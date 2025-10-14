import React from 'react';
import {
  Box,
  Grid,
  Heading,
  Text,
  Card,
  CardBody,
  CardHeader,
  Flex,
  Badge,
  Progress,
  Icon,
} from '@chakra-ui/react';
import { Clock, TrendingUp, Award, Users, FileText } from 'lucide-react';
import { StatCard } from './StatCard';
import { colors, bgStyles, textStyles } from '../../../utils/colors';

interface TestAnalytics {
  testId: number;
  title: string;
  totalAttempts: number;
  totalQuestions: number;
  totalPoints: number;
  averageScore: number;
  averageTimeSpent: number;
  highestScore: number;
  lowestScore: number;
}

const formatTime = (seconds: number): string => {
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins}m ${secs}s`;
};

interface TestStatisticsCardProps {
  test: TestAnalytics;
}

export const TestStatisticsCard: React.FC<TestStatisticsCardProps> = ({
  test,
}) => {
  return (
    <Card
      {...bgStyles.card}
      bg={colors.cardBg} // Explicitly set card background
      borderColor={colors.border}
      boxShadow='0 1px 3px rgba(0, 0, 0, 0.1)' // Added base shadow
      _hover={{
        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
        transform: 'translateY(-2px)',
      }}
      transition='all 0.3s ease-in-out'
    >
      <CardHeader pb={2}>
        <Flex justify='space-between' align='flex-start'>
          <Box>
            <Heading size='md' mb={1} {...textStyles.heading}>
              {test.title}
            </Heading>
            <Text fontSize='sm' {...textStyles.muted}>
              Test ID: {test.testId}
            </Text>
          </Box>
          <Badge
            bg={colors.primary}
            color='white'
            display='flex'
            alignItems='center'
            gap={2}
            px={3}
            py={1}
            borderRadius='full'
            fontSize='sm'
            fontWeight='semibold'
          >
            <Icon as={Users} boxSize={3} />
            <Text>{test.totalAttempts} attempts</Text>
          </Badge>
        </Flex>
      </CardHeader>

      <CardBody pt={0}>
        <Grid templateColumns='repeat(2, 1fr)' gap={3} mb={4}>
          <StatCard
            icon={FileText}
            label='Questions'
            value={test.totalQuestions}
            color='#8B5CF6'
          />
          <StatCard
            icon={Award}
            label='Total Points'
            value={test.totalPoints}
            color={colors.warning}
          />
          <StatCard
            icon={Clock}
            label='Avg Time'
            value={formatTime(test.averageTimeSpent)}
            color={colors.info}
          />
          <StatCard
            icon={TrendingUp}
            label='Avg Score'
            value={`${test.averageScore.toFixed(1)}%`}
            color={colors.success}
          />
        </Grid>

        <Box pt={4} borderTop='1px' borderColor={colors.border}>
          <Text fontSize='xs' fontWeight='medium' {...textStyles.body} mb={2}>
            Score Range
          </Text>
          <Progress
            value={100}
            size='sm'
            borderRadius='full'
            bg={colors.sectionBg}
            sx={{
              '& > div': {
                background:
                  'linear-gradient(to right, #FC8181, #F6E05E, #68D391)',
              },
            }}
          />
          <Flex justify='space-between' mt={2}>
            <Text fontSize='xs' color={colors.error} fontWeight='medium'>
              Low: {test.lowestScore.toFixed(1)}%
            </Text>
            <Text fontSize='xs' color={colors.success} fontWeight='medium'>
              High: {test.highestScore.toFixed(1)}%
            </Text>
          </Flex>
        </Box>
      </CardBody>
    </Card>
  );
};
