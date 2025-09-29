import React, { useState, useCallback } from 'react';
import {
  Box,
  VStack,
  HStack,
  Heading,
  Button,
  useDisclosure,
  Text,
  SimpleGrid,
} from '@chakra-ui/react';
import { AddIcon } from '@chakra-ui/icons';
import QuestionForm from './QuestionForm';
import QuestionList from './QuestionList';

import type { Question } from '../../types/api';
import BulkUploadModal from './BulkUploadModal';

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
  const {
    isOpen: isFormOpen,
    onOpen: onFormOpen,
    onClose: onFormClose,
  } = useDisclosure();
  const {
    isOpen: isBulkOpen,
    onOpen: onBulkOpen,
    onClose: onBulkClose,
  } = useDisclosure();

  const handleAddQuestion = useCallback(
    (questionData: Omit<Question, 'id'>) => {
      const newQuestion: Question = {
        ...questionData,
        id: Date.now(), // Use timestamp for unique ID instead of length
        testId,
        options: questionData.options || [],
      };

      const updatedQuestions = [...questions, newQuestion];
      setQuestions(updatedQuestions);
      onQuestionsUpdate(updatedQuestions);
      onFormClose();
    },
    [questions, testId, onQuestionsUpdate, onFormClose]
  );

  const handleUpdateQuestion = useCallback(
    (questionData: Question) => {
      const updatedQuestions = questions.map((q) =>
        q.id === questionData.id ? questionData : q
      );
      setQuestions(updatedQuestions);
      onQuestionsUpdate(updatedQuestions);
      setEditingQuestion(null);
      onFormClose();
    },
    [questions, onQuestionsUpdate, onFormClose]
  );

  const handleEditQuestion = useCallback(
    (question: Question) => {
      setEditingQuestion(question);
      onFormOpen();
    },
    [onFormOpen]
  );

  const handleDeleteQuestion = useCallback(
    (questionId: number) => {
      const updatedQuestions = questions.filter((q) => q.id !== questionId);
      setQuestions(updatedQuestions);
      onQuestionsUpdate(updatedQuestions);
    },
    [questions, onQuestionsUpdate]
  );

  const handleReorderQuestions = useCallback(
    (reorderedQuestions: Question[]) => {
      const updatedQuestions = reorderedQuestions.map((q, index) => ({
        ...q,
        order: index + 1,
      }));
      setQuestions(updatedQuestions);
      onQuestionsUpdate(updatedQuestions);
    },
    [onQuestionsUpdate]
  );

  const handleBulkUpload = useCallback(
    (uploadedQuestions: Question[]) => {
      const questionsWithOrder = uploadedQuestions.map((q, index) => ({
        ...q,
        id: Date.now() + index, // Generate unique IDs
        order: questions.length + index + 1,
        testId,
      }));

      const updatedQuestions = [...questions, ...questionsWithOrder];
      setQuestions(updatedQuestions);
      onQuestionsUpdate(updatedQuestions);
      onBulkClose();
    },
    [questions, testId, onQuestionsUpdate, onBulkClose]
  );

  const totalPoints = questions.reduce((sum, q) => sum + q.points, 0);
  const questionTypes = Array.from(
    new Set(questions.map((q) => q.questionType))
  ).join(', ');

  return (
    <Box p={6}>
      <VStack spacing={6} align='stretch'>
        {/* Header */}
        <HStack justify='space-between'>
          <Heading size='lg'>Manage Questions</Heading>
          <HStack>
            <Button
              leftIcon={<AddIcon />}
              colorScheme='blue'
              onClick={onFormOpen}
            >
              Add Question
            </Button>
            <Button variant='outline' onClick={onBulkOpen}>
              Bulk Upload
            </Button>
          </HStack>
        </HStack>

        {/* Stats */}
        <SimpleGrid columns={3} spacing={4}>
          <Box p={4} bg='blue.50' borderRadius='md'>
            <Text fontWeight='bold'>Total Questions</Text>
            <Text fontSize='2xl'>{questions.length}</Text>
          </Box>
          <Box p={4} bg='green.50' borderRadius='md'>
            <Text fontWeight='bold'>Total Points</Text>
            <Text fontSize='2xl'>{totalPoints}</Text>
          </Box>
          <Box p={4} bg='purple.50' borderRadius='md'>
            <Text fontWeight='bold'>Types</Text>
            <Text fontSize='sm' noOfLines={2}>
              {questionTypes || 'None'}
            </Text>
          </Box>
        </SimpleGrid>

        {/* Question List */}
        <QuestionList
          questions={questions}
          onEdit={handleEditQuestion}
          onDelete={handleDeleteQuestion}
          onReorder={handleReorderQuestions}
        />

        {/* Question Form Modal */}
        <QuestionForm
          isOpen={isFormOpen}
          onClose={() => {
            onFormClose();
            setEditingQuestion(null);
          }}
          onSave={editingQuestion ? handleUpdateQuestion : handleAddQuestion}
          question={editingQuestion}
          testId={testId}
          nextOrder={questions.length + 1}
        />

        {/* Bulk Upload Modal */}
        <BulkUploadModal
          isOpen={isBulkOpen}
          onClose={onBulkClose}
          onUpload={handleBulkUpload}
        />
      </VStack>
    </Box>
  );
};

export default QuestionManager;
