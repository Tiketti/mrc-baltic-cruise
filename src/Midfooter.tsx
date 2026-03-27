import { events as defaultEvents } from "./data";
import type { EventItem } from "./data2026";

interface MidFooterProps {
  events?: EventItem[];
}

export const MidFooter = ({ events = defaultEvents }: MidFooterProps) => (
  <div
    id="strava"
    className="flex flex-col justify-center min-[700px]:flex-row min-[500px]:flex-wrap"
  >
    {events.map((event) => (
      <a
        key={event.id}
        href={event.url}
        className="my-1 ml-10 inline-flex h-min items-center justify-start gap-1 bg-surface px-3 py-2 min-[700px]:mx-2 min-[700px]:p-4"
        target="_blank"
        rel="noreferrer"
        title={event.title}
      >
        <img
          src="assets/strava-seeklogo.svg"
          alt="Logo"
          className="h-5 min-[700px]:h-6"
        />
        <span className="border-surface border-b font-semibold text-accent text-lg hover:border-accent min-[700px]:text-xl">
          {event.name}
        </span>
      </a>
    ))}
  </div>
);
