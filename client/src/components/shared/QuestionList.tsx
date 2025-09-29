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
  }, []);

  const formatQuestionType = useCallback((type: QuestionType): string => {
    return type.toLowerCase().replace('_', ' ');
  }, []);

  if (questions.length === 0) {
    return (
      <Box textAlign='center' py={10}>
        <Text color='gray.500'>
          No questions added yet. Click "Add Question" to get started.
        </Text>
      </Box>
    );
  }

  const sortedQuestions = [...questions].sort((a, b) => a.order - b.order);

  return (
    <VStack spacing={4} align='stretch'>
      {sortedQuestions.map((question) => (
        <Card key={question.id} variant='outline'>
          <CardBody>
            <Stack
              direction={{ base: 'column', md: 'row' }}
              spacing={4}
              align='start'
            >
              {/* Drag Handle and Order */}
              <HStack flexShrink={0}>
                <DragHandleIcon color='gray.400' cursor='grab' />
                <Badge variant='outline' colorScheme='gray'>
                  {question.order}
                </Badge>
              </HStack>

              {/* Question Content */}
              <Box flex={1}>
                <HStack mb={2} flexWrap='wrap' spacing={2}>
                  <Badge
                    colorScheme={getQuestionTypeColor(question.questionType)}
                  >
                    {formatQuestionType(question.questionType)}
                  </Badge>
                  <Badge variant='outline'>
                    {question.points} point{question.points !== 1 ? 's' : ''}
                  </Badge>
                </HStack>

                <Text mb={2} whiteSpace='pre-wrap'>
                  {question.text}
                </Text>

                {/* Options Preview */}
                {['MULTIPLE_CHOICE', 'TRUE_FALSE'].includes(
                  question.questionType
                ) &&
                  question.options && (
                    <VStack align='stretch' spacing={1} mt={3}>
                      {question.options
                        .sort((a, b) => a.order - b.order)
                        .map((option) => (
                          <HStack key={option.id} spacing={2}>
                            <Box
                              w={2}
                              h={2}
                              borderRadius='full'
                              bg={option.isCorrect ? 'green.500' : 'gray.300'}
                            />
                            <Text
                              fontSize='sm'
                              color={
                                option.isCorrect ? 'green.600' : 'gray.600'
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
                  <Text fontSize='sm' color='gray.600' fontStyle='italic'>
                    Short answer question - manual grading required
                  </Text>
                )}

                {question.questionType === 'ESSAY' && (
                  <Text fontSize='sm' color='gray.600' fontStyle='italic'>
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
                  onClick={() => onEdit(question)}
                />
                <IconButton
                  aria-label='Delete question'
                  icon={<DeleteIcon />}
                  size='sm'
                  variant='outline'
                  colorScheme='red'
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
        <AlertDialogOverlay>
          <AlertDialogContent>
            <AlertDialogHeader fontSize='lg' fontWeight='bold'>
              Delete Question
            </AlertDialogHeader>

            <AlertDialogBody>
              Are you sure you want to delete this question? This action cannot
              be undone.
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
    </VStack>
  );
};

export default QuestionList;
