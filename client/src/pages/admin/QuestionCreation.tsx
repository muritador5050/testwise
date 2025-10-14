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
  Stack,
  Flex,
} from '@chakra-ui/react';
import {
  DeleteIcon,
  AddIcon,
  EditIcon,
  DragHandleIcon,
} from '@chakra-ui/icons';
import { useLocation, useNavigate } from 'react-router-dom';
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
import { colors, bgStyles, textStyles } from '../../utils/colors';

interface QuestionFormData {
  text: string;
  questionType: QuestionType;
  points: number;
  order: number;
  options: Option[];
  correctAnswer: string;
  isAnswerCorrect: boolean;
}

const QuestionCreation: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const toast = useToast();

  const { testId, title } =
    (location.state as { testId: number; title: string }) || {};

  useEffect(() => {
    if (!testId) {
      navigate('/admin/exams/create');
    }
  }, [testId, navigate]);

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
        ...bgStyles.card,
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
        ...bgStyles.card,
      });

      resetForms();
    } catch {
      toast({
        title: 'Error',
        description: 'Failed to create questions.',
        status: 'error',
        duration: 3000,
        ...bgStyles.card,
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
        ...bgStyles.card,
      });
      resetForms();
    } catch {
      toast({
        title: 'Error',
        description: 'Failed to update question.',
        status: 'error',
        duration: 3000,
        ...bgStyles.card,
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
          ...bgStyles.card,
        });
        onClose();
        setQuestionToDelete(null);
      } catch {
        toast({
          title: 'Error',
          description: 'Failed to delete question.',
          status: 'error',
          duration: 3000,
          ...bgStyles.card,
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
      const form = questionForms[formIndex];

      if (form.questionType === 'MULTIPLE_ANSWER') {
        const newOptions = form.options.map((opt, i) =>
          i === optionIndex ? { ...opt, isCorrect: !opt.isCorrect } : opt
        );
        updateQuestionForm(formIndex, { options: newOptions });
      } else {
        const newOptions = form.options.map((opt, i) => ({
          ...opt,
          isCorrect: i === optionIndex,
        }));
        updateQuestionForm(formIndex, { options: newOptions });
      }
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

  const formatQuestionType = (type: QuestionType): string => {
    return type.toLowerCase().replace('_', ' ');
  };

  if (!testId) return null;

  if (isLoading) {
    return (
      <Box p={{ base: 4, md: 6 }} textAlign='center' {...bgStyles.page}>
        <Text {...textStyles.body}>Loading questions...</Text>
      </Box>
    );
  }

  return (
    <Box p={{ base: 4, md: 6 }} minH='100vh' {...bgStyles.page}>
      <VStack spacing={{ base: 4, md: 6 }} align='stretch'>
        {/* Header */}
        <Flex justify='space-between' align='center' flexWrap='wrap' gap={4}>
          <VStack align='flex-start' spacing={1}>
            <Heading size={{ base: 'md', md: 'lg' }} {...textStyles.heading}>
              Manage Questions
            </Heading>
            <Text
              fontSize={{ base: 'sm', md: 'md' }}
              color={colors.primary}
              fontWeight='semibold'
            >
              Test: {title}
            </Text>
          </VStack>
        </Flex>

        {/* Stats Grid */}
        <SimpleGrid columns={{ base: 1, sm: 3 }} spacing={4}>
          <Box
            p={4}
            bg={colors.primary}
            color='white'
            borderRadius='lg'
            shadow='md'
            border='1px'
            borderColor={colors.border}
          >
            <Text fontWeight='bold' fontSize='sm' opacity={0.9}>
              Total Questions
            </Text>
            <Text fontSize={{ base: '2xl', md: '3xl' }} fontWeight='bold'>
              {questions.length}
            </Text>
          </Box>
          <Box
            p={4}
            bg={colors.success}
            color='white'
            borderRadius='lg'
            shadow='md'
            border='1px'
            borderColor={colors.border}
          >
            <Text fontWeight='bold' fontSize='sm' opacity={0.9}>
              Total Points
            </Text>
            <Text fontSize={{ base: '2xl', md: '3xl' }} fontWeight='bold'>
              {totalPoints}
            </Text>
          </Box>
          <Box
            p={4}
            bg={colors.info}
            color='white'
            borderRadius='lg'
            shadow='md'
            border='1px'
            borderColor={colors.border}
          >
            <Text fontWeight='bold' fontSize='sm' opacity={0.9}>
              Types
            </Text>
            <Text fontSize='sm' noOfLines={2}>
              {questionTypes || 'None'}
            </Text>
          </Box>
        </SimpleGrid>

        {/* Main Content Grid */}
        <Grid
          templateColumns={{ base: '1fr', lg: '1fr 1fr' }}
          gap={{ base: 4, md: 6 }}
        >
          {/* Question Form */}
          <Box
            p={{ base: 4, md: 6 }}
            borderRadius='lg'
            shadow='lg'
            border='2px'
            // borderColor={colors.primaryLight}
            {...bgStyles.card}
          >
            <VStack spacing={4} align='stretch'>
              <Stack
                direction={{ base: 'column', sm: 'row' }}
                justify='space-between'
                align={{ base: 'stretch', sm: 'center' }}
                spacing={2}
              >
                <Heading
                  size={{ base: 'sm', md: 'md' }}
                  {...textStyles.heading}
                >
                  {editingQuestion ? '✏️ Edit Question' : '➕ Create Questions'}
                </Heading>

                {!editingQuestion && (
                  <Button
                    leftIcon={<AddIcon />}
                    bg={colors.success}
                    color='white'
                    _hover={{ bg: colors.success, opacity: 0.9 }}
                    size='sm'
                    onClick={addQuestionForm}
                    width={{ base: 'full', sm: 'auto' }}
                  >
                    Add Another Question
                  </Button>
                )}
              </Stack>

              {!editingQuestion && questionForms.length > 1 && (
                <Alert
                  status='info'
                  borderRadius='md'
                  fontSize='sm'
                  bg={colors.sectionBg}
                  color={colors.textPrimary}
                  border='1px'
                  borderColor={colors.border}
                >
                  <AlertIcon color={colors.info} />
                  Multiple question mode. You can create {
                    questionForms.length
                  }{' '}
                  questions at once.
                </Alert>
              )}

              {questionForms.map((form, formIndex) => (
                <Box
                  key={formIndex}
                  p={4}
                  borderRadius='md'
                  border='1px'
                  borderColor={colors.border}
                  position='relative'
                  bg={colors.cardBg}
                >
                  {!editingQuestion && questionForms.length > 1 && (
                    <>
                      <IconButton
                        aria-label='Remove question'
                        icon={<DeleteIcon />}
                        size='sm'
                        bg={colors.error}
                        color='white'
                        _hover={{ bg: colors.error, opacity: 0.9 }}
                        variant='solid'
                        position='absolute'
                        top={2}
                        right={2}
                        onClick={() => removeQuestionForm(formIndex)}
                      />
                      <Badge
                        bg={colors.primary}
                        color='white'
                        position='absolute'
                        top={2}
                        left={2}
                      >
                        Question {formIndex + 1}
                      </Badge>
                    </>
                  )}

                  <VStack
                    spacing={4}
                    align='stretch'
                    mt={questionForms.length > 1 ? 6 : 0}
                  >
                    <FormControl isRequired>
                      <FormLabel
                        fontWeight='semibold'
                        fontSize={{ base: 'sm', md: 'md' }}
                        {...textStyles.heading}
                      >
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
                        _hover={{ borderColor: colors.primaryLight }}
                        _focus={{
                          borderColor: colors.primary,
                          boxShadow: `0 0 0 1px ${colors.primary}`,
                        }}
                        fontSize={{ base: 'sm', md: 'md' }}
                        bg={colors.cardBg}
                        color={colors.textPrimary}
                      />
                    </FormControl>

                    <Stack
                      direction={{ base: 'column', md: 'row' }}
                      spacing={3}
                    >
                      <FormControl flex={{ base: 1, md: 2 }}>
                        <FormLabel
                          fontWeight='semibold'
                          fontSize={{ base: 'sm', md: 'md' }}
                          {...textStyles.heading}
                        >
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
                          _hover={{ borderColor: colors.primaryLight }}
                          fontSize={{ base: 'sm', md: 'md' }}
                          bg={colors.cardBg}
                          color={colors.textPrimary}
                        >
                          <option
                            style={{
                              color: 'white',
                            }}
                            value='MULTIPLE_CHOICE'
                          >
                            Multiple Choice
                          </option>
                          <option
                            style={{
                              color: 'white',
                            }}
                            value='MULTIPLE_ANSWER'
                          >
                            Multiple Answer
                          </option>
                          <option
                            style={{
                              color: 'white',
                            }}
                            value='TRUE_FALSE'
                          >
                            True/False
                          </option>
                          <option
                            style={{
                              color: 'white',
                            }}
                            value='SHORT_ANSWER'
                          >
                            Short Answer
                          </option>
                          <option
                            style={{
                              color: 'white',
                            }}
                            value='ESSAY'
                          >
                            Essay
                          </option>
                        </Select>
                      </FormControl>

                      <FormControl flex={1} isRequired>
                        <FormLabel
                          fontWeight='semibold'
                          fontSize={{ base: 'sm', md: 'md' }}
                          {...textStyles.heading}
                        >
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
                          size={{ base: 'sm', md: 'md' }}
                        >
                          <NumberInputField
                            borderColor={colors.border}
                            bg={colors.cardBg}
                            color={colors.textPrimary}
                          />
                          <NumberInputStepper>
                            <NumberIncrementStepper />
                            <NumberDecrementStepper />
                          </NumberInputStepper>
                        </NumberInput>
                      </FormControl>

                      <FormControl flex={1}>
                        <FormLabel
                          fontWeight='semibold'
                          fontSize={{ base: 'sm', md: 'md' }}
                          {...textStyles.heading}
                        >
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
                          size={{ base: 'sm', md: 'md' }}
                        >
                          <NumberInputField
                            borderColor={colors.border}
                            bg={colors.cardBg}
                            color={colors.textPrimary}
                          />
                        </NumberInput>
                      </FormControl>
                    </Stack>

                    {[
                      'MULTIPLE_CHOICE',
                      'TRUE_FALSE',
                      'MULTIPLE_ANSWER',
                    ].includes(form.questionType) && (
                      <FormControl>
                        <FormLabel
                          fontWeight='semibold'
                          fontSize={{ base: 'sm', md: 'md' }}
                          {...textStyles.heading}
                        >
                          Options (Check the correct answer
                          {form.questionType === 'MULTIPLE_ANSWER' ? 's' : ''})
                        </FormLabel>
                        <VStack spacing={2} align='stretch'>
                          {form.options.map((option, optionIndex) => (
                            <HStack
                              key={option.id}
                              p={2}
                              borderWidth='1px'
                              borderColor={
                                option.isCorrect
                                  ? colors.success
                                  : colors.border
                              }
                              borderRadius='md'
                              spacing={2}
                              bg={colors.cardBg}
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
                                size={{ base: 'md', md: 'lg' }}
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
                                borderColor={colors.border}
                                _hover={{ borderColor: colors.primaryLight }}
                                size={{ base: 'sm', md: 'md' }}
                                bg={colors.cardBg}
                                color={colors.textPrimary}
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
                                  _hover={{ bg: colors.error, opacity: 0.9 }}
                                  variant='solid'
                                  flexShrink={0}
                                />
                              )}
                            </HStack>
                          ))}
                          {['MULTIPLE_CHOICE', 'MULTIPLE_ANSWER'].includes(
                            form.questionType
                          ) && (
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
                        <Stack
                          direction={{ base: 'column', sm: 'row' }}
                          justify='space-between'
                          align={{ base: 'stretch', sm: 'center' }}
                          mb={2}
                          spacing={2}
                        >
                          <FormLabel
                            fontWeight='semibold'
                            mb={0}
                            fontSize={{ base: 'sm', md: 'md' }}
                            {...textStyles.heading}
                          >
                            Expected Answer (Optional)
                          </FormLabel>
                          <HStack
                            spacing={2}
                            justify={{ base: 'flex-start', sm: 'flex-end' }}
                          >
                            <Text fontSize='sm' {...textStyles.body}>
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
                        </Stack>
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
                          _hover={{
                            borderColor: form.isAnswerCorrect
                              ? colors.success
                              : colors.primaryLight,
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
                          fontSize={{ base: 'sm', md: 'md' }}
                          bg={colors.cardBg}
                          color={colors.textPrimary}
                        />
                        <Alert
                          status='info'
                          borderRadius='md'
                          mt={2}
                          fontSize='sm'
                          bg={colors.sectionBg}
                          color={colors.textPrimary}
                          border='1px'
                          borderColor={colors.border}
                        >
                          <AlertIcon color={colors.info} />
                          {form.questionType === 'SHORT_ANSWER'
                            ? 'Short answer questions require manual grading.'
                            : 'Essay questions require manual grading and review.'}
                        </Alert>
                      </FormControl>
                    )}
                  </VStack>
                </Box>
              ))}

              <Stack
                direction={{ base: 'column', sm: 'row' }}
                justify='flex-end'
                pt={4}
                spacing={2}
              >
                <Button
                  variant='outline'
                  borderColor={colors.border}
                  color={colors.textSecondary}
                  _hover={{ bg: colors.sectionBg }}
                  onClick={resetForms}
                  width={{ base: 'full', sm: 'auto' }}
                >
                  Cancel
                </Button>
                <Button
                  bg={colors.primary}
                  color='white'
                  _hover={{ bg: colors.primaryHover }}
                  onClick={
                    editingQuestion ? handleUpdateQuestion : handleAddQuestions
                  }
                  isLoading={
                    createQuestion.isPending || updateQuestion.isPending
                  }
                  width={{ base: 'full', sm: 'auto' }}
                >
                  {editingQuestion
                    ? 'Update'
                    : `Create ${
                        questionForms.length > 1
                          ? `${questionForms.length} Questions`
                          : 'Question'
                      }`}
                </Button>
              </Stack>
            </VStack>
          </Box>

          {/* Questions List */}
          <Box
            p={{ base: 4, md: 6 }}
            borderRadius='lg'
            shadow='lg'
            border='2px'
            {...bgStyles.card}
          >
            <VStack spacing={4} align='stretch'>
              <Heading size={{ base: 'sm', md: 'md' }} {...textStyles.heading}>
                📝 Questions List
              </Heading>

              {questions.length === 0 ? (
                <Box textAlign='center' py={12}>
                  <Text fontSize='6xl' mb={4}>
                    📋
                  </Text>
                  <Text
                    fontSize={{ base: 'sm', md: 'md' }}
                    {...textStyles.body}
                  >
                    No questions added yet.
                  </Text>
                  <Text fontSize='sm' mt={2} {...textStyles.muted}>
                    Create your first question using the form.
                  </Text>
                </Box>
              ) : (
                <VStack
                  spacing={4}
                  align='stretch'
                  maxH={{ base: '400px', md: '600px' }}
                  overflowY='auto'
                  pr={2}
                >
                  {sortedQuestions.map((question) => (
                    <Card
                      key={question.id}
                      variant='outline'
                      _hover={{ borderColor: colors.primaryLight }}
                      {...bgStyles.card}
                    >
                      <CardBody p={{ base: 3, md: 4 }}>
                        <Flex direction={{ base: 'column', sm: 'row' }} gap={3}>
                          <Box display={{ base: 'none', sm: 'block' }}>
                            <DragHandleIcon
                              cursor='grab'
                              mt={1}
                              color={colors.textSecondary}
                            />
                          </Box>

                          <VStack flex={1} align='stretch' spacing={2}>
                            <Flex flexWrap='wrap' gap={2}>
                              <Badge
                                variant='outline'
                                color={colors.textSecondary}
                                borderColor={colors.border}
                              >
                                #{question.order}
                              </Badge>
                              <Badge bg={colors.primary} color='white'>
                                {formatQuestionType(question.questionType)}
                              </Badge>
                              <Badge bg={colors.warning} color='white'>
                                {question.points} pt
                                {question.points !== 1 ? 's' : ''}
                              </Badge>
                            </Flex>

                            <Text
                              fontWeight='medium'
                              fontSize={{ base: 'sm', md: 'md' }}
                              {...textStyles.heading}
                            >
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
                                              ? colors.success
                                              : colors.border
                                          }
                                          flexShrink={0}
                                        />
                                        <Text
                                          fontSize='sm'
                                          color={
                                            option.isCorrect
                                              ? colors.success
                                              : colors.textSecondary
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

                            {['SHORT_ANSWER', 'ESSAY'].includes(
                              question.questionType
                            ) &&
                              question.options &&
                              question.options.length > 0 && (
                                <Box
                                  p={3}
                                  bg={colors.sectionBg}
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
                                    color={colors.textPrimary}
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
                                  fontStyle='italic'
                                  {...textStyles.muted}
                                >
                                  Manual grading required
                                </Text>
                              )}

                            {question.questionType === 'ESSAY' &&
                              (!question.options ||
                                question.options.length === 0) && (
                                <Text
                                  fontSize='sm'
                                  {...textStyles.muted}
                                  fontStyle='italic'
                                >
                                  Essay - manual grading required
                                </Text>
                              )}
                          </VStack>

                          <HStack
                            flexShrink={0}
                            alignSelf={{ base: 'flex-end', sm: 'flex-start' }}
                          >
                            <IconButton
                              aria-label='Edit question'
                              icon={<EditIcon />}
                              size='sm'
                              bg={colors.primary}
                              color='white'
                              _hover={{ bg: colors.primaryHover }}
                              variant='solid'
                              onClick={() => handleEditQuestion(question)}
                            />
                            <IconButton
                              aria-label='Delete question'
                              icon={<DeleteIcon />}
                              size='sm'
                              bg={colors.error}
                              color='white'
                              _hover={{ bg: colors.error, opacity: 0.9 }}
                              variant='solid'
                              onClick={() => handleDeleteClick(question)}
                            />
                          </HStack>
                        </Flex>
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
            <AlertDialogContent mx={4} {...bgStyles.card}>
              <AlertDialogHeader
                fontSize='lg'
                fontWeight='bold'
                {...textStyles.heading}
              >
                Delete Question
              </AlertDialogHeader>

              <AlertDialogBody {...textStyles.body}>
                Are you sure you want to delete this question? This action
                cannot be undone.
              </AlertDialogBody>

              <AlertDialogFooter>
                <Button
                  ref={cancelRef}
                  onClick={onClose}
                  size={{ base: 'sm', md: 'md' }}
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
                  _hover={{ bg: colors.error, opacity: 0.9 }}
                  onClick={handleDeleteConfirm}
                  ml={3}
                  isLoading={deleteQuestion.isPending}
                  size={{ base: 'sm', md: 'md' }}
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

export default QuestionCreation;
