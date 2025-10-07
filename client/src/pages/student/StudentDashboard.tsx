import { Container, Grid, GridItem } from '@chakra-ui/react';

import {
  useUserActivityStats,
  useCurrentUser,
  useLogoutUser,
} from '../../api/services/authService';
import WelcomeSection from './components/WelcomeSection';

import PerformanceOverview from './components/PerformanceOverview';
import StudentStatsOverview from './components/StudentStatsOverview';

import { StudentPerformance } from './components/StudentPerformance';

const StudentDashboard: React.FC = () => {
  const logout = useLogoutUser();
  const currentUser = useCurrentUser();
  const student_data = currentUser.data;
  const { data: student } = useUserActivityStats(student_data?.id as number);

  const studentStats = {
    totalAttempts: student?.totalAttempts || 0,
    completedAttempts: student?.completedAttempts || 0,
    averageScore: student?.averageScore || 0,
    inProgressAttempts: student?.inProgressAttempts || 0,
    recentActivity: student?.recentActivity || [],
  };

  return (
    <Container maxW='container.xl' py={8}>
      <WelcomeSection
        avatar={student_data?.avatar ?? ''}
        studentName={student_data?.name || 'Student'}
        handleLogout={() => logout.mutate()}
      />
      <StudentStatsOverview stats={studentStats} />

      <Grid templateColumns={{ base: '1fr', lg: '2fr 1fr' }} gap={6}>
        <GridItem>
          <StudentPerformance />
        </GridItem>
        <GridItem>
          <PerformanceOverview stats={studentStats} />
        </GridItem>
      </Grid>
    </Container>
  );
};

export default StudentDashboard;
