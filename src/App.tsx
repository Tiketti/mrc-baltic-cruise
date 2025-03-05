import { Link } from "lucide-react";
import { useState } from "react";
import { MidFooter } from "./Midfooter";
import CityCard from "./components/CityCard";
import { Dialog } from "./components/Dialog";
import { Faq } from "./components/Faq";
import { Footer } from "./components/Footer";
import { Header } from "./components/Header";
import { HostsSection } from "./components/Hosts";
import { Logo } from "./components/Logo";
import { cities, faqItems } from "./data";

function App() {
  const [selectedCity, setSelectedCity] = useState<string | null>(null);

  const selectedCityData = cities.find(
    ({ name }) => name.toUpperCase() === selectedCity?.toUpperCase(),
  );

  return (
    <div className="flex flex-col space-y-8">
      <Dialog
        open={!!selectedCity}
        onOpenChange={() => setSelectedCity(null)}
        title={selectedCity?.toLocaleUpperCase() || ""}
        date={selectedCityData?.date}
        content={selectedCityData?.agenda}
      />
      <Header />
      <Logo />
      <div className="flex flex-col space-y-8 md:w-full items-center justify-center px-8">
        <a
          href="#itinerary"
          className="flex items-center group border-b border-brand-paper hover:border-brand-burgundy"
        >
          <Link className="invisible group-hover:visible" />
          <h2 id="itinerary" className="pl-2">
            Our itinerary
          </h2>
        </a>
        <div className="flex flex-col w-full md:flex-row md:space-x-8 space-y-8 md:space-y-0">
          {cities.map(({ name, date, imageUrl, imageUrlSmall }) => (
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
        <Faq items={faqItems} />
        <HostsSection />
      </div>
      <MidFooter />
      <Footer />
    </div>
  );
}

export default App;
