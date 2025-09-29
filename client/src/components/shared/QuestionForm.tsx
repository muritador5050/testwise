import React, { useState, useEffect, useCallback } from 'react';
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  VStack,
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
  Button,
  HStack,
  IconButton,
  Checkbox,
  Alert,
  AlertIcon,
} from '@chakra-ui/react';
import { DeleteIcon, AddIcon } from '@chakra-ui/icons';
import type { Option, Question, QuestionType } from '../../types/api';

interface QuestionFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (question: Question | Omit<Question, 'id'>) => void;
  question?: Question | null;
  testId: number;
  nextOrder: number;
}

interface FormDataState {
  text: string;
  questionType: QuestionType;
  points: number;
  order: number;
}

const QuestionForm: React.FC<QuestionFormProps> = ({
  isOpen,
  onClose,
  onSave,
  question,
  testId,
  nextOrder,
}) => {
  const [formData, setFormData] = useState<FormDataState>({
    text: '',
    questionType: 'MULTIPLE_CHOICE',
    points: 1.0,
    order: nextOrder,
  });
  const [options, setOptions] = useState<Option[]>([
    { id: 1, text: '', isCorrect: false, order: 1, questionId: 0 },
    { id: 2, text: '', isCorrect: false, order: 2, questionId: 0 },
  ]);
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (question) {
      setFormData({
        text: question.text,
        questionType: question.questionType,
        points: question.points,
        order: question.order,
      });
      setOptions(question.options || []);
    } else {
      setFormData({
        text: '',
        questionType: 'MULTIPLE_CHOICE',
        points: 1.0,
        order: nextOrder,
      });
      setOptions([
        { id: 1, text: '', isCorrect: false, order: 1, questionId: 0 },
        { id: 2, text: '', isCorrect: false, order: 2, questionId: 0 },
      ]);
    }
    setErrors({});
  }, [question, nextOrder, isOpen]);

  const validateForm = useCallback((): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.text.trim()) {
      newErrors.text = 'Question text is required';
    }

    if (formData.points <= 0) {
      newErrors.points = 'Points must be greater than 0';
    }

    if (['MULTIPLE_CHOICE', 'TRUE_FALSE'].includes(formData.questionType)) {
      const validOptions = options.filter((opt) => opt.text.trim());
      if (validOptions.length < 2) {
        newErrors.options = 'At least 2 options are required';
      }

      const correctOptions = validOptions.filter((opt) => opt.isCorrect);
      if (correctOptions.length === 0) {
        newErrors.options = 'At least one correct option is required';
      }

      if (formData.questionType === 'TRUE_FALSE' && validOptions.length !== 2) {
        newErrors.options = 'True/False questions must have exactly 2 options';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, [formData, options]);

  const handleSubmit = useCallback(() => {
    if (!validateForm()) return;

    const questionData = {
      ...formData,
      testId,
      options: options
        .filter((opt) => opt.text.trim())
        .map((opt, index) => ({
          ...opt,
          order: index + 1,
          questionId: question?.id || 0,
        })),
    };

    if (question) {
      onSave({ ...questionData, id: question.id });
    } else {
      onSave(questionData);
    }
  }, [formData, testId, options, question, validateForm, onSave]);

  const handleOptionChange = useCallback(
    (index: number, field: keyof Option, value: string | boolean) => {
      const newOptions = [...options];
      newOptions[index] = { ...newOptions[index], [field]: value };
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

  const handleCorrectOptionChange = useCallback(
    (index: number) => {
      const newOptions = options.map((opt, i) => ({
        ...opt,
        isCorrect:
          formData.questionType === 'MULTIPLE_CHOICE'
            ? i === index
            : formData.questionType === 'TRUE_FALSE'
            ? i === index
              ? !opt.isCorrect
              : false
            : i === index
            ? !opt.isCorrect
            : opt.isCorrect,
      }));
      setOptions(newOptions);
    },
    [options, formData.questionType]
  );

  const renderOptions = useCallback(() => {
    if (!['MULTIPLE_CHOICE', 'TRUE_FALSE'].includes(formData.questionType)) {
      return null;
    }

    return (
      <FormControl isInvalid={!!errors.options}>
        <FormLabel>
          Options {formData.questionType === 'TRUE_FALSE' && '(True/False)'}
        </FormLabel>
        <VStack spacing={3} align='stretch'>
          {options.map((option, index) => (
            <HStack key={option.id}>
              <Checkbox
                isChecked={option.isCorrect}
                onChange={() => handleCorrectOptionChange(index)}
                isDisabled={
                  formData.questionType === 'TRUE_FALSE' && options.length === 2
                }
              />
              <Input
                value={option.text}
                onChange={(e) =>
                  handleOptionChange(index, 'text', e.target.value)
                }
                placeholder={`Option ${index + 1}`}
                isDisabled={formData.questionType === 'TRUE_FALSE' && index < 2}
              />
              {options.length > 2 && (
                <IconButton
                  aria-label='Remove option'
                  icon={<DeleteIcon />}
                  onClick={() => removeOption(index)}
                  size='sm'
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
            >
              Add Option
            </Button>
          )}
        </VStack>
        {errors.options && (
          <Alert status='error' mt={2} size='sm'>
            <AlertIcon />
            {errors.options}
          </Alert>
        )}
      </FormControl>
    );
  }, [
    formData.questionType,
    options,
    errors.options,
    handleCorrectOptionChange,
    handleOptionChange,
    removeOption,
    addOption,
  ]);

  return (
    <Modal isOpen={isOpen} onClose={onClose} size='xl'>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>
          {question ? 'Edit Question' : 'Create New Question'}
        </ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <VStack spacing={4}>
            <FormControl isInvalid={!!errors.text} isRequired>
              <FormLabel>Question Text</FormLabel>
              <Textarea
                value={formData.text}
                onChange={(e) =>
                  setFormData({ ...formData, text: e.target.value })
                }
                placeholder='Enter your question here...'
                rows={3}
              />
            </FormControl>

            <HStack width='100%' align='flex-start'>
              <FormControl>
                <FormLabel>Question Type</FormLabel>
                <Select
                  value={formData.questionType}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      questionType: e.target.value as QuestionType,
                    })
                  }
                >
                  <option value='MULTIPLE_CHOICE'>Multiple Choice</option>
                  <option value='TRUE_FALSE'>True/False</option>
                  <option value='SHORT_ANSWER'>Short Answer</option>
                  <option value='ESSAY'>Essay</option>
                </Select>
              </FormControl>

              <FormControl isInvalid={!!errors.points} width='150px' isRequired>
                <FormLabel>Points</FormLabel>
                <NumberInput
                  value={formData.points}
                  onChange={(valueString, valueNumber) =>
                    setFormData({ ...formData, points: valueNumber })
                  }
                  min={0.5}
                  step={0.5}
                  precision={1}
                >
                  <NumberInputField />
                  <NumberInputStepper>
                    <NumberIncrementStepper />
                    <NumberDecrementStepper />
                  </NumberInputStepper>
                </NumberInput>
              </FormControl>

              <FormControl width='100px'>
                <FormLabel>Order</FormLabel>
                <NumberInput
                  value={formData.order}
                  onChange={(valueString, valueNumber) =>
                    setFormData({ ...formData, order: valueNumber })
                  }
                  min={1}
                >
                  <NumberInputField />
                </NumberInput>
              </FormControl>
            </HStack>

            {renderOptions()}

            {formData.questionType === 'SHORT_ANSWER' && (
              <Alert status='info' size='sm'>
                <AlertIcon />
                For short answer questions, you'll need to manually grade
                student responses.
              </Alert>
            )}

            {formData.questionType === 'ESSAY' && (
              <Alert status='info' size='sm'>
                <AlertIcon />
                Essay questions require manual grading and review.
              </Alert>
            )}
          </VStack>
        </ModalBody>

        <ModalFooter>
          <HStack>
            <Button variant='outline' onClick={onClose}>
              Cancel
            </Button>
            <Button colorScheme='blue' onClick={handleSubmit}>
              {question ? 'Update' : 'Create'} Question
            </Button>
          </HStack>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default QuestionForm;
