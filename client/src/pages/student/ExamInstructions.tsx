import {
  Box,
  Container,
  Heading,
  Text,
  Button,
  VStack,
  List,
  ListItem,
  Divider,
  Alert,
  AlertIcon,
  Flex,
  useToast,
} from '@chakra-ui/react';
import { CheckCircle, AlertCircle } from 'lucide-react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useStartAttempt } from '../../api/services/attemptService';

export default function ExamInstructions() {
  const navigate = useNavigate();
  const toast = useToast();

  // Location
  const location = useLocation();
  const testId = location.state?.testId;

  const start = useStartAttempt();

  const handleStart = async () => {
    await start.mutateAsync(testId, {
      onSuccess: (attempt) => {
        navigate(`/student/exam/${attempt.id}`);
      },
      onError: (error) => {
        toast({
          title: 'Error starting exam',
          description: error.message,
          status: 'error',
          position: 'top-right',
        });
      },
    });
  };

  const handleCancel = () => {
    navigate('/student');
  };

  return (
    <Container maxW='container.md' py={8}>
      <Box shadow='xl' borderRadius='lg' p={8}>
        <VStack spacing={6} align='stretch'>
          <Heading as='h1' size='xl' textAlign='center' color='blue.600'>
            Exam Instructions
          </Heading>

          <Divider />

          <Alert status='info' borderRadius='md'>
            <AlertIcon />
            Please read all instructions carefully before starting the exam.
          </Alert>

          <Box>
            <Heading as='h2' size='md' mb={4} color='gray.700'>
              General Guidelines:
            </Heading>
            <List spacing={3}>
              <ListItem display='flex' alignItems='flex-start'>
                <Box
                  as={CheckCircle}
                  size={20}
                  color='green.500'
                  mr={3}
                  mt={1}
                  flexShrink={0}
                />
                <Text>
                  Ensure you have a stable internet connection throughout the
                  exam.
                </Text>
              </ListItem>
              <ListItem display='flex' alignItems='flex-start'>
                <Box
                  as={CheckCircle}
                  size={20}
                  color='green.500'
                  mr={3}
                  mt={1}
                  flexShrink={0}
                />
                <Text>
                  The exam must be completed in one sitting. You cannot pause
                  and resume later.
                </Text>
              </ListItem>
              <ListItem display='flex' alignItems='flex-start'>
                <Box
                  as={CheckCircle}
                  size={20}
                  color='green.500'
                  mr={3}
                  mt={1}
                  flexShrink={0}
                />
                <Text>Answer all questions to the best of your ability.</Text>
              </ListItem>
              <ListItem display='flex' alignItems='flex-start'>
                <Box
                  as={CheckCircle}
                  size={20}
                  color='green.500'
                  mr={3}
                  mt={1}
                  flexShrink={0}
                />
                <Text>
                  You can navigate between questions using the navigation
                  buttons.
                </Text>
              </ListItem>
              <ListItem display='flex' alignItems='flex-start'>
                <Box
                  as={CheckCircle}
                  size={20}
                  color='green.500'
                  mr={3}
                  mt={1}
                  flexShrink={0}
                />
                <Text>Review your answers before submitting the exam.</Text>
              </ListItem>
            </List>
          </Box>

          <Box>
            <Heading as='h2' size='md' mb={4} color='gray.700'>
              Important Notes:
            </Heading>
            <List spacing={3}>
              <ListItem display='flex' alignItems='flex-start'>
                <Box
                  as={AlertCircle}
                  size={20}
                  color='orange.500'
                  mr={3}
                  mt={1}
                  flexShrink={0}
                />
                <Text>
                  The timer will start as soon as you click "Start Exam".
                </Text>
              </ListItem>
              <ListItem display='flex' alignItems='flex-start'>
                <Box
                  as={AlertCircle}
                  size={20}
                  color='orange.500'
                  mr={3}
                  mt={1}
                  flexShrink={0}
                />
                <Text>
                  Do not refresh the page or close the browser during the exam.
                </Text>
              </ListItem>
              <ListItem display='flex' alignItems='flex-start'>
                <Box
                  as={AlertCircle}
                  size={20}
                  color='orange.500'
                  mr={3}
                  mt={1}
                  flexShrink={0}
                />
                <Text>Ensure you submit your exam before time runs out.</Text>
              </ListItem>
            </List>
          </Box>

          <Divider />

          <Flex gap={4} justify='center' flexWrap='wrap'>
            <Button colorScheme='gray' size='lg' px={8} onClick={handleCancel}>
              Cancel
            </Button>
            <Button
              colorScheme='blue'
              size='lg'
              px={8}
              isLoading={start.isPending}
              onClick={handleStart}
            >
              Start Exam
            </Button>
          </Flex>
        </VStack>
      </Box>
    </Container>
  );
}
