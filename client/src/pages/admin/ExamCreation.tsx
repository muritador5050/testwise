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

  if (!tests) return;
  return (
    <Box p={6} minH='100vh'>
      <HStack align='flex-start' spacing={8}>
        {/* Left: Form */}
        <Box flex='1' p={8} borderRadius='lg' shadow='lg'>
          <VStack spacing={6} align='stretch' as='form' onSubmit={handleSubmit}>
            <Heading size='lg'>
              {editingId ? 'Update Test' : 'Create New Test'}
            </Heading>

            {/* Title */}
            <FormControl isRequired>
              <FormLabel fontWeight='semibold'>Test Title</FormLabel>
              <Input
                value={formData.title}
                onChange={(e) =>
                  setFormData({ ...formData, title: e.target.value })
                }
                placeholder='Enter test title'
                borderColor='gray.300'
                _placeholder={{ color: 'gray.400' }}
              />
            </FormControl>

            {/* Description */}
            <FormControl>
              <FormLabel fontWeight='semibold'>Description</FormLabel>
              <Textarea
                value={formData.description}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
                placeholder='Enter test description (optional)'
                rows={4}
                borderColor='gray.300'
                _placeholder={{ color: 'gray.400' }}
              />
            </FormControl>

            {/* Duration & Max Attempts */}
            <HStack spacing={4} align='flex-start'>
              <FormControl isRequired flex={1}>
                <FormLabel fontWeight='semibold'>Duration (minutes)</FormLabel>
                <NumberInput
                  value={formData.duration}
                  onChange={(_valueString, valueNumber) =>
                    setFormData({ ...formData, duration: valueNumber })
                  }
                  min={1}
                >
                  <NumberInputField borderColor='gray.300' />
                  <NumberInputStepper>
                    <NumberIncrementStepper />
                    <NumberDecrementStepper />
                  </NumberInputStepper>
                </NumberInput>
              </FormControl>

              <FormControl isRequired flex={1}>
                <FormLabel fontWeight='semibold'>Max Attempts</FormLabel>
                <NumberInput
                  value={formData.maxAttempts}
                  onChange={(_valueString, valueNumber) =>
                    setFormData({ ...formData, maxAttempts: valueNumber })
                  }
                  min={1}
                >
                  <NumberInputField borderColor='gray.300' />
                  <NumberInputStepper>
                    <NumberIncrementStepper />
                    <NumberDecrementStepper />
                  </NumberInputStepper>
                </NumberInput>
              </FormControl>
            </HStack>

            {/* Available From & Until */}
            <HStack spacing={4} align='flex-start'>
              <FormControl flex={1}>
                <FormLabel fontWeight='semibold'>Available From</FormLabel>
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
                />
              </FormControl>

              <FormControl flex={1}>
                <FormLabel fontWeight='semibold'>Available Until</FormLabel>
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
                />
              </FormControl>
            </HStack>

            {/* Is Published */}
            <FormControl display='flex' alignItems='center'>
              <FormLabel mb='0' fontWeight='semibold'>
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

            {/* Buttons */}
            <HStack justify='flex-end' pt={4}>
              <Button variant='outline' colorScheme='blue' onClick={resetForm}>
                Reset
              </Button>
              <Button
                type='submit'
                isLoading={
                  editingId ? updateTest.isPending : createTest.isPending
                }
                loadingText={editingId ? 'Updating...' : 'Creating...'}
                colorScheme='blue'
              >
                {editingId ? 'Update Test' : 'Create Test'}
              </Button>
            </HStack>
          </VStack>
        </Box>

        {/* Right: Test List */}
        <Box flex='1'>
          <Heading size='md' mb={4}>
            All Tests
          </Heading>
          <SimpleGrid columns={1} spacing={4}>
            {tests.tests.map((test) => (
              <Card key={test.id} shadow='md' borderRadius='lg'>
                <CardHeader>
                  <Heading size='sm'>{test.title}</Heading>
                </CardHeader>
                <CardBody>
                  <Text fontSize='sm' color='gray.600'>
                    {test.description || 'No description'}
                  </Text>
                  <Text fontSize='xs' color='gray.500' mt={2}>
                    Duration: {test.duration} mins | Attempts:{' '}
                    {test.maxAttempts}
                  </Text>
                  <Text fontSize='xs' color='gray.500'>
                    Questions: {test._count?.questions ?? 0} | Attempts Made:{' '}
                    {test._count?.attempts ?? 0}
                  </Text>
                  <Text
                    fontSize='xs'
                    color={test.isPublished ? 'green.500' : 'orange.500'}
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
                <CardFooter justifyContent='space-between'>
                  <HStack spacing={2}>
                    <IconButton
                      aria-label='edit'
                      icon={<Pencil size={16} />}
                      variant='ghost'
                      onClick={() => handleEdit(test)}
                    />
                    <IconButton
                      aria-label='delete'
                      icon={<Trash2 size={16} />}
                      variant='ghost'
                      onClick={() => handleDelete(test.id)}
                    />
                    <Button
                      size='sm'
                      onClick={() => publish.mutate(test.id)}
                      colorScheme={test.isPublished ? 'red' : 'green'}
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
                  >
                    {' '}
                    {test.questions?.length !== 0
                      ? 'Add More Questions'
                      : 'Start Creating Questions'}
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </SimpleGrid>
        </Box>
      </HStack>
    </Box>
  );
};

export default ExamCreation;
