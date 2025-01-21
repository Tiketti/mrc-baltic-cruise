import {
  Close,
  Content,
  Description,
  Overlay,
  Portal,
  Root,
  Title,
} from '@radix-ui/react-dialog';
import '../styles/global.css';
import { Calendar, XCircle } from 'lucide-react';

interface DialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  content: string | undefined;
}

export const Dialog = ({ open, onOpenChange, title, content }: DialogProps) => (
  <Root open={open} onOpenChange={onOpenChange}>
    <Portal>
      <Overlay className='DialogOverlay' />
      <Content className='DialogContent whitespace-pre-line'>
        <Title className='DialogTitle'>{title}</Title>
        <Description className='DialogDescription flex items-center'>
          <Calendar size='24' strokeWidth={2} />
          The agenda!
        </Description>
        {content}
        <div className='flex justify-end mt-8' />
        <Close asChild>
          <button type='button' className='IconButton' aria-label='Close'>
            <XCircle size='36' />
          </button>
        </Close>
      </Content>
    </Portal>
  </Root>
);
