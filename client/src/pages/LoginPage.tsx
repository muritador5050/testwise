import React, { useState } from 'react';
import {
  Box,
  Container,
  VStack,
  Heading,
  Text,
  FormControl,
  FormLabel,
  Input,
  Button,
  useToast,
  Link,
  Flex,
  useColorModeValue,
  Card,
  CardBody,
} from '@chakra-ui/react';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import { useLoginUser } from '../api/services/authService';
import { navigateByRole, getCurrentUser, setToken } from '../api/apiClient';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const toast = useToast();
  const navigate = useNavigate();
  const loginMutation = useLoginUser();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Simple email validation
    if (!email || !/\S+@\S+\.\S+/.test(email)) {
      toast({
        title: 'Invalid email',
        description: 'Please enter a valid email address',
        status: 'error',
        duration: 3000,
        position: 'top-right',
        isClosable: true,
      });

      return;
    }

    try {
      // Simulate login process
      const response = await loginMutation.mutateAsync({ email: email });
      setToken(response.token);
      const user = getCurrentUser();

      if (!user) {
        throw new Error('Failed to get user data');
      }

      navigate(navigateByRole(user.role), { replace: true });
      toast({
        title: 'Login successful!',
        description: `Welcome back!`,
        status: 'success',
        duration: 3000,
        position: 'top-right',
        isClosable: true,
      });
    } catch {
      toast({
        title: 'Login failed',
        description: 'Please try again',
        status: 'error',
        position: 'top-right',
        duration: 3000,
        isClosable: true,
      });
    }
  };

  const bgGradient = useColorModeValue(
    'linear(to-br, blue.50, purple.50)',
    'linear(to-br, gray.800, gray.900)'
  );

  const cardBg = useColorModeValue('white', 'gray.700');

  return (
    <Flex
      minH='100vh'
      bgGradient={bgGradient}
      align='center'
      justify='center'
      py={8}
      px={4}
    >
      <Container maxW='md'>
        <VStack spacing={8}>
          {/* Header */}
          <Box textAlign='center'>
            <Heading size='xl' color='blue.600' mb={3}>
              Login
            </Heading>
            <Text fontSize='lg' color='gray.600'>
              Enter your email to access the admin panel
            </Text>
          </Box>

          {/* Login Card */}
          <Card w='full' shadow='lg' borderRadius='xl' bg={cardBg}>
            <CardBody p={8}>
              <VStack as='form' onSubmit={handleSubmit} spacing={6}>
                {/* Email Input */}
                <FormControl isRequired>
                  <FormLabel fontWeight='medium'>Email Address</FormLabel>
                  <Input
                    type='email'
                    placeholder='your.email@example.com'
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    size='lg'
                    fontSize='md'
                    focusBorderColor='blue.500'
                    autoComplete='email'
                  />
                </FormControl>

                {/* Login Button */}
                <Button
                  type='submit'
                  colorScheme='blue'
                  size='lg'
                  w='full'
                  isLoading={loginMutation.isPending}
                  loadingText='Signing in...'
                  fontSize='md'
                  fontWeight='semibold'
                  py={6}
                >
                  Sign In
                </Button>

                {/* Demo Info */}
                <Box
                  p={3}
                  bg='blue.50'
                  borderRadius='md'
                  w='full'
                  textAlign='center'
                >
                  <Text fontSize='sm' color='blue.700'>
                    💡 Demo: Enter any valid email format to login
                  </Text>
                </Box>
              </VStack>
            </CardBody>
          </Card>

          {/* Footer Links */}
          <VStack spacing={4} textAlign='center'>
            <Text fontSize='sm' color='gray.600'>
              Need help?{' '}
              <Link
                color='blue.500'
                fontWeight='medium'
                _hover={{ textDecoration: 'underline' }}
              >
                Contact support
              </Link>
            </Text>

            <Text fontSize='sm' color='gray.500'>
              ←{' '}
              <Link
                as={RouterLink}
                to='/'
                color='blue.500'
                fontWeight='medium'
                _hover={{ textDecoration: 'underline' }}
              >
                Back to homepage
              </Link>
            </Text>
          </VStack>
        </VStack>
      </Container>
    </Flex>
  );
}
