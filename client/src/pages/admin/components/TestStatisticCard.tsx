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
  useColorModeValue,
} from '@chakra-ui/react';
import { Clock, TrendingUp, Award, Users, FileText } from 'lucide-react';
import { StatCard } from './StatCard';

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
  const cardBg = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.200', 'gray.700');

  return (
    <Card
      bg={cardBg}
      borderColor={borderColor}
      _hover={{ shadow: 'lg' }}
      transition='all 0.2s'
    >
      <CardHeader pb={2}>
        <Flex justify='space-between' align='flex-start'>
          <Box>
            <Heading size='md' mb={1}>
              {test.title}
            </Heading>
            <Text fontSize='sm' color='gray.500'>
              Test ID: {test.testId}
            </Text>
          </Box>
          <Badge
            colorScheme='blue'
            display='flex'
            alignItems='center'
            gap={2}
            px={3}
            py={1}
            borderRadius='full'
          >
            <Icon as={Users} boxSize={4} />
            <Text>{test.totalAttempts} attempts</Text>
          </Badge>
        </Flex>
      </CardHeader>

      <CardBody>
        <Grid templateColumns='repeat(2, 1fr)' gap={3} mb={4}>
          <StatCard
            icon={FileText}
            label='Questions'
            value={test.totalQuestions}
            color='purple.500'
          />
          <StatCard
            icon={Award}
            label='Total Points'
            value={test.totalPoints}
            color='orange.400'
          />
          <StatCard
            icon={Clock}
            label='Avg Time'
            value={formatTime(test.averageTimeSpent)}
            color='cyan.500'
          />
          <StatCard
            icon={TrendingUp}
            label='Avg Score'
            value={`${test.averageScore.toFixed(1)}%`}
            color='green.500'
          />
        </Grid>

        <Box pt={4} borderTop='1px' borderColor={borderColor}>
          <Text fontSize='xs' fontWeight='medium' color='gray.600' mb={2}>
            Score Range
          </Text>
          <Progress
            value={100}
            size='sm'
            borderRadius='full'
            sx={{
              '& > div': {
                background:
                  'linear-gradient(to right, #FC8181, #F6E05E, #68D391)',
              },
            }}
          />
          <Flex justify='space-between' mt={2}>
            <Text fontSize='xs' color='red.500' fontWeight='medium'>
              Low: {test.lowestScore.toFixed(1)}%
            </Text>
            <Text fontSize='xs' color='green.500' fontWeight='medium'>
              High: {test.highestScore.toFixed(1)}%
            </Text>
          </Flex>
        </Box>
      </CardBody>
    </Card>
  );
};
