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
      <Card>
        <CardBody>
          <VStack spacing={{ base: 3, md: 4 }} align='stretch'>
            {/* Student Info - Compact on mobile */}
            <HStack spacing={3} display={{ base: 'flex', md: 'none' }}>
              <Avatar
                size='md'
                name={studentName}
                src={studentAvatar || ''}
                bg='blue.500'
              />
              <VStack align='start' spacing={0}>
                <Text fontWeight='bold' fontSize='md'>
                  {studentName}
                </Text>
                <Badge
                  colorScheme={isConnected ? 'green' : 'red'}
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
                bg='blue.500'
              />
              <Text fontWeight='bold' fontSize='lg' textAlign='center'>
                {studentName}
              </Text>
            </VStack>

            <Divider />

            {/* Exam Details - Compact on mobile */}
            <VStack spacing={2} align='stretch'>
              <Text
                fontWeight='semibold'
                color='gray.600'
                fontSize='sm'
                display={{ base: 'none', md: 'block' }}
              >
                EXAM DETAILS
              </Text>
              <Box>
                <Text fontSize='xs' color='gray.500'>
                  Title
                </Text>
                <Text fontWeight='medium' fontSize={{ base: 'sm', md: 'md' }}>
                  {examTitle}
                </Text>
              </Box>
              {examDescription && (
                <Box display={{ base: 'none', md: 'block' }}>
                  <Text fontSize='xs' color='gray.500'>
                    Description
                  </Text>
                  <Text fontWeight='medium' fontSize='sm'>
                    {examDescription}
                  </Text>
                </Box>
              )}
              <Box>
                <Text fontSize='xs' color='gray.500'>
                  Total Questions
                </Text>
                <Text fontWeight='medium' fontSize={{ base: 'sm', md: 'md' }}>
                  {totalQuestions}
                </Text>
              </Box>
            </VStack>

            <Divider />

            {/* Timer */}
            <VStack spacing={3}>
              <Text
                fontWeight='semibold'
                color='gray.600'
                fontSize='sm'
                display={{ base: 'none', md: 'block' }}
              >
                TIME REMAINING
              </Text>
              <CircularProgress
                value={timePercentage}
                size={{ base: '100px', md: '120px' }}
                thickness='8px'
                color={timeRemaining < 300 ? 'red.400' : 'blue.400'}
              >
                <CircularProgressLabel
                  fontSize={{ base: 'md', md: 'lg' }}
                  fontWeight='bold'
                >
                  {formatTime(timeRemaining)}
                </CircularProgressLabel>
              </CircularProgress>
              <Badge
                colorScheme={isConnected ? 'green' : 'red'}
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
