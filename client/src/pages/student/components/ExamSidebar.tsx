import React from 'react';
import {
  Box,
  Text,
  Avatar,
  VStack,
  Divider,
  CircularProgress,
  CircularProgressLabel,
  Badge,
  Card,
  CardBody,
  HStack,
} from '@chakra-ui/react';
import { formatTime } from '../hooks/useExamHelper';
import { colors } from '../../../utils/colors';

interface ExamSidebarProps {
  studentName: string;
  studentAvatar: string;
  examTitle: string;
  examDescription: string | null;
  totalQuestions: number;
  timeRemaining: number;
  timePercentage: number;
  isConnected: boolean;
}

export const ExamSidebar: React.FC<ExamSidebarProps> = ({
  studentName,
  studentAvatar,
  examTitle,
  examDescription,
  totalQuestions,
  timeRemaining,
  timePercentage,
  isConnected,
}) => {
  return (
    <Box w='full'>
      <Card bg={colors.cardBg} borderColor={colors.border} borderWidth='1px'>
        <CardBody>
          <VStack spacing={{ base: 3, md: 4 }} align='stretch'>
            {/* Student Info - Compact on mobile */}
            <HStack spacing={3} display={{ base: 'flex', md: 'none' }}>
              <Avatar
                size='md'
                name={studentName}
                src={studentAvatar || ''}
                bg={colors.primary}
              />
              <VStack align='start' spacing={0}>
                <Text
                  fontWeight='bold'
                  fontSize='md'
                  color={colors.textPrimary}
                >
                  {studentName}
                </Text>
                <Badge
                  bg={isConnected ? colors.success : colors.error}
                  color='white'
                  fontSize='xs'
                >
                  {isConnected ? '● Live' : '● Offline'}
                </Badge>
              </VStack>
            </HStack>

            {/* Student Info - Full on desktop */}
            <VStack spacing={3} display={{ base: 'none', md: 'flex' }}>
              <Avatar
                size='xl'
                name={studentName}
                src={studentAvatar || ''}
                bg={colors.primary}
              />
              <Text
                fontWeight='bold'
                fontSize='lg'
                textAlign='center'
                color={colors.textPrimary}
              >
                {studentName}
              </Text>
            </VStack>

            <Divider borderColor={colors.border} />

            {/* Exam Details - Compact on mobile */}
            <VStack spacing={2} align='stretch'>
              <Text
                fontWeight='semibold'
                color={colors.textSecondary}
                fontSize='sm'
                display={{ base: 'none', md: 'block' }}
              >
                EXAM DETAILS
              </Text>
              <Box>
                <Text fontSize='xs' color={colors.textMuted}>
                  Title
                </Text>
                <Text
                  fontWeight='medium'
                  fontSize={{ base: 'sm', md: 'md' }}
                  color={colors.textPrimary}
                >
                  {examTitle}
                </Text>
              </Box>
              {examDescription && (
                <Box display={{ base: 'none', md: 'block' }}>
                  <Text fontSize='xs' color={colors.textMuted}>
                    Description
                  </Text>
                  <Text
                    fontWeight='medium'
                    fontSize='sm'
                    color={colors.textPrimary}
                  >
                    {examDescription}
                  </Text>
                </Box>
              )}
              <Box>
                <Text fontSize='xs' color={colors.textMuted}>
                  Total Questions
                </Text>
                <Text
                  fontWeight='medium'
                  fontSize={{ base: 'sm', md: 'md' }}
                  color={colors.textPrimary}
                >
                  {totalQuestions}
                </Text>
              </Box>
            </VStack>

            <Divider borderColor={colors.border} />

            {/* Timer */}
            <VStack spacing={3}>
              <Text
                fontWeight='semibold'
                color={colors.textSecondary}
                fontSize='sm'
                display={{ base: 'none', md: 'block' }}
              >
                TIME REMAINING
              </Text>
              <CircularProgress
                value={timePercentage}
                size={{ base: '100px', md: '120px' }}
                thickness='8px'
                color={timeRemaining < 300 ? colors.error : colors.primary}
                trackColor={colors.border}
              >
                <CircularProgressLabel
                  fontSize={{ base: 'md', md: 'lg' }}
                  fontWeight='bold'
                  color={colors.textPrimary}
                >
                  {formatTime(timeRemaining)}
                </CircularProgressLabel>
              </CircularProgress>
              <Badge
                bg={isConnected ? colors.success : colors.error}
                color='white'
                fontSize='xs'
                display={{ base: 'none', md: 'inline-flex' }}
              >
                {isConnected ? '● Live' : '● Offline'}
              </Badge>
            </VStack>
          </VStack>
        </CardBody>
      </Card>
    </Box>
  );
};
