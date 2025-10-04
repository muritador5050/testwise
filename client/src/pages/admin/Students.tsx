import {
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Avatar,
  Box,
  Heading,
  HStack,
  IconButton,
  Text,
  useBreakpointValue,
  Flex,
  Button,
  useDisclosure,
  Drawer,
  DrawerBody,
  DrawerFooter,
  DrawerHeader,
  DrawerOverlay,
  DrawerContent,
  DrawerCloseButton,
  VStack,
  Stat,
  StatLabel,
  StatNumber,
  Badge,
  Divider,
  Spinner,
  Alert,
  AlertIcon,
} from '@chakra-ui/react';
import { useState, useMemo } from 'react';
import {
  useGetAllUsers,
  useUserActivityStats,
} from '../../api/services/authService';
import { Eye } from 'lucide-react';
import type { User } from '../../types/api';
import SearchBar from '../../components/shared/SearchBar';

export default function Students() {
  const [page, setPage] = useState(1);
  const limit = 10;
  const [selectedUserId, setSelectedUserId] = useState<number | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  const { data, isLoading, isError, isFetching } = useGetAllUsers({
    page,
    limit,
  });

  const { isOpen, onOpen, onClose } = useDisclosure();
  const isMobile = useBreakpointValue({ base: true, md: false });

  // Fetch activity stats for selected user
  const {
    data: activityData,
    isLoading: isActivityLoading,
    isError: isActivityError,
  } = useUserActivityStats(selectedUserId!);

  const filteredStudents = useMemo(() => {
    if (!data?.users) return [];

    const students = data.users.filter((user: User) => user.role === 'STUDENT');

    if (!searchQuery.trim()) return students;

    const query = searchQuery.toLowerCase();
    return students.filter(
      (user: User) =>
        user.name.toLowerCase().includes(query) ||
        user.email.toLowerCase().includes(query) ||
        user.id.toString().includes(query)
    );
  }, [data?.users, searchQuery]);

  const handleSearchChange = (value: string) => {
    setSearchQuery(value);
    setPage(1);
  };

  const handleSearchClear = () => {
    setSearchQuery('');
    setPage(1);
  };

  const handleViewActivity = (userId: number) => {
    setSelectedUserId(userId);
    onOpen();
  };

  const handleDrawerClose = () => {
    onClose();
    setSelectedUserId(null);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getStatusColor = (status: string) => {
    switch (status.toUpperCase()) {
      case 'COMPLETED':
        return 'green';
      case 'IN_PROGRESS':
        return 'blue';
      default:
        return 'gray';
    }
  };

  if (isLoading) return <Text textAlign='center'>Loading students...</Text>;
  if (isError)
    return (
      <Text color='red.500' textAlign='center'>
        Failed to load students.
      </Text>
    );

  return (
    <Box p={4} w='full'>
      <Heading size='lg' mb={6}>
        Students
      </Heading>

      <Box mb={4}>
        <SearchBar
          value={searchQuery}
          onChange={handleSearchChange}
          onClear={handleSearchClear}
          placeholder='Search by name, email, or ID...'
          size='md'
          maxWidth='500px'
        />
      </Box>

      {searchQuery && (
        <Text fontSize='sm' color='gray.600' mb={2}>
          Found {filteredStudents.length} student
          {filteredStudents.length !== 1 ? 's' : ''}
        </Text>
      )}

      <Box
        overflowX='auto'
        borderWidth='1px'
        borderRadius='lg'
        shadow='sm'
        bg='white'
        _dark={{ bg: 'gray.800' }}
      >
        <Table variant='simple' size={isMobile ? 'sm' : 'md'}>
          <Thead bg='gray.100' _dark={{ bg: 'gray.700' }}>
            <Tr>
              <Th>ID</Th>
              <Th>Student</Th>
              {!isMobile && <Th>Email</Th>}
              <Th textAlign='center'>Actions</Th>
            </Tr>
          </Thead>
          <Tbody>
            {filteredStudents.length > 0 ? (
              filteredStudents.map((user: User) => (
                <Tr key={user.id}>
                  <Td>{user.id}</Td>
                  <Td>
                    <HStack spacing={3}>
                      <Avatar
                        size='sm'
                        name={user.name}
                        src={user.avatar ?? ''}
                      />
                      <Text fontWeight='medium'>{user.name}</Text>
                    </HStack>
                  </Td>
                  {!isMobile && <Td>{user.email}</Td>}
                  <Td>
                    <Flex justify='center'>
                      <IconButton
                        aria-label='View Activity'
                        icon={<Eye size={18} />}
                        variant='ghost'
                        size='sm'
                        colorScheme='blue'
                        onClick={() => handleViewActivity(user.id)}
                      />
                    </Flex>
                  </Td>
                </Tr>
              ))
            ) : (
              <Tr>
                <Td colSpan={isMobile ? 3 : 4} textAlign='center' py={8}>
                  <Text color='gray.500'>
                    {searchQuery
                      ? `No students found matching "${searchQuery}"`
                      : 'No students available'}
                  </Text>
                </Td>
              </Tr>
            )}
          </Tbody>
        </Table>
      </Box>

      {!searchQuery && data?.pagination && (
        <Flex
          justify='space-between'
          align='center'
          mt={4}
          p={2}
          borderWidth='1px'
          borderRadius='md'
        >
          <Button
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            isDisabled={page === 1 || isFetching}
            size='sm'
          >
            Prev
          </Button>

          <Text fontSize='sm'>
            Page {data.pagination.page} of {data.pagination.totalPages} •{' '}
            {filteredStudents.length} students
          </Text>

          <Button
            onClick={() =>
              setPage((p) => (p < data.pagination.totalPages ? p + 1 : p))
            }
            isDisabled={page === data.pagination.totalPages || isFetching}
            size='sm'
          >
            Next
          </Button>
        </Flex>
      )}

      {/* Activity Drawer */}
      <Drawer
        isOpen={isOpen}
        placement='right'
        onClose={handleDrawerClose}
        size='md'
      >
        <DrawerOverlay />
        <DrawerContent>
          <DrawerCloseButton />
          <DrawerHeader borderBottomWidth='1px'>Student Activity</DrawerHeader>

          <DrawerBody>
            {isActivityLoading ? (
              <Flex justify='center' align='center' h='200px'>
                <Spinner size='lg' />
              </Flex>
            ) : isActivityError ? (
              <Alert status='error'>
                <AlertIcon />
                Failed to load activity data
              </Alert>
            ) : activityData ? (
              <VStack spacing={6} align='stretch'>
                {/* Stats Overview */}
                <Box>
                  <Heading size='sm' mb={4}>
                    Overview
                  </Heading>
                  <VStack spacing={3}>
                    <Stat
                      px={4}
                      py={3}
                      borderWidth='1px'
                      borderRadius='lg'
                      bg='blue.50'
                      _dark={{ bg: 'blue.900' }}
                    >
                      <StatLabel>Total Attempts</StatLabel>
                      <StatNumber>{activityData.totalAttempts}</StatNumber>
                    </Stat>

                    <Stat
                      px={4}
                      py={3}
                      borderWidth='1px'
                      borderRadius='lg'
                      bg='green.50'
                      _dark={{ bg: 'green.900' }}
                    >
                      <StatLabel>Completed Attempts</StatLabel>
                      <StatNumber>{activityData.completedAttempts}</StatNumber>
                    </Stat>

                    <Stat
                      px={4}
                      py={3}
                      borderWidth='1px'
                      borderRadius='lg'
                      bg='purple.50'
                      _dark={{ bg: 'purple.900' }}
                    >
                      <StatLabel>Average Score</StatLabel>
                      <StatNumber>
                        {activityData.averageScore.toFixed(2)}%
                      </StatNumber>
                    </Stat>

                    <Stat
                      px={4}
                      py={3}
                      borderWidth='1px'
                      borderRadius='lg'
                      bg='orange.50'
                      _dark={{ bg: 'orange.900' }}
                    >
                      <StatLabel>In Progress</StatLabel>
                      <StatNumber>{activityData.inProgressAttempts}</StatNumber>
                    </Stat>
                  </VStack>
                </Box>

                <Divider />

                {/* Recent Activity */}
                <Box>
                  <Heading size='sm' mb={4}>
                    Recent Activity
                  </Heading>
                  {activityData.recentActivity.length > 0 ? (
                    <VStack spacing={3} align='stretch'>
                      {activityData.recentActivity.map((activity, index) => (
                        <Box
                          key={index}
                          p={4}
                          borderWidth='1px'
                          borderRadius='md'
                          bg='gray.50'
                          _dark={{ bg: 'gray.700' }}
                        >
                          <Flex justify='space-between' align='start' mb={2}>
                            <Text fontWeight='semibold' fontSize='sm'>
                              {activity.testTitle}
                            </Text>
                            <Badge
                              colorScheme={getStatusColor(activity.status)}
                            >
                              {activity.status.replace('_', ' ')}
                            </Badge>
                          </Flex>
                          <Text
                            fontSize='sm'
                            color='gray.600'
                            _dark={{ color: 'gray.400' }}
                          >
                            Score: {activity?.score?.toFixed(2)}%
                          </Text>
                          <Text fontSize='xs' color='gray.500' mt={1}>
                            {formatDate(activity.startedAt)}
                          </Text>
                        </Box>
                      ))}
                    </VStack>
                  ) : (
                    <Text color='gray.500' fontSize='sm'>
                      No recent activity
                    </Text>
                  )}
                </Box>
              </VStack>
            ) : null}
          </DrawerBody>

          <DrawerFooter borderTopWidth='1px'>
            <Button variant='outline' onClick={handleDrawerClose}>
              Close
            </Button>
          </DrawerFooter>
        </DrawerContent>
      </Drawer>
    </Box>
  );
}
