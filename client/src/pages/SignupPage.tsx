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
  Link,
} from '@chakra-ui/react';
import { AvatarUpload } from '../utils/avatarUpload';
import { useRegisterUser } from '../api/services/authService';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import { colors, bgStyles, buttonStyles, textStyles } from '../utils/colors';

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

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      toast({
        title: 'Invalid email',
        description: 'Please enter a valid email address',
        status: 'error',
        duration: 5000,
        position: 'top-right',
        isClosable: true,
      });
      return;
    }

    if (!formData.avatar) {
      toast({
        title: 'Avatar required',
        description: 'Please select an avatar image',
        status: 'warning',
        duration: 5000,
        position: 'top-right',
        isClosable: true,
      });
      return;
    }

    await registerMutation.mutateAsync({
      email: formData.email.trim().toLowerCase(),
      name: formData.name,
      avatar: formData.avatar,
      role: '',
    });

    toast({
      title: 'Registration successful!',
      description: 'Your account has been created',
      status: 'success',
      duration: 3000,
      position: 'top-right',
      isClosable: true,
    });

    // Reset form
    setFormData({ email: '', name: '', avatar: null });
    navigate('/users/login');
  };

  return (
    <Container maxW='md' py={10} minH='100vh'>
      <Card {...bgStyles.card} boxShadow='md'>
        <CardBody>
          <VStack spacing={6} as='form' onSubmit={handleSubmit}>
            <Heading size='lg' {...textStyles.heading}>
              Create Account
            </Heading>
            <Text {...textStyles.body} fontSize='sm'>
              Fill in your details to get started
            </Text>

            <FormControl isRequired>
              <FormLabel textAlign='center' {...textStyles.heading}>
                Profile Picture
              </FormLabel>
              <Box display='flex' justifyContent='center'>
                <AvatarUpload
                  onAvatarChange={handleAvatarChange}
                  disabled={registerMutation.isPending}
                />
              </Box>
            </FormControl>

            <FormControl isRequired>
              <FormLabel {...textStyles.heading}>Full Name</FormLabel>
              <Input
                type='text'
                name='name'
                value={formData.name}
                onChange={handleInputChange}
                placeholder='Enter your full name'
                disabled={registerMutation.isPending}
                borderColor={colors.border}
                _hover={{ borderColor: colors.primaryLight }}
                color='black'
                _focus={{
                  borderColor: colors.primary,
                  boxShadow: `0 0 0 1px ${colors.primary}`,
                }}
              />
            </FormControl>

            <FormControl isRequired>
              <FormLabel {...textStyles.heading}>Email Address</FormLabel>
              <Input
                type='email'
                name='email'
                value={formData.email}
                onChange={handleInputChange}
                placeholder='Enter your email'
                disabled={registerMutation.isPending}
                borderColor={colors.border}
                _hover={{ borderColor: colors.primaryLight }}
                color='black'
                _focus={{
                  borderColor: colors.primary,
                  boxShadow: `0 0 0 1px ${colors.primary}`,
                }}
              />
            </FormControl>

            <Button
              type='submit'
              width='full'
              size='lg'
              isLoading={registerMutation.isPending}
              loadingText='Creating account...'
              isDisabled={!formData.avatar || !formData.name || !formData.email}
              {...buttonStyles.primary}
            >
              Sign Up
            </Button>

            <Link
              as={RouterLink}
              to='/users/login'
              color={colors.primary}
              fontWeight='medium'
              _hover={{
                color: colors.primaryHover,
                textDecoration: 'underline',
              }}
              cursor='pointer'
            >
              Already have an account
            </Link>

            {registerMutation.isError && (
              <Box
                p={3}
                bg={colors.sectionBg}
                borderRadius='md'
                w='full'
                textAlign='center'
                border={`1px solid ${colors.border}`}
              >
                <Text color={colors.error} fontSize='sm'>
                  {registerMutation.error.message}
                </Text>
              </Box>
            )}
          </VStack>
        </CardBody>
      </Card>
    </Container>
  );
};
