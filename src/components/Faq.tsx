import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@radix-ui/react-accordion";
import { ChevronDown, Link } from "lucide-react";
import type { FaqItem } from "../data";

export const Faq = ({ items }: { items: FaqItem[] }) => {
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
      <div className="flex w-full max-w-3xl text-left items-start mt-8 px-8">
        <Accordion type="multiple" className="">
          {items.map(({ title, nodeContent, content }) => (
            <AccordionItem key={title} value={title} className="">
              <AccordionTrigger className="flex flex-1 items-center justify-between py-4 transition-all data-[state=open]:text-brand-burgundy [&[data-state=open]>svg]:rotate-180 text-2xl font-[windsor] cursor-pointer">
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
