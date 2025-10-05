import { Routes, Route } from 'react-router-dom';
import { Box } from '@chakra-ui/react';
import StudentDashboard from '../../../pages/student/StudentDashboard';
import ExamPage from '../../../pages/student/ExamPage';
import ExamInstructions from '../../../pages/student/ExamInstructions';
export default function StudentLayout() {
  return (
    <Box>
      <Routes>
        <Route index element={<StudentDashboard />} />
        <Route path='exam/:attemptId' element={<ExamPage />} />
        <Route path='instructions' element={<ExamInstructions />} />
      </Routes>
    </Box>
  );
}
