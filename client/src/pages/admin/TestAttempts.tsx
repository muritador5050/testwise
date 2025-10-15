import React from 'react';
import {
  Box,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Select,
  Badge,
  Text,
  Heading,
  Container,
  Stack,
  Flex,
  Avatar,
  Spinner,
  Alert,
  AlertIcon,
  AlertTitle,
  AlertDescription,
} from '@chakra-ui/react';
import {
  useGetAllAttempts,
  useUpdateStatus,
} from '../../api/services/attemptService';
import { colors, bgStyles, textStyles } from '../../utils/colors';

const TestAttempts: React.FC = () => {
  const { data: attempts, isLoading, error } = useGetAllAttempts();
  const updateStatus = useUpdateStatus();

  const handleStatusChange = async (id: number, newStatus: string) => {
    try {
      await updateStatus.mutateAsync({
        attemptId: id,
        status: newStatus as 'IN_PROGRESS' | 'COMPLETED' | 'TIMED_OUT',
      });
    } catch (err) {
      console.error('Failed to update status:', err);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'COMPLETED':
        return 'green';
      case 'TIMED_OUT':
        return 'red';
      case 'IN_PROGRESS':
        return 'blue';
      default:
        return 'gray';
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const formatTime = (seconds: number | null) => {
    if (!seconds) return 'N/A';
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}m ${secs}s`;
  };

  if (isLoading) {
    return (
      <Container maxW='container.xl' py={8}>
        <Flex justify='center' align='center' minH='400px'>
          <Spinner size='xl' color={colors.primary} thickness='4px' />
        </Flex>
      </Container>
    );
  }

  if (error) {
    return (
      <Container maxW='container.xl' py={8}>
        <Alert status='error' borderRadius='lg'>
          <AlertIcon />
          <Box>
            <AlertTitle>Error loading attempts</AlertTitle>
            <AlertDescription>
              {error instanceof Error
                ? error.message
                : 'An unexpected error occurred'}
            </AlertDescription>
          </Box>
        </Alert>
      </Container>
    );
  }

  if (!attempts || attempts.length === 0) {
    return (
      <Container maxW='container.xl' py={8}>
        <Alert status='info' borderRadius='lg'>
          <AlertIcon />
          <AlertTitle>No test attempts found</AlertTitle>
        </Alert>
      </Container>
    );
  }

  return (
    <Container maxW='container.xl' py={4}>
      <Heading mb={6} size='lg' {...textStyles.heading}>
        Test Attempts Dashboard
      </Heading>

      <Box {...bgStyles.card} borderRadius='lg' overflowX='auto' shadow='sm'>
        <Table variant='simple' size='sm'>
          <Thead>
            <Tr>
              <Th>ID</Th>
              <Th>User</Th>
              <Th>Test</Th>
              <Th>Score</Th>
              <Th>Attempt #</Th>
              <Th>Time Spent</Th>
              <Th>Started At</Th>
              <Th>Status</Th>
            </Tr>
          </Thead>
          <Tbody>
            {attempts.map((attempt) => (
              <Tr key={attempt.id}>
                <Td fontWeight='medium' {...textStyles.body}>
                  {attempt.id}
                </Td>

                <Td>
                  <Flex align='center' gap={2}>
                    <Avatar size='sm' name={attempt.user.name} />
                    <Box>
                      <Text
                        fontSize='sm'
                        fontWeight='medium'
                        {...textStyles.body}
                      >
                        {attempt.user.name}
                      </Text>
                      <Text fontSize='xs' {...textStyles.muted}>
                        {attempt.user.email}
                      </Text>
                    </Box>
                  </Flex>
                </Td>

                <Td>
                  <Text fontSize='sm' fontWeight='medium' {...textStyles.body}>
                    {attempt.test.title}
                  </Text>
                  <Text fontSize='xs' {...textStyles.muted}>
                    {attempt.test.duration} mins
                  </Text>
                </Td>

                <Td>
                  <Stack spacing={0}>
                    <Text fontSize='sm' fontWeight='bold' {...textStyles.body}>
                      {attempt.score}/{attempt.maxScore || 'N/A'}
                    </Text>
                    {attempt.percentScore !== null && (
                      <Text fontSize='xs' {...textStyles.muted}>
                        {attempt.percentScore.toFixed(1)}%
                      </Text>
                    )}
                  </Stack>
                </Td>

                <Td>
                  <Badge colorScheme='purple' fontSize='xs'>
                    #{attempt.attemptNumber}
                  </Badge>
                </Td>

                <Td>
                  <Text fontSize='sm' {...textStyles.body}>
                    {formatTime(attempt.timeSpent)}
                  </Text>
                </Td>

                <Td>
                  <Text fontSize='sm' {...textStyles.body}>
                    {formatDate(attempt.startedAt)}
                  </Text>
                </Td>

                <Td>
                  {attempt.status === 'COMPLETED' ? (
                    <Badge colorScheme={getStatusColor(attempt.status)}>
                      Completed
                    </Badge>
                  ) : (
                    <Select
                      value={attempt.status}
                      onChange={(e) =>
                        handleStatusChange(attempt.id, e.target.value)
                      }
                      size='sm'
                      maxW='150px'
                      variant='filled'
                      isDisabled={updateStatus.isPending}
                    >
                      <option value={attempt.status}>
                        {attempt.status === 'TIMED_OUT'
                          ? 'Timed Out'
                          : 'In Progress'}
                      </option>
                      <option value='COMPLETED'>Mark as Completed</option>
                    </Select>
                  )}
                </Td>
              </Tr>
            ))}
          </Tbody>
        </Table>
      </Box>
    </Container>
  );
};

export default TestAttempts;
