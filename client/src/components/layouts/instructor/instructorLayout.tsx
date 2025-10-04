import { Routes, Route } from 'react-router-dom';
import InstructorDashboard from '../../../pages/instructor/InstructorDashboard';
import ExamsPage from '../../../pages/ExamsPage';
import QuestionPage from '../../../pages/QuestionsPage';
import ResultsPage from '../../../pages/ResultsPage';
import SettingsPage from '../../../pages/SettingsPage';
import QuestionManager from '../../shared/QuestionManager';
import { Box } from '@chakra-ui/react';
import TestCreator from '../../../pages/instructor/TestCreator';

export default function InstructorLayout() {
  return (
    <Box>
      <Routes>
        <Route index element={<InstructorDashboard />} />
        <Route path='exams' element={<ExamsPage />} />
        <Route path='exams/create' element={<TestCreator />} />
        <Route
          path='question-manager'
          element={<QuestionManager testId={1} onQuestionsUpdate={() => {}} />}
        />
        <Route path='questions' element={<QuestionPage />} />
        <Route path='questions/create' element={<div>Create Question</div>} />
        <Route path='results' element={<ResultsPage />} />
        <Route path='settings' element={<SettingsPage />} />
      </Routes>
    </Box>
  );
}
