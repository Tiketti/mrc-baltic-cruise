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
      <div className="flex flex-col items-center justify-center space-y-8 px-8 md:w-full">
        <a
          href="#itinerary"
          className="group flex items-center border-brand-paper border-b hover:border-brand-burgundy"
        >
          <Link className="invisible group-hover:visible" />
          <h2 id="itinerary" className="pl-2">
            Our itinerary
          </h2>
        </a>
        <div className="flex w-full flex-col space-y-8 md:flex-row md:space-x-8 md:space-y-0">
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
