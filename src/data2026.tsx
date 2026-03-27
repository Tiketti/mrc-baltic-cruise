import type { FaqItem } from "./data";

export const cities2026 = [
  {
    name: "Helsinki",
    date: "10.4.2026",
    imageUrlSmall: "/assets/helsinki_small.webp",
    imageUrl: "/assets/helsinki.webp",
    agenda: `This is the opening leg of Baltic Cruise 2026!

    This time we kick off the cruise with a chill run in Helsinki. We have pace groups for runners wishing to do 5 to 12 km.

    Start time 12:00 sharp.

    We start and finish at SalamaNation which has a bag drop for us.

    If you are taking the suggested ferry Tallink Silja Symphony leaving at 16:45, we recommend you be at Olympiaterminaali no later than 16:00. A captain-led, official city walk will start the 2 km transport to the harbour at 15:30. (A cab or a Bolt ride will take you to the harbour in 15 minutes.)`,
  },
  {
    name: "Stockholm",
    date: "11.4.2026",
    imageUrlSmall: "/assets/stockholm_small.webp",
    imageUrl: "/assets/stockholm.webp",
    agenda: `Stockholm hosts the second leg of the MRC Baltic Cruise!

    The run is open to everyone who wants to join!
    
    11:55 Welcome and bag drop.
    12:00 Group photo and dividing into running groups:    
    5 km - cozy (pace 6:20-6:30)
    7 km - lazy (pace 6:15)
    9 km - Hazy (pace 5:30-5:40)
    
    There might be a surprise group and Strava Art and stuff as well.
    After run :beer: :beer:
    15:00 Run 5,5 km or take the bus to Stockholm Brewing for more Beer and stuff.
    16:45 Walk to the Silja terminal for check in and boarding.
    17:30 off we go! (Tallink Baltic Queen to Tallinn)

    Mikkeller Bar address:
    Östgötagatan 33
    Subway - Medborgarplatsen`,
  },
  {
    name: "Tallinn",
    date: "12.4.2026",
    imageUrlSmall: "/assets/tallinn_small.webp",
    imageUrl: "/assets/tallinn.webp",
    agenda: `The grand finale in Tallinn!

    Meeting point: Põhjala Taproom (Peetri 5)

    12:05-13:30 (2 groups, easy pace and nice surprises during the run)

    After run: sauna, food, :beer:, fun and sun`,
  },
];

export const faqItems2026: FaqItem[] = [
  {
    title: "What is it?",
    content: `It's three cities in three days in great company — the sequel! We run and sit down for beers afterwards. It's simple yet beautiful.`,
  },
  {
    title: "What does it cost?",
    content: `The short answer: nothing. The runs will cost you nothing and there are no entry fees to any of the events. You can join all or any of them just by showing up.
    
    What you need to pay for and organize yourself, are trips between the cities, your possible accommodation, as well as food and beer.
    
    More details on costs and recommended boats will be added soon.`,
  },
  {
    title: "How can I join?",
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
    content: "Absolutely. Feel free to come and run with us in any city.",
  },
  {
    title: "Can I go just part of the way?",
    content: `Remember those "choose your own adventure" books from back in the day? This is one of those situations.
    
    Join where you can and you're free to run only a part of the way.`,
  },
  {
    title: "I was on the first cruise. What's different this time?",
    content:
      "The route! This year we start in Helsinki, cruise to Stockholm, and finish in Tallinn. New routes, new adventures, double the fun.",
  },
];

// Only override what's changed from the base hostItems in data.tsx.
// STO + TAL stay as-is.
export const hostOverrides2026 = [
  {
    id: "helsinki" as const,
    image: "/assets/club_hel_2026.jpg",
    content: [
      "'You don't have to be a runner to join us, but you just may become one.'",
      "We've been running and chugging since 2017. We treat every First Saturday of the month like a runner's fest. For the running part, we have three distances and pace groups; for the post-run beers, the wonderful SalamaNation acts as our neon-lit club house.",
      "We also host Thirsty Tuesday runs which are even more casual events every Tuesday at 18:00. Often there's even a pre-run for those wanting rack up some extra kilometers.",
      "Captains Felix, Heidi, Perttu and Rasmus are at your service.",
      "We're happy to have you join us!",
    ],
  },
];

export type EventItem = {
  id: string;
  title: string;
  name: string;
  url: string;
};

export const events2026: EventItem[] = [
  {
    id: "helsinki-run-2026",
    title: "MRC Baltic Cruise II - Helsinki Run",
    name: "Helsinki Run",
    url: "https://www.strava.com/clubs/315734/group_events/3472182295693872880",
  },
  {
    id: "stockholm-run-2026",
    title: "MRC Baltic Cruise II - Stockholm Run",
    name: "Stockholm Run",
    url: "https://www.strava.com/clubs/302996/group_events/3455960626226077518",
  },
];
