import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';

type Props = {};

const ToastComponent = (props: Props) => {
  const { toast } = useToast();
  return (
    <div>
      <Button
        onClick={() => {
          toast({
            description: 'Your message has been sent.',
          });
        }}
      >
        Show Toast
      </Button>
    </div>
  );
};

export default ToastComponent;
