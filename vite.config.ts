import { mkdir, readFile, writeFile } from "node:fs/promises";
import { resolve } from "node:path";
import react from "@vitejs/plugin-react";
import { type Plugin, defineConfig } from "vite";

const SITE_URL = "https://mikkellerrunning.club";

type OgPage = {
  title: string;
  description: string;
  image: string;
  documentTitle: string;
};

// Link-preview crawlers don't run JS, so every route that gets shared on its own needs a
// static HTML file with its OG tags baked in. Netlify serves these before the SPA fallback.
const ogPages: Record<string, OgPage> = {
  "brewery-run": {
    title: "MRC Brewery Run 2026!",
    description:
      "Running and chugging through Western Helsinki with stops at breweries and bars - Saturday, October 17, 2026",
    image: `${SITE_URL}/assets/og_brewery_run_2026.jpg`,
    documentTitle: "Brewery Run 2026 | MRC Helsinki",
  },
};

const replaceOrThrow = (html: string, pattern: RegExp, value: string) => {
  if (!pattern.test(html)) {
    throw new Error(`og-per-route: ${pattern} not found in index.html`);
  }

  return html.replace(pattern, `$1${value}$2`);
};

const ogPerRoute = (): Plugin => {
  let outDir = "dist";

  return {
    name: "og-per-route",
    apply: (_, { command, isPreview }) => command === "build" || !!isPreview,
    configResolved(config) {
      outDir = resolve(config.root, config.build.outDir);
    },
    // Mirror the Netlify rewrites below so `pnpm preview` serves the same HTML as production
    configurePreviewServer(server) {
      server.middlewares.use((req, _res, next) => {
        const [pathname, query] = (req.url ?? "").split("?");
        const page = pathname.replace(/^\/|\/$/g, "");

        if (page in ogPages) {
          req.url = `/${page}/index.html${query ? `?${query}` : ""}`;
        }

        next();
      });
    },
    async closeBundle() {
      const html = await readFile(resolve(outDir, "index.html"), "utf8");

      for (const [path, og] of Object.entries(ogPages)) {
        const tags: [RegExp, string][] = [
          [/(property="og:title" content=")[^"]*(")/, og.title],
          [/(property="og:description" content=")[^"]*(")/, og.description],
          [/(property="og:image" content=")[^"]*(")/, og.image],
          [/(name="twitter:image" content=")[^"]*(")/, og.image],
          [/(property="og:url" content=")[^"]*(")/, `${SITE_URL}/${path}`],
          [/(<title>)[^<]*(<\/title>)/, og.documentTitle],
        ];

        const pageHtml = tags.reduce(
          (acc, [pattern, value]) => replaceOrThrow(acc, pattern, value),
          html,
        );

        await mkdir(resolve(outDir, path), { recursive: true });
        await writeFile(resolve(outDir, path, "index.html"), pageHtml);
      }

      // Explicit rewrites so /brewery-run (no trailing slash) doesn't depend on Netlify's
      // pretty-URL handling. They must come before the SPA catch-all, since first match wins.
      const redirectsPath = resolve(outDir, "_redirects");
      const redirects = await readFile(redirectsPath, "utf8");
      const rewrites = Object.keys(ogPages).map(
        (path) => `/${path}    /${path}/index.html    200`,
      );

      await writeFile(redirectsPath, `${rewrites.join("\n")}\n${redirects}`);
    },
  };
};

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), ogPerRoute()],
});
