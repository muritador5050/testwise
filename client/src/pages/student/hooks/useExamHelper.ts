import type { QuestionType } from '../../../types/api';

export const formatTime = (seconds: number): string => {
  const hrs = Math.floor(seconds / 3600);
  const mins = Math.floor((seconds % 3600) / 60);
  const secs = seconds % 60;
  return `${hrs.toString().padStart(2, '0')}:${mins
    .toString()
    .padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
};

export const getTimePercentage = (
  timeRemaining: number,
  duration: number
): number => {
  return (timeRemaining / (duration * 60)) * 100;
};

export const getQuestionTypeBadge = (type: QuestionType) => {
  const badges = {
    MULTIPLE_CHOICE: { color: 'blue', text: 'Multiple Choice' },
    MULTIPLE_ANSWER: { color: 'purple', text: 'Multiple Answer' },
    TRUE_FALSE: { color: 'green', text: 'True/False' },
    SHORT_ANSWER: { color: 'orange', text: 'Short Answer' },
    ESSAY: { color: 'red', text: 'Essay' },
  };
  return badges[type] || { color: 'gray', text: type };
};
