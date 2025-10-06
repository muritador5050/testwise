import React from 'react';
import {
  Box,
  Text,
  Radio,
  RadioGroup,
  Stack,
  Checkbox,
  CheckboxGroup,
  Textarea,
} from '@chakra-ui/react';
import type { Question } from '../../../types/api';
import type { AnswerValue } from '../hooks/useExamAnswer';

interface QuestionRendererProps {
  question: Question;
  currentAnswer: AnswerValue;
  onAnswerChange: (value: AnswerValue) => void;
}

export const QuestionRenderer: React.FC<QuestionRendererProps> = ({
  question,
  currentAnswer,
  onAnswerChange,
}) => {
  switch (question.questionType) {
    case 'MULTIPLE_CHOICE':
    case 'TRUE_FALSE':
      return (
        <RadioGroup
          value={currentAnswer as string}
          onChange={(value) => onAnswerChange(value)}
        >
          <Stack spacing={4}>
            {question.options?.map((option) => (
              <Box
                key={option.id}
                p={4}
                borderWidth='2px'
                borderRadius='lg'
                borderColor={
                  currentAnswer === option.id.toString()
                    ? 'blue.400'
                    : 'gray.200'
                }
                cursor='pointer'
                transition='all 0.2s'
              >
                <Radio
                  value={option.id.toString()}
                  size='lg'
                  colorScheme='blue'
                >
                  <Text
                    ml={2}
                    fontSize='md'
                    fontWeight={
                      question.questionType === 'TRUE_FALSE'
                        ? 'semibold'
                        : 'normal'
                    }
                  >
                    {option.text}
                  </Text>
                </Radio>
              </Box>
            ))}
          </Stack>
        </RadioGroup>
      );

    case 'MULTIPLE_ANSWER':
      return (
        <CheckboxGroup
          value={(currentAnswer as string[]) || []}
          onChange={(value) => onAnswerChange(value as string[])}
        >
          <Stack spacing={4}>
            {question.options?.map((option) => (
              <Box
                key={option.id}
                p={4}
                borderWidth='2px'
                borderRadius='lg'
                borderColor={
                  (currentAnswer as string[])?.includes(option.id.toString())
                    ? 'blue.400'
                    : 'gray.200'
                }
                cursor='pointer'
                transition='all 0.2s'
              >
                <Checkbox
                  value={option.id.toString()}
                  size='lg'
                  colorScheme='blue'
                >
                  <Text ml={2} fontSize='md'>
                    {option.text}
                  </Text>
                </Checkbox>
              </Box>
            ))}
          </Stack>
        </CheckboxGroup>
      );

    case 'SHORT_ANSWER':
      return (
        <Textarea
          value={(currentAnswer as string) || ''}
          onChange={(e) => onAnswerChange(e.target.value)}
          placeholder='Type your short answer here...'
          size='lg'
          minH='120px'
          resize='vertical'
          borderWidth='2px'
          borderColor='gray.200'
          _focus={{
            borderColor: 'blue.400',
            boxShadow: '0 0 0 1px var(--chakra-colors-blue-400)',
          }}
        />
      );

    case 'ESSAY':
      return (
        <Box>
          <Textarea
            value={(currentAnswer as string) || ''}
            onChange={(e) => onAnswerChange(e.target.value)}
            placeholder='Type your detailed answer here...'
            size='lg'
            minH='300px'
            resize='vertical'
            borderWidth='2px'
            borderColor='gray.200'
            _focus={{
              borderColor: 'blue.400',
              boxShadow: '0 0 0 1px var(--chakra-colors-blue-400)',
            }}
          />
          <Text mt={2} fontSize='sm' color='gray.500' textAlign='right'>
            {(currentAnswer as string)?.length || 0} characters
          </Text>
        </Box>
      );

    default:
      return null;
  }
};
