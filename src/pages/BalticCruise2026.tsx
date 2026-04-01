import { Link } from "lucide-react";
import { useState } from "react";
import { MidFooter } from "../Midfooter";
import { CityCard } from "../components/CityCard";
import { Dialog } from "../components/Dialog";
import { Faq } from "../components/Faq";
import { Header } from "../components/Header";
import { HeroIntro } from "../components/HeroIntro";
import { HostsSection } from "../components/Hosts";
import { Logo } from "../components/Logo";
import {
  cities2026,
  events2026,
  faqItems2026,
  hostOverrides2026,
} from "../data2026";
import { useDocumentTitle } from "../hooks/useDocumentTitle";

export const BalticCruise2026 = () => {
  useDocumentTitle("MRC Baltic Cruise 2026");

  const [selectedCity, setSelectedCity] = useState<string | null>(null);

  const selectedCityData = cities2026.find(
    ({ name }) => name.toUpperCase() === selectedCity?.toUpperCase(),
  );

  return (
    <div data-theme="2026" className="flex flex-col space-y-8">
      <Dialog
        open={!!selectedCity}
        onOpenChange={() => setSelectedCity(null)}
        title={selectedCity?.toLocaleUpperCase() || ""}
        date={selectedCityData?.date}
        content={selectedCityData?.agenda}
      />
      <Header title="MRC Baltic Cruise 2026" />
      <Logo variant="2026" />
      <HeroIntro
        tagline="Ready to take the Baltic Sea by storm?"
        blurb="Mikkeller Running Club Baltic Cruise is all about running, beer, and meeting the best people onshore and onboard in 3 cities."
        details={[
          { label: "Route", value: "Helsinki → Stockholm → Tallinn" },
          { label: "Cost", value: "Free. No entry fees, just show up." },
        ]}
      />
      <div className="flex flex-col items-center justify-center space-y-8 px-8 md:w-full">
        <a
          href="#itinerary"
          className="group flex items-center border-surface border-b hover:border-accent"
        >
          <Link className="invisible group-hover:visible" />
          <h2 id="itinerary" className="pl-2">
            Our itinerary
          </h2>
        </a>
        <div className="flex w-full flex-col space-y-8 md:flex-row md:space-x-8 md:space-y-0">
          {cities2026.map(({ name, date, imageUrl, imageUrlSmall }) => (
            <CityCard
              key={name}
              city={name}
              date={date}
              imageUrl={imageUrl}
              imageUrlSmall={imageUrlSmall}
              onClick={() => setSelectedCity(name)}
            />
          ))}
        </div>
        <Faq items={faqItems2026} />
        <HostsSection
          order={["helsinki", "stockholm", "tallinn"]}
          overrides={hostOverrides2026}
        />
      </div>
      <div className="!mt-2 md:!mt-8 pb-12">
        <MidFooter events={events2026} />
      </div>
    </div>
  );
};
