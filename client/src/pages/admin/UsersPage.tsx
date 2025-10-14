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
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  FormControl,
  FormLabel,
  Input,
  Select,
  useDisclosure,
  useToast,
  AlertDialog,
  AlertDialogBody,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogContent,
  AlertDialogOverlay,
  VStack,
} from '@chakra-ui/react';
import { useState, useRef, useMemo } from 'react';
import {
  useGetAllUsers,
  useUpdateUser,
  useDeleteUser,
} from '../../api/services/authService';
import { Eye, Edit, Trash } from 'lucide-react';
import type { User } from '../../types/api';
import SearchBar from '../../components/shared/SearchBar';
import { colors, bgStyles, buttonStyles, textStyles } from '../../utils/colors';

export default function UsersPage() {
  const [page, setPage] = useState(1);
  const limit = 10;
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [editFormData, setEditFormData] = useState<{
    name?: string;
    email?: string;
    role?: string;
  }>({});
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  const { data, isLoading, isError, isFetching } = useGetAllUsers({
    page,
    limit,
  });
  const updateMutation = useUpdateUser();
  const deleteMutation = useDeleteUser();

  const {
    isOpen: isViewOpen,
    onOpen: onViewOpen,
    onClose: onViewClose,
  } = useDisclosure();
  const {
    isOpen: isEditOpen,
    onOpen: onEditOpen,
    onClose: onEditClose,
  } = useDisclosure();
  const {
    isOpen: isDeleteOpen,
    onOpen: onDeleteOpen,
    onClose: onDeleteClose,
  } = useDisclosure();

  const cancelRef = useRef<HTMLButtonElement>(null);
  const toast = useToast();
  const isMobile = useBreakpointValue({ base: true, md: false });

  // Filter users based on search query
  const filteredUsers = useMemo(() => {
    if (!data?.users) return [];

    if (!searchQuery.trim()) return data.users;

    const query = searchQuery.toLowerCase();
    return data.users.filter(
      (user: User) =>
        user.name.toLowerCase().includes(query) ||
        user.email.toLowerCase().includes(query) ||
        user.role.toLowerCase().includes(query) ||
        user.id.toString().includes(query)
    );
  }, [data?.users, searchQuery]);

  const handleSearchChange = (value: string) => {
    setSearchQuery(value);
    // Reset to first page when searching
    setPage(1);
  };

  const handleSearchClear = () => {
    setSearchQuery('');
    setPage(1);
  };

  const handleViewUser = (user: User) => {
    setSelectedUser(user);
    onViewOpen();
  };

  const handleEditUser = (user: User) => {
    setSelectedUser(user);
    setEditFormData({
      name: user.name,
      email: user.email,
      role: user.role,
    });
    setAvatarFile(null);
    onEditOpen();
  };

  const handleDeleteUser = (user: User) => {
    setSelectedUser(user);
    onDeleteOpen();
  };

  const handleSubmitEdit = async () => {
    if (!selectedUser) return;

    try {
      await updateMutation.mutateAsync({
        id: selectedUser.id,
        userData: {
          name: editFormData.name,
          email: editFormData.email,
          role: editFormData.role,
          ...(avatarFile && { avatar: avatarFile }),
        },
      });

      toast({
        title: 'User updated successfully',
        status: 'success',
        duration: 3000,
        isClosable: true,
        position: 'top-right',
      });
      onEditClose();
    } catch (error) {
      toast({
        title: 'Failed to update user',
        description: error instanceof Error ? error.message : 'Unknown error',
        status: 'error',
        duration: 3000,
        position: 'top-right',
        isClosable: true,
      });
    }
  };

  const handleConfirmDelete = async () => {
    if (!selectedUser) return;

    try {
      await deleteMutation.mutateAsync(selectedUser.id);

      toast({
        title: 'User deleted successfully',
        status: 'success',
        duration: 3000,
        position: 'top-right',
        isClosable: true,
      });
      onDeleteClose();
    } catch (error) {
      toast({
        title: 'Failed to delete user',
        description: error instanceof Error ? error.message : 'Unknown error',
        status: 'error',
        duration: 3000,
        position: 'top-right',
        isClosable: true,
      });
    }
  };

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setAvatarFile(e.target.files[0]);
    }
  };

  if (isLoading) return <Text textAlign='center'>Loading users...</Text>;
  if (isError)
    return (
      <Text color={colors.error} textAlign='center'>
        Failed to load users.
      </Text>
    );

  return (
    <Box p={4} w='full' {...bgStyles.page}>
      <Heading size='lg' mb={6} {...textStyles.heading}>
        Manage Users
      </Heading>

      {/* SearchBar with proper props */}
      <Box mb={4}>
        <SearchBar
          value={searchQuery}
          onChange={handleSearchChange}
          onClear={handleSearchClear}
          placeholder='Search by name, email, role, or ID...'
          size='md'
          maxWidth='500px'
        />
      </Box>

      {/* Show search results count */}
      {searchQuery && (
        <Text fontSize='sm' color={colors.textMuted} mb={2}>
          Found {filteredUsers.length} user
          {filteredUsers.length !== 1 ? 's' : ''}
        </Text>
      )}

      <Box overflowX='auto' borderRadius='lg' shadow='sm' {...bgStyles.card}>
        <Table variant='simple' size={isMobile ? 'sm' : 'md'}>
          <Thead bg={colors.sectionBg}>
            <Tr>
              <Th>ID</Th>
              <Th>User</Th>
              {!isMobile && <Th>Email</Th>}
              <Th>Role</Th>
              <Th textAlign='center'>Actions</Th>
            </Tr>
          </Thead>
          <Tbody>
            {filteredUsers.length > 0 ? (
              filteredUsers.map((user: User) => (
                <Tr key={user.id}>
                  <Td>{user.id}</Td>
                  <Td>
                    <HStack spacing={3}>
                      <Avatar
                        size='sm'
                        name={user.name}
                        src={user.avatar ?? ''}
                      />
                      <Text fontWeight='medium' {...textStyles.heading}>
                        {user.name}
                      </Text>
                    </HStack>
                  </Td>
                  {!isMobile && <Td {...textStyles.body}>{user.email}</Td>}
                  <Td>
                    <Text
                      fontSize='sm'
                      fontWeight='semibold'
                      color={colors.primary}
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
                        color={colors.primary}
                        _hover={{ bg: colors.sectionBg }}
                        onClick={() => handleViewUser(user)}
                      />
                      <IconButton
                        aria-label='Edit User'
                        icon={<Edit size={18} />}
                        variant='ghost'
                        size='sm'
                        color={colors.success}
                        _hover={{ bg: colors.sectionBg }}
                        onClick={() => handleEditUser(user)}
                      />
                      <IconButton
                        aria-label='Delete User'
                        icon={<Trash size={18} />}
                        variant='ghost'
                        size='sm'
                        color={colors.error}
                        _hover={{ bg: colors.sectionBg }}
                        onClick={() => handleDeleteUser(user)}
                      />
                    </Flex>
                  </Td>
                </Tr>
              ))
            ) : (
              <Tr>
                <Td colSpan={isMobile ? 4 : 5} textAlign='center' py={8}>
                  <Text color={colors.textMuted}>
                    {searchQuery
                      ? `No users found matching "${searchQuery}"`
                      : 'No users available'}
                  </Text>
                </Td>
              </Tr>
            )}
          </Tbody>
        </Table>
      </Box>

      {/* Pagination controls - hide when searching */}
      {!searchQuery && data?.pagination && (
        <Flex
          justify='space-between'
          align='center'
          mt={4}
          p={2}
          borderWidth='1px'
          borderRadius='md'
          borderColor={colors.border}
          bg={colors.cardBg}
        >
          <Button
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            isDisabled={page === 1 || isFetching}
            size='sm'
            {...buttonStyles.outline}
          >
            Prev
          </Button>

          <Text fontSize='sm' {...textStyles.body}>
            Page {data.pagination.page} of {data.pagination.totalPages} •{' '}
            {data.pagination.total} users
          </Text>

          <Button
            onClick={() =>
              setPage((p) => (p < data.pagination.totalPages ? p + 1 : p))
            }
            isDisabled={page === data.pagination.totalPages || isFetching}
            size='sm'
            {...buttonStyles.outline}
          >
            Next
          </Button>
        </Flex>
      )}

      {/* View User Modal */}
      <Modal isOpen={isViewOpen} onClose={onViewClose} size='md'>
        <ModalOverlay />
        <ModalContent {...bgStyles.card}>
          <ModalHeader {...textStyles.heading}>User Details</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            {selectedUser && (
              <VStack spacing={4} align='stretch'>
                <Flex justify='center'>
                  <Avatar
                    size='2xl'
                    name={selectedUser.name}
                    src={selectedUser.avatar ?? ''}
                  />
                </Flex>
                <Box>
                  <Text
                    fontWeight='bold'
                    fontSize='sm'
                    color={colors.textMuted}
                  >
                    ID
                  </Text>
                  <Text {...textStyles.heading}>{selectedUser.id}</Text>
                </Box>
                <Box>
                  <Text
                    fontWeight='bold'
                    fontSize='sm'
                    color={colors.textMuted}
                  >
                    Name
                  </Text>
                  <Text {...textStyles.heading}>{selectedUser.name}</Text>
                </Box>
                <Box>
                  <Text
                    fontWeight='bold'
                    fontSize='sm'
                    color={colors.textMuted}
                  >
                    Email
                  </Text>
                  <Text {...textStyles.body}>{selectedUser.email}</Text>
                </Box>
                <Box>
                  <Text
                    fontWeight='bold'
                    fontSize='sm'
                    color={colors.textMuted}
                  >
                    Role
                  </Text>
                  <Text textTransform='capitalize' {...textStyles.heading}>
                    {selectedUser.role}
                  </Text>
                </Box>
              </VStack>
            )}
          </ModalBody>
          <ModalFooter>
            <Button {...buttonStyles.primary} onClick={onViewClose}>
              Close
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      {/* Edit User Modal */}
      <Modal isOpen={isEditOpen} onClose={onEditClose} size='md'>
        <ModalOverlay />
        <ModalContent {...bgStyles.card}>
          <ModalHeader {...textStyles.heading}>Edit User</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <VStack spacing={4}>
              <FormControl>
                <FormLabel {...textStyles.heading}>Name</FormLabel>
                <Input
                  value={editFormData.name || ''}
                  onChange={(e) =>
                    setEditFormData({ ...editFormData, name: e.target.value })
                  }
                  placeholder='Enter name'
                  borderColor={colors.border}
                  color='black'
                />
              </FormControl>

              <FormControl>
                <FormLabel {...textStyles.heading}>Email</FormLabel>
                <Input
                  type='email'
                  value={editFormData.email || ''}
                  onChange={(e) =>
                    setEditFormData({ ...editFormData, email: e.target.value })
                  }
                  placeholder='Enter email'
                  borderColor={colors.border}
                  color='black'
                />
              </FormControl>

              <FormControl>
                <FormLabel {...textStyles.heading}>Role</FormLabel>
                <Select
                  value={editFormData.role || ''}
                  onChange={(e) =>
                    setEditFormData({ ...editFormData, role: e.target.value })
                  }
                  borderColor={colors.border}
                  color='black'
                >
                  <option value='ADMIN'>Admin</option>
                  <option value='INSTRUCTOR'>Instructor</option>
                  <option value='STUDENT'>Student</option>
                </Select>
              </FormControl>

              <FormControl>
                <FormLabel {...textStyles.heading}>Avatar</FormLabel>
                <Input
                  type='file'
                  accept='image/*'
                  onChange={handleAvatarChange}
                  pt={1}
                  color='black'
                  borderColor={colors.border}
                />
                {avatarFile && (
                  <Text fontSize='sm' mt={2} color={colors.success}>
                    New avatar selected: {avatarFile.name}
                  </Text>
                )}
              </FormControl>
            </VStack>
          </ModalBody>
          <ModalFooter>
            <Button
              variant='ghost'
              mr={3}
              onClick={onEditClose}
              color={colors.textSecondary}
              _hover={{ bg: colors.sectionBg }}
            >
              Cancel
            </Button>
            <Button
              {...buttonStyles.primary}
              bg={colors.success}
              _hover={{ bg: colors.primaryHover }}
              onClick={handleSubmitEdit}
              isLoading={updateMutation.isPending}
            >
              Save Changes
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      {/* Delete Confirmation Alert Dialog */}
      <AlertDialog
        isOpen={isDeleteOpen}
        leastDestructiveRef={cancelRef}
        onClose={onDeleteClose}
      >
        <AlertDialogOverlay>
          <AlertDialogContent {...bgStyles.card}>
            <AlertDialogHeader
              fontSize='lg'
              fontWeight='bold'
              {...textStyles.heading}
            >
              Delete User
            </AlertDialogHeader>

            <AlertDialogBody {...textStyles.body}>
              Are you sure you want to delete{' '}
              <Text as='span' fontWeight='bold' {...textStyles.heading}>
                {selectedUser?.name}
              </Text>
              ? This action cannot be undone.
            </AlertDialogBody>

            <AlertDialogFooter>
              <Button
                ref={cancelRef}
                onClick={onDeleteClose}
                {...buttonStyles.outline}
              >
                Cancel
              </Button>
              <Button
                bg={colors.error}
                color='white'
                _hover={{ bg: colors.primaryHover }}
                onClick={handleConfirmDelete}
                ml={3}
                isLoading={deleteMutation.isPending}
              >
                Delete
              </Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialogOverlay>
      </AlertDialog>
    </Box>
  );
}
