import { Routes, Route } from 'react-router-dom';
import { Box } from '@chakra-ui/react';
import StudentDashboard from '../../../pages/student/StudentDashboard';
import ExamPage from '../../../pages/student/ExamPage';
import ExamInstructions from '../../../pages/student/ExamInstructions';
import ExamResult from '../../../pages/student/ExamResults';
import PublishedExams from '../../../pages/student/PublishedExams';
import StudentResults from '../../../pages/student/StudentResults';
export default function StudentLayout() {
  return (
    <Box>
      <Routes>
        <Route index element={<StudentDashboard />} />
        <Route path='exams' element={<PublishedExams />} />
        <Route path='exam/:attemptId' element={<ExamPage />} />
        <Route path='instructions' element={<ExamInstructions />} />
        <Route path='exam/results' element={<ExamResult />} />
        <Route path='results' element={<StudentResults />} />
      </Routes>
    </Box>
  );
}
