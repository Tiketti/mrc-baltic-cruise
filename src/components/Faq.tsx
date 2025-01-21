import { ChevronDown, Link } from "lucide-react";
import {
	Accordion,
	AccordionItem,
	AccordionTrigger,
	AccordionContent,
} from "@radix-ui/react-accordion";
import type { ReactNode } from "react";

interface FaqItem {
	title: string;
	content: string;
	nodeContent?: ReactNode;
}

const faqItems: FaqItem[] = [
	{
		title: "What is it?",
		content: `It's three cities in three days in great company. We run and sit down for beers afterwards. It's simple yet beautiful.`,
	},
	{
		title: "How can I join?",
		content: `Follow this page and our Strava events. We also have an Instagram account <a href="">@mrcbalticcruise</a>. And then...
    
    Just show up! We welcome everybody to join in whatever city you can travel to.`,
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
		title: "What does it cost?",
		content: "Your own travels, food and beer. We charge nothing.",
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

export const Faq = () => {
	return (
		<div className="flex flex-col w-full items-center justify-center">
			<a
				href="#faq"
				className="flex items-center justify-center group border-b border-brand-paper hover:border-brand-burgundy"
			>
				<Link className="invisible group-hover:visible" />
				<h2 id="faq" className="pl-2">
					FAQ
				</h2>
			</a>
			<div className="flex w-full max-w-2xl text-left items-start mt-8 px-8">
				<Accordion type="multiple" className="">
					{faqItems.map(({ title, nodeContent, content }) => (
						<AccordionItem key={title} value={title} className="">
							<AccordionTrigger className="flex flex-1 text-nowrap items-center justify-between py-4 transition-all data-[state=open]:text-brand-burgundy [&[data-state=open]>svg]:rotate-180 text-2xl font-[windsor] cursor-pointer">
								{title}
								<ChevronDown className="ml-4 h-4 w-4 shrink-0 transition-transform duration-200" />
							</AccordionTrigger>
							<AccordionContent className="whitespace-pre-line overflow-hidden transition-all data-[state=closed]:animate-accordion-up data-[state=open]:animate-accordion-down">
								{nodeContent || content}
							</AccordionContent>
						</AccordionItem>
					))}
				</Accordion>
			</div>
		</div>
	);
};
