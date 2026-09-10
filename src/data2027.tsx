import type { FaqItem } from "./data";

// Listed in route order. No agendas yet — this is a save-the-date placeholder.
export const cities2027 = [
  {
    name: "Tallinn",
    date: "Fri 26.3.2027",
    imageUrlSmall: "/assets/tallinn_small.webp",
    imageUrl: "/assets/tallinn.webp",
  },
  {
    name: "Helsinki",
    date: "Sat 27.3.2027",
    imageUrlSmall: "/assets/helsinki_small.webp",
    imageUrl: "/assets/helsinki.webp",
  },
  {
    name: "Stockholm",
    date: "Sun 28.3.2027",
    imageUrlSmall: "/assets/stockholm_small.webp",
    imageUrl: "/assets/stockholm.webp",
  },
];

export const faqItems2027: FaqItem[] = [
  {
    title: "What is it?",
    content: `Three cities in three days in great company — the third Baltic Cruise. We run, we sail, and we sit down for beers afterwards. It's simple yet beautiful.`,
  },
  {
    title: "When and where?",
    content: `Easter weekend 2027: Friday March 26th through Sunday March 28th. We start in Tallinn, cruise to Helsinki, and finish in Stockholm.

    Every cruise gets a fresh route. 2025 ran Stockholm → Tallinn → Helsinki, 2026 ran Helsinki → Stockholm → Tallinn, and now every city has had its turn both opening and closing the cruise.

    Exact starting points, run times and boat recommendations will be published here a bit later.`,
  },
  {
    title: "How can I join?",
    nodeContent: (
      <>
        Nothing to sign up for yet — block the weekend in your calendar and keep
        an eye on this page. We post the details on Instagram first at{" "}
        <a
          href="https://www.instagram.com/mrcbalticcruise/"
          target="_blank"
          rel="noreferrer"
        >
          @mrcbalticcruise
        </a>
        , and Strava events follow once the details are sharpened.
        <br />
        <br />
        As always: free to join, no entry fees, and you're welcome in whichever
        city you can travel to. You only need to book your own travel.
      </>
    ),
  },
];
