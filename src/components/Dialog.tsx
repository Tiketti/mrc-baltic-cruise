import {
  Close,
  Content,
  Description,
  Overlay,
  Portal,
  Root,
  Title,
} from "@radix-ui/react-dialog";
import "../styles/global.css";
import { Beer, Calendar, XCircle } from "lucide-react";
import { format, parse } from "date-fns";
import { Fragment } from "react/jsx-runtime";

interface DialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  content: string | undefined;
  date: string | undefined;
}

export const Dialog = ({
  open,
  onOpenChange,
  title,
  content,
  date,
}: DialogProps) => {
  // Hackamajig: replace :beer: with Beer icon
  const processedContent =
    typeof content === "string"
      ? content.split(":beer:").map((text, index, array) => (
          // biome-ignore lint/suspicious/noArrayIndexKey: Elements are not changing
          <Fragment key={index}>
            {text}
            {index < array.length - 1 && (
              <Beer className="inline faded" size="24" strokeWidth="2" />
            )}
          </Fragment>
        ))
      : content;

  return (
    <Root open={open} onOpenChange={onOpenChange}>
      <Portal>
        <Overlay className="DialogOverlay overflow-y-auto" />
        <Content className="DialogContent whitespace-pre-line max-h-[85vh] overflow-y-auto">
          <Title className="DialogTitle">{title}</Title>
          <Description className="DialogDescription flex items-center">
            <Calendar size="24" strokeWidth="2" className="mr-2" />
            {date &&
              format(parse(date, "dd.MM.yyyy", new Date()), "EEEE, MMMM do")}
          </Description>
          {processedContent}
          <div className="flex justify-end mt-8" />
          <Close asChild>
            <button type="button" className="IconButton" aria-label="Close">
              <XCircle size="36" />
            </button>
          </Close>
        </Content>
      </Portal>
    </Root>
  );
};
