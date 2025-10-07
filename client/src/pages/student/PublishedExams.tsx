import {
  Card,
  CardHeader,
  CardBody,
  HStack,
  Heading,
  VStack,
  Box,
  Badge,
  Text,
  Button,
  Container,
} from '@chakra-ui/react';
import { Calendar, Clock, BookOpen, AlertCircle } from 'lucide-react';
import type { Test } from '../../types/api';
import { useGetAllTests } from '../../api/services/testServices';
import { useNavigate } from 'react-router-dom';

const PublishedExams = () => {
  const navigate = useNavigate();

  const { data: test } = useGetAllTests();
  const exams = test?.tests || [];

  const getExamStatus = (exam: Test) => {
    if (!exam.isPublished) return 'Draft';
    if (!exam.availableFrom && !exam.availableUntil) return 'Available';

    const now = new Date();
    const availableFrom = exam.availableFrom
      ? new Date(exam.availableFrom)
      : null;
    const availableUntil = exam.availableUntil
      ? new Date(exam.availableUntil)
      : null;

    if (availableFrom && now < availableFrom) return 'Upcoming';
    if (availableUntil && now > availableUntil) return 'Expired';
    return 'Active';
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Available':
      case 'Active':
        return 'green';
      case 'Upcoming':
        return 'orange';
      case 'Draft':
        return 'gray';
      case 'Expired':
        return 'red';
      default:
        return 'blue';
    }
  };

  const canStartExam = (exam: Test) => {
    const status = getExamStatus(exam);
    return exam.isPublished && (status === 'Available' || status === 'Active');
  };

  const getDisplayDate = (exam: Test) => {
    if (exam.availableFrom) {
      return new Date(exam.availableFrom).toLocaleDateString();
    }
    return 'Anytime';
  };

  const filteredExams = exams
    .filter((exam) => exam.isPublished || exam._count?.questions !== undefined)
    .sort((a, b) => {
      if (a.isPublished !== b.isPublished) return a.isPublished ? -1 : 1;
      if (a.availableFrom && b.availableFrom) {
        return (
          new Date(a.availableFrom).getTime() -
          new Date(b.availableFrom).getTime()
        );
      }
      return 0;
    })
    .slice(0, 5);

  if (filteredExams.length === 0) {
    return (
      <Container maxW='container.xl' py={6}>
        <Card>
          <CardHeader>
            <HStack>
              <Calendar size={20} />
              <Heading size='md'>Available Exams</Heading>
            </HStack>
          </CardHeader>
          <CardBody>
            <VStack spacing={4} py={12}>
              <AlertCircle size={48} color='gray' />
              <Text color='gray.500' fontSize='lg'>
                No exams available at the moment
              </Text>
              <Text color='gray.400' fontSize='sm'>
                Check back later for new assessments
              </Text>
            </VStack>
          </CardBody>
        </Card>
      </Container>
    );
  }

  return (
    <Container maxW='container.xl' py={6}>
      <VStack spacing={6} align='stretch'>
        <Box px={2}>
          <Heading size='lg' mb={2}>
            Your Exams
          </Heading>
          <Text color='gray.600' fontSize='md'>
            Select an exam below to view instructions and begin your assessment
          </Text>
        </Box>

        <Card>
          <CardHeader pb={4}>
            <HStack>
              <Calendar size={20} />
              <Heading size='md'>Available Exams</Heading>
            </HStack>
          </CardHeader>
          <CardBody pt={0}>
            <VStack spacing={4} align='stretch'>
              {filteredExams.map((exam) => {
                const status = getExamStatus(exam);
                const statusColor = getStatusColor(status);
                const attemptsLeft =
                  exam.maxAttempts - (exam._count?.attempts || 0);

                return (
                  <Box
                    key={exam.id}
                    p={5}
                    borderWidth='1px'
                    borderRadius='lg'
                    _hover={{ shadow: 'md' }}
                    transition='all 0.2s'
                  >
                    <HStack justify='space-between' mb={3}>
                      <VStack align='start' spacing={1} flex={1}>
                        <Heading size='sm'>{exam.title}</Heading>
                        <Text fontSize='sm' color='gray.500' noOfLines={2}>
                          {exam.description}
                        </Text>
                      </VStack>
                      <Badge
                        colorScheme={statusColor}
                        fontSize='xs'
                        px={3}
                        py={1}
                      >
                        {status}
                      </Badge>
                    </HStack>

                    <HStack
                      fontSize='sm'
                      color='gray.600'
                      spacing={6}
                      flexWrap='wrap'
                      mb={3}
                    >
                      <HStack>
                        <Calendar size={16} />
                        <Text>{getDisplayDate(exam)}</Text>
                      </HStack>
                      <HStack>
                        <Clock size={16} />
                        <Text>{exam.duration} min</Text>
                      </HStack>
                      <HStack>
                        <BookOpen size={16} />
                        <Text>{exam._count?.questions || 0} questions</Text>
                      </HStack>
                    </HStack>

                    {exam.maxAttempts > 0 && (
                      <Text fontSize='sm' color='gray.500' mb={3}>
                        Attempts remaining: {attemptsLeft} / {exam.maxAttempts}
                      </Text>
                    )}

                    <Button
                      colorScheme='blue'
                      size='md'
                      width='full'
                      isDisabled={!canStartExam(exam) || attemptsLeft <= 0}
                      onClick={() =>
                        navigate(`/student/instructions`, {
                          state: { testId: exam.id },
                        })
                      }
                    >
                      {!canStartExam(exam)
                        ? 'Not Available'
                        : attemptsLeft <= 0
                        ? 'No Attempts Left'
                        : 'View Instructions & Start Exam'}
                    </Button>
                  </Box>
                );
              })}
            </VStack>
          </CardBody>
        </Card>
      </VStack>
    </Container>
  );
};

export default PublishedExams;
