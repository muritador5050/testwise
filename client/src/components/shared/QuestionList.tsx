import React, { useRef, useState, useCallback } from 'react';
import {
  Box,
  VStack,
  HStack,
  Text,
  Badge,
  IconButton,
  Card,
  CardBody,
  Stack,
  useDisclosure,
  AlertDialog,
  AlertDialogBody,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogContent,
  AlertDialogOverlay,
  Button,
} from '@chakra-ui/react';
import { EditIcon, DeleteIcon, DragHandleIcon } from '@chakra-ui/icons';
import type { Question, QuestionType } from '../../types/api';
import { colors, bgStyles } from '../../utils/colors';

interface QuestionListProps {
  questions: Question[];
  onEdit: (question: Question) => void;
  onDelete: (questionId: number) => void;
  onReorder: (questions: Question[]) => void;
}

const QuestionList: React.FC<QuestionListProps> = ({
  questions,
  onEdit,
  onDelete,
}) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [questionToDelete, setQuestionToDelete] = useState<Question | null>(
    null
  );
  const cancelRef = useRef<HTMLButtonElement>(null);

  const handleDeleteClick = useCallback(
    (question: Question) => {
      setQuestionToDelete(question);
      onOpen();
    },
    [onOpen]
  );

  const handleDeleteConfirm = useCallback(() => {
    if (questionToDelete) {
      onDelete(questionToDelete.id);
      onClose();
      setQuestionToDelete(null);
    }
  }, [questionToDelete, onDelete, onClose]);

  const getQuestionTypeColor = useCallback((type: QuestionType): string => {
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
  }, []);

  const formatQuestionType = useCallback((type: QuestionType): string => {
    return type.toLowerCase().replace('_', ' ');
  }, []);

  if (questions.length === 0) {
    return (
      <Box
        textAlign='center'
        py={10}
        px={4}
        bg={colors.sectionBg}
        borderRadius='lg'
      >
        <Text color={colors.textMuted} fontSize='lg'>
          No questions added yet. Click "Add Question" to get started.
        </Text>
      </Box>
    );
  }

  const sortedQuestions = [...questions].sort((a, b) => a.order - b.order);

  return (
    <VStack spacing={4} align='stretch'>
      {sortedQuestions.map((question) => (
        <Card
          key={question.id}
          variant='outline'
          {...bgStyles.card}
          boxShadow='md'
          _hover={{ boxShadow: 'lg', borderColor: colors.primary }}
          transition='all 0.2s'
        >
          <CardBody>
            <Stack
              direction={{ base: 'column', md: 'row' }}
              spacing={4}
              align='start'
            >
              {/* Drag Handle and Order */}
              <HStack flexShrink={0}>
                <DragHandleIcon color={colors.textMuted} cursor='grab' />
                <Badge
                  variant='solid'
                  bg={colors.sectionBg}
                  color={colors.textPrimary}
                  fontSize='sm'
                  px={3}
                  py={1}
                  borderRadius='full'
                >
                  {question.order}
                </Badge>
              </HStack>

              {/* Question Content */}
              <Box flex={1}>
                <HStack mb={3} flexWrap='wrap' spacing={2}>
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
                    variant='outline'
                    borderColor={colors.border}
                    color={colors.textSecondary}
                    px={3}
                    py={1}
                    borderRadius='full'
                  >
                    {question.points} point{question.points !== 1 ? 's' : ''}
                  </Badge>
                </HStack>

                <Text
                  mb={3}
                  whiteSpace='pre-wrap'
                  color={colors.textPrimary}
                  fontWeight='500'
                >
                  {question.text}
                </Text>

                {/* Options Preview */}
                {['MULTIPLE_CHOICE', 'TRUE_FALSE'].includes(
                  question.questionType
                ) &&
                  question.options && (
                    <VStack
                      align='stretch'
                      spacing={2}
                      mt={3}
                      p={3}
                      bg={colors.sectionBg}
                      borderRadius='md'
                    >
                      {question.options
                        .sort((a, b) => a.order - b.order)
                        .map((option) => (
                          <HStack key={option.id} spacing={3}>
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
                              fontWeight={option.isCorrect ? '600' : 'normal'}
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
                    color={colors.textMuted}
                    fontStyle='italic'
                    mt={2}
                  >
                    Short answer question - manual grading required
                  </Text>
                )}

                {question.questionType === 'ESSAY' && (
                  <Text
                    fontSize='sm'
                    color={colors.textMuted}
                    fontStyle='italic'
                    mt={2}
                  >
                    Essay question - manual grading required
                  </Text>
                )}
              </Box>

              {/* Actions */}
              <HStack flexShrink={0}>
                <IconButton
                  aria-label='Edit question'
                  icon={<EditIcon />}
                  size='sm'
                  variant='outline'
                  borderColor={colors.primary}
                  color={colors.primary}
                  _hover={{ bg: colors.sectionBg }}
                  onClick={() => onEdit(question)}
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
            </Stack>
          </CardBody>
        </Card>
      ))}

      {/* Delete Confirmation Dialog */}
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
              Are you sure you want to delete this question? This action cannot
              be undone.
            </AlertDialogBody>

            <AlertDialogFooter>
              <Button
                ref={cancelRef}
                onClick={onClose}
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
              >
                Delete
              </Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialogOverlay>
      </AlertDialog>
    </VStack>
  );
};

export default QuestionList;
