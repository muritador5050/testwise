import { Container, Grid, GridItem, useColorModeValue } from '@chakra-ui/react';
import StatsOverview from '../../components/instructor/StatOverview';
import ActiveExams from '../../components/instructor/ActiveExams';
import RecentSubmissions from '../../components/instructor/RecentSubmissions';
import PendingActions from '../../components/instructor/PendingActions';
import InstructorHeader from '../../components/instructor/InstructorHeader';

const instructorStats = {
  totalExams: 15,
  activeExams: 8,
  totalStudents: 124,
  totalQuestions: 450,
  averageCompletionRate: 87.5,
  improvement: 5.2,
};

const activeExams = [
  {
    id: 1,
    title: 'Mathematics Final Exam',
    subject: 'Mathematics',
    startDate: '2025-10-05',
    endDate: '2025-10-07',
    totalStudents: 45,
    completed: 12,
    averageScore: 75,
    status: 'active',
  },
  {
    id: 2,
    title: 'Physics Mid-term',
    subject: 'Physics',
    startDate: '2025-10-08',
    endDate: '2025-10-10',
    totalStudents: 38,
    completed: 0,
    averageScore: 0,
    status: 'scheduled',
  },
  {
    id: 3,
    title: 'Chemistry Quiz',
    subject: 'Chemistry',
    startDate: '2025-09-28',
    endDate: '2025-09-30',
    totalStudents: 41,
    completed: 41,
    averageScore: 82,
    status: 'completed',
  },
];

const recentSubmissions = [
  {
    id: 1,
    studentName: 'John Doe',
    examTitle: 'Mathematics Quiz',
    score: 85,
    submittedAt: '2025-09-29T14:30:00',
    status: 'graded',
  },
  {
    id: 2,
    studentName: 'Jane Smith',
    examTitle: 'Physics Test',
    score: 92,
    submittedAt: '2025-09-29T13:45:00',
    status: 'graded',
  },
  {
    id: 3,
    studentName: 'Mike Johnson',
    examTitle: 'Chemistry Lab',
    score: null,
    submittedAt: '2025-09-29T12:20:00',
    status: 'pending',
  },
  {
    id: 4,
    studentName: 'Sarah Williams',
    examTitle: 'Mathematics Quiz',
    score: 78,
    submittedAt: '2025-09-29T11:15:00',
    status: 'graded',
  },
];

const pendingActions = [
  {
    id: 1,
    type: 'grading',
    description: '8 exams waiting for review',
    priority: 'high',
  },
  {
    id: 2,
    type: 'question',
    description: '3 new question submissions',
    priority: 'medium',
  },
  {
    id: 3,
    type: 'feedback',
    description: '5 student inquiries',
    priority: 'low',
  },
];

const InstructorDashboard = () => {
  const borderColor = useColorModeValue('gray.200', 'gray.700');

  return (
    <Container maxW='container.xl' py={8}>
      <InstructorHeader />
      <StatsOverview {...instructorStats} />

      <Grid templateColumns={{ base: '1fr', lg: '2fr 1fr' }} gap={6}>
        <GridItem>
          <ActiveExams exams={activeExams} borderColor={borderColor} />
          <RecentSubmissions
            submissions={recentSubmissions}
            borderColor={borderColor}
          />
        </GridItem>

        <GridItem>
          <PendingActions actions={pendingActions} borderColor={borderColor} />
        </GridItem>
      </Grid>
    </Container>
  );
};

export default InstructorDashboard;
