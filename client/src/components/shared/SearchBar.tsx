import React from 'react';
import {
  Input,
  InputGroup,
  InputLeftElement,
  InputRightElement,
  IconButton,
  Box,
} from '@chakra-ui/react';
import { Search, X } from 'lucide-react';
import { colors } from '../../utils/colors';

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
            color={colors.textMuted}
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
          backgroundColor={backgroundColor || colors.cardBg}
          borderColor={colors.border}
          color={colors.textPrimary}
          _placeholder={{ color: colors.textMuted }}
          _focus={{
            borderColor: colors.primary,
            boxShadow: `0 0 0 1px ${colors.primary}`,
          }}
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
              color={colors.textSecondary}
              _hover={{ color: colors.textPrimary }}
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
