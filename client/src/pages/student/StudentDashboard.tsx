import { Container, Grid, GridItem } from '@chakra-ui/react';

import {
  useUserActivityStats,
  useCurrentUser,
  useLogoutUser,
} from '../../api/services/authService';
import { useGetAllTests } from '../../api/services/testServices';
import { useNavigate } from 'react-router-dom';
import WelcomeSection from './components/WelcomeSection';
import RecentResults from './components/RecentResults';
import PerformanceOverview from './components/PerformanceOverview';
import StudentStatsOverview from './components/StudentStatsOverview';
import UpcomingExams from './components/UpcomingExams';

const StudentDashboard: React.FC = () => {
  const navigate = useNavigate();
  const logout = useLogoutUser();
  const currentUser = useCurrentUser();
  const student_data = currentUser.data;
  const { data: student } = useUserActivityStats(student_data?.id as number);
  const { data: test } = useGetAllTests();
  const upcoming_test = test?.tests || [];

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
          <UpcomingExams
            exams={upcoming_test}
            onClick={(testId) =>
              navigate(`/student/instructions`, { state: { testId } })
            }
          />
          <RecentResults results={studentStats} />
        </GridItem>
        <GridItem>
          <PerformanceOverview stats={studentStats} />
        </GridItem>
      </Grid>
    </Container>
  );
};

export default StudentDashboard;
