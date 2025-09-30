import {
  Grid,
  Card,
  CardBody,
  Stat,
  StatLabel,
  StatNumber,
  StatHelpText,
  StatArrow,
  useColorModeValue,
} from '@chakra-ui/react';

interface StatsProps {
  totalExams: number;
  activeExams: number;
  totalStudents: number;
  totalQuestions: number;
  averageCompletionRate: number;
  improvement: number;
}

const StatsOverview = ({
  totalExams,
  activeExams,
  totalStudents,
  totalQuestions,
  averageCompletionRate,
  improvement,
}: StatsProps) => {
  const bgColor = useColorModeValue('white', 'gray.800');
  const statBgColor = useColorModeValue('purple.50', 'purple.900');

  return (
    <Grid templateColumns='repeat(auto-fit, minmax(200px, 1fr))' gap={4} mb={8}>
      <Card bg={statBgColor}>
        <CardBody>
          <Stat>
            <StatLabel>Total Exams</StatLabel>
            <StatNumber>{totalExams}</StatNumber>
            <StatHelpText>{activeExams} active</StatHelpText>
          </Stat>
        </CardBody>
      </Card>

      <Card bg={bgColor}>
        <CardBody>
          <Stat>
            <StatLabel>Total Students</StatLabel>
            <StatNumber>{totalStudents}</StatNumber>
            <StatHelpText>Across all exams</StatHelpText>
          </Stat>
        </CardBody>
      </Card>

      <Card bg={bgColor}>
        <CardBody>
          <Stat>
            <StatLabel>Completion Rate</StatLabel>
            <StatNumber>{averageCompletionRate}%</StatNumber>
            <StatHelpText>
              <StatArrow type='increase' />
              {improvement}%
            </StatHelpText>
          </Stat>
        </CardBody>
      </Card>

      <Card bg={bgColor}>
        <CardBody>
          <Stat>
            <StatLabel>Question Bank</StatLabel>
            <StatNumber>{totalQuestions}</StatNumber>
            <StatHelpText>Ready to use</StatHelpText>
          </Stat>
        </CardBody>
      </Card>
    </Grid>
  );
};

export default StatsOverview;
