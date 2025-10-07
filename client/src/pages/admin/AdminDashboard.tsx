import React from 'react';
import { SimpleGrid, Heading, VStack } from '@chakra-ui/react';
import StatCard from '../../components/admin/StatCard';
import { BookCheck, BookOpen, CircleQuestionMark, Users } from 'lucide-react';
import { useUserAnalytics } from '../../api/services/authService';
import ResultsAnalyticsCharts from './components/ResultsAnalyticsChart';

const AdminDashboard: React.FC = () => {
  const { data } = useUserAnalytics();

  if (!data) {
    return;
  }

  return (
    <VStack spacing={6} align='stretch'>
      <Heading size='lg'>Dashboard</Heading>

      <SimpleGrid columns={{ base: 1, md: 2, lg: 4 }} spacing={6}>
        <StatCard title='Exams' count={5} iconBg='red' icon={<BookOpen />} />
        <StatCard
          title='Questions'
          count={5}
          iconBg='green'
          icon={<CircleQuestionMark />}
        />

        <StatCard
          title='Total Users'
          count={data?.total}
          iconBg='blue'
          icon={<Users />}
        />

        <StatCard
          title='Tests'
          count={5}
          iconBg='yellow'
          icon={<BookCheck />}
        />
      </SimpleGrid>

      <ResultsAnalyticsCharts />
    </VStack>
  );
};

export default AdminDashboard;
