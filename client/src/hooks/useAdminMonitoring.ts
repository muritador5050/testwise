import { useEffect, useState } from 'react';
import { useWebSocket } from './useWebsocket';
import {
  LiveAttemptResponse,
  StudentStartedEvent,
  StudentAnsweredEvent,
  StudentCompletedEvent,
  ActivityFeedItem,
} from '../types/api';

export const useAdminMonitoring = () => {
  const { isConnected, on, off } = useWebSocket();
  const [liveAttempts, setLiveAttempts] = useState<LiveAttemptResponse[]>([]);
  const [activityFeed, setActivityFeed] = useState<ActivityFeedItem[]>([]);

  useEffect(() => {
    if (!isConnected) return;

    const handleStudentStarted = (data: StudentStartedEvent) => {
      setLiveAttempts((prev) => [
        {
          attemptId: data.attemptId,
          user: data.user,
          test: data.test,
          startedAt: data.startedAt,
          expiresAt: '',
          answeredQuestions: 0,
          correctAnswers: 0,
        },
        ...prev,
      ]);

      setActivityFeed((prev) => [
        {
          type: 'started',
          message: `${data.user.name} started ${data.test.title}`,
          timestamp: new Date(),
        },
        ...prev.slice(0, 49), // Keep only the latest 50 activities
      ]);
    };

    const handleStudentAnswered = (data: StudentAnsweredEvent) => {
      setLiveAttempts((prev) =>
        prev.map((attempt) =>
          attempt.attemptId === data.attemptId
            ? {
                ...attempt,
                answeredQuestions: data.answeredQuestions,
              }
            : attempt
        )
      );

      setActivityFeed((prev) => [
        {
          type: 'answered',
          message: `Question answered in attempt #${data.attemptId}`,
          timestamp: new Date(),
        },
        ...prev.slice(0, 49),
      ]);
    };

    const handleStudentCompleted = (data: StudentCompletedEvent) => {
      setLiveAttempts((prev) =>
        prev.filter((attempt) => attempt.attemptId !== data.attemptId)
      );

      setActivityFeed((prev) => [
        {
          type: 'completed',
          message: `Exam completed - Score: ${data.percentScore.toFixed(1)}%`,
          timestamp: new Date(),
        },
        ...prev.slice(0, 49),
      ]);
    };

    on<StudentStartedEvent>('student_started_exam', handleStudentStarted);
    on<StudentAnsweredEvent>(
      'student_answered_question',
      handleStudentAnswered
    );
    on<StudentCompletedEvent>('student_completed_exam', handleStudentCompleted);

    return () => {
      off<StudentStartedEvent>('student_started_exam', handleStudentStarted);
      off<StudentAnsweredEvent>(
        'student_answered_question',
        handleStudentAnswered
      );
      off<StudentCompletedEvent>(
        'student_completed_exam',
        handleStudentCompleted
      );
    };
  }, [isConnected, on, off]);

  return { liveAttempts, activityFeed, isConnected };
};
