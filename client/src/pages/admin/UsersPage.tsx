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
} from '@chakra-ui/react';
import { useState } from 'react';
import { useGetAllUsers } from '../../api/services/authService';
import { Eye, Edit, Trash } from 'lucide-react';
import type { User } from '../../types/api';

export default function UsersPage() {
  // local state for pagination
  const [page, setPage] = useState(1);
  const limit = 10;

  const { data, isLoading, isError, isFetching } = useGetAllUsers({
    page,
    limit,
  });

  const isMobile = useBreakpointValue({ base: true, md: false });

  if (isLoading) return <Text>Loading users...</Text>;
  if (isError) return <Text color='red.500'>Failed to load users.</Text>;

  return (
    <Box p={4} w='full'>
      <Heading size='lg' mb={6}>
        Manage Users
      </Heading>

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
              <Th>User</Th>
              {!isMobile && <Th>Email</Th>}
              <Th>Role</Th>
              <Th textAlign='center'>Actions</Th>
            </Tr>
          </Thead>
          <Tbody>
            {data?.users.map((user: User) => (
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
                  <Text
                    fontSize='sm'
                    fontWeight='semibold'
                    color='blue.500'
                    textTransform='capitalize'
                  >
                    {user.role}
                  </Text>
                </Td>
                <Td>
                  <Flex justify='center' gap={2}>
                    <IconButton
                      aria-label='View User'
                      icon={<Eye size={18} />}
                      variant='ghost'
                      size='sm'
                      colorScheme='blue'
                    />
                    <IconButton
                      aria-label='Edit User'
                      icon={<Edit size={18} />}
                      variant='ghost'
                      size='sm'
                      colorScheme='green'
                    />
                    <IconButton
                      aria-label='Delete User'
                      icon={<Trash size={18} />}
                      variant='ghost'
                      size='sm'
                      colorScheme='red'
                    />
                  </Flex>
                </Td>
              </Tr>
            ))}
          </Tbody>
        </Table>
      </Box>

      {/* Pagination controls */}
      {data?.pagination && (
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
            {data.pagination.total} users
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
    </Box>
  );
}
