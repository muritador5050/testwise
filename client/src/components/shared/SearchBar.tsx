import React from 'react';
import {
  Input,
  InputGroup,
  InputLeftElement,
  InputRightElement,
  IconButton,
  Box,
  useColorModeValue,
} from '@chakra-ui/react';
import { Search, X } from 'lucide-react';

export interface SearchBarProps {
  // Core props
  value: string;
  onChange: (value: string) => void;
  onSearch?: (value: string) => void;
  onClear?: () => void;

  // Customization props
  placeholder?: string;
  size?: 'sm' | 'md' | 'lg';
  variant?: 'outline' | 'filled' | 'flushed';
  borderRadius?: string;

  // Feature toggles
  showClearButton?: boolean;
  autoFocus?: boolean;
  disabled?: boolean;

  // Styling
  width?: string | number;
  maxWidth?: string | number;
  backgroundColor?: string;

  // Accessibility
  id?: string;
  'aria-label'?: string;
}

const SearchBar: React.FC<SearchBarProps> = ({
  value,
  onChange,
  onSearch,
  onClear,
  placeholder = 'Search...',
  size = 'md',
  variant = 'outline',
  borderRadius = 'md',
  showClearButton = true,
  autoFocus = false,
  disabled = false,
  width = '100%',
  maxWidth = '400px',
  backgroundColor,
  id,
  'aria-label': ariaLabel = 'Search',
}) => {
  // Color values for light/dark mode
  const searchIconColor = useColorModeValue('gray.400', 'gray.500');
  const clearButtonColor = useColorModeValue('gray.500', 'gray.400');
  const defaultBgColor = useColorModeValue('white', 'gray.800');

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    onChange(event.target.value);
  };

  const handleClear = () => {
    onChange('');
    onClear?.();
  };

  const handleKeyPress = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') {
      onSearch?.(value);
    }
  };

  const handleSearchClick = () => {
    onSearch?.(value);
  };

  return (
    <Box width={width} maxWidth={maxWidth}>
      <InputGroup size={size}>
        {/* Search Icon - Clickable */}
        <InputLeftElement>
          <IconButton
            aria-label='Search'
            icon={<Search />}
            variant='ghost'
            size='xs'
            color={searchIconColor}
            onClick={handleSearchClick}
            isDisabled={disabled}
          />
        </InputLeftElement>

        {/* Search Input */}
        <Input
          id={id}
          value={value}
          onChange={handleInputChange}
          onKeyPress={handleKeyPress}
          placeholder={placeholder}
          variant={variant}
          borderRadius={borderRadius}
          autoFocus={autoFocus}
          disabled={disabled}
          backgroundColor={backgroundColor || defaultBgColor}
          aria-label={ariaLabel}
          pr={showClearButton && value ? '2.5rem' : undefined}
        />

        {/* Clear Button - Only shows when there's text */}
        {showClearButton && value && (
          <InputRightElement>
            <IconButton
              aria-label='Clear search'
              icon={<X />}
              variant='ghost'
              size='xs'
              color={clearButtonColor}
              onClick={handleClear}
              isDisabled={disabled}
            />
          </InputRightElement>
        )}
      </InputGroup>
    </Box>
  );
};

export default SearchBar;
