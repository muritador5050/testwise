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
      p={{ base: 4, md: 6, lg: 8 }}
    >
      {/* Left: Form */}
      <Box
        flex='1'
        w={{ base: '100%', lg: 'auto' }}
        p={{ base: 4, md: 6, lg: 8 }}
        borderRadius='lg'
        shadow='lg'
      >
        <VStack
          spacing={{ base: 4, md: 6 }}
          align='stretch'
          as='form'
          onSubmit={handleSubmit}
        >
          <Heading size={{ base: 'md', md: 'lg' }}>
            {editingId ? 'Update Test' : 'Create New Test'}
          </Heading>

          <FormControl isRequired>
            <FormLabel
              fontWeight='semibold'
              fontSize={{ base: 'sm', md: 'md' }}
            >
              Test Title
            </FormLabel>
            <Input
              value={formData.title}
              onChange={(e) =>
                setFormData({ ...formData, title: e.target.value })
              }
              placeholder='Enter test title'
              borderColor='gray.300'
              _placeholder={{ color: 'gray.400' }}
              fontSize={{ base: 'sm', md: 'md' }}
            />
          </FormControl>

          <FormControl>
            <FormLabel
              fontWeight='semibold'
              fontSize={{ base: 'sm', md: 'md' }}
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
              borderColor='gray.300'
              _placeholder={{ color: 'gray.400' }}
              fontSize={{ base: 'sm', md: 'md' }}
            />
          </FormControl>

          <Stack direction={{ base: 'column', sm: 'row' }} spacing={4}>
            <FormControl isRequired flex={1}>
              <FormLabel
                fontWeight='semibold'
                fontSize={{ base: 'sm', md: 'md' }}
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
                  borderColor='gray.300'
                  fontSize={{ base: 'sm', md: 'md' }}
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
                  borderColor='gray.300'
                  fontSize={{ base: 'sm', md: 'md' }}
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
                borderColor='gray.300'
                fontSize={{ base: 'sm', md: 'md' }}
              />
            </FormControl>

            <FormControl flex={1}>
              <FormLabel
                fontWeight='semibold'
                fontSize={{ base: 'sm', md: 'md' }}
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
                borderColor='gray.300'
                fontSize={{ base: 'sm', md: 'md' }}
              />
            </FormControl>
          </Stack>

          <FormControl display='flex' alignItems='center' flexWrap='wrap'>
            <FormLabel
              mb='0'
              fontWeight='semibold'
              fontSize={{ base: 'sm', md: 'md' }}
            >
              Publish Test
            </FormLabel>
            <Switch
              isChecked={formData.isPublished}
              onChange={(e) =>
                setFormData({ ...formData, isPublished: e.target.checked })
              }
              colorScheme='blue'
            />
            <Text ml={3} fontSize='sm' color='gray.600'>
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
            >
              {editingId ? 'Update Test' : 'Create Test'}
            </Button>
          </Stack>
        </VStack>
      </Box>

      {/* Right: Test List */}
      <Box flex='1' w={{ base: '100%', lg: 'auto' }}>
        <Heading size={{ base: 'sm', md: 'md' }} mb={4}>
          All Tests
        </Heading>
        <SimpleGrid columns={{ base: 1 }} spacing={4}>
          {tests.tests.map((test) => (
            <Card key={test.id} shadow='md' borderRadius='lg'>
              <CardHeader pb={2}>
                <Heading size={{ base: 'xs', md: 'sm' }}>{test.title}</Heading>
              </CardHeader>
              <CardBody py={3}>
                <Text fontSize={{ base: 'xs', md: 'sm' }} color='gray.600'>
                  {test.description || 'No description'}
                </Text>
                <Text fontSize='xs' color='gray.500' mt={2}>
                  Duration: {test.duration} mins | Attempts: {test.maxAttempts}
                </Text>
                <Text fontSize='xs' color='gray.500'>
                  Questions: {test._count?.questions ?? 0} | Attempts Made:{' '}
                  {test._count?.attempts ?? 0}
                </Text>
                <Text
                  fontSize='xs'
                  color={test.isPublished ? 'green.500' : 'orange.500'}
                  fontWeight='semibold'
                >
                  {test.isPublished ? 'Published' : 'Draft'}
                </Text>
                {test.availableFrom && test.availableUntil && (
                  <Text fontSize='xs' color='gray.500' mt={1}>
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
                  />
                  <IconButton
                    aria-label='delete'
                    icon={<Trash2 size={16} />}
                    variant='ghost'
                    size='sm'
                    onClick={() => handleDelete(test.id)}
                  />
                  <Button
                    size='sm'
                    onClick={() => publish.mutate(test.id)}
                    colorScheme={test.isPublished ? 'red' : 'green'}
                    fontSize='xs'
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
