import { format } from 'date-fns';
import { Calendar as CalendarIcon } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { cn } from '@/lib/utils';
import { Matcher } from 'react-day-picker';
type Props = {
  date: Date | undefined;
  setDate: (date: Date) => void;
  disabled?: Matcher | Matcher[] | undefined;
};

const DatePicker = ({ date, setDate, disabled }: Props) => {
  return (
    <div>
      <Popover>
        <PopoverTrigger asChild>
          <Button
            variant={'outline'}
            className={cn(
              'w-[280px] justify-start text-left font-normal',
              !date && 'text-muted-foreground'
            )}
          >
            <CalendarIcon className="mr-2 h-4 w-4" />
            {date ? format(date, 'PPP') : <span>Pick a date</span>}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0">
          <Calendar
            mode="single"
            selected={date}
            onSelect={(date: Date | undefined) => date && setDate(date)}
            disabled={disabled || false}
            initialFocus
          />
        </PopoverContent>
      </Popover>
    </div>
  );
};
export default DatePicker;
