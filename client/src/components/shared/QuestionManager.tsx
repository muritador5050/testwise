import React, { useState, useCallback, useRef, useEffect } from 'react';
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
  useToast,
} from '@chakra-ui/react';
import {
  DeleteIcon,
  AddIcon,
  EditIcon,
  DragHandleIcon,
  ArrowBackIcon,
} from '@chakra-ui/icons';
import { useLocation, useNavigate } from 'react-router-dom';
import { colors, bgStyles, buttonStyles } from '../../utils/colors';

import {
  useCreateQuestion,
  useGetQuestionsByTest,
  useUpdateQuestion,
  useDeleteQuestion,
} from '../../api/services/questionServices';
import type {
  Option,
  Question,
  QuestionType,
  CreateQuestion,
} from '../../types/api';

interface QuestionFormData {
  text: string;
  questionType: QuestionType;
  points: number;
  order: number;
  options: Option[];
  correctAnswer: string;
  isAnswerCorrect: boolean;
}

const QuestionManager: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const toast = useToast();

  const { testId, title } =
    (location.state as { testId: number; title: string }) || {};

  useEffect(() => {
    if (!testId) {
      toast({
        title: 'Error',
        description: 'No test selected. Redirecting to tests page.',
        status: 'error',
        duration: 3000,
      });
      navigate('/instructor/tests');
    }
  }, [testId, navigate, toast]);

  const { data: questionsData, isLoading } = useGetQuestionsByTest(testId);
  const createQuestion = useCreateQuestion();
  const updateQuestion = useUpdateQuestion();
  const deleteQuestion = useDeleteQuestion();

  const [editingQuestion, setEditingQuestion] = useState<Question | null>(null);
  const [questionForms, setQuestionForms] = useState<QuestionFormData[]>([
    {
      text: '',
      questionType: 'MULTIPLE_CHOICE',
      points: 1.0,
      order: 1,
      options: [
        { id: 1, text: '', isCorrect: false, order: 1, questionId: 0 },
        { id: 2, text: '', isCorrect: false, order: 2, questionId: 0 },
      ],
      correctAnswer: '',
      isAnswerCorrect: true,
    },
  ]);

  const { isOpen, onOpen, onClose } = useDisclosure();

  const [questionToDelete, setQuestionToDelete] = useState<Question | null>(
    null
  );
  const cancelRef = useRef<HTMLButtonElement>(null);

  const questions = questionsData || [];

  const resetForms = useCallback(() => {
    setQuestionForms([
      {
        text: '',
        questionType: 'MULTIPLE_CHOICE',
        points: 1.0,
        order: questions.length + 1,
        options: [
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
        ],
        correctAnswer: '',
        isAnswerCorrect: true,
      },
    ]);
    setEditingQuestion(null);
  }, [questions.length]);

  const addQuestionForm = useCallback(() => {
    setQuestionForms((prev) => [
      ...prev,
      {
        text: '',
        questionType: 'MULTIPLE_CHOICE',
        points: 1.0,
        order: questions.length + prev.length + 1,
        options: [
          {
            id: Date.now() + prev.length * 10 + 1,
            text: '',
            isCorrect: false,
            order: 1,
            questionId: 0,
          },
          {
            id: Date.now() + prev.length * 10 + 2,
            text: '',
            isCorrect: false,
            order: 2,
            questionId: 0,
          },
        ],
        correctAnswer: '',
        isAnswerCorrect: true,
      },
    ]);
  }, [questions.length]);

  const removeQuestionForm = useCallback(
    (index: number) => {
      if (questionForms.length > 1) {
        setQuestionForms((prev) => prev.filter((_, i) => i !== index));
      }
    },
    [questionForms.length]
  );

  const updateQuestionForm = useCallback(
    (index: number, updates: Partial<QuestionFormData>) => {
      setQuestionForms((prev) =>
        prev.map((form, i) => (i === index ? { ...form, ...updates } : form))
      );
    },
    []
  );

  const handleAddQuestions = useCallback(async () => {
    const validForms = questionForms.filter((form) => form.text.trim() !== '');

    if (validForms.length === 0) {
      toast({
        title: 'Error',
        description: 'Please add at least one question with text.',
        status: 'error',
        duration: 3000,
      });
      return;
    }

    try {
      for (const form of validForms) {
        let questionData: CreateQuestion;

        if (['SHORT_ANSWER', 'ESSAY'].includes(form.questionType)) {
          questionData = {
            text: form.text,
            questionType: form.questionType,
            points: form.points,
            order: form.order,
            options: form.correctAnswer.trim()
              ? [
                  {
                    text: form.correctAnswer,
                    isCorrect: form.isAnswerCorrect,
                    order: 1,
                  },
                ]
              : [],
          };
        } else {
          questionData = {
            text: form.text,
            questionType: form.questionType,
            points: form.points,
            order: form.order,
            options: form.options
              .filter((opt) => opt.text.trim())
              .map((opt) => ({
                text: opt.text,
                isCorrect: opt.isCorrect,
                order: opt.order,
              })),
          };
        }

        await createQuestion.mutateAsync({ testId, questionData });
      }

      toast({
        title: 'Success',
        description: `${validForms.length} question(s) created successfully.`,
        status: 'success',
        duration: 3000,
      });

      resetForms();
    } catch {
      toast({
        title: 'Error',
        description: 'Failed to create questions.',
        status: 'error',
        duration: 3000,
      });
    }
  }, [questionForms, testId, createQuestion, toast, resetForms]);

  const handleUpdateQuestion = useCallback(async () => {
    if (!editingQuestion) return;

    const form = questionForms[0];
    let questionData: Partial<CreateQuestion>;

    if (['SHORT_ANSWER', 'ESSAY'].includes(form.questionType)) {
      questionData = {
        text: form.text,
        questionType: form.questionType,
        points: form.points,
        order: form.order,
        options: form.correctAnswer.trim()
          ? [
              {
                text: form.correctAnswer,
                isCorrect: form.isAnswerCorrect,
                order: 1,
              },
            ]
          : [],
      };
    } else {
      questionData = {
        text: form.text,
        questionType: form.questionType,
        points: form.points,
        order: form.order,
        options: form.options
          .filter((opt) => opt.text.trim())
          .map((opt) => ({
            id: opt.id,
            text: opt.text,
            isCorrect: opt.isCorrect,
            order: opt.order,
          })),
      };
    }

    try {
      await updateQuestion.mutateAsync({
        id: editingQuestion.id,
        questionData,
        testId,
      });
      toast({
        title: 'Success',
        description: 'Question updated successfully.',
        status: 'success',
        duration: 3000,
      });
      resetForms();
    } catch {
      toast({
        title: 'Error',
        description: 'Failed to update question.',
        status: 'error',
        duration: 3000,
      });
    }
  }, [
    questionForms,
    editingQuestion,
    testId,
    updateQuestion,
    toast,
    resetForms,
  ]);

  const handleEditQuestion = useCallback((question: Question) => {
    setEditingQuestion(question);
    setQuestionForms([
      {
        text: question.text,
        questionType: question.questionType,
        points: question.points,
        order: question.order,
        options:
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
              ],
        correctAnswer:
          question.options && question.options.length > 0
            ? question.options[0].text
            : '',
        isAnswerCorrect:
          question.options && question.options.length > 0
            ? question.options[0].isCorrect
            : true,
      },
    ]);

    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  const handleDeleteClick = useCallback(
    (question: Question) => {
      setQuestionToDelete(question);
      onOpen();
    },
    [onOpen]
  );

  const handleDeleteConfirm = useCallback(async () => {
    if (questionToDelete) {
      try {
        await deleteQuestion.mutateAsync({ id: questionToDelete.id, testId });
        toast({
          title: 'Success',
          description: 'Question deleted successfully.',
          status: 'success',
          duration: 3000,
        });
        onClose();
        setQuestionToDelete(null);
      } catch {
        toast({
          title: 'Error',
          description: 'Failed to delete question.',
          status: 'error',
          duration: 3000,
        });
      }
    }
  }, [questionToDelete, testId, deleteQuestion, toast, onClose]);

  const handleOptionChange = useCallback(
    (
      formIndex: number,
      optionIndex: number,
      field: keyof Option,
      value: string | boolean
    ) => {
      const newOptions = [...questionForms[formIndex].options];
      newOptions[optionIndex] = { ...newOptions[optionIndex], [field]: value };
      updateQuestionForm(formIndex, { options: newOptions });
    },
    [questionForms, updateQuestionForm]
  );

  const handleCorrectOptionChange = useCallback(
    (formIndex: number, optionIndex: number) => {
      const newOptions = questionForms[formIndex].options.map((opt, i) => ({
        ...opt,
        isCorrect: i === optionIndex,
      }));
      updateQuestionForm(formIndex, { options: newOptions });
    },
    [questionForms, updateQuestionForm]
  );

  const addOption = useCallback(
    (formIndex: number) => {
      const currentOptions = questionForms[formIndex].options;
      const newId = Math.max(0, ...currentOptions.map((o) => o.id)) + 1;
      const newOptions = [
        ...currentOptions,
        {
          id: newId,
          text: '',
          isCorrect: false,
          order: currentOptions.length + 1,
          questionId: 0,
        },
      ];
      updateQuestionForm(formIndex, { options: newOptions });
    },
    [questionForms, updateQuestionForm]
  );

  const removeOption = useCallback(
    (formIndex: number, optionIndex: number) => {
      const currentOptions = questionForms[formIndex].options;
      if (currentOptions.length > 2) {
        const newOptions = currentOptions.filter((_, i) => i !== optionIndex);
        updateQuestionForm(formIndex, {
          options: newOptions.map((opt, i) => ({ ...opt, order: i + 1 })),
        });
      }
    },
    [questionForms, updateQuestionForm]
  );

  const totalPoints = questions.reduce((sum, q) => sum + q.points, 0);
  const questionTypes = Array.from(
    new Set(questions.map((q) => q.questionType))
  ).join(', ');
  const sortedQuestions = [...questions].sort((a, b) => a.order - b.order);

  const getQuestionTypeColor = (type: QuestionType): string => {
    switch (type) {
      case 'MULTIPLE_CHOICE':
        return colors.primary;
      case 'TRUE_FALSE':
        return colors.success;
      case 'SHORT_ANSWER':
        return colors.warning;
      case 'ESSAY':
        return '#a855f7';
      default:
        return colors.textMuted;
    }
  };

  const formatQuestionType = (type: QuestionType): string => {
    return type.toLowerCase().replace('_', ' ');
  };

  if (!testId) return null;

  if (isLoading) {
    return (
      <Box p={6} textAlign='center' minH='100vh' bg={colors.pageBg}>
        <Text color={colors.textSecondary}>Loading questions...</Text>
      </Box>
    );
  }

  return (
    <Box p={6} minH='100vh' bg={colors.pageBg}>
      <IconButton
        aria-label='back'
        icon={<ArrowBackIcon />}
        onClick={() => navigate('/instructor/exams/create')}
        mb={4}
        borderColor={colors.border}
        color={colors.textPrimary}
        _hover={{ bg: colors.sectionBg }}
      />
      <VStack spacing={6} align='stretch'>
        <HStack justify='space-between' align='center' flexWrap='wrap'>
          <VStack align='flex-start' spacing={1}>
            <Heading size='lg' color={colors.textPrimary}>
              Manage Questions
            </Heading>
            <Text fontSize='md' color={colors.primary} fontWeight='semibold'>
              Test: {title}
            </Text>
          </VStack>
        </HStack>

        <SimpleGrid columns={{ base: 1, md: 3 }} spacing={4}>
          <Box
            p={5}
            bgGradient={`linear(to-br, ${colors.primary}, ${colors.primaryHover})`}
            color='white'
            borderRadius='lg'
            shadow='lg'
          >
            <Text fontWeight='bold' fontSize='sm' opacity={0.95} mb={1}>
              Total Questions
            </Text>
            <Text fontSize='3xl' fontWeight='bold'>
              {questions.length}
            </Text>
          </Box>
          <Box
            p={5}
            bgGradient={`linear(to-br, ${colors.success}, #059669)`}
            color='white'
            borderRadius='lg'
            shadow='lg'
          >
            <Text fontWeight='bold' fontSize='sm' opacity={0.95} mb={1}>
              Total Points
            </Text>
            <Text fontSize='3xl' fontWeight='bold'>
              {totalPoints}
            </Text>
          </Box>
          <Box
            p={5}
            bgGradient='linear(to-br, #a855f7, #9333ea)'
            color='white'
            borderRadius='lg'
            shadow='lg'
          >
            <Text fontWeight='bold' fontSize='sm' opacity={0.95} mb={1}>
              Types
            </Text>
            <Text fontSize='sm' noOfLines={2}>
              {questionTypes || 'None'}
            </Text>
          </Box>
        </SimpleGrid>

        <Grid templateColumns={{ base: '1fr', lg: '1fr 1fr' }} gap={6}>
          <Box
            p={6}
            {...bgStyles.card}
            borderRadius='lg'
            shadow='xl'
            borderWidth='2px'
            borderColor={colors.primary}
          >
            <VStack spacing={4} align='stretch'>
              <HStack justify='space-between' align='center'>
                <Heading size='md' color={colors.textPrimary}>
                  {editingQuestion ? '✏️ Edit Question' : '➕ Create Questions'}
                </Heading>

                {!editingQuestion && (
                  <Button
                    leftIcon={<AddIcon />}
                    bg={colors.success}
                    color='white'
                    _hover={{ bg: '#059669' }}
                    size='sm'
                    onClick={addQuestionForm}
                  >
                    Add Another Question
                  </Button>
                )}
              </HStack>

              {!editingQuestion && questionForms.length > 1 && (
                <Alert
                  status='info'
                  borderRadius='md'
                  fontSize='sm'
                  bg={colors.sectionBg}
                  borderColor={colors.info}
                >
                  <AlertIcon color={colors.info} />
                  <Text color={colors.textSecondary}>
                    Multiple question mode. You can create{' '}
                    {questionForms.length} questions at once.
                  </Text>
                </Alert>
              )}

              {questionForms.map((form, formIndex) => (
                <Box
                  key={formIndex}
                  p={4}
                  borderRadius='md'
                  borderWidth='2px'
                  borderColor={colors.border}
                  bg={colors.cardBg}
                  position='relative'
                >
                  {!editingQuestion && questionForms.length > 1 && (
                    <IconButton
                      aria-label='Remove question'
                      icon={<DeleteIcon />}
                      size='sm'
                      bg={colors.error}
                      color='white'
                      _hover={{ bg: '#dc2626' }}
                      variant='solid'
                      position='absolute'
                      top={2}
                      right={2}
                      onClick={() => removeQuestionForm(formIndex)}
                    />
                  )}

                  {!editingQuestion && questionForms.length > 1 && (
                    <Badge
                      bg={colors.primary}
                      color='white'
                      position='absolute'
                      top={2}
                      left={2}
                      px={3}
                      py={1}
                      borderRadius='full'
                    >
                      Question {formIndex + 1}
                    </Badge>
                  )}

                  <VStack
                    spacing={4}
                    align='stretch'
                    mt={questionForms.length > 1 ? 6 : 0}
                  >
                    <FormControl isRequired>
                      <FormLabel fontWeight='600' color={colors.textPrimary}>
                        Question Text
                      </FormLabel>
                      <Textarea
                        value={form.text}
                        onChange={(e) =>
                          updateQuestionForm(formIndex, {
                            text: e.target.value,
                          })
                        }
                        placeholder='Enter your question here...'
                        rows={2}
                        borderColor={colors.border}
                        color={colors.textPrimary}
                        _hover={{ borderColor: colors.primary }}
                        _focus={{
                          borderColor: colors.primary,
                          boxShadow: `0 0 0 1px ${colors.primary}`,
                        }}
                        _placeholder={{ color: colors.textMuted }}
                      />
                    </FormControl>

                    <HStack width='100%' align='flex-start' spacing={3}>
                      <FormControl flex={2}>
                        <FormLabel fontWeight='600' color={colors.textPrimary}>
                          Question Type
                        </FormLabel>
                        <Select
                          value={form.questionType}
                          onChange={(e) =>
                            updateQuestionForm(formIndex, {
                              questionType: e.target.value as QuestionType,
                            })
                          }
                          borderColor={colors.border}
                          color={colors.textPrimary}
                          _hover={{ borderColor: colors.primary }}
                        >
                          <option value='MULTIPLE_CHOICE'>
                            Multiple Choice
                          </option>
                          <option value='TRUE_FALSE'>True/False</option>
                          <option value='SHORT_ANSWER'>Short Answer</option>
                          <option value='ESSAY'>Essay</option>
                        </Select>
                      </FormControl>

                      <FormControl flex={1} isRequired>
                        <FormLabel fontWeight='600' color={colors.textPrimary}>
                          Points
                        </FormLabel>
                        <NumberInput
                          value={form.points}
                          onChange={(_valueString, valueNumber) =>
                            updateQuestionForm(formIndex, {
                              points: valueNumber,
                            })
                          }
                          min={0.5}
                          step={0.5}
                          precision={1}
                        >
                          <NumberInputField
                            borderColor={colors.border}
                            color={colors.textPrimary}
                          />
                          <NumberInputStepper>
                            <NumberIncrementStepper
                              borderColor={colors.border}
                            />
                            <NumberDecrementStepper
                              borderColor={colors.border}
                            />
                          </NumberInputStepper>
                        </NumberInput>
                      </FormControl>

                      <FormControl flex={1}>
                        <FormLabel fontWeight='600' color={colors.textPrimary}>
                          Order
                        </FormLabel>
                        <NumberInput
                          value={form.order}
                          onChange={(_valueString, valueNumber) =>
                            updateQuestionForm(formIndex, {
                              order: valueNumber,
                            })
                          }
                          min={1}
                        >
                          <NumberInputField
                            borderColor={colors.border}
                            color={colors.textPrimary}
                          />
                        </NumberInput>
                      </FormControl>
                    </HStack>

                    {['MULTIPLE_CHOICE', 'TRUE_FALSE'].includes(
                      form.questionType
                    ) && (
                      <FormControl>
                        <FormLabel fontWeight='600' color={colors.textPrimary}>
                          Options (Check the correct answer)
                        </FormLabel>
                        <VStack spacing={2} align='stretch'>
                          {form.options.map((option, optionIndex) => (
                            <HStack
                              key={option.id}
                              p={3}
                              borderWidth='2px'
                              borderColor={
                                option.isCorrect
                                  ? colors.success
                                  : colors.border
                              }
                              bg={option.isCorrect ? '#f0fdf4' : colors.cardBg}
                              borderRadius='md'
                            >
                              <Checkbox
                                isChecked={option.isCorrect}
                                onChange={() =>
                                  handleCorrectOptionChange(
                                    formIndex,
                                    optionIndex
                                  )
                                }
                                colorScheme='green'
                                size='lg'
                              />
                              <Input
                                value={option.text}
                                onChange={(e) =>
                                  handleOptionChange(
                                    formIndex,
                                    optionIndex,
                                    'text',
                                    e.target.value
                                  )
                                }
                                placeholder={`Option ${optionIndex + 1}`}
                                borderColor='transparent'
                                color={colors.textPrimary}
                                _hover={{ borderColor: colors.primary }}
                                _placeholder={{ color: colors.textMuted }}
                              />
                              {form.options.length > 2 && (
                                <IconButton
                                  aria-label='Remove option'
                                  icon={<DeleteIcon />}
                                  onClick={() =>
                                    removeOption(formIndex, optionIndex)
                                  }
                                  size='sm'
                                  bg={colors.error}
                                  color='white'
                                  _hover={{ bg: '#dc2626' }}
                                />
                              )}
                            </HStack>
                          ))}
                          {form.questionType === 'MULTIPLE_CHOICE' && (
                            <Button
                              leftIcon={<AddIcon />}
                              onClick={() => addOption(formIndex)}
                              size='sm'
                              variant='outline'
                              borderColor={colors.primary}
                              color={colors.primary}
                              _hover={{ bg: colors.sectionBg }}
                              alignSelf='flex-start'
                            >
                              Add Option
                            </Button>
                          )}
                        </VStack>
                      </FormControl>
                    )}

                    {['SHORT_ANSWER', 'ESSAY'].includes(form.questionType) && (
                      <FormControl>
                        <HStack justify='space-between' align='center' mb={2}>
                          <FormLabel
                            fontWeight='600'
                            color={colors.textPrimary}
                            mb={0}
                          >
                            Expected Answer (Optional)
                          </FormLabel>
                          <HStack spacing={2}>
                            <Text fontSize='sm' color={colors.textSecondary}>
                              Mark as correct
                            </Text>
                            <Checkbox
                              isChecked={form.isAnswerCorrect}
                              onChange={(e) =>
                                updateQuestionForm(formIndex, {
                                  isAnswerCorrect: e.target.checked,
                                })
                              }
                              colorScheme='green'
                            />
                          </HStack>
                        </HStack>
                        <Textarea
                          value={form.correctAnswer}
                          onChange={(e) =>
                            updateQuestionForm(formIndex, {
                              correctAnswer: e.target.value,
                            })
                          }
                          placeholder='Enter the expected/sample answer here...'
                          rows={3}
                          borderWidth='2px'
                          borderColor={
                            form.isAnswerCorrect
                              ? colors.success
                              : colors.border
                          }
                          bg={form.isAnswerCorrect ? '#f0fdf4' : colors.cardBg}
                          color={colors.textPrimary}
                          _hover={{
                            borderColor: form.isAnswerCorrect
                              ? '#059669'
                              : colors.primary,
                          }}
                          _focus={{
                            borderColor: form.isAnswerCorrect
                              ? colors.success
                              : colors.primary,
                            boxShadow: `0 0 0 1px ${
                              form.isAnswerCorrect
                                ? colors.success
                                : colors.primary
                            }`,
                          }}
                          _placeholder={{ color: colors.textMuted }}
                        />
                        <Alert
                          status='info'
                          borderRadius='md'
                          mt={2}
                          fontSize='sm'
                          bg={colors.sectionBg}
                          borderColor={colors.info}
                        >
                          <AlertIcon color={colors.info} />
                          <Text color={colors.textSecondary}>
                            {form.questionType === 'SHORT_ANSWER'
                              ? 'Short answer questions require manual grading.'
                              : 'Essay questions require manual grading and review.'}
                          </Text>
                        </Alert>
                      </FormControl>
                    )}
                  </VStack>
                </Box>
              ))}

              <HStack justify='flex-end' pt={4}>
                <Button
                  variant='outline'
                  onClick={resetForms}
                  borderColor={colors.border}
                  color={colors.textSecondary}
                  _hover={{ bg: colors.sectionBg }}
                >
                  Cancel
                </Button>
                <Button
                  {...buttonStyles.primary}
                  onClick={
                    editingQuestion ? handleUpdateQuestion : handleAddQuestions
                  }
                  isLoading={
                    createQuestion.isPending || updateQuestion.isPending
                  }
                >
                  {editingQuestion
                    ? 'Update'
                    : `Create ${
                        questionForms.length > 1
                          ? `${questionForms.length} Questions`
                          : 'Question'
                      }`}
                </Button>
              </HStack>
            </VStack>
          </Box>

          {/* Questions List */}
          <Box
            p={6}
            {...bgStyles.card}
            borderRadius='lg'
            shadow='xl'
            borderWidth='2px'
            borderColor='#a855f7'
          >
            <VStack spacing={4} align='stretch'>
              <Heading size='md' color={colors.textPrimary}>
                📝 Questions List
              </Heading>

              {questions.length === 0 ? (
                <Box
                  textAlign='center'
                  py={12}
                  px={4}
                  bg={colors.sectionBg}
                  borderRadius='lg'
                >
                  <Text fontSize='6xl' mb={4}>
                    📋
                  </Text>
                  <Text color={colors.textPrimary} fontWeight='500'>
                    No questions added yet.
                  </Text>
                  <Text fontSize='sm' mt={2} color={colors.textMuted}>
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
                  css={{
                    '&::-webkit-scrollbar': {
                      width: '8px',
                    },
                    '&::-webkit-scrollbar-track': {
                      background: colors.sectionBg,
                      borderRadius: '4px',
                    },
                    '&::-webkit-scrollbar-thumb': {
                      background: colors.border,
                      borderRadius: '4px',
                    },
                    '&::-webkit-scrollbar-thumb:hover': {
                      background: colors.textMuted,
                    },
                  }}
                >
                  {sortedQuestions.map((question) => (
                    <Card
                      key={question.id}
                      variant='outline'
                      borderWidth='2px'
                      borderColor={colors.border}
                      bg={colors.cardBg}
                      _hover={{ borderColor: colors.primary, shadow: 'md' }}
                      transition='all 0.2s'
                    >
                      <CardBody>
                        <HStack align='start' spacing={3}>
                          <DragHandleIcon
                            color={colors.textMuted}
                            cursor='grab'
                            mt={1}
                          />

                          <VStack flex={1} align='stretch' spacing={2}>
                            <HStack flexWrap='wrap' spacing={2}>
                              <Badge
                                variant='solid'
                                bg={colors.sectionBg}
                                color={colors.textPrimary}
                                px={2}
                                py={1}
                                borderRadius='full'
                              >
                                #{question.order}
                              </Badge>
                              <Badge
                                bg={getQuestionTypeColor(question.questionType)}
                                color='white'
                                px={3}
                                py={1}
                                borderRadius='full'
                                textTransform='capitalize'
                              >
                                {formatQuestionType(question.questionType)}
                              </Badge>
                              <Badge
                                bg={colors.warning}
                                color='white'
                                px={3}
                                py={1}
                                borderRadius='full'
                              >
                                {question.points} pt
                                {question.points !== 1 ? 's' : ''}
                              </Badge>
                            </HStack>

                            <Text fontWeight='600' color={colors.textPrimary}>
                              {question.text}
                            </Text>

                            {['MULTIPLE_CHOICE', 'TRUE_FALSE'].includes(
                              question.questionType
                            ) &&
                              question.options && (
                                <VStack
                                  align='stretch'
                                  spacing={1}
                                  p={3}
                                  bg={colors.sectionBg}
                                  borderRadius='md'
                                >
                                  {question.options
                                    .sort((a, b) => a.order - b.order)
                                    .map((option) => (
                                      <HStack key={option.id} spacing={2}>
                                        <Box
                                          w={3}
                                          h={3}
                                          borderRadius='full'
                                          bg={
                                            option.isCorrect
                                              ? colors.success
                                              : colors.border
                                          }
                                        />
                                        <Text
                                          fontSize='sm'
                                          color={
                                            option.isCorrect
                                              ? colors.success
                                              : colors.textSecondary
                                          }
                                          fontWeight={
                                            option.isCorrect ? '600' : 'normal'
                                          }
                                        >
                                          {option.text}
                                          {option.isCorrect && ' ✓'}
                                        </Text>
                                      </HStack>
                                    ))}
                                </VStack>
                              )}

                            {['SHORT_ANSWER', 'ESSAY'].includes(
                              question.questionType
                            ) &&
                              question.options &&
                              question.options.length > 0 && (
                                <Box
                                  p={3}
                                  bg='#f0fdf4'
                                  borderRadius='md'
                                  borderWidth='1px'
                                  borderColor={colors.success}
                                >
                                  <Text
                                    fontSize='xs'
                                    fontWeight='bold'
                                    color={colors.success}
                                    mb={1}
                                  >
                                    Expected Answer:
                                  </Text>
                                  <Text
                                    fontSize='sm'
                                    color={colors.textSecondary}
                                  >
                                    {question.options[0].text}
                                  </Text>
                                </Box>
                              )}

                            {question.questionType === 'SHORT_ANSWER' &&
                              (!question.options ||
                                question.options.length === 0) && (
                                <Text
                                  fontSize='sm'
                                  color={colors.textMuted}
                                  fontStyle='italic'
                                >
                                  Manual grading required
                                </Text>
                              )}

                            {question.questionType === 'ESSAY' &&
                              (!question.options ||
                                question.options.length === 0) && (
                                <Text
                                  fontSize='sm'
                                  color={colors.textMuted}
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
                              variant='outline'
                              borderColor={colors.primary}
                              color={colors.primary}
                              _hover={{ bg: colors.sectionBg }}
                              onClick={() => handleEditQuestion(question)}
                            />
                            <IconButton
                              aria-label='Delete question'
                              icon={<DeleteIcon />}
                              size='sm'
                              variant='outline'
                              borderColor={colors.error}
                              color={colors.error}
                              _hover={{ bg: '#fee' }}
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

        <AlertDialog
          isOpen={isOpen}
          leastDestructiveRef={cancelRef}
          onClose={onClose}
        >
          <AlertDialogOverlay bg='blackAlpha.700'>
            <AlertDialogContent bg={colors.cardBg} borderColor={colors.border}>
              <AlertDialogHeader
                fontSize='lg'
                fontWeight='bold'
                color={colors.textPrimary}
              >
                Delete Question
              </AlertDialogHeader>

              <AlertDialogBody color={colors.textSecondary}>
                Are you sure you want to delete this question? This action
                cannot be undone.
              </AlertDialogBody>

              <AlertDialogFooter>
                <Button
                  ref={cancelRef}
                  onClick={onClose}
                  variant='outline'
                  borderColor={colors.border}
                  color={colors.textSecondary}
                  _hover={{ bg: colors.sectionBg }}
                >
                  Cancel
                </Button>
                <Button
                  bg={colors.error}
                  color='white'
                  _hover={{ bg: '#dc2626' }}
                  onClick={handleDeleteConfirm}
                  ml={3}
                  isLoading={deleteQuestion.isPending}
                >
                  Delete
                </Button>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialogOverlay>
        </AlertDialog>
      </VStack>
    </Box>
  );
};

export default QuestionManager;
