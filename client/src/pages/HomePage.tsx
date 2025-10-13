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
  useColorModeValue,
  Stack,
} from '@chakra-ui/react';
import { BookOpen, Brain, TrendingUp, CheckCircle, Zap } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function HomePage() {
  const navigate = useNavigate();
  const bgGradient = useColorModeValue(
    'linear(to-br, indigo.50, white, purple.50)',
    'linear(to-br, gray.900, gray.800, purple.900)'
  );
  const navBg = 'gray.800';
  const cardBg = 'gray.700';
  const textColor = 'gray.200';

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
    <Box minH='100vh' bgGradient={bgGradient}>
      {/* Navigation */}
      <Box
        position='fixed'
        top={0}
        left={0}
        right={0}
        zIndex={50}
        bg={navBg}
        backdropFilter='blur(10px)'
        borderBottom='1px'
        borderColor='gray.200'
      >
        <Container maxW='7xl'>
          <Flex py={4} align='center' justify='space-between'>
            <HStack spacing={2}>
              <Icon as={BookOpen} w={8} h={8} color='indigo.600' />
              <Heading
                size='lg'
                bgGradient='linear(to-r, indigo.600, purple.600)'
                bgClip='text'
              >
                TESTWISE
              </Heading>
            </HStack>

            <HStack spacing={4}>
              <Button
                variant='ghost'
                colorScheme='gray'
                fontWeight='medium'
                onClick={() => navigate('/users/login')}
              >
                Login
              </Button>
              <Button
                bgGradient='linear(to-r, indigo.600, purple.600)'
                color='white'
                fontWeight='medium'
                _hover={{
                  transform: 'scale(1.05)',
                  shadow: 'lg',
                }}
                transition='all 0.2s'
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
        <VStack spacing={16}>
          {/* Hero Content */}
          <VStack spacing={6} textAlign='center'>
            <Heading
              fontSize={{ base: '4xl', md: '5xl', lg: '6xl' }}
              fontWeight='bold'
              lineHeight='tight'
            >
              Master Your Exams with
              <Text
                as='span'
                display='block'
                bgGradient='linear(to-r, indigo.600, purple.600)'
                bgClip='text'
              >
                Smart Assessment
              </Text>
            </Heading>

            <Text
              fontSize={{ base: 'lg', md: 'xl' }}
              color={textColor}
              maxW='3xl'
            >
              Experience the next generation of computer-based testing.
              Practice, learn, and excel with our intelligent platform designed
              for modern learners.
            </Text>

            <Stack direction={{ base: 'column', md: 'row' }} spacing={4} pt={4}>
              <Button
                size='lg'
                bgGradient='linear(to-r, indigo.600, purple.600)'
                color='white'
                fontWeight='semibold'
                px={8}
                rightIcon={<Icon as={CheckCircle} />}
                _hover={{
                  transform: 'scale(1.05)',
                  shadow: '2xl',
                }}
                transition='all 0.2s'
                onClick={() => navigate('/users/signup')}
              >
                Get Started Free
              </Button>
              <Button
                size='lg'
                variant='outline'
                colorScheme='gray'
                fontWeight='semibold'
                px={8}
                _hover={{
                  borderColor: 'indigo.600',
                  color: 'indigo.600',
                }}
                transition='all 0.2s'
              >
                Watch Demo
              </Button>
            </Stack>
          </VStack>

          {/* Stats Section */}
          <SimpleGrid columns={{ base: 1, md: 3 }} spacing={8} w='full'>
            {stats.map((stat, idx) => (
              <Box
                key={idx}
                bg={cardBg}
                rounded='2xl'
                p={8}
                shadow='lg'
                textAlign='center'
                _hover={{ shadow: 'xl' }}
                transition='all 0.2s'
              >
                <Heading
                  size='2xl'
                  bgGradient='linear(to-r, indigo.600, purple.600)'
                  bgClip='text'
                  mb={2}
                >
                  {stat.value}
                </Heading>
                <Text color={textColor} fontWeight='medium'>
                  {stat.label}
                </Text>
              </Box>
            ))}
          </SimpleGrid>

          {/* Features Grid */}
          <VStack spacing={12} w='full'>
            <Heading size='xl' textAlign='center'>
              Why Choose TESTWISE?
            </Heading>

            <SimpleGrid
              columns={{ base: 1, md: 2, lg: 4 }}
              spacing={6}
              w='full'
            >
              {features.map((feature, idx) => (
                <Box
                  key={idx}
                  bg={cardBg}
                  rounded='2xl'
                  p={8}
                  shadow='lg'
                  _hover={{
                    shadow: '2xl',
                    transform: 'scale(1.05)',
                    bgGradient: 'linear(to-br, indigo.50, purple.50)',
                  }}
                  transition='all 0.3s'
                  cursor='pointer'
                >
                  <Icon
                    as={feature.icon}
                    w={8}
                    h={8}
                    color='indigo.600'
                    mb={4}
                  />
                  <Heading size='md' mb={3}>
                    {feature.title}
                  </Heading>
                  <Text color={textColor}>{feature.description}</Text>
                </Box>
              ))}
            </SimpleGrid>
          </VStack>

          {/* CTA Section */}
          <Box
            w='full'
            bgGradient='linear(to-r, indigo.600, purple.600)'
            rounded='3xl'
            p={12}
            textAlign='center'
            color='white'
            shadow='2xl'
          >
            <Heading size='xl' mb={4}>
              Ready to Transform Your Learning?
            </Heading>
            <Text fontSize='xl' mb={8} color='indigo.100'>
              Join thousands of students already succeeding with TESTWISE Pro
            </Text>
            <Button
              size='lg'
              bg='white'
              color='indigo.900'
              fontWeight='bold'
              px={10}
              w={{ base: 'full', md: 'auto' }}
              _hover={{
                transform: 'scale(1.05)',
                shadow: '2xl',
              }}
              transition='all 0.2s'
              onClick={() => navigate('/users/signup')}
            >
              Start Your Journey Today
            </Button>
          </Box>
        </VStack>
      </Container>

      {/* Footer */}
      <Box bg='gray.900' color='gray.400' py={12}>
        <Container maxW='7xl'>
          <VStack spacing={4}>
            <HStack spacing={2}>
              <Icon as={BookOpen} w={6} h={6} color='indigo.400' />
              <Text fontSize='xl' fontWeight='bold' color='white'>
                TESTWISE
              </Text>
            </HStack>
            <Text>
              Empowering learners worldwide with smart assessment technology
            </Text>
            <Text fontSize='sm'>© 2025 CBT Pro. All rights reserved.</Text>
          </VStack>
        </Container>
      </Box>
    </Box>
  );
}
