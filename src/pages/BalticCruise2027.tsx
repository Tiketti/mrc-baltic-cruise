import { Link } from "lucide-react";
import { CityCard } from "../components/CityCard";
import { Countdown } from "../components/Countdown";
import { Faq } from "../components/Faq";
import { Header } from "../components/Header";
import { HeroIntro } from "../components/HeroIntro";
import { Logo } from "../components/Logo";
import { cities2027, faqItems2027 } from "../data2027";
import { useDocumentTitle } from "../hooks/useDocumentTitle";

// Module scope keeps the reference stable — Countdown resets its interval whenever targetDate changes.
const CRUISE_START = new Date(2027, 2, 26);

export const BalticCruise2027 = () => {
  useDocumentTitle("MRC Baltic Cruise 2027");

  return (
    <div data-theme="2027" className="flex flex-col space-y-8">
      <Header title="MRC Baltic Cruise 2027" />
      <Logo variant="2027" />
      <section className="!mt-0 bg-primary px-4 pt-2 pb-8">
        <p className="mb-3 text-center font-[windsor] text-sm text-surface uppercase tracking-widest">
          Save the date!
        </p>
        <Countdown targetDate={CRUISE_START} tone="brand" />
      </section>
      <HeroIntro
        tagline="It's happening again. Easter 2027."
        blurb="Three cities, three days, three runs. Mark it in your calendar now — the Baltic Cruise returns over Easter weekend 2027."
        details={[
          { label: "When", value: "March 26–28, 2027 (Easter)" },
          { label: "Route", value: "Tallinn → Helsinki → Stockholm" },
          { label: "Cost", value: "Free. No entry fees, just show up." },
        ]}
      />
      <div className="flex flex-col items-center justify-center space-y-8 px-8 pb-12 md:w-full">
        <a
          href="#route"
          className="group flex items-center border-surface border-b hover:border-accent"
        >
          <Link className="invisible group-hover:visible" />
          <h2 id="route" className="pl-2">
            The route
          </h2>
        </a>
        <div className="flex w-full flex-col space-y-8 md:flex-row md:space-x-8 md:space-y-0">
          {cities2027.map(({ name, date, imageUrl, imageUrlSmall }) => (
            <CityCard
              key={name}
              city={name}
              date={date}
              imageUrl={imageUrl}
              imageUrlSmall={imageUrlSmall}
            />
          ))}
        </div>
        <p className="max-w-xl text-center text-lg">
          Starting points, run times and boat recommendations will be published
          here closer to the date.
        </p>
        <Faq items={faqItems2027} />
      </div>
    </div>
  );
};
