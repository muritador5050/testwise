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
  Card,
  CardBody,
  HStack,
  Icon,
} from '@chakra-ui/react';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import { BookOpen } from 'lucide-react';
import { useLoginUser } from '../api/services/authService';
import { navigateByRole, getCurrentUser, setToken } from '../api/apiClient';
import { colors, buttonStyles } from '../utils/colors';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const toast = useToast();
  const navigate = useNavigate();
  const loginMutation = useLoginUser();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email || !/\S+@\S+\.\S+/.test(email)) {
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

    const normalizedEmail = email.trim().toLowerCase();

    const response = await loginMutation.mutateAsync({
      email: normalizedEmail,
    });

    setToken(response.token);
    const user = getCurrentUser();

    if (!user) {
      throw new Error('Failed to get user data');
    }

    navigate(navigateByRole(user.role), { replace: true });
  };

  return (
    <Box minH='100vh' bg={colors.pageBg}>
      {/* Navigation */}
      <Box
        position='fixed'
        top={0}
        left={0}
        right={0}
        zIndex={50}
        bg='white'
        borderBottom='1px'
        borderColor={colors.border}
      >
        <Container maxW='7xl'>
          <Flex py={4} align='center' justify='space-between'>
            <HStack spacing={3}>
              <Icon as={BookOpen} w={8} h={8} color={colors.primary} />
              <Heading size='lg' color={colors.primary}>
                TESTWISE
              </Heading>
            </HStack>

            <HStack spacing={3}>
              <Button
                variant='ghost'
                color={colors.textSecondary}
                fontWeight='medium'
                _hover={{ color: colors.primary, bg: colors.sectionBg }}
                onClick={() => navigate('/')}
              >
                Back to Home
              </Button>
            </HStack>
          </Flex>
        </Container>
      </Box>

      <Flex minH='100vh' align='center' justify='center' py={8} pt={20}>
        <Container maxW='md'>
          <VStack spacing={8}>
            {/* Header */}
            <Box textAlign='center'>
              <Heading size='xl' color={colors.primary} mb={3}>
                Welcome Back
              </Heading>
              <Text fontSize='lg' color={colors.textSecondary}>
                Enter your email to access your account
              </Text>
            </Box>

            {/* Login Card */}
            <Card w='full' shadow='lg' borderRadius='xl' bg={colors.cardBg}>
              <CardBody p={8}>
                <VStack as='form' onSubmit={handleSubmit} spacing={6}>
                  {/* Email Input */}
                  <FormControl isRequired>
                    <FormLabel fontWeight='medium' color={colors.textPrimary}>
                      Email Address
                    </FormLabel>
                    <Input
                      type='email'
                      placeholder='your.email@example.com'
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      size='lg'
                      fontSize='md'
                      focusBorderColor={colors.primary}
                      borderColor={colors.border}
                      bg='white'
                      color='black'
                      autoComplete='email'
                    />
                  </FormControl>

                  {/* Login Button */}
                  <Button
                    type='submit'
                    {...buttonStyles.primary}
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

                  {/* Error Message */}
                  {loginMutation.isError && (
                    <Box
                      p={3}
                      bg='red.50'
                      borderRadius='md'
                      w='full'
                      textAlign='center'
                      border='1px'
                      borderColor='red.200'
                    >
                      <Text color='red.600' fontSize='sm'>
                        {loginMutation.error.message}
                      </Text>
                    </Box>
                  )}
                </VStack>
                <VStack spacing={4} textAlign='center' mt={7}>
                  <Text fontSize='sm' color={colors.textMuted}>
                    <Link
                      as={RouterLink}
                      to='/users/signUp'
                      color={colors.primary}
                      fontWeight='medium'
                      _hover={{ textDecoration: 'underline' }}
                    >
                      Don't have account yet ?
                    </Link>
                  </Text>
                </VStack>
              </CardBody>
            </Card>
          </VStack>
        </Container>
      </Flex>
    </Box>
  );
}
