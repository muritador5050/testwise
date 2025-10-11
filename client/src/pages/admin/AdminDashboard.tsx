import React from 'react';
import { SimpleGrid, Heading, VStack, Stack } from '@chakra-ui/react';
import StatCard from '../../components/admin/StatCard';
import {
  BookCheck,
  CircleCheck,
  CircleQuestionMark,
  Loader,
  Repeat,
  TimerOff,
  Users,
} from 'lucide-react';
import { useUserAnalytics } from '../../api/services/authService';
import ResultsAnalyticsCharts from './components/ResultsAnalyticsChart';
import { useTestsStats } from '../../api/services/testServices';
import { useGetQuestions } from '../../api/services/questionServices';
import { useGetAttemptAnalytics } from '../../api/services/attemptService';

const AdminDashboard: React.FC = () => {
  const { data: users } = useUserAnalytics();
  const { data: tests } = useTestsStats();
  const { data: questions } = useGetQuestions();
  const { data: attempts } = useGetAttemptAnalytics();

  if (!users || !tests) {
    return;
  }

  return (
    <VStack spacing={6} align={'stretch'}>
      <Heading size='lg'>Dashboard</Heading>

      <SimpleGrid columns={{ base: 1, md: 2, lg: 4 }} spacing={6}>
        <StatCard
          title='Attempts'
          count={attempts?.totalAttempts ?? 0}
          iconBg='red'
          icon={<Repeat />}
        />
        <StatCard
          title='Questions'
          count={questions ?? 0}
          iconBg='green'
          icon={<CircleQuestionMark />}
        />

        <StatCard
          title='Total Users'
          count={users?.total}
          iconBg='blue'
          icon={<Users />}
        />

        <StatCard
          title='Tests'
          count={tests?.length ?? 0}
          iconBg='yellow'
          icon={<BookCheck />}
        />
      </SimpleGrid>
      <Stack spacing={3} maxW={{ base: '100%', lg: '300px' }}>
        <StatCard
          title='completed Attempts'
          count={attempts?.completedAttempts ?? 0}
          iconBg='green.500'
          icon={<CircleCheck />}
        />
        <StatCard
          title='inProgress Attempts'
          count={attempts?.inProgressAttempts ?? 0}
          iconBg='blue.50'
          icon={<Loader />}
        />
        <StatCard
          title='timedOut Attempts'
          count={attempts?.timedOutAttempts ?? 0}
          iconBg='red.700'
          icon={<TimerOff />}
        />
      </Stack>
      <ResultsAnalyticsCharts />
    </VStack>
  );
};

export default AdminDashboard;
