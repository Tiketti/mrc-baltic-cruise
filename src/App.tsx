import { useState } from "react";
import CityCard from "./components/CityCard";
import { Dialog } from "./components/Dialog";
import { Footer } from "./components/Footer";
import { Header } from "./components/Header";
import { Logo } from "./components/Logo";
import { cities, faqItems } from "./data";
import { Link } from "lucide-react";
import { Faq } from "./components/Faq";

function App() {
	const [selectedCity, setSelectedCity] = useState<string | null>(null);

	return (
		<div className="flex flex-col space-y-8">
			<Dialog
				open={!!selectedCity}
				onOpenChange={() => setSelectedCity(null)}
				title={selectedCity?.toLocaleUpperCase() || ""}
				content={
					cities.find(
						({ name }) => name.toUpperCase() === selectedCity?.toUpperCase(),
					)?.agenda
				}
			/>
			<Header />
			<Logo />
			<div className="flex flex-col md:flex-col space-y-8 md:space-x-8 md:w-full items-center justify-center">
				<a
					href="#itinerary"
					className="flex items-center group border-b border-brand-paper hover:border-brand-burgundy"
				>
					<Link className="invisible group-hover:visible" />
					<h2 id="itinerary" className="pl-2">
						Our itinerary
					</h2>
				</a>
				<div className="flex flex-col w-full md:flex-row md:space-x-8 space-y-8 md:space-y-0 md:px-8">
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
			</div>
			<div className="flex justify-center">
				<a
					href="https://www.strava.com/clubs/315734/group_events/1892944"
					className="inline-flex items-center gap-1 bg-brand-paper p-4 h-min"
					target="_blank"
					rel="noreferrer"
				>
					<img src="assets/strava-seeklogo.svg" alt="Logo" className="h-6" />
					<span className="text-brand-burgundy border-b border-brand-paper hover:border-brand-burgundy font-semibold text-xl">
						Strava event
					</span>
				</a>
			</div>
			<Footer />
		</div>
	);
}

export default App;
