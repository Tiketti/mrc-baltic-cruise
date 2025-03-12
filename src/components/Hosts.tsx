import { Root, List, Trigger, Content } from "@radix-ui/react-tabs";
import { hostItems } from "../data";
import { Link } from "lucide-react";

export const HostsSection = () => {
  return (
    <div className="flex w-full flex-col items-center justify-center md:max-w-screen-md lg:max-w-screen-lg">
      <a
        href="#hosts"
        className="group mb-8 flex items-center justify-center border-brand-paper border-b hover:border-brand-burgundy"
      >
        <Link className="invisible group-hover:visible" />
        <h2 id="hosts" className="pl-2">
          Meet Your Hosts
        </h2>
      </a>

      <Root defaultValue="stockholm">
        <List
          className="flex border-gray-200 border-b"
          aria-label="Meet your hosts"
        >
          {hostItems.map((host) => (
            <Trigger
              key={host.id}
              className="flex-1 cursor-pointer px-4 py-2 text-center font-extrabold text-lg hover:text-brand-burgundy data-[state=active]:border-brand-burgundy data-[state=active]:border-b-2 data-[state=active]:text-brand-burgundy md:flex-initial"
              value={host.id}
            >
              {host.city}
            </Trigger>
          ))}
        </List>

        {hostItems.map((host) => (
          <Content key={host.id} value={host.id} className="p-4">
            <div>
              <img
                src={host.image}
                alt={host.imageAlt}
                className="float-left mr-4 mb-4 shadow-lg md:max-w-sm"
              />
              <h3 className="mb-4 block text-left text-2xl text-brand-burgundy">
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
