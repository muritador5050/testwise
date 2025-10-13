import {
  Box,
  Button,
  Container,
  Flex,
  Heading,
  Text,
  SimpleGrid,
  Icon,
  VStack,
  HStack,
  Stack,
} from '@chakra-ui/react';
import { BookOpen, Brain, TrendingUp, CheckCircle, Zap } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { colors, buttonStyles } from '../utils/colors';

export default function HomePage() {
  const navigate = useNavigate();

  const features = [
    {
      icon: Brain,
      title: 'Smart Assessment',
      description: 'Adaptive testing powered by intelligent algorithms',
    },
    {
      icon: TrendingUp,
      title: 'Track Progress',
      description: 'Real-time analytics and performance insights',
    },
    {
      icon: Zap,
      title: 'Instant Results',
      description: 'Get immediate feedback on your performance',
    },
  ];

  const stats = [
    { label: 'Active Users', value: '50,000+' },
    { label: 'Questions Available', value: '100,000+' },
    { label: 'Success Rate', value: '95%' },
  ];

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
                onClick={() => navigate('/users/login')}
              >
                Login
              </Button>
              <Button
                {...buttonStyles.primary}
                onClick={() => navigate('/users/signup')}
              >
                Sign Up
              </Button>
            </HStack>
          </Flex>
        </Container>
      </Box>

      {/* Hero Section */}
      <Container maxW='7xl' pt={32} pb={20}>
        <VStack spacing={20}>
          {/* Hero Content */}
          <VStack spacing={8} textAlign='center' maxW='4xl'>
            <Heading
              fontSize={{ base: '4xl', md: '6xl' }}
              fontWeight='bold'
              lineHeight='1.1'
              color={colors.textPrimary}
            >
              Master Your Exams with{' '}
              <Text as='span' color={colors.primary}>
                Smart Assessment
              </Text>
            </Heading>

            <Text fontSize='xl' color={colors.textSecondary} lineHeight='1.6'>
              Experience the next generation of computer-based testing.
              Practice, learn, and excel with our intelligent platform.
            </Text>

            <Stack direction={{ base: 'column', sm: 'row' }} spacing={4} pt={4}>
              <Button
                size='lg'
                {...buttonStyles.primary}
                rightIcon={<Icon as={CheckCircle} />}
                onClick={() => navigate('/users/signup')}
              >
                Get Started Free
              </Button>
              <Button
                size='lg'
                variant='outline'
                borderColor={colors.primary}
                color={colors.primary}
                _hover={{ bg: colors.sectionBg }}
              >
                Watch Demo
              </Button>
            </Stack>
          </VStack>

          {/* Stats Section */}
          <SimpleGrid
            columns={{ base: 1, md: 3 }}
            spacing={6}
            w='full'
            maxW='4xl'
          >
            {stats.map((stat, idx) => (
              <Box
                key={idx}
                bg={colors.cardBg}
                rounded='xl'
                p={6}
                shadow='md'
                textAlign='center'
                border='1px'
                borderColor={colors.border}
              >
                <Text
                  fontSize='3xl'
                  fontWeight='bold'
                  color={colors.primary}
                  mb={2}
                >
                  {stat.value}
                </Text>
                <Text color={colors.textSecondary} fontWeight='medium'>
                  {stat.label}
                </Text>
              </Box>
            ))}
          </SimpleGrid>

          {/* Features Grid */}
          <VStack spacing={12} w='full'>
            <Heading size='xl' textAlign='center' color={colors.textPrimary}>
              Why Choose TESTWISE?
            </Heading>

            <SimpleGrid columns={{ base: 1, md: 3 }} spacing={8} w='full'>
              {features.map((feature, idx) => (
                <Box
                  key={idx}
                  bg={colors.cardBg}
                  rounded='xl'
                  p={6}
                  shadow='md'
                  border='1px'
                  borderColor={colors.border}
                  textAlign='center'
                >
                  <Flex justify='center' mb={4}>
                    <Box p={3} bg={colors.sectionBg} rounded='lg'>
                      <Icon
                        as={feature.icon}
                        w={6}
                        h={6}
                        color={colors.primary}
                      />
                    </Box>
                  </Flex>
                  <Heading size='md' mb={3} color={colors.textPrimary}>
                    {feature.title}
                  </Heading>
                  <Text color={colors.textSecondary} fontSize='sm'>
                    {feature.description}
                  </Text>
                </Box>
              ))}
            </SimpleGrid>
          </VStack>

          {/* CTA Section */}
          <Box
            w='full'
            bg={colors.primary}
            rounded='2xl'
            p={12}
            textAlign='center'
            color='white'
          >
            <VStack spacing={4}>
              <Heading size='xl'>Ready to Transform Your Learning?</Heading>
              <Text fontSize='lg' opacity={0.9}>
                Join thousands of students already succeeding with TESTWISE
              </Text>
              <Button
                size='lg'
                bg='white'
                color={colors.primary}
                fontWeight='bold'
                px={8}
                _hover={{ bg: 'gray.50' }}
                onClick={() => navigate('/users/signup')}
              >
                Start Your Journey Today
              </Button>
            </VStack>
          </Box>
        </VStack>
      </Container>

      {/* Footer */}
      <Box bg={colors.textPrimary} color='white' py={8}>
        <Container maxW='7xl'>
          <VStack spacing={4} textAlign='center'>
            <HStack spacing={2}>
              <Icon as={BookOpen} w={5} h={5} color={colors.primary} />
              <Text fontSize='lg' fontWeight='bold'>
                TESTWISE
              </Text>
            </HStack>
            <Text fontSize='sm' opacity={0.8}>
              Empowering learners worldwide with smart assessment technology
            </Text>
            <Text fontSize='sm' opacity={0.6}>
              © 2025 TESTWISE. All rights reserved.
            </Text>
          </VStack>
        </Container>
      </Box>
    </Box>
  );
}
