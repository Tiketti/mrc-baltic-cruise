import { Root, List, Trigger, Content } from "@radix-ui/react-tabs";

const HOSTS = [
  {
    id: "stockholm",
    city: "Stockholm",
    image: "/assets/club_sto.jpg",
    imageAlt: "Stockholm club",
    name: "MRC Stockholm",
    content: [
      "The first attempt to start MRC Stockholm was way back in 2015. But that group folded after 2 runs.",
      "In 2017 Mikkeller Stockholm opened in Östermalm and Mikkel himself was there to start up the running club again.",
      "The last 3.5 years our home base has been the Mikkeller Söder bar. We run every Tuesday at 18:00 and of course every first Saturday. MRC Stockholm is captained by David and Magnus.",
    ],
  },
  {
    id: "tallinn",
    city: "Tallinn",
    image: "/assets/club_tal.jpg",
    imageAlt: "Tallinn club",
    name: "Pühaste Jooksuklubi",
    content: [
      "Our Club is a Phenomenon of Its Own.",
      "We've been gathering since 2017, yet in some ways, it's as if we don't officially exist. The reasons for that? Well, let's just say they're not that important. What is important is that we raise our glasses high every Tuesday, promoting both social running and responsible beer enjoyment.",
      "Over the past year, we've made it our mission to support local craft breweries, and our home base is none other than Pühaste Taproom.",
      "Every Tuesday, we hit the streets in three pace groups, so there's something for everyone:",
      "🏃‍♂️ The Bold & The Beautiful (easy strollers)",
      "🐦 Angry Birds (moderate pace)",
      "⚡ Fast & Furious (speed demons)",
      "Once a month, we switch things up with a long Sunday run, followed by a well-earned sauna session and a feast at Estonia's most renowned craft brewery, Põhjala.",
      "And because we love both running and great beer, this April, we'll introduce you to at least four exciting local brewers!",
      "We like to say we're either a running club with a slight beer problem or a beer club with a slight running problem—you decide. 😉",
      "Cheers & see you on the run! 🍻🏃‍♀️",
    ],
  },
  {
    id: "helsinki",
    city: "Helsinki",
    image: "/assets/club_hel.png",
    imageAlt: "Helsinki club",
    name: "MRC Helsinki",
    content: [
      "'You don't have to be a runner to join us, but you just may become one.'",
      "We've been running and chugging since 2017. We celebrate every First Saturday of the month like it's Christmas! On those Saturdays, we have three distances and pace groups.",
      "We also host Thirsty Tuesday runs which are even more casual events every Tuesday at 18:00.",
      "Our captains are Heidi, Milla, Perttu and Rasmus.",
      "We're happy to have you join us!",
    ],
  },
];

export const HostsSection = () => {
  return (
    <section className="w-full max-w-3xl mx-auto px-4">
      <h3 className="text-4xl font-windsor text-center mb-8">
        Meet Your Hosts
      </h3>

      <Root defaultValue="stockholm">
        <List
          className="flex border-b border-gray-200"
          aria-label="Meet your hosts"
        >
          {HOSTS.map((host) => (
            <Trigger
              key={host.id}
              className="px-4 py-2 text-lg font-extrabold cursor-pointer hover:text-brand-burgundy data-[state=active]:border-b-2 data-[state=active]:border-brand-burgundy data-[state=active]:text-brand-burgundy"
              value={host.id}
            >
              {host.city}
            </Trigger>
          ))}
        </List>

        {HOSTS.map((host) => (
          <Content key={host.id} value={host.id} className="p-4">
            <div className="">
              <img
                src={host.image}
                alt={host.imageAlt}
                className="float-left md:max-w-sm mr-4 mb-4"
              />
              <h4 className="text-2xl text-left mb-4">{host.name}</h4>
              {host.content.map((paragraph, index) => (
                // biome-ignore lint/suspicious/noArrayIndexKey: The paragraphs won't change on the fly
                <p key={index} className="text-left mb-4">
                  {paragraph}
                </p>
              ))}
            </div>
          </Content>
        ))}
      </Root>
    </section>
  );
};
