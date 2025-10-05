import { Container, Grid, GridItem } from '@chakra-ui/react';
import WelcomeSection from '../../components/student/WelcomeSection';
import StatsOverview from '../../components/student/StatOverview';
import UpcomingExams from '../../components/student/UpcomingExams';
import RecentResults from '../../components/student/RecentResults';
import PerformanceOverview from '../../components/student/PerformanceOverview';
import {
  useUserActivityStats,
  useCurrentUser,
  useLogoutUser,
} from '../../api/services/authService';
import { useGetAllTests } from '../../api/services/testServices';
import { useNavigate } from 'react-router-dom';

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
        studentName={student_data?.name || 'Student'}
        handleLogout={() => logout.mutate()}
      />
      <StatsOverview stats={studentStats} />

      <Grid templateColumns={{ base: '1fr', lg: '2fr 1fr' }} gap={6}>
        <GridItem>
          <UpcomingExams
            exams={upcoming_test}
            onClick={(id) => navigate(`/student/exam`, { state: { id } })}
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
