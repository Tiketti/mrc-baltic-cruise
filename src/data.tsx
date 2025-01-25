import type { ReactNode } from "react";

// TODO: Make content and nodeContent mutually exclusive
export interface FaqItem {
	title: string;
	content: string;
	nodeContent?: ReactNode;
}

export const faqItems: FaqItem[] = [
	{
		title: "What is it?",
		content: `It's three cities in three days in great company. We run and sit down for beers afterwards. It's simple yet beautiful.`,
	},
	{
		title: "What does it cost?",
		content: `The short answer: nothing. The runs will cost you nothing and there are no entry fees to any of the events. You can join all or any of them just by showing up.
    
    What you need to pay for and organize yourself, are trips between the cities, your possible accommodation, as well as food and beer.
    
    As for our estimates:

    At the time of this writing, a well equipped cabin will cost from 150€ to 250€ total and fits up to 4 persons. This is the preferred option between Stockholm & Tallinn (as well as Helsinki & Stockholm).

    Helsinki - Tallinn is just 80 km so no need to book a cabin, there's boats from multiple cruise lines running morning to evening — and these boats have the same luxuries. You're likely looking at 25€ to 30€ per person if not less.

    Hotel: There are some boats that take that trip overnight, the practical runner will just pick a hotel in downtown Helsinki and sleep late, waking up ready for the Sunday run & Fin(n)ishing Party. At the time of writing plenty of rooms available between 70€ to 120€ for two.`,
	},
	{
		title: "Which boats are we taking?",
		content: "",
		nodeContent: (
			<>
				MRC Helsinki is taking the 17:00 Silja Symphony from Helsinki (overnight
				trip, arrives 10:00 on Friday).
				<br />
				<br />
				STO - TLN: Tallink Silja Baltic Queen, Friday 19th at 17:30.
				<br />
				<br />
				TLN - HEL: Tallink Silja Megastar, Saturday 20th at 22:30. Most of the
				cruise attendees will travel on the above. Tickets are available online
				at{" "}
				<a href="https://tallink.com" target="_blank" rel="noreferrer">
					Tallink.com
				</a>
				.
			</>
		),
	},
	{
		title: "What about accommodation?",
		content: `For the most part, we'll be staying onboard! It is a cruise after all.
  
    If you've never been on these Baltic boats before, you'll be amazed. They're true cruise ships with bars, restaurants, clubs, casinos, spas and tax-free shopping.`,
	},
	{
		title: "How can I join?",
		content: "",
		nodeContent: (
			<>
				Follow this page and our Strava events. We also have an Instagram
				account{" "}
				<a
					href="https://www.instagram.com/mrcbalticcruise/"
					target="_blank"
					rel="noreferrer"
				>
					@mrcbalticcruise
				</a>{" "}
				to keep you posted. And then...
				<br />
				<br />
				Just show up! We welcome everybody to join in whatever city you can
				travel to. You are responsible for booking your own trips, but our{" "}
				<a href="#itinerary">Itinerary + agenda</a> section offers suggestions.
			</>
		),
	},
	{
		title: "Can I join just the runs?",
		content: "Absolutely. Feel free to come and run with us.",
	},
	{
		title: "Can I go just part of the way?",
		content: `Remember those "choose your own adventure" books from back in the day? This is one of those situations.
    
    Join where you can and you're free to run only a part of the way.`,
	},
	{
		title: "Who the hell thinks of things like these?",
		content: `That's what we keep asking ourselves, too!
    
    But really. All credit goes to Felix from MRC Helsinki. He's the creative mind and driving force behind this whole thing.`,
	},
];

export const cities = [
	{
		name: "Stockholm",
		date: "18.4.2025",
		imageUrlSmall: "/assets/stockholm_small.webp",
		imageUrl: "/assets/stockholm.webp",
		agenda: `Friday, April 18th, 2025

    Run in Stockholm hosted by MRC Stockholm. Time to be confirmed.

    Post-run beers and party.

    Boat 17:30 Tallink Silja Baltic Queen to Tallinn; overnight trip, arrival to Tallinn Saturday 10:45.`,
	},
	{
		name: "Tallinn",
		date: "19.4.2025",
		imageUrlSmall: "/assets/tallinn_small.webp",
		imageUrl: "/assets/tallinn.webp",
		agenda: `Saturday, April 19th, 2025

    Run in Tallinn hosted by Pühaste jooksuklubi.

    Post-run beers and party.

    Boat 22:30 Tallink Silja Megastar to Helsinki (2 hour trip, arrives 00:30)

   Note! Feel free to book earlier or later boat to suit your needs eg. depending on choice of hotel and if you want to overnight in Helsinki (recommended for those who want to sleep late) or Tallinn (if you prefer to catch an early boat at around 6 or 7).`,
	},
	{
		name: "Helsinki",
		date: "20.4.2025",
		imageUrlSmall: "/assets/helsinki_small.webp",
		imageUrl: "/assets/helsinki.webp",
		agenda: `Sunday, April 20th, 2025

    Run in Helsinki hosted by MRC Helsinki. Starting at 12:30 from SalamaNation.

    Post-run beers and party at SalamaNation.

    Optional beer mile (to be confirmed).

    Awards and farewells until we meet again.

    Suggested boat for Stockholm-bound runners: 17:00 Silja Serenade to Stockholm. Arrives to STO on Monday 10:00.
    
    Note! Feel free to book another boat or flight, or stay in town until Monday.`,
	},
];
