import React from 'react';
import {
  Box,
  Text,
  Button,
  HStack,
  Grid,
  Badge,
  Card,
  CardBody,
} from '@chakra-ui/react';
import type { Question } from '../../../types/api';
import { colors } from '../../../utils/colors';

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
    <Box w='full'>
      <Card
        bg={colors.cardBg}
        borderColor={colors.border}
        borderWidth='1px'
        boxShadow={{ base: 'none', lg: 'md' }}
        borderRadius={{ base: 0, lg: 'md' }}
      >
        <CardBody p={{ base: 3, lg: 4 }}>
          {/* Mobile Compact Layout */}
          <Box display={{ base: 'block', lg: 'none' }}>
            <HStack spacing={2} mb={2} justify='space-between'>
              <HStack spacing={2} fontSize='xs'>
                <Box w={2} h={2} bg={colors.success} borderRadius='sm' />
                <Text color={colors.textSecondary}>Answered</Text>
                <Badge bg={colors.success} color='white' fontSize='xs'>
                  {answeredCount}
                </Badge>
              </HStack>
              <HStack spacing={2} fontSize='xs'>
                <Box w={2} h={2} bg={colors.border} borderRadius='sm' />
                <Text color={colors.textSecondary}>Left</Text>
                <Badge bg={colors.warning} color='white' fontSize='xs'>
                  {remainingCount}
                </Badge>
              </HStack>
            </HStack>

            {/* Scrollable Question Grid Container - Horizontal Scroll */}
            <Box
              overflowX='auto'
              overflowY='hidden'
              mb={2}
              css={{
                '&::-webkit-scrollbar': {
                  height: '4px',
                },
                '&::-webkit-scrollbar-track': {
                  background: colors.border,
                },
                '&::-webkit-scrollbar-thumb': {
                  background: colors.textMuted,
                  borderRadius: '2px',
                },
              }}
            >
              <HStack spacing={1.5} minW='min-content'>
                {questions.map((q, index) => (
                  <Button
                    key={q.id}
                    onClick={() => onQuestionJump(index)}
                    size='sm'
                    variant={currentQuestion === index ? 'solid' : 'outline'}
                    bg={
                      currentQuestion === index
                        ? colors.primary
                        : isQuestionAnswered(q.id)
                        ? colors.success
                        : 'white'
                    }
                    color={
                      currentQuestion === index || isQuestionAnswered(q.id)
                        ? 'white'
                        : colors.textPrimary
                    }
                    borderColor={
                      isQuestionAnswered(q.id) && currentQuestion !== index
                        ? colors.success
                        : colors.border
                    }
                    _hover={{
                      bg:
                        currentQuestion === index
                          ? colors.primaryHover
                          : isQuestionAnswered(q.id)
                          ? colors.success
                          : colors.pageBg,
                      opacity: isQuestionAnswered(q.id) ? 0.9 : 1,
                    }}
                    h='42px'
                    w='32px'
                    minW='32px'
                    flexShrink={0}
                    p={0}
                    borderRadius='md'
                    fontSize='xs'
                    fontWeight='semibold'
                  >
                    {index + 1}
                  </Button>
                ))}
              </HStack>
            </Box>

            {/* Submit Button */}
            <Button
              bg={colors.success}
              color='white'
              size='md'
              onClick={onSubmit}
              isLoading={isSubmitting}
              w='full'
              _hover={{ opacity: 0.9 }}
            >
              Submit Exam
            </Button>
          </Box>

          {/* Desktop Full Layout */}
          <Box display={{ base: 'none', lg: 'block' }}>
            <Text
              fontWeight='bold'
              fontSize='lg'
              mb={4}
              color={colors.textPrimary}
            >
              Question Navigator
            </Text>

            {/* Legend */}
            <HStack spacing={4} fontSize='sm' mb={4}>
              <HStack>
                <Box w={3} h={3} bg={colors.success} borderRadius='sm' />
                <Text color={colors.textSecondary}>Answered</Text>
              </HStack>
              <HStack>
                <Box w={3} h={3} bg={colors.border} borderRadius='sm' />
                <Text color={colors.textSecondary}>Unanswered</Text>
              </HStack>
            </HStack>

            {/* Question Grid */}
            <Grid templateColumns='repeat(4, 1fr)' gap={2} mb={4}>
              {questions.map((q, index) => (
                <Button
                  key={q.id}
                  onClick={() => onQuestionJump(index)}
                  size='lg'
                  variant={currentQuestion === index ? 'solid' : 'outline'}
                  bg={
                    currentQuestion === index
                      ? colors.primary
                      : isQuestionAnswered(q.id)
                      ? colors.success
                      : 'white'
                  }
                  color={
                    currentQuestion === index || isQuestionAnswered(q.id)
                      ? 'white'
                      : colors.textPrimary
                  }
                  borderColor={
                    isQuestionAnswered(q.id) && currentQuestion !== index
                      ? colors.success
                      : colors.border
                  }
                  _hover={{
                    bg:
                      currentQuestion === index
                        ? colors.primaryHover
                        : isQuestionAnswered(q.id)
                        ? colors.success
                        : colors.pageBg,
                    opacity: isQuestionAnswered(q.id) ? 0.9 : 1,
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

            {/* Stats */}
            <HStack justify='space-between' mb={4}>
              <HStack>
                <Text fontSize='sm' color={colors.textSecondary}>
                  Answered:
                </Text>
                <Badge bg={colors.success} color='white' fontSize='md'>
                  {answeredCount}
                </Badge>
              </HStack>
              <HStack>
                <Text fontSize='sm' color={colors.textSecondary}>
                  Remaining:
                </Text>
                <Badge bg={colors.warning} color='white' fontSize='md'>
                  {remainingCount}
                </Badge>
              </HStack>
            </HStack>

            {/* Submit Button */}
            <Button
              bg={colors.success}
              color='white'
              size='lg'
              onClick={onSubmit}
              isLoading={isSubmitting}
              w='full'
              _hover={{ opacity: 0.9 }}
            >
              Submit Exam
            </Button>
          </Box>
        </CardBody>
      </Card>
    </Box>
  );
};
