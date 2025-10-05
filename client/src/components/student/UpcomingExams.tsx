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
} from '@chakra-ui/react';
import { Calendar, Clock, BookOpen, AlertCircle } from 'lucide-react';
import type { Test } from '../../types/api';

interface Props {
  exams: Test[];
  onClick: (testId: number) => void;
}

const UpcomingExams = ({ exams, onClick }: Props) => {
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
      <Card mb={6}>
        <CardHeader>
          <HStack>
            <Calendar size={16} />
            <Heading size='md'>Upcoming Exams</Heading>
          </HStack>
        </CardHeader>
        <CardBody>
          <VStack spacing={4} py={8}>
            <AlertCircle size={48} color='gray' />
            <Text color='gray.500'>No exams available at the moment</Text>
          </VStack>
        </CardBody>
      </Card>
    );
  }

  return (
    <Card mb={6}>
      <CardHeader>
        <HStack justify='space-between'>
          <HStack>
            <Calendar size={16} />
            <Heading size='md'>Upcoming Exams</Heading>
          </HStack>
          <Button size='sm' variant='ghost'>
            View All
          </Button>
        </HStack>
      </CardHeader>
      <CardBody>
        <VStack spacing={4} align='stretch'>
          {filteredExams.map((exam) => {
            const status = getExamStatus(exam);
            const statusColor = getStatusColor(status);
            const attemptsLeft =
              exam.maxAttempts - (exam._count?.attempts || 0);

            return (
              <Box key={exam.id} p={4} borderWidth='1px' borderRadius='lg'>
                <HStack justify='space-between' mb={2}>
                  <VStack align='start' spacing={1}>
                    <Heading size='sm'>{exam.title}</Heading>
                    <Text fontSize='sm' color='gray.600' noOfLines={1}>
                      {exam.description}
                    </Text>
                  </VStack>
                  <Badge colorScheme={statusColor}>{status}</Badge>
                </HStack>

                <HStack
                  fontSize='sm'
                  color='gray.600'
                  spacing={4}
                  flexWrap='wrap'
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
                  <Text fontSize='xs' color='gray.500' mt={2}>
                    Attempts remaining: {attemptsLeft} / {exam.maxAttempts}
                  </Text>
                )}

                <Button
                  mt={3}
                  colorScheme='blue'
                  size='sm'
                  width='full'
                  isDisabled={!canStartExam(exam) || attemptsLeft <= 0}
                  onClick={() => onClick(exam.id)}
                >
                  {!canStartExam(exam)
                    ? 'Not Available'
                    : attemptsLeft <= 0
                    ? 'No Attempts Left'
                    : 'Start Exam'}
                </Button>
              </Box>
            );
          })}
        </VStack>
      </CardBody>
    </Card>
  );
};

export default UpcomingExams;
