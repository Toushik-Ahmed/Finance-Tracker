import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import Selector from './Selector';
import { Label } from '@radix-ui/react-menubar';

type Props = {};
const values = ['Expense', 'Income', 'All']
const PopoverComponent = (props: Props) => {
  return (
    <div className='w-200px'>
      <Popover >
        <PopoverTrigger className='w-[100px] border-2 p-1 rounded-sm'>Filter</PopoverTrigger>
        <PopoverContent>
          <div>
          <Label>Select Type</Label>
          <Selector placeholder="Filter" value={values} />
          </div>

        </PopoverContent>

      </Popover>
    </div>
  );
};

export default PopoverComponent;
