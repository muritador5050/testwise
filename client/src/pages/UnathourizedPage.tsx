import { Box, Heading, Text, Button } from '@chakra-ui/react';
import { useNavigate } from 'react-router-dom';

export default function UnauthorizedPage() {
  const navigate = useNavigate();

  return (
    <Box textAlign='center' py={10}>
      <Heading>403 - Unauthorized</Heading>
      <Text mt={4}>You don't have permission to access this page.</Text>
      <Button mt={6} colorScheme='blue' onClick={() => navigate(-1)}>
        Go Back
      </Button>
    </Box>
  );
}
