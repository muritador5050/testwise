import { lazy } from 'react';
import { Routes, Route } from 'react-router-dom';
import { Box } from '@chakra-ui/react';

const StudentDashboard = lazy(
  () => import('../../../pages/student/StudentDashboard')
);
const ExamPage = lazy(() => import('../../../pages/student/ExamPage'));
const ExamInstructions = lazy(
  () => import('../../../pages/student/ExamInstructions')
);
const ExamResult = lazy(() => import('../../../pages/student/ExamResults'));
const PublishedExams = lazy(
  () => import('../../../pages/student/PublishedExams')
);
const StudentResults = lazy(
  () => import('../../../pages/student/StudentResults')
);

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
