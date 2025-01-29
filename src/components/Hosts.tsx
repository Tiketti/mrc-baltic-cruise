import * as Tabs from "@radix-ui/react-tabs";

const HOSTS = [
  {
    id: "stockholm",
    city: "Stockholm",
    image: "/assets/host_sto.jpg",
    imageAlt: "Stockholm host",
    name: "MRC Stockholm",
    content: ["Your content here...", "More content..."],
  },
  {
    id: "helsinki",
    city: "Helsinki",
    image: "/assets/host_hel.jpg",
    imageAlt: "Helsinki host",
    name: "MRC Helsinki",
    content: ["Your content here...", "More content..."],
  },
  {
    id: "tallinn",
    city: "Tallinn",
    image: "/assets/host_tal.jpg",
    imageAlt: "Tallinn host",
    name: "MRC Tallinn",
    content: ["Your content here...", "More content..."],
  },
];

export const HostsSection = () => {
  return (
    <section className="w-full mx-auto px-4">
      <h3 className="text-4xl font-windsor text-center mb-8">
        Meet Your Hosts
      </h3>

      <Tabs.Root defaultValue="stockholm">
        <Tabs.List
          className="flex border-b border-gray-200"
          aria-label="Meet your hosts"
        >
          {HOSTS.map((host) => (
            <Tabs.Trigger
              key={host.id}
              className="px-4 py-2 text-lg cursor-pointer hover:text-brand-burgundy data-[state=active]:border-b-2 data-[state=active]:border-brand-burgundy data-[state=active]:text-brand-burgundy"
              value={host.id}
            >
              {host.city}
            </Tabs.Trigger>
          ))}
        </Tabs.List>

        {HOSTS.map((host) => (
          <Tabs.Content key={host.id} value={host.id} className="p-4">
            <div className="flex flex-col md:flex-row gap-6">
              <img
                src={host.image}
                alt={host.imageAlt}
                className="w-full md:w-1/3 rounded-lg"
              />
              <div className="space-y-4">
                <h3 className="text-2xl font-windsor">{host.name}</h3>
                {host.content.map((paragraph, index) => (
                  <p key={index}>{paragraph}</p>
                ))}
              </div>
            </div>
          </Tabs.Content>
        ))}
      </Tabs.Root>
    </section>
  );
};
