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
import { colors, textStyles } from '../../utils/colors';

const AdminDashboard: React.FC = () => {
  const { data: users } = useUserAnalytics();
  const { data: tests } = useTestsStats();
  const { data: questions } = useGetQuestions();
  const { data: attempts } = useGetAttemptAnalytics();

  if (!users || !tests) {
    return null;
  }

  return (
    <VStack spacing={6} align='stretch' p={6} bg={colors.pageBg} minH='100vh'>
      <Heading size='lg' {...textStyles.heading}>
        Dashboard
      </Heading>

      <SimpleGrid columns={{ base: 1, md: 2, lg: 4 }} spacing={6}>
        <StatCard
          title='Attempts'
          count={attempts?.totalAttempts ?? 0}
          iconBg={colors.error}
          icon={<Repeat />}
        />
        <StatCard
          title='Questions'
          count={questions ?? 0}
          iconBg={colors.success}
          icon={<CircleQuestionMark />}
        />

        <StatCard
          title='Total Users'
          count={users?.total}
          iconBg={colors.primary}
          icon={<Users />}
        />

        <StatCard
          title='Tests'
          count={tests?.length ?? 0}
          iconBg={colors.warning}
          icon={<BookCheck />}
        />
      </SimpleGrid>

      <Stack spacing={3} maxW={{ base: '100%', lg: '300px' }}>
        <StatCard
          title='Completed Attempts'
          count={attempts?.completedAttempts ?? 0}
          iconBg={colors.success}
          icon={<CircleCheck />}
        />
        <StatCard
          title='In Progress Attempts'
          count={attempts?.inProgressAttempts ?? 0}
          iconBg={colors.info}
          icon={<Loader />}
        />
        <StatCard
          title='Timed Out Attempts'
          count={attempts?.timedOutAttempts ?? 0}
          iconBg={colors.error}
          icon={<TimerOff />}
        />
      </Stack>

      <ResultsAnalyticsCharts />
    </VStack>
  );
};

export default AdminDashboard;
