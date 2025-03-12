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
    <div className="flex w-full flex-col items-center justify-center">
      <a
        href="#faq"
        className="group flex items-center justify-center border-brand-paper border-b hover:border-brand-burgundy"
      >
        <Link className="invisible group-hover:visible" />
        <h2 id="faq" className="pl-2">
          FAQ
        </h2>
      </a>
      <div className="mt-8 flex w-full max-w-3xl items-start px-8 text-left">
        <Accordion type="multiple" className="">
          {items.map(({ title, nodeContent, content }) => (
            <AccordionItem key={title} value={title} className="">
              <AccordionTrigger className="flex flex-1 cursor-pointer items-center justify-between py-4 font-[windsor] text-2xl transition-all data-[state=open]:text-brand-burgundy [&[data-state=open]>svg]:rotate-180">
                {title}
                <ChevronDown className="ml-4 h-4 w-4 shrink-0 transition-transform duration-200" />
              </AccordionTrigger>
              <AccordionContent className="overflow-hidden whitespace-pre-line transition-all data-[state=closed]:animate-accordion-up data-[state=open]:animate-accordion-down">
                {nodeContent ?? content}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </div>
  );
};
