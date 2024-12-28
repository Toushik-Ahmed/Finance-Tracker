'use client';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

type Props = {
  value: string[];
  placeholder: string;
  onSelect?: (value: string) => void;
  selectedValue?: string;

};

const Selector = ({ placeholder, value, onSelect, selectedValue }: Props) => {

  const filteredValues = value.filter(val => val.trim() !== '');

  return (
    <div className="w-full">
      <Select value={selectedValue} onValueChange={onSelect} >
        <SelectTrigger>
          <SelectValue placeholder={placeholder} />
        </SelectTrigger>
        <SelectContent>
          {filteredValues.map((value, index) => (
            <SelectItem key={index} value={value}>
              {value}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};

export default Selector;
