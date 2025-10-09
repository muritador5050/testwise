import { Container } from '@chakra-ui/react';

import { useCurrentUser, useLogoutUser } from '../../api/services/authService';
import WelcomeSection from './components/WelcomeSection';

import { StudentPerformance } from './components/StudentPerformance';

const StudentDashboard: React.FC = () => {
  const logout = useLogoutUser();
  const currentUser = useCurrentUser();
  const student_data = currentUser.data;

  return (
    <Container maxW='container.xl' py={8}>
      <WelcomeSection
        avatar={student_data?.avatar ?? ''}
        studentName={student_data?.name || 'Student'}
        handleLogout={() => logout.mutate()}
      />

      <StudentPerformance />
    </Container>
  );
};

export default StudentDashboard;
