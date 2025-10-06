import { useState, useEffect, useCallback, useMemo } from 'react';

export type AnswerValue = string | string[];

export interface Answers {
  [questionId: number]: AnswerValue;
}

export const useExamAnswers = (attemptId: number) => {
  const [answers, setAnswers] = useState<Answers>({});

  // Restore from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem(`exam-${attemptId}`);
    if (saved) {
      try {
        setAnswers(JSON.parse(saved));
      } catch (error) {
        console.error('Failed to parse saved answers:', error);
      }
    }
  }, [attemptId]);

  // Save to localStorage whenever answers change
  useEffect(() => {
    if (Object.keys(answers).length > 0) {
      localStorage.setItem(`exam-${attemptId}`, JSON.stringify(answers));
    }
  }, [answers, attemptId]);

  const isQuestionAnswered = useCallback(
    (questionId: number): boolean => {
      const answer = answers[questionId];
      if (Array.isArray(answer)) {
        return answer.length > 0;
      }
      return answer !== undefined && answer !== '';
    },
    [answers]
  );

  const answeredCount = useMemo(() => {
    return Object.keys(answers).filter((key) => {
      const answer = answers[parseInt(key)];
      if (Array.isArray(answer)) return answer.length > 0;
      return answer !== undefined && answer !== '';
    }).length;
  }, [answers]);

  return {
    answers,
    setAnswers,
    isQuestionAnswered,
    answeredCount,
  };
};
