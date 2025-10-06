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
    <Box w={{ base: '100%', lg: '280px' }} flexShrink={0}>
      <Card>
        <CardBody>
          <VStack spacing={4} align='stretch'>
            <VStack spacing={3}>
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

            <VStack spacing={2} align='stretch'>
              <Text fontWeight='semibold' color='gray.600' fontSize='sm'>
                EXAM DETAILS
              </Text>
              <Box>
                <Text fontSize='sm' color='gray.500'>
                  Title
                </Text>
                <Text fontWeight='medium'>{examTitle}</Text>
              </Box>
              {examDescription && (
                <Box>
                  <Text fontSize='sm' color='gray.500'>
                    Description
                  </Text>
                  <Text fontWeight='medium'>{examDescription}</Text>
                </Box>
              )}
              <Box>
                <Text fontSize='sm' color='gray.500'>
                  Total Questions
                </Text>
                <Text fontWeight='medium'>{totalQuestions}</Text>
              </Box>
            </VStack>

            <Divider />

            <VStack spacing={3}>
              <Text fontWeight='semibold' color='gray.600' fontSize='sm'>
                TIME REMAINING
              </Text>
              <CircularProgress
                value={timePercentage}
                size='120px'
                thickness='8px'
                color={timeRemaining < 300 ? 'red.400' : 'blue.400'}
              >
                <CircularProgressLabel fontSize='lg' fontWeight='bold'>
                  {formatTime(timeRemaining)}
                </CircularProgressLabel>
              </CircularProgress>
              <Badge colorScheme={isConnected ? 'green' : 'red'} fontSize='xs'>
                {isConnected ? '● Live' : '● Offline'}
              </Badge>
            </VStack>
          </VStack>
        </CardBody>
      </Card>
    </Box>
  );
};
