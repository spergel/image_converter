import React from 'react';
import * as DropdownMenuPrimitive from '@radix-ui/react-dropdown-menu';
import { ChevronDown } from 'lucide-react';

export interface DropdownOption {
  value: string;
  label: string;
}

interface DropdownMenuProps {
  options: DropdownOption[];
  onValueChange: (value: string) => void;
  placeholder?: string;
  value: string | null;
}

export const DropdownMenu: React.FC<DropdownMenuProps> = ({ options, onValueChange, placeholder = 'Select an option', value }) => {
  return (
    <DropdownMenuPrimitive.Root>
      <DropdownMenuPrimitive.Trigger className="flex items-center justify-between w-full px-3 py-2 text-sm border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
        {value ? options.find(option => option.value === value)?.label : placeholder}
        <ChevronDown className="w-4 h-4 ml-2" />
      </DropdownMenuPrimitive.Trigger>

      <DropdownMenuPrimitive.Portal>
        <DropdownMenuPrimitive.Content className="min-w-[220px] bg-white rounded-md shadow-lg p-1 mt-1">
          {options.map((option) => (
            <DropdownMenuPrimitive.Item
              key={option.value}
              className="flex items-center px-2 py-2 text-sm outline-none cursor-pointer hover:bg-gray-100 focus:bg-gray-100"
              onSelect={() => onValueChange(option.value)}
            >
              {option.label}
            </DropdownMenuPrimitive.Item>
          ))}
        </DropdownMenuPrimitive.Content>
      </DropdownMenuPrimitive.Portal>
    </DropdownMenuPrimitive.Root>
  );
};