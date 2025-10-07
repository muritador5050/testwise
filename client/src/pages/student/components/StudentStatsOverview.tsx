import {
  Grid,
  Card,
  CardBody,
  Stat,
  StatLabel,
  StatNumber,
  StatHelpText,
} from '@chakra-ui/react';

interface StudentStats {
  totalAttempts: number;
  completedAttempts: number;
  averageScore: number;
  inProgressAttempts: number;
}

interface Props {
  stats: StudentStats;
}

const StudentStatsOverview: React.FC<Props> = ({ stats }) => (
  <Grid templateColumns='repeat(auto-fit, minmax(200px, 1fr))' gap={4} mb={8}>
    <Card>
      <CardBody>
        <Stat>
          <StatLabel>Total Exams</StatLabel>
          <StatNumber>{stats.totalAttempts}</StatNumber>
          <StatHelpText>{stats.completedAttempts} completed</StatHelpText>
        </Stat>
      </CardBody>
    </Card>

    <Card>
      <CardBody>
        <Stat>
          <StatLabel>Inprogress Attempts</StatLabel>
          <StatNumber>{stats.inProgressAttempts}</StatNumber>
          <StatHelpText>This month</StatHelpText>
        </Stat>
      </CardBody>
    </Card>
  </Grid>
);

export default StudentStatsOverview;
