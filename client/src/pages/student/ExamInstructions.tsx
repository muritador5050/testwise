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
import { colors, bgStyles, textStyles, buttonStyles } from '../../utils/colors';

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
      <Box shadow='xl' borderRadius='lg' p={8} {...bgStyles.card}>
        <VStack spacing={6} align='stretch'>
          <Heading as='h1' size='xl' textAlign='center' color={colors.primary}>
            Exam Instructions
          </Heading>

          <Divider borderColor={colors.border} />

          <Alert
            status='info'
            borderRadius='md'
            bg={colors.sectionBg}
            borderColor={colors.info}
          >
            <AlertIcon color={colors.info} />
            <Text {...textStyles.body}>
              Please read all instructions carefully before starting the exam.
            </Text>
          </Alert>

          <Box>
            <Heading as='h2' size='md' mb={4} {...textStyles.heading}>
              General Guidelines:
            </Heading>
            <List spacing={3}>
              <ListItem display='flex' alignItems='flex-start'>
                <Box
                  as={CheckCircle}
                  size={20}
                  color={colors.success}
                  mr={3}
                  mt={1}
                  flexShrink={0}
                />
                <Text {...textStyles.body}>
                  Ensure you have a stable internet connection throughout the
                  exam.
                </Text>
              </ListItem>
              <ListItem display='flex' alignItems='flex-start'>
                <Box
                  as={CheckCircle}
                  size={20}
                  color={colors.success}
                  mr={3}
                  mt={1}
                  flexShrink={0}
                />
                <Text {...textStyles.body}>
                  The exam must be completed in one sitting. You cannot pause
                  and resume later.
                </Text>
              </ListItem>
              <ListItem display='flex' alignItems='flex-start'>
                <Box
                  as={CheckCircle}
                  size={20}
                  color={colors.success}
                  mr={3}
                  mt={1}
                  flexShrink={0}
                />
                <Text {...textStyles.body}>
                  Answer all questions to the best of your ability.
                </Text>
              </ListItem>
              <ListItem display='flex' alignItems='flex-start'>
                <Box
                  as={CheckCircle}
                  size={20}
                  color={colors.success}
                  mr={3}
                  mt={1}
                  flexShrink={0}
                />
                <Text {...textStyles.body}>
                  You can navigate between questions using the navigation
                  buttons.
                </Text>
              </ListItem>
              <ListItem display='flex' alignItems='flex-start'>
                <Box
                  as={CheckCircle}
                  size={20}
                  color={colors.success}
                  mr={3}
                  mt={1}
                  flexShrink={0}
                />
                <Text {...textStyles.body}>
                  Review your answers before submitting the exam.
                </Text>
              </ListItem>
            </List>
          </Box>

          <Box>
            <Heading as='h2' size='md' mb={4} {...textStyles.heading}>
              Important Notes:
            </Heading>
            <List spacing={3}>
              <ListItem display='flex' alignItems='flex-start'>
                <Box
                  as={AlertCircle}
                  size={20}
                  color={colors.warning}
                  mr={3}
                  mt={1}
                  flexShrink={0}
                />
                <Text {...textStyles.body}>
                  The timer will start as soon as you click "Start Exam".
                </Text>
              </ListItem>
              <ListItem display='flex' alignItems='flex-start'>
                <Box
                  as={AlertCircle}
                  size={20}
                  color={colors.warning}
                  mr={3}
                  mt={1}
                  flexShrink={0}
                />
                <Text {...textStyles.body}>
                  Do not refresh the page or close the browser during the exam.
                </Text>
              </ListItem>
              <ListItem display='flex' alignItems='flex-start'>
                <Box
                  as={AlertCircle}
                  size={20}
                  color={colors.warning}
                  mr={3}
                  mt={1}
                  flexShrink={0}
                />
                <Text {...textStyles.body}>
                  Ensure you submit your exam before time runs out.
                </Text>
              </ListItem>
            </List>
          </Box>

          <Divider borderColor={colors.border} />

          <Flex gap={4} justify='center' flexWrap='wrap'>
            <Button
              colorScheme='gray'
              size='lg'
              px={8}
              onClick={handleCancel}
              borderColor={colors.border}
              color={colors.textSecondary}
              _hover={{ bg: colors.sectionBg }}
            >
              Cancel
            </Button>
            <Button
              {...buttonStyles.primary}
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
