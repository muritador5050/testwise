import React, { useState } from 'react';
import {
  Box,
  VStack,
  Heading,
  FormControl,
  FormLabel,
  Input,
  Textarea,
  NumberInput,
  NumberInputField,
  Switch,
  Button,
  HStack,
  Text,
  SimpleGrid,
  IconButton,
  Card,
  CardHeader,
  CardBody,
  CardFooter,
  NumberInputStepper,
  NumberIncrementStepper,
  NumberDecrementStepper,
  Stack,
} from '@chakra-ui/react';
import { useNavigate } from 'react-router-dom';
import { Pencil, Trash2, PlusCircle } from 'lucide-react';
import {
  useCreateTest,
  useGetAllTests,
  useDeleteTest,
  useUpdateTest,
  usePublishTest,
} from '../../api/services/testServices';
import type { CreateTest, Test } from '../../types/api';
import { colors, bgStyles, buttonStyles, textStyles } from '../../utils/colors';

const ExamCreation: React.FC = () => {
  const [formData, setFormData] = useState<CreateTest>({
    title: '',
    description: '',
    duration: 20,
    maxAttempts: 1,
    isPublished: false,
    availableFrom: null,
    availableUntil: null,
  });
  const [editingId, setEditingId] = useState<number | null>(null);

  const createTest = useCreateTest();
  const { data: tests } = useGetAllTests();
  const updateTest = useUpdateTest();
  const publish = usePublishTest();
  const deleteTest = useDeleteTest();
  const navigate = useNavigate();

  const resetForm = () => {
    setFormData({
      title: '',
      description: '',
      duration: 60,
      maxAttempts: 1,
      isPublished: false,
      availableFrom: null,
      availableUntil: null,
    });
    setEditingId(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const payload = {
      ...formData,
      availableFrom: formData.availableFrom
        ? new Date(formData.availableFrom).toISOString()
        : null,
      availableUntil: formData.availableUntil
        ? new Date(formData.availableUntil).toISOString()
        : null,
    };

    if (editingId) {
      await updateTest.mutateAsync({ id: editingId, testData: payload });
    } else {
      await createTest.mutateAsync(payload);
    }

    resetForm();
  };

  const handleDelete = (id: number) => {
    deleteTest.mutate(id);
  };

  const handleEdit = (test: Test) => {
    setFormData({
      title: test.title,
      description: test.description || '',
      duration: test.duration,
      maxAttempts: test.maxAttempts,
      isPublished: test.isPublished,
      availableFrom: test.availableFrom
        ? new Date(test.availableFrom).toISOString().slice(0, 16)
        : null,
      availableUntil: test.availableUntil
        ? new Date(test.availableUntil).toISOString().slice(0, 16)
        : null,
    });
    setEditingId(test.id);
  };

  if (!tests) return null;

  return (
    <Stack
      direction={{ base: 'column', lg: 'row' }}
      align='flex-start'
      spacing={{ base: 6, md: 8 }}
      bg={colors.pageBg}
      minH='100vh'
    >
      {/* Left: Form */}
      <Box
        flex='1'
        w={{ base: '100%', lg: 'auto' }}
        p={{ base: 4, md: 6, lg: 8 }}
        borderRadius='lg'
        shadow='lg'
        {...bgStyles.card}
        border='1px solid'
        borderColor={colors.border}
      >
        <VStack
          spacing={{ base: 4, md: 6 }}
          align='stretch'
          as='form'
          onSubmit={handleSubmit}
        >
          <Heading size={{ base: 'md', md: 'lg' }} {...textStyles.heading}>
            {editingId ? 'Update Test' : 'Create New Test'}
          </Heading>

          <FormControl isRequired>
            <FormLabel
              fontWeight='semibold'
              fontSize={{ base: 'sm', md: 'md' }}
              {...textStyles.body}
            >
              Test Title
            </FormLabel>
            <Input
              value={formData.title}
              onChange={(e) =>
                setFormData({ ...formData, title: e.target.value })
              }
              placeholder='Enter test title'
              borderColor={colors.border}
              _placeholder={{ color: colors.textMuted }}
              fontSize={{ base: 'sm', md: 'md' }}
              bg='white'
              color='black'
            />
          </FormControl>

          <FormControl>
            <FormLabel
              fontWeight='semibold'
              fontSize={{ base: 'sm', md: 'md' }}
              {...textStyles.body}
            >
              Description
            </FormLabel>
            <Textarea
              value={formData.description}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
              placeholder='Enter test description (optional)'
              rows={4}
              borderColor={colors.border}
              _placeholder={{ color: colors.textMuted }}
              fontSize={{ base: 'sm', md: 'md' }}
              bg='white'
              color='black'
            />
          </FormControl>

          <Stack direction={{ base: 'column', sm: 'row' }} spacing={4}>
            <FormControl isRequired flex={1}>
              <FormLabel
                fontWeight='semibold'
                fontSize={{ base: 'sm', md: 'md' }}
                {...textStyles.body}
              >
                Duration (minutes)
              </FormLabel>
              <NumberInput
                value={formData.duration}
                onChange={(_valueString, valueNumber) =>
                  setFormData({ ...formData, duration: valueNumber })
                }
                min={1}
              >
                <NumberInputField
                  borderColor={colors.border}
                  fontSize={{ base: 'sm', md: 'md' }}
                  bg='white'
                  color='black'
                />
                <NumberInputStepper>
                  <NumberIncrementStepper />
                  <NumberDecrementStepper />
                </NumberInputStepper>
              </NumberInput>
            </FormControl>

            <FormControl isRequired flex={1}>
              <FormLabel
                fontWeight='semibold'
                fontSize={{ base: 'sm', md: 'md' }}
                {...textStyles.body}
              >
                Max Attempts
              </FormLabel>
              <NumberInput
                value={formData.maxAttempts}
                onChange={(_valueString, valueNumber) =>
                  setFormData({ ...formData, maxAttempts: valueNumber })
                }
                min={1}
              >
                <NumberInputField
                  borderColor={colors.border}
                  fontSize={{ base: 'sm', md: 'md' }}
                  bg='white'
                  color='black'
                />
                <NumberInputStepper>
                  <NumberIncrementStepper />
                  <NumberDecrementStepper />
                </NumberInputStepper>
              </NumberInput>
            </FormControl>
          </Stack>

          <Stack direction={{ base: 'column', sm: 'row' }} spacing={4}>
            <FormControl flex={1}>
              <FormLabel
                fontWeight='semibold'
                fontSize={{ base: 'sm', md: 'md' }}
                {...textStyles.body}
              >
                Available From
              </FormLabel>
              <Input
                type='datetime-local'
                value={formData.availableFrom ?? ''}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    availableFrom: e.target.value || null,
                  })
                }
                borderColor={colors.border}
                fontSize={{ base: 'sm', md: 'md' }}
                bg='white'
                color='black'
              />
            </FormControl>

            <FormControl flex={1}>
              <FormLabel
                fontWeight='semibold'
                fontSize={{ base: 'sm', md: 'md' }}
                {...textStyles.body}
              >
                Available Until
              </FormLabel>
              <Input
                type='datetime-local'
                value={formData.availableUntil ?? ''}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    availableUntil: e.target.value || null,
                  })
                }
                borderColor={colors.border}
                fontSize={{ base: 'sm', md: 'md' }}
                bg='white'
                color='black'
              />
            </FormControl>
          </Stack>

          <FormControl display='flex' alignItems='center' flexWrap='wrap'>
            <FormLabel
              mb='0'
              fontWeight='semibold'
              fontSize={{ base: 'sm', md: 'md' }}
              {...textStyles.body}
            >
              Publish Test
            </FormLabel>
            <Switch
              isChecked={formData.isPublished}
              onChange={(e) =>
                setFormData({ ...formData, isPublished: e.target.checked })
              }
              sx={{
                'span.chakra-switch__track': {
                  backgroundColor: formData.isPublished ? '#38B2AC' : '#CBD5E0',
                },
                'span.chakra-switch__thumb': {
                  backgroundColor: 'white',
                },
              }}
            />
            <Text
              ml={3}
              fontSize='sm'
              color={formData.isPublished ? 'teal.300' : colors.textMuted}
              fontWeight={formData.isPublished ? 'bold' : 'normal'}
            >
              {formData.isPublished ? 'Published' : 'Draft'}
            </Text>
          </FormControl>

          <Stack
            direction={{ base: 'column', sm: 'row' }}
            justify='flex-end'
            pt={4}
            spacing={3}
          >
            <Button
              variant='outline'
              colorScheme='blue'
              onClick={resetForm}
              w={{ base: 'full', sm: 'auto' }}
              size={{ base: 'md', md: 'md' }}
              borderColor={colors.primary}
              color={colors.primary}
              _hover={{ bg: colors.sectionBg }}
            >
              Reset
            </Button>
            <Button
              type='submit'
              isLoading={
                editingId ? updateTest.isPending : createTest.isPending
              }
              loadingText={editingId ? 'Updating...' : 'Creating...'}
              colorScheme='blue'
              w={{ base: 'full', sm: 'auto' }}
              size={{ base: 'md', md: 'md' }}
              {...buttonStyles.primary}
            >
              {editingId ? 'Update Test' : 'Create Test'}
            </Button>
          </Stack>
        </VStack>
      </Box>

      {/* Right: Test List */}
      <Box flex='1' w={{ base: '100%', lg: 'auto' }}>
        <Heading size={{ base: 'sm', md: 'md' }} mb={4} {...textStyles.heading}>
          All Tests
        </Heading>
        <SimpleGrid columns={{ base: 1 }} spacing={4}>
          {tests.tests.map((test) => (
            <Card
              key={test.id}
              shadow='md'
              borderRadius='lg'
              {...bgStyles.card}
              border='1px solid'
              borderColor={colors.border}
            >
              <CardHeader pb={2}>
                <Heading
                  size={{ base: 'xs', md: 'sm' }}
                  {...textStyles.heading}
                >
                  {test.title}
                </Heading>
              </CardHeader>
              <CardBody py={3}>
                <Text
                  fontSize={{ base: 'xs', md: 'sm' }}
                  color={colors.textSecondary}
                >
                  {test.description || 'No description'}
                </Text>
                <Text fontSize='xs' color={colors.textMuted} mt={2}>
                  Duration: {test.duration} mins | Attempts: {test.maxAttempts}
                </Text>
                <Text fontSize='xs' color={colors.textMuted}>
                  Questions: {test._count?.questions ?? 0} | Attempts Made:{' '}
                  {test._count?.attempts ?? 0}
                </Text>
                <Text
                  fontSize='xs'
                  color={test.isPublished ? colors.success : colors.warning}
                  fontWeight='semibold'
                >
                  {test.isPublished ? 'Published' : 'Draft'}
                </Text>
                {test.availableFrom && test.availableUntil && (
                  <Text fontSize='xs' color={colors.textMuted} mt={1}>
                    Available:{' '}
                    {new Date(test.availableFrom).toLocaleDateString()} -{' '}
                    {new Date(test.availableUntil).toLocaleDateString()}
                  </Text>
                )}
              </CardBody>
              <CardFooter
                flexDirection={{ base: 'column', sm: 'row' }}
                justifyContent='space-between'
                gap={3}
                pt={3}
              >
                <HStack spacing={2} w={{ base: 'full', sm: 'auto' }}>
                  <IconButton
                    aria-label='edit'
                    icon={<Pencil size={16} />}
                    variant='ghost'
                    size='sm'
                    onClick={() => handleEdit(test)}
                    color={colors.primary}
                  />
                  <IconButton
                    aria-label='delete'
                    icon={<Trash2 size={16} />}
                    variant='ghost'
                    size='sm'
                    onClick={() => handleDelete(test.id)}
                    color={colors.error}
                  />
                  <Button
                    size='sm'
                    onClick={() => publish.mutate(test.id)}
                    colorScheme={test.isPublished ? 'red' : 'green'}
                    fontSize='xs'
                    bg={test.isPublished ? colors.error : colors.success}
                    _hover={{
                      bg: test.isPublished ? '#dc2626' : '#059669',
                    }}
                  >
                    {test.isPublished ? 'Unpublish' : 'Publish'}
                  </Button>
                </HStack>
                <Button
                  leftIcon={<PlusCircle size={16} />}
                  size='sm'
                  colorScheme='blue'
                  onClick={() =>
                    navigate(`/admin/questions/create`, {
                      state: { testId: test.id, title: test.title },
                    })
                  }
                  w={{ base: 'full', sm: 'auto' }}
                  fontSize='xs'
                  {...buttonStyles.primary}
                >
                  {test.questions?.length !== 0
                    ? 'Add More Questions'
                    : 'Start Creating Questions'}
                </Button>
              </CardFooter>
            </Card>
          ))}
        </SimpleGrid>
      </Box>
    </Stack>
  );
};

export default ExamCreation;
