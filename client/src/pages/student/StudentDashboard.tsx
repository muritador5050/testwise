import { Container, Grid, GridItem } from '@chakra-ui/react';
import WelcomeSection from '../../components/student/WelcomeSection';
import StatsOverview from '../../components/student/StatOverview';
import UpcomingExams from '../../components/student/UpcomingExams';
import RecentResults from '../../components/student/RecentResults';
import PerformanceOverview from '../../components/student/PerformanceOverview';
import PracticeRecommendations from '../../components/student/PracticeRecommendations';

const StudentDashboard: React.FC = () => {
  const studentName = 'Student';

  const studentStats = {
    totalExams: 24,
    completedExams: 18,
    averageScore: 78.5,
    improvement: 12.3,
    totalStudyHours: 42,
    currentStreak: 7,
  };

  const upcomingExams = [
    {
      id: 1,
      title: 'Mathematics Final Exam',
      subject: 'Mathematics',
      date: '2025-10-05',
      duration: 120,
      questions: 50,
      status: 'upcoming',
    },
    {
      id: 2,
      title: 'Physics Mid-term',
      subject: 'Physics',
      date: '2025-10-08',
      duration: 90,
      questions: 40,
      status: 'upcoming',
    },
    {
      id: 3,
      title: 'Chemistry Quiz',
      subject: 'Chemistry',
      date: '2025-10-10',
      duration: 60,
      questions: 30,
      status: 'upcoming',
    },
  ];

  const recentResults = [
    {
      id: 1,
      examTitle: 'English Literature',
      score: 85,
      totalQuestions: 40,
      date: '2025-09-25',
      status: 'passed',
    },
    {
      id: 2,
      examTitle: 'Biology Test',
      score: 72,
      totalQuestions: 50,
      date: '2025-09-22',
      status: 'passed',
    },
    {
      id: 3,
      examTitle: 'History Quiz',
      score: 91,
      totalQuestions: 30,
      date: '2025-09-20',
      status: 'passed',
    },
  ];

  const practiceRecommendations = [
    {
      id: 1,
      subject: 'Mathematics',
      topic: 'Calculus - Derivatives',
      difficulty: 'Medium',
      estimatedTime: 30,
    },
    {
      id: 2,
      subject: 'Physics',
      topic: 'Mechanics - Force & Motion',
      difficulty: 'Hard',
      estimatedTime: 45,
    },
    {
      id: 3,
      subject: 'Chemistry',
      topic: 'Organic Chemistry',
      difficulty: 'Easy',
      estimatedTime: 20,
    },
  ];

  return (
    <Container maxW='container.xl' py={8}>
      <WelcomeSection studentName={studentName} />
      <StatsOverview stats={studentStats} />

      <Grid templateColumns={{ base: '1fr', lg: '2fr 1fr' }} gap={6}>
        <GridItem>
          <UpcomingExams exams={upcomingExams} />
          <RecentResults results={recentResults} />
        </GridItem>
        <GridItem>
          <PerformanceOverview />
          <PracticeRecommendations practices={practiceRecommendations} />
        </GridItem>
      </Grid>
    </Container>
  );
};

export default StudentDashboard;
