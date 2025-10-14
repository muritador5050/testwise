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
  Center,
  Spinner,
  Stack,
  useBreakpointValue,
} from '@chakra-ui/react';
import { Calendar, Clock, BookOpen, AlertCircle } from 'lucide-react';
import type { Test } from '../../types/api';
import { useGetAllTests } from '../../api/services/testServices';
import { useNavigate } from 'react-router-dom';
import { colors, bgStyles, textStyles, buttonStyles } from '../../utils/colors';

const PublishedExams = () => {
  const navigate = useNavigate();
  const isMobile = useBreakpointValue({ base: true, md: false });

  const { data: test, isLoading } = useGetAllTests();
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

  if (isLoading) {
    return (
      <Center h='50vh'>
        <VStack spacing={4}>
          <Text fontSize='lg' {...textStyles.body}>
            Loading exams...
          </Text>
          <Spinner size='xl' color={colors.primary} />
        </VStack>
      </Center>
    );
  }

  if (filteredExams.length === 0) {
    return (
      <Container
        maxW='container.xl'
        py={{ base: 4, md: 6 }}
        px={{ base: 3, md: 6 }}
      >
        <Card {...bgStyles.card}>
          <CardHeader>
            <HStack>
              <Calendar size={isMobile ? 18 : 20} color={colors.primary} />
              <Heading size={{ base: 'sm', md: 'md' }} {...textStyles.heading}>
                Available Exams
              </Heading>
            </HStack>
          </CardHeader>
          <CardBody>
            <VStack spacing={4} py={{ base: 8, md: 12 }}>
              <AlertCircle size={isMobile ? 36 : 48} color={colors.textMuted} />
              <Text
                {...textStyles.muted}
                fontSize={{ base: 'md', md: 'lg' }}
                textAlign='center'
              >
                No exams available at the moment
              </Text>
              <Text {...textStyles.muted} fontSize='sm' textAlign='center'>
                Check back later for new assessments
              </Text>
            </VStack>
          </CardBody>
        </Card>
      </Container>
    );
  }

  return (
    <Container
      maxW='container.xl'
      py={{ base: 4, md: 6 }}
      px={{ base: 3, md: 6 }}
    >
      <VStack spacing={{ base: 4, md: 6 }} align='stretch'>
        {/* Header Section */}
        <Box px={{ base: 0, md: 2 }}>
          <Stack
            direction={{ base: 'column', md: 'row' }}
            justify='space-between'
            align={{ base: 'stretch', md: 'start' }}
            mb={2}
            spacing={{ base: 3, md: 0 }}
          >
            <Box>
              <Heading
                size={{ base: 'md', md: 'lg' }}
                mb={2}
                {...textStyles.heading}
              >
                Exams
              </Heading>
              <Text
                {...textStyles.body}
                fontSize={{ base: 'sm', md: 'md' }}
                display={{ base: 'none', sm: 'block' }}
              >
                Select an exam below to view instructions and begin your
                assessment
              </Text>
            </Box>
            <Button
              {...buttonStyles.outline}
              size={{ base: 'sm', md: 'sm' }}
              onClick={() => navigate('/student')}
              w={{ base: 'full', sm: 'auto' }}
            >
              Back to Dashboard
            </Button>
          </Stack>
        </Box>

        {/* Exams Card */}
        <Card {...bgStyles.card}>
          <CardHeader pb={4}>
            <HStack>
              <Calendar size={isMobile ? 18 : 20} color={colors.primary} />
              <Heading size={{ base: 'sm', md: 'md' }} {...textStyles.heading}>
                Available Exams
              </Heading>
            </HStack>
          </CardHeader>
          <CardBody pt={0}>
            <VStack spacing={{ base: 3, md: 4 }} align='stretch'>
              {filteredExams.map((exam) => {
                const status = getExamStatus(exam);
                const statusColor = getStatusColor(status);
                const attemptsLeft =
                  exam.maxAttempts - (exam._count?.attempts || 0);

                return (
                  <Box
                    key={exam.id}
                    p={{ base: 4, md: 5 }}
                    borderWidth='1px'
                    borderColor={colors.border}
                    borderRadius='lg'
                    bg={colors.cardBg}
                    _hover={{ shadow: 'md', borderColor: colors.primary }}
                    transition='all 0.2s'
                  >
                    {/* Title and Status */}
                    <Stack
                      direction={{ base: 'column', sm: 'row' }}
                      justify='space-between'
                      mb={3}
                      spacing={{ base: 2, sm: 0 }}
                    >
                      <VStack align='start' spacing={1} flex={1}>
                        <Heading
                          size={{ base: 'xs', md: 'sm' }}
                          {...textStyles.heading}
                        >
                          {exam.title}
                        </Heading>
                        <Text
                          fontSize={{ base: 'xs', md: 'sm' }}
                          {...textStyles.muted}
                          noOfLines={2}
                        >
                          {exam.description}
                        </Text>
                      </VStack>
                      <Badge
                        colorScheme={statusColor}
                        fontSize='xs'
                        px={3}
                        py={1}
                        alignSelf={{ base: 'flex-start', sm: 'flex-start' }}
                      >
                        {status}
                      </Badge>
                    </Stack>

                    {/* Exam Details */}
                    <Stack
                      direction={{ base: 'column', sm: 'row' }}
                      fontSize={{ base: 'xs', md: 'sm' }}
                      {...textStyles.body}
                      spacing={{ base: 2, sm: 4, md: 6 }}
                      mb={3}
                    >
                      <HStack>
                        <Calendar size={14} />
                        <Text>{getDisplayDate(exam)}</Text>
                      </HStack>
                      <HStack>
                        <Clock size={14} />
                        <Text>{exam.duration} min</Text>
                      </HStack>
                      <HStack>
                        <BookOpen size={14} />
                        <Text>{exam._count?.questions || 0} questions</Text>
                      </HStack>
                    </Stack>

                    {/* Attempts Info */}
                    {exam.maxAttempts > 0 && (
                      <Text
                        fontSize={{ base: 'xs', md: 'sm' }}
                        {...textStyles.muted}
                        mb={3}
                      >
                        Attempts remaining: {attemptsLeft} / {exam.maxAttempts}
                      </Text>
                    )}

                    {/* Action Button */}
                    <Button
                      {...buttonStyles.primary}
                      size={{ base: 'sm', md: 'md' }}
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
                        : isMobile
                        ? 'Start Exam'
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
