import {
  Grid,
  Card,
  CardBody,
  Stat,
  StatLabel,
  StatNumber,
  StatHelpText,
  StatArrow,
} from '@chakra-ui/react';

interface StudentStats {
  totalExams: number;
  completedExams: number;
  averageScore: number;
  improvement: number;
  totalStudyHours: number;
  currentStreak: number;
}

interface Props {
  stats: StudentStats;
}

const StatsOverview: React.FC<Props> = ({ stats }) => (
  <Grid templateColumns='repeat(auto-fit, minmax(200px, 1fr))' gap={4} mb={8}>
    <Card>
      <CardBody>
        <Stat>
          <StatLabel>Total Exams</StatLabel>
          <StatNumber>{stats.totalExams}</StatNumber>
          <StatHelpText>{stats.completedExams} completed</StatHelpText>
        </Stat>
      </CardBody>
    </Card>

    <Card>
      <CardBody>
        <Stat>
          <StatLabel>Average Score</StatLabel>
          <StatNumber>{stats.averageScore}%</StatNumber>
          <StatHelpText>
            <StatArrow type='increase' />
            {stats.improvement}%
          </StatHelpText>
        </Stat>
      </CardBody>
    </Card>

    <Card>
      <CardBody>
        <Stat>
          <StatLabel>Study Hours</StatLabel>
          <StatNumber>{stats.totalStudyHours}h</StatNumber>
          <StatHelpText>This month</StatHelpText>
        </Stat>
      </CardBody>
    </Card>

    <Card>
      <CardBody>
        <Stat>
          <StatLabel>Current Streak</StatLabel>
          <StatNumber>{stats.currentStreak} days</StatNumber>
          <StatHelpText>Keep it up! 🔥</StatHelpText>
        </Stat>
      </CardBody>
    </Card>
  </Grid>
);

export default StatsOverview;
