import { useRef, useState } from 'react';
import {
  Box,
  Avatar,
  Button,
  VStack,
  Text,
  Icon,
  IconButton,
} from '@chakra-ui/react';
import { Camera, X } from 'lucide-react';

interface AvatarUploadProps {
  onAvatarChange: (file: File | null) => void;
  currentAvatar?: string;
  disabled?: boolean;
}

export const AvatarUpload: React.FC<AvatarUploadProps> = ({
  onAvatarChange,
  currentAvatar,
  disabled = false,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      alert('Please select an image file');
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      alert('Image must be less than 5MB');
      return;
    }

    const objectUrl = URL.createObjectURL(file);
    setPreviewUrl(objectUrl);
    onAvatarChange(file);
  };

  const handleClick = () => {
    if (!disabled) {
      fileInputRef.current?.click();
    }
  };

  const handleRemove = () => {
    setPreviewUrl(null);
    onAvatarChange(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <VStack spacing={3}>
      <input
        type='file'
        ref={fileInputRef}
        onChange={handleFileSelect}
        accept='image/*'
        style={{ display: 'none' }}
        disabled={disabled}
      />

      <Box position='relative'>
        <Avatar
          size='2xl'
          src={previewUrl || currentAvatar}
          name='User Avatar'
          bg='gray.300'
        />

        {(previewUrl || currentAvatar) && !disabled && (
          <IconButton
            aria-label='Remove avatar'
            icon={<Icon as={X} />}
            size='sm'
            colorScheme='red'
            rounded='full'
            position='absolute'
            top='-2'
            right='-2'
            onClick={handleRemove}
          />
        )}

        {!previewUrl && !currentAvatar && (
          <Box
            position='absolute'
            top='50%'
            left='50%'
            transform='translate(-50%, -50%)'
          >
            <Icon as={Camera} boxSize={8} color='gray.500' />
          </Box>
        )}
      </Box>

      <Button
        onClick={handleClick}
        disabled={disabled}
        size='sm'
        colorScheme='blue'
        variant='outline'
        leftIcon={<Icon as={Camera} />}
      >
        {previewUrl || currentAvatar ? 'Change Avatar' : 'Upload Avatar'}
      </Button>

      <Text fontSize='xs' color='gray.500'>
        Max size: 5MB (JPG, PNG)
      </Text>
    </VStack>
  );
};
