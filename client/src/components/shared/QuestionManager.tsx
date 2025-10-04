import React, { useState, useCallback, useRef } from 'react';
import {
  Box,
  VStack,
  HStack,
  Heading,
  Button,
  Text,
  SimpleGrid,
  FormControl,
  FormLabel,
  Input,
  Select,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  NumberIncrementStepper,
  NumberDecrementStepper,
  Textarea,
  IconButton,
  Checkbox,
  Alert,
  AlertIcon,
  Card,
  CardBody,
  Badge,
  Grid,
  AlertDialog,
  AlertDialogBody,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogContent,
  AlertDialogOverlay,
  useDisclosure,
} from '@chakra-ui/react';
import {
  DeleteIcon,
  AddIcon,
  EditIcon,
  DragHandleIcon,
  DownloadIcon,
} from '@chakra-ui/icons';
import BulkUploadModal from './BulkUploadModal';
import type { Option, Question, QuestionType } from '../../types/api';

interface QuestionManagerProps {
  testId: number;
  onQuestionsUpdate: (questions: Question[]) => void;
}

const QuestionManager: React.FC<QuestionManagerProps> = ({
  testId,
  onQuestionsUpdate,
}) => {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [editingQuestion, setEditingQuestion] = useState<Question | null>(null);
  const [formData, setFormData] = useState({
    text: '',
    questionType: 'MULTIPLE_CHOICE' as QuestionType,
    points: 1.0,
    order: 1,
  });
  const [options, setOptions] = useState<Option[]>([
    { id: 1, text: '', isCorrect: false, order: 1, questionId: 0 },
    { id: 2, text: '', isCorrect: false, order: 2, questionId: 0 },
  ]);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const {
    isOpen: isBulkUploadOpen,
    onOpen: onBulkUploadOpen,
    onClose: onBulkUploadClose,
  } = useDisclosure();
  const [questionToDelete, setQuestionToDelete] = useState<Question | null>(
    null
  );
  const cancelRef = useRef<HTMLButtonElement>(null);

  const handleBulkUpload = useCallback(
    (uploadedQuestions: Question[]) => {
      const updatedQuestions = [...questions, ...uploadedQuestions];
      setQuestions(updatedQuestions);
      onQuestionsUpdate(updatedQuestions);
      onBulkUploadClose();
    },
    [questions, onQuestionsUpdate, onBulkUploadClose]
  );

  const handleAddQuestion = useCallback(() => {
    const newQuestion: Question = {
      ...formData,
      id: Date.now(),
      testId,
      options: options.filter((opt) => opt.text.trim()),
    };

    const updatedQuestions = [...questions, newQuestion];
    setQuestions(updatedQuestions);
    onQuestionsUpdate(updatedQuestions);

    // Reset form
    setFormData({
      text: '',
      questionType: 'MULTIPLE_CHOICE',
      points: 1.0,
      order: questions.length + 2,
    });
    setOptions([
      {
        id: Date.now() + 1,
        text: '',
        isCorrect: false,
        order: 1,
        questionId: 0,
      },
      {
        id: Date.now() + 2,
        text: '',
        isCorrect: false,
        order: 2,
        questionId: 0,
      },
    ]);
    setEditingQuestion(null);
  }, [formData, options, questions, testId, onQuestionsUpdate]);

  const handleUpdateQuestion = useCallback(() => {
    if (!editingQuestion) return;

    const updatedQuestion: Question = {
      ...formData,
      id: editingQuestion.id,
      testId,
      options: options.filter((opt) => opt.text.trim()),
    };

    const updatedQuestions = questions.map((q) =>
      q.id === editingQuestion.id ? updatedQuestion : q
    );
    setQuestions(updatedQuestions);
    onQuestionsUpdate(updatedQuestions);

    // Reset form
    setFormData({
      text: '',
      questionType: 'MULTIPLE_CHOICE',
      points: 1.0,
      order: questions.length + 1,
    });
    setOptions([
      {
        id: Date.now() + 1,
        text: '',
        isCorrect: false,
        order: 1,
        questionId: 0,
      },
      {
        id: Date.now() + 2,
        text: '',
        isCorrect: false,
        order: 2,
        questionId: 0,
      },
    ]);
    setEditingQuestion(null);
  }, [
    formData,
    options,
    questions,
    editingQuestion,
    testId,
    onQuestionsUpdate,
  ]);

  const handleEditQuestion = useCallback((question: Question) => {
    setEditingQuestion(question);
    setFormData({
      text: question.text,
      questionType: question.questionType,
      points: question.points,
      order: question.order,
    });
    setOptions(
      question.options && question.options.length > 0
        ? question.options
        : [
            {
              id: Date.now() + 1,
              text: '',
              isCorrect: false,
              order: 1,
              questionId: 0,
            },
            {
              id: Date.now() + 2,
              text: '',
              isCorrect: false,
              order: 2,
              questionId: 0,
            },
          ]
    );
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  const handleDeleteClick = useCallback(
    (question: Question) => {
      setQuestionToDelete(question);
      onOpen();
    },
    [onOpen]
  );

  const handleDeleteConfirm = useCallback(() => {
    if (questionToDelete) {
      const updatedQuestions = questions.filter(
        (q) => q.id !== questionToDelete.id
      );
      setQuestions(updatedQuestions);
      onQuestionsUpdate(updatedQuestions);
      onClose();
      setQuestionToDelete(null);
    }
  }, [questionToDelete, questions, onQuestionsUpdate, onClose]);

  const handleOptionChange = useCallback(
    (index: number, field: keyof Option, value: string | boolean) => {
      const newOptions = [...options];
      newOptions[index] = { ...newOptions[index], [field]: value };
      setOptions(newOptions);
    },
    [options]
  );

  const handleCorrectOptionChange = useCallback(
    (index: number) => {
      const newOptions = options.map((opt, i) => ({
        ...opt,
        isCorrect: i === index,
      }));
      setOptions(newOptions);
    },
    [options]
  );

  const addOption = useCallback(() => {
    const newId = Math.max(0, ...options.map((o) => o.id)) + 1;
    setOptions([
      ...options,
      {
        id: newId,
        text: '',
        isCorrect: false,
        order: options.length + 1,
        questionId: 0,
      },
    ]);
  }, [options]);

  const removeOption = useCallback(
    (index: number) => {
      if (options.length > 2) {
        const newOptions = options.filter((_, i) => i !== index);
        setOptions(newOptions.map((opt, i) => ({ ...opt, order: i + 1 })));
      }
    },
    [options]
  );

  const handleCancelForm = useCallback(() => {
    setFormData({
      text: '',
      questionType: 'MULTIPLE_CHOICE',
      points: 1.0,
      order: questions.length + 1,
    });
    setOptions([
      {
        id: Date.now() + 1,
        text: '',
        isCorrect: false,
        order: 1,
        questionId: 0,
      },
      {
        id: Date.now() + 2,
        text: '',
        isCorrect: false,
        order: 2,
        questionId: 0,
      },
    ]);
    setEditingQuestion(null);
  }, [questions.length]);

  const totalPoints = questions.reduce((sum, q) => sum + q.points, 0);
  const questionTypes = Array.from(
    new Set(questions.map((q) => q.questionType))
  ).join(', ');
  const sortedQuestions = [...questions].sort((a, b) => a.order - b.order);

  const getQuestionTypeColor = (type: QuestionType): string => {
    switch (type) {
      case 'MULTIPLE_CHOICE':
        return 'blue';
      case 'TRUE_FALSE':
        return 'green';
      case 'SHORT_ANSWER':
        return 'orange';
      case 'ESSAY':
        return 'purple';
      default:
        return 'gray';
    }
  };

  const formatQuestionType = (type: QuestionType): string => {
    return type.toLowerCase().replace('_', ' ');
  };

  return (
    <Box p={6} bg='gray.50' minH='100vh'>
      <VStack spacing={6} align='stretch'>
        {/* Header with Bulk Upload Button */}
        <HStack justify='space-between' align='center'>
          <Heading size='lg' color='gray.800'>
            Manage Questions
          </Heading>
          <Button
            leftIcon={<DownloadIcon />}
            colorScheme='purple'
            onClick={onBulkUploadOpen}
            shadow='md'
          >
            Bulk Upload
          </Button>
        </HStack>

        {/* Stats */}
        <SimpleGrid columns={3} spacing={4}>
          <Box
            p={4}
            bgGradient='linear(to-br, blue.500, blue.600)'
            color='white'
            borderRadius='lg'
            shadow='md'
          >
            <Text fontWeight='bold' fontSize='sm' opacity={0.9}>
              Total Questions
            </Text>
            <Text fontSize='3xl' fontWeight='bold'>
              {questions.length}
            </Text>
          </Box>
          <Box
            p={4}
            bgGradient='linear(to-br, green.500, green.600)'
            color='white'
            borderRadius='lg'
            shadow='md'
          >
            <Text fontWeight='bold' fontSize='sm' opacity={0.9}>
              Total Points
            </Text>
            <Text fontSize='3xl' fontWeight='bold'>
              {totalPoints}
            </Text>
          </Box>
          <Box
            p={4}
            bgGradient='linear(to-br, purple.500, purple.600)'
            color='white'
            borderRadius='lg'
            shadow='md'
          >
            <Text fontWeight='bold' fontSize='sm' opacity={0.9}>
              Types
            </Text>
            <Text fontSize='sm' noOfLines={2}>
              {questionTypes || 'None'}
            </Text>
          </Box>
        </SimpleGrid>

        {/* Main Content - Side by Side */}
        <Grid templateColumns={{ base: '1fr', lg: '1fr 1fr' }} gap={6}>
          {/* Left Side - Question Form */}
          <Box
            bg='white'
            p={6}
            borderRadius='lg'
            shadow='lg'
            border='2px'
            borderColor='blue.200'
          >
            <VStack spacing={4} align='stretch'>
              <Heading size='md' color='gray.800'>
                {editingQuestion
                  ? '✏️ Edit Question'
                  : '➕ Create New Question'}
              </Heading>

              <FormControl isRequired>
                <FormLabel fontWeight='semibold' color='gray.700'>
                  Question Text
                </FormLabel>
                <Textarea
                  value={formData.text}
                  onChange={(e) =>
                    setFormData({ ...formData, text: e.target.value })
                  }
                  placeholder='Enter your question here...'
                  rows={3}
                  color='gray.800'
                  borderColor='gray.300'
                  _hover={{ borderColor: 'blue.400' }}
                  _focus={{
                    borderColor: 'blue.500',
                    boxShadow: '0 0 0 1px var(--chakra-colors-blue-500)',
                  }}
                  _placeholder={{ color: 'gray.400' }}
                />
              </FormControl>

              <HStack width='100%' align='flex-start' spacing={3}>
                <FormControl flex={2}>
                  <FormLabel fontWeight='semibold' color='gray.700'>
                    Question Type
                  </FormLabel>
                  <Select
                    value={formData.questionType}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        questionType: e.target.value as QuestionType,
                      })
                    }
                    color='gray.800'
                    borderColor='gray.300'
                    _hover={{ borderColor: 'blue.400' }}
                  >
                    <option value='MULTIPLE_CHOICE'>Multiple Choice</option>
                    <option value='TRUE_FALSE'>True/False</option>
                    <option value='SHORT_ANSWER'>Short Answer</option>
                    <option value='ESSAY'>Essay</option>
                  </Select>
                </FormControl>

                <FormControl flex={1} isRequired>
                  <FormLabel fontWeight='semibold' color='gray.700'>
                    Points
                  </FormLabel>
                  <NumberInput
                    value={formData.points}
                    onChange={(_valueString, valueNumber) =>
                      setFormData({ ...formData, points: valueNumber })
                    }
                    min={0.5}
                    step={0.5}
                    precision={1}
                  >
                    <NumberInputField color='gray.800' borderColor='gray.300' />
                    <NumberInputStepper>
                      <NumberIncrementStepper />
                      <NumberDecrementStepper />
                    </NumberInputStepper>
                  </NumberInput>
                </FormControl>

                <FormControl flex={1}>
                  <FormLabel fontWeight='semibold' color='gray.700'>
                    Order
                  </FormLabel>
                  <NumberInput
                    value={formData.order}
                    onChange={(_valueString, valueNumber) =>
                      setFormData({ ...formData, order: valueNumber })
                    }
                    min={1}
                  >
                    <NumberInputField color='gray.800' borderColor='gray.300' />
                  </NumberInput>
                </FormControl>
              </HStack>

              {/* Options */}
              {['MULTIPLE_CHOICE', 'TRUE_FALSE'].includes(
                formData.questionType
              ) && (
                <FormControl>
                  <FormLabel fontWeight='semibold' color='gray.700'>
                    Options{' '}
                    {formData.questionType === 'TRUE_FALSE' && '(True/False)'}
                  </FormLabel>
                  <VStack spacing={2} align='stretch'>
                    {options.map((option, index) => (
                      <HStack key={option.id}>
                        <Checkbox
                          isChecked={option.isCorrect}
                          onChange={() => handleCorrectOptionChange(index)}
                          colorScheme='blue'
                        />
                        <Input
                          value={option.text}
                          onChange={(e) =>
                            handleOptionChange(index, 'text', e.target.value)
                          }
                          placeholder={`Option ${index + 1}`}
                          color='gray.800'
                          borderColor='gray.300'
                          _hover={{ borderColor: 'blue.400' }}
                          _placeholder={{ color: 'gray.400' }}
                        />
                        {options.length > 2 && (
                          <IconButton
                            aria-label='Remove option'
                            icon={<DeleteIcon />}
                            onClick={() => removeOption(index)}
                            size='sm'
                            colorScheme='red'
                            variant='ghost'
                          />
                        )}
                      </HStack>
                    ))}
                    {formData.questionType === 'MULTIPLE_CHOICE' && (
                      <Button
                        leftIcon={<AddIcon />}
                        onClick={addOption}
                        size='sm'
                        variant='outline'
                        colorScheme='blue'
                      >
                        Add Option
                      </Button>
                    )}
                  </VStack>
                </FormControl>
              )}

              {/* Info Messages */}
              {formData.questionType === 'SHORT_ANSWER' && (
                <Alert status='info' borderRadius='md'>
                  <AlertIcon />
                  Short answer questions require manual grading.
                </Alert>
              )}

              {formData.questionType === 'ESSAY' && (
                <Alert status='info' borderRadius='md'>
                  <AlertIcon />
                  Essay questions require manual grading and review.
                </Alert>
              )}

              {/* Action Buttons */}
              <HStack justify='flex-end' pt={4}>
                <Button variant='outline' onClick={handleCancelForm}>
                  Cancel
                </Button>
                <Button
                  colorScheme='blue'
                  onClick={
                    editingQuestion ? handleUpdateQuestion : handleAddQuestion
                  }
                >
                  {editingQuestion ? 'Update' : 'Create'} Question
                </Button>
              </HStack>
            </VStack>
          </Box>

          {/* Right Side - Question List */}
          <Box
            bg='white'
            p={6}
            borderRadius='lg'
            shadow='lg'
            border='2px'
            borderColor='purple.200'
          >
            <VStack spacing={4} align='stretch'>
              <Heading size='md' color='gray.800'>
                📝 Questions List
              </Heading>

              {questions.length === 0 ? (
                <Box textAlign='center' py={12}>
                  <Text fontSize='6xl' mb={4}>
                    📋
                  </Text>
                  <Text color='gray.500'>No questions added yet.</Text>
                  <Text fontSize='sm' color='gray.400' mt={2}>
                    Create your first question using the form.
                  </Text>
                </Box>
              ) : (
                <VStack
                  spacing={4}
                  align='stretch'
                  maxH='600px'
                  overflowY='auto'
                  pr={2}
                >
                  {sortedQuestions.map((question) => (
                    <Card
                      key={question.id}
                      variant='outline'
                      borderWidth='2px'
                      borderColor='gray.200'
                      _hover={{ borderColor: 'blue.300' }}
                    >
                      <CardBody>
                        <HStack align='start' spacing={3}>
                          <DragHandleIcon
                            color='gray.400'
                            cursor='grab'
                            mt={1}
                          />

                          <VStack flex={1} align='stretch' spacing={2}>
                            <HStack flexWrap='wrap' spacing={2}>
                              <Badge variant='outline' colorScheme='gray'>
                                #{question.order}
                              </Badge>
                              <Badge
                                colorScheme={getQuestionTypeColor(
                                  question.questionType
                                )}
                              >
                                {formatQuestionType(question.questionType)}
                              </Badge>
                              <Badge colorScheme='yellow'>
                                {question.points} pt
                                {question.points !== 1 ? 's' : ''}
                              </Badge>
                            </HStack>

                            <Text fontWeight='medium' color='gray.800'>
                              {question.text}
                            </Text>

                            {['MULTIPLE_CHOICE', 'TRUE_FALSE'].includes(
                              question.questionType
                            ) &&
                              question.options && (
                                <VStack align='stretch' spacing={1}>
                                  {question.options
                                    .sort((a, b) => a.order - b.order)
                                    .map((option) => (
                                      <HStack key={option.id} spacing={2}>
                                        <Box
                                          w={2}
                                          h={2}
                                          borderRadius='full'
                                          bg={
                                            option.isCorrect
                                              ? 'green.500'
                                              : 'gray.300'
                                          }
                                        />
                                        <Text
                                          fontSize='sm'
                                          color={
                                            option.isCorrect
                                              ? 'green.600'
                                              : 'gray.600'
                                          }
                                          fontWeight={
                                            option.isCorrect
                                              ? 'medium'
                                              : 'normal'
                                          }
                                        >
                                          {option.text}
                                          {option.isCorrect && ' ✓'}
                                        </Text>
                                      </HStack>
                                    ))}
                                </VStack>
                              )}

                            {question.questionType === 'SHORT_ANSWER' && (
                              <Text
                                fontSize='sm'
                                color='gray.500'
                                fontStyle='italic'
                              >
                                Manual grading required
                              </Text>
                            )}

                            {question.questionType === 'ESSAY' && (
                              <Text
                                fontSize='sm'
                                color='gray.500'
                                fontStyle='italic'
                              >
                                Essay - manual grading required
                              </Text>
                            )}
                          </VStack>

                          <HStack flexShrink={0}>
                            <IconButton
                              aria-label='Edit question'
                              icon={<EditIcon />}
                              size='sm'
                              colorScheme='blue'
                              variant='ghost'
                              onClick={() => handleEditQuestion(question)}
                            />
                            <IconButton
                              aria-label='Delete question'
                              icon={<DeleteIcon />}
                              size='sm'
                              colorScheme='red'
                              variant='ghost'
                              onClick={() => handleDeleteClick(question)}
                            />
                          </HStack>
                        </HStack>
                      </CardBody>
                    </Card>
                  ))}
                </VStack>
              )}
            </VStack>
          </Box>
        </Grid>

        {/* Delete Confirmation Dialog */}
        <AlertDialog
          isOpen={isOpen}
          leastDestructiveRef={cancelRef}
          onClose={onClose}
        >
          <AlertDialogOverlay>
            <AlertDialogContent>
              <AlertDialogHeader fontSize='lg' fontWeight='bold'>
                Delete Question
              </AlertDialogHeader>

              <AlertDialogBody>
                Are you sure you want to delete this question? This action
                cannot be undone.
              </AlertDialogBody>

              <AlertDialogFooter>
                <Button ref={cancelRef} onClick={onClose}>
                  Cancel
                </Button>
                <Button colorScheme='red' onClick={handleDeleteConfirm} ml={3}>
                  Delete
                </Button>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialogOverlay>
        </AlertDialog>

        {/* Bulk Upload Modal */}
        <BulkUploadModal
          isOpen={isBulkUploadOpen}
          onClose={onBulkUploadClose}
          onUpload={handleBulkUpload}
        />
      </VStack>
    </Box>
  );
};

export default QuestionManager;
