import { Root, List, Trigger, Content } from "@radix-ui/react-tabs";
import { hostItems } from "../data";
import { Link } from "lucide-react";

// Derive valid host IDs from the data so the type stays in sync automatically
type HostId = (typeof hostItems)[number]["id"];
type HostItem = (typeof hostItems)[number];
type HostOverride = { id: HostId } & Partial<Omit<HostItem, "id">>;

type HostsSectionProps = { 
  order?: HostId[];
  overrides?: HostOverride[];
}
export const HostsSection = ({ order, overrides }: HostsSectionProps) => {
  const mergedHostItems = overrides
    ? hostItems.map((host) => {
        const override = overrides.find((o) => o.id === host.id);
        return override ? { ...host, ...override } : host;
      })
    : hostItems;

  const sortedHostItems = order
    ? mergedHostItems.sort((a, b) => (order.indexOf(a.id) ?? 0) - (order.indexOf(b.id) ?? 0))
    : mergedHostItems;

  return (
    <div className="flex w-full flex-col items-center justify-center md:max-w-screen-md lg:max-w-screen-lg">
      <a
        href="#hosts"
        className="group mb-8 flex items-center justify-center border-surface border-b hover:border-accent"
      >
        <Link className="invisible group-hover:visible" />
        <h2 id="hosts" className="pl-2">
          Meet Your Hosts
        </h2>
      </a>

      <Root defaultValue="helsinki">
        <List
          className="flex border-gray-200 border-b"
          aria-label="Meet your hosts"
        >
          {sortedHostItems.map((host) => (
            <Trigger
              key={host.id}
              className="flex-1 cursor-pointer px-4 py-2 text-center font-extrabold text-lg hover:text-accent data-[state=active]:border-accent data-[state=active]:border-b-2 data-[state=active]:text-accent md:flex-initial"
              value={host.id}
            >
              {host.city}
            </Trigger>
          ))}
        </List>

        {sortedHostItems.map((host) => (
          <Content key={host.id} value={host.id} className="p-4">
            <div>
              <img
                src={host.image}
                alt={host.imageAlt}
                className="float-left mr-4 mb-4 shadow-lg md:max-w-sm"
              />
              <h3 className="mb-4 block text-left text-2xl text-accent">
                {host.name}
              </h3>
              {host.content.map((paragraph, index) => (
                // biome-ignore lint/suspicious/noArrayIndexKey: The paragraphs are static
                <p key={index} className="mb-4 text-left">
                  {paragraph}
                </p>
              ))}
            </div>
          </Content>
        ))}
      </Root>
    </div>
  );
};
