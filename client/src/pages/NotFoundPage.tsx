import { Box, Heading, Text, Button, VStack, Image } from '@chakra-ui/react';
import { useNavigate } from 'react-router-dom';

export default function NotFoundPage() {
  const navigate = useNavigate();

  return (
    <Box
      minH='100vh'
      display='flex'
      alignItems='center'
      justifyContent='center'
      bg='gray.50'
      px={4}
    >
      <VStack spacing={6} textAlign='center' maxW='md'>
        <Image
          src='https://illustrations.popsy.co/white/resistance-error.svg'
          alt='404 Illustration'
          maxW='300px'
        />
        <Heading as='h1' fontSize={{ base: '2xl', md: '4xl' }}>
          Oops! Page Not Found 😢
        </Heading>
        <Text fontSize={{ base: 'md', md: 'lg' }} color='gray.600'>
          The page you’re looking for doesn’t exist or has been moved.
        </Text>
        <Button
          colorScheme='blue'
          size='lg'
          onClick={() => navigate('/')}
          _hover={{ transform: 'translateY(-2px)', boxShadow: 'md' }}
        >
          Go Home
        </Button>
      </VStack>
    </Box>
  );
}
