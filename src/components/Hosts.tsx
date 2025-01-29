import { Root, List, Trigger, Content } from "@radix-ui/react-tabs";
import { hostItems } from "../data";

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
          {hostItems.map((host) => (
            <Trigger
              key={host.id}
              className="px-4 py-2 text-lg font-extrabold cursor-pointer hover:text-brand-burgundy data-[state=active]:border-b-2 data-[state=active]:border-brand-burgundy data-[state=active]:text-brand-burgundy"
              value={host.id}
            >
              {host.city}
            </Trigger>
          ))}
        </List>

        {hostItems.map((host) => (
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
