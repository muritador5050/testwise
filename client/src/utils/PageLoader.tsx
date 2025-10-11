import { Center, Spinner } from '@chakra-ui/react';

export const PageLoader = () => (
  <Center h='100vh'>
    <Spinner size='xl' color='blue.500' thickness='4px' />
  </Center>
);
