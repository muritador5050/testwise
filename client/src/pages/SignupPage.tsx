import { useState } from 'react';
import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Input,
  VStack,
  Heading,
  Text,
  useToast,
  Container,
  Card,
  CardBody,
} from '@chakra-ui/react';
import { AvatarUpload } from '../utils/avatarUpload';
import { useRegisterUser } from '../api/services/authService';
import { useNavigate } from 'react-router-dom';

export const SignupPage: React.FC = () => {
  const [formData, setFormData] = useState({
    email: '',
    name: '',
    avatar: null as File | null,
  });

  const navigate = useNavigate();
  const registerMutation = useRegisterUser();
  const toast = useToast();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleAvatarChange = (file: File | null) => {
    setFormData((prev) => ({ ...prev, avatar: file }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.avatar) {
      toast({
        title: 'Avatar required',
        description: 'Please select an avatar image',
        status: 'warning',
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    try {
      await registerMutation.mutateAsync({
        ...formData,
        avatar: formData.avatar,
        role: '',
      });

      toast({
        title: 'Registration successful!',
        description: 'Your account has been created',
        status: 'success',
        duration: 3000,
        isClosable: true,
      });

      // Reset form
      setFormData({ email: '', name: '', avatar: null });
      navigate('/users/login');
    } catch (error) {
      toast({
        title: 'Registration failed',
        description:
          error instanceof Error ? error.message : 'Something went wrong',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    }
  };

  return (
    <Container maxW='md' py={10}>
      <Card>
        <CardBody>
          <VStack spacing={6} as='form' onSubmit={handleSubmit}>
            <Heading size='lg'>Create Account</Heading>
            <Text color='gray.600' fontSize='sm'>
              Fill in your details to get started
            </Text>

            <FormControl isRequired>
              <FormLabel textAlign='center'>Profile Picture</FormLabel>
              <Box display='flex' justifyContent='center'>
                <AvatarUpload
                  onAvatarChange={handleAvatarChange}
                  disabled={registerMutation.isPending}
                />
              </Box>
            </FormControl>

            <FormControl isRequired>
              <FormLabel>Full Name</FormLabel>
              <Input
                type='text'
                name='name'
                value={formData.name}
                onChange={handleInputChange}
                placeholder='Enter your full name'
                disabled={registerMutation.isPending}
              />
            </FormControl>

            <FormControl isRequired>
              <FormLabel>Email Address</FormLabel>
              <Input
                type='email'
                name='email'
                value={formData.email}
                onChange={handleInputChange}
                placeholder='Enter your email'
                disabled={registerMutation.isPending}
              />
            </FormControl>

            <Button
              type='submit'
              colorScheme='blue'
              width='full'
              size='lg'
              isLoading={registerMutation.isPending}
              loadingText='Creating account...'
              isDisabled={!formData.avatar || !formData.name || !formData.email}
            >
              Sign Up
            </Button>
            <Text onClick={() => navigate('/users/login')} cursor='pointer'>
              Already have an account
            </Text>
            {registerMutation.isError && (
              <Text color='red.500' fontSize='sm'>
                {registerMutation.error.message}
              </Text>
            )}
          </VStack>
        </CardBody>
      </Card>
    </Container>
  );
};
