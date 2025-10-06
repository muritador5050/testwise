import React from 'react';
import {
  Box,
  Text,
  Button,
  Stack,
  HStack,
  VStack,
  Grid,
  Badge,
  Divider,
  Card,
  CardBody,
} from '@chakra-ui/react';
import type { Question } from '../../../types/api';

interface QuestionNavigatorProps {
  questions: Question[];
  currentQuestion: number;
  isQuestionAnswered: (questionId: number) => boolean;
  onQuestionJump: (index: number) => void;
  onSubmit: () => void;
  answeredCount: number;
  isSubmitting: boolean;
}

export const QuestionNavigator: React.FC<QuestionNavigatorProps> = ({
  questions,
  currentQuestion,
  isQuestionAnswered,
  onQuestionJump,
  onSubmit,
  answeredCount,
  isSubmitting,
}) => {
  const remainingCount = questions.length - answeredCount;

  return (
    <Box w={{ base: '100%', lg: '300px' }} flexShrink={0}>
      <Card>
        <CardBody>
          <Stack spacing={4} align='stretch'>
            <Text fontWeight='bold' fontSize='lg'>
              Question Navigator
            </Text>

            <HStack spacing={4}>
              <HStack>
                <Box w={4} h={4} bg='green.400' borderRadius='sm' />
                <Text fontSize='sm'>Answered</Text>
              </HStack>
              <HStack>
                <Box w={4} h={4} bg='gray.200' borderRadius='sm' />
                <Text fontSize='sm'>Unanswered</Text>
              </HStack>
            </HStack>

            <Divider />

            <Grid templateColumns='repeat(4, 1fr)' gap={2}>
              {questions.map((q, index) => (
                <Button
                  key={q.id}
                  onClick={() => onQuestionJump(index)}
                  size='lg'
                  variant={currentQuestion === index ? 'solid' : 'outline'}
                  colorScheme={
                    currentQuestion === index
                      ? 'blue'
                      : isQuestionAnswered(q.id)
                      ? 'green'
                      : 'gray'
                  }
                  bg={
                    currentQuestion === index
                      ? 'blue.500'
                      : isQuestionAnswered(q.id)
                      ? 'green.400'
                      : 'white'
                  }
                  color={
                    currentQuestion === index || isQuestionAnswered(q.id)
                      ? 'white'
                      : 'gray.700'
                  }
                  borderColor={
                    isQuestionAnswered(q.id) && currentQuestion !== index
                      ? 'green.400'
                      : 'gray.300'
                  }
                  _hover={{
                    bg:
                      currentQuestion === index
                        ? 'blue.600'
                        : isQuestionAnswered(q.id)
                        ? 'green.500'
                        : 'gray.100',
                  }}
                  h='45px'
                  w='45px'
                  borderRadius='full'
                  fontSize='md'
                  fontWeight='semibold'
                >
                  {index + 1}
                </Button>
              ))}
            </Grid>

            <Divider />

            <VStack spacing={2} align='stretch'>
              <HStack justify='space-between'>
                <Text fontSize='sm' color='gray.600'>
                  Answered:
                </Text>
                <Badge colorScheme='green' fontSize='md'>
                  {answeredCount}
                </Badge>
              </HStack>
              <HStack justify='space-between'>
                <Text fontSize='sm' color='gray.600'>
                  Remaining:
                </Text>
                <Badge colorScheme='orange' fontSize='md'>
                  {remainingCount}
                </Badge>
              </HStack>
            </VStack>

            <Button
              colorScheme='green'
              size='lg'
              onClick={onSubmit}
              isLoading={isSubmitting}
              w='full'
              mt={4}
            >
              Submit Exam
            </Button>
          </Stack>
        </CardBody>
      </Card>
    </Box>
  );
};
