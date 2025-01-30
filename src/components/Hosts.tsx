import { Root, List, Trigger, Content } from "@radix-ui/react-tabs";
import { hostItems } from "../data";
import { Link } from "lucide-react";

export const HostsSection = () => {
  return (
    <div className="flex flex-col w-full items-center justify-center">
      <a
        href="#hosts"
        className="flex items-center justify-center mb-8 group border-b border-brand-paper hover:border-brand-burgundy"
      >
        <Link className="invisible group-hover:visible" />
        <h2 id="hosts" className="pl-2">
          Meet Your Hosts
        </h2>
      </a>

      <Root defaultValue="stockholm">
        <List
          className="flex border-b border-gray-200"
          aria-label="Meet your hosts"
        >
          {hostItems.map((host) => (
            <Trigger
              key={host.id}
              className="flex-1 md:flex-initial text-center px-4 py-2 text-lg font-extrabold cursor-pointer hover:text-brand-burgundy data-[state=active]:border-b-2 data-[state=active]:border-brand-burgundy data-[state=active]:text-brand-burgundy"
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
                className="float-left md:max-w-sm mr-4 mb-4 shadow-lg"
              />
              <h3 className="text-2xl block text-left text-brand-burgundy mb-4">
                {host.name}
              </h3>
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
    </div>
  );
};
