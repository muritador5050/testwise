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
import { colors, textStyles } from '../../utils/colors';

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

  if (isLoading)
    return (
      <Text textAlign='center' {...textStyles.body}>
        Loading students...
      </Text>
    );
  if (isError)
    return (
      <Text color={colors.error} textAlign='center'>
        Failed to load students.
      </Text>
    );

  return (
    <Box p={4} w='full' bg={colors.pageBg} minH='100vh'>
      <Heading size='lg' mb={6} {...textStyles.heading}>
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
        <Text fontSize='sm' color={colors.textSecondary} mb={2}>
          Found {filteredStudents.length} student
          {filteredStudents.length !== 1 ? 's' : ''}
        </Text>
      )}

      <Box
        overflowX='auto'
        borderWidth='1px'
        borderColor={colors.border}
        borderRadius='lg'
        shadow='sm'
        bg={colors.cardBg}
      >
        <Table variant='simple' size={isMobile ? 'sm' : 'md'}>
          <Thead bg={colors.sectionBg}>
            <Tr>
              <Th color={colors.textPrimary}>ID</Th>
              <Th color={colors.textPrimary}>Student</Th>
              {!isMobile && <Th color={colors.textPrimary}>Email</Th>}
              <Th textAlign='center' color={colors.textPrimary}>
                Actions
              </Th>
            </Tr>
          </Thead>
          <Tbody>
            {filteredStudents.length > 0 ? (
              filteredStudents.map((user: User) => (
                <Tr key={user.id} _hover={{ bg: colors.sectionBg }}>
                  <Td color={colors.textSecondary}>{user.id}</Td>
                  <Td>
                    <HStack spacing={3}>
                      <Avatar
                        size='sm'
                        name={user.name}
                        src={user.avatar ?? ''}
                      />
                      <Text fontWeight='medium' color={colors.textPrimary}>
                        {user.name}
                      </Text>
                    </HStack>
                  </Td>
                  {!isMobile && (
                    <Td color={colors.textSecondary}>{user.email}</Td>
                  )}
                  <Td>
                    <Flex justify='center'>
                      <IconButton
                        aria-label='View Activity'
                        icon={<Eye size={18} />}
                        variant='ghost'
                        size='sm'
                        color={colors.primary}
                        _hover={{ bg: colors.sectionBg }}
                        onClick={() => handleViewActivity(user.id)}
                      />
                    </Flex>
                  </Td>
                </Tr>
              ))
            ) : (
              <Tr>
                <Td colSpan={isMobile ? 3 : 4} textAlign='center' py={8}>
                  <Text color={colors.textMuted}>
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
          borderColor={colors.border}
          borderRadius='md'
          bg={colors.cardBg}
        >
          <Button
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            isDisabled={page === 1 || isFetching}
            size='sm'
            bg={colors.primary}
            color='white'
            _hover={{ bg: colors.primaryHover }}
            _disabled={{ bg: colors.border, cursor: 'not-allowed' }}
          >
            Prev
          </Button>

          <Text fontSize='sm' color={colors.textSecondary}>
            Page {data.pagination.page} of {data.pagination.totalPages} •{' '}
            {filteredStudents.length} students
          </Text>

          <Button
            onClick={() =>
              setPage((p) => (p < data.pagination.totalPages ? p + 1 : p))
            }
            isDisabled={page === data.pagination.totalPages || isFetching}
            size='sm'
            bg={colors.primary}
            color='white'
            _hover={{ bg: colors.primaryHover }}
            _disabled={{ bg: colors.border, cursor: 'not-allowed' }}
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
        <DrawerContent bg={colors.cardBg}>
          <DrawerCloseButton color={colors.textSecondary} />
          <DrawerHeader
            borderBottomWidth='1px'
            borderColor={colors.border}
            color={colors.textPrimary}
          >
            Student Activity
          </DrawerHeader>

          <DrawerBody>
            {isActivityLoading ? (
              <Flex justify='center' align='center' h='200px'>
                <Spinner size='lg' color={colors.primary} />
              </Flex>
            ) : isActivityError ? (
              <Alert status='error' bg='transparent' color={colors.error}>
                <AlertIcon />
                Failed to load activity data
              </Alert>
            ) : activityData ? (
              <VStack spacing={6} align='stretch'>
                {/* Stats Overview */}
                <Box>
                  <Heading size='sm' mb={4} color={colors.textPrimary}>
                    Overview
                  </Heading>
                  <VStack spacing={3}>
                    <Stat
                      px={4}
                      py={3}
                      borderWidth='1px'
                      borderColor={colors.border}
                      borderRadius='lg'
                      bg='#dbeafe'
                    >
                      <StatLabel color={colors.textSecondary}>
                        Total Attempts
                      </StatLabel>
                      <StatNumber color={colors.textPrimary}>
                        {activityData.totalAttempts}
                      </StatNumber>
                    </Stat>

                    <Stat
                      px={4}
                      py={3}
                      borderWidth='1px'
                      borderColor={colors.border}
                      borderRadius='lg'
                      bg='#d1fae5'
                    >
                      <StatLabel color={colors.textSecondary}>
                        Completed Attempts
                      </StatLabel>
                      <StatNumber color={colors.textPrimary}>
                        {activityData.completedAttempts}
                      </StatNumber>
                    </Stat>

                    <Stat
                      px={4}
                      py={3}
                      borderWidth='1px'
                      borderColor={colors.border}
                      borderRadius='lg'
                      bg='#e9d5ff'
                    >
                      <StatLabel color={colors.textSecondary}>
                        Average Score
                      </StatLabel>
                      <StatNumber color={colors.textPrimary}>
                        {activityData.averageScore.toFixed(2)}%
                      </StatNumber>
                    </Stat>

                    <Stat
                      px={4}
                      py={3}
                      borderWidth='1px'
                      borderColor={colors.border}
                      borderRadius='lg'
                      bg='#fed7aa'
                    >
                      <StatLabel color={colors.textSecondary}>
                        In Progress
                      </StatLabel>
                      <StatNumber color={colors.textPrimary}>
                        {activityData.inProgressAttempts}
                      </StatNumber>
                    </Stat>
                  </VStack>
                </Box>

                <Divider borderColor={colors.border} />

                {/* Recent Activity */}
                <Box>
                  <Heading size='sm' mb={4} color={colors.textPrimary}>
                    Recent Activity
                  </Heading>
                  {activityData.recentActivity.length > 0 ? (
                    <VStack spacing={3} align='stretch'>
                      {activityData.recentActivity.map((activity, index) => (
                        <Box
                          key={index}
                          p={4}
                          borderWidth='1px'
                          borderColor={colors.border}
                          borderRadius='md'
                          bg={colors.sectionBg}
                        >
                          <Flex justify='space-between' align='start' mb={2}>
                            <Text
                              fontWeight='semibold'
                              fontSize='sm'
                              color={colors.textPrimary}
                            >
                              {activity.testTitle}
                            </Text>
                            <Badge
                              colorScheme={getStatusColor(activity.status)}
                            >
                              {activity.status.replace('_', ' ')}
                            </Badge>
                          </Flex>
                          <Text fontSize='sm' color={colors.textSecondary}>
                            Score: {activity?.score?.toFixed(2)}%
                          </Text>
                          <Text fontSize='xs' color={colors.textMuted} mt={1}>
                            {formatDate(activity.startedAt)}
                          </Text>
                        </Box>
                      ))}
                    </VStack>
                  ) : (
                    <Text color={colors.textMuted} fontSize='sm'>
                      No recent activity
                    </Text>
                  )}
                </Box>
              </VStack>
            ) : null}
          </DrawerBody>

          <DrawerFooter borderTopWidth='1px' borderColor={colors.border}>
            <Button
              variant='outline'
              onClick={handleDrawerClose}
              borderColor={colors.primary}
              color={colors.primary}
              _hover={{ bg: colors.sectionBg }}
            >
              Close
            </Button>
          </DrawerFooter>
        </DrawerContent>
      </Drawer>
    </Box>
  );
}
