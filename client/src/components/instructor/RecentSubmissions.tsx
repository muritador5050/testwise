import {
  Card,
  CardHeader,
  CardBody,
  HStack,
  Heading,
  Icon,
  Button,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Avatar,
  Text,
  Badge,
} from '@chakra-ui/react';
import { Link } from 'react-router-dom';
import { CheckCircle } from 'lucide-react';

interface Submission {
  id: number;
  studentName: string;
  examTitle: string;
  score: number | null;
  submittedAt: string;
  status: string;
}

interface RecentSubmissionsProps {
  submissions: Submission[];
  borderColor: string;
}

const RecentSubmissions = ({
  submissions,
  borderColor,
}: RecentSubmissionsProps) => (
  <Card borderColor={borderColor}>
    <CardHeader>
      <HStack justify='space-between'>
        <HStack>
          <Icon as={CheckCircle} boxSize={5} color='green.500' />
          <Heading size='md'>Recent Submissions</Heading>
        </HStack>
        <Button
          as={Link}
          to='/instructor/submissions'
          size='sm'
          variant='ghost'
        >
          View All
        </Button>
      </HStack>
    </CardHeader>
    <CardBody>
      <Table variant='simple' size='sm'>
        <Thead>
          <Tr>
            <Th>Student</Th>
            <Th>Exam</Th>
            <Th>Score</Th>
            <Th>Time</Th>
            <Th>Status</Th>
            <Th></Th>
          </Tr>
        </Thead>
        <Tbody>
          {submissions.map((s) => (
            <Tr key={s.id}>
              <Td>
                <HStack>
                  <Avatar size='sm' name={s.studentName} />
                  <Text fontSize='sm'>{s.studentName}</Text>
                </HStack>
              </Td>
              <Td fontSize='sm'>{s.examTitle}</Td>
              <Td>
                {s.score !== null ? (
                  <Badge colorScheme={s.score >= 70 ? 'green' : 'red'}>
                    {s.score}%
                  </Badge>
                ) : (
                  <Text fontSize='sm' color='gray.500'>
                    -
                  </Text>
                )}
              </Td>
              <Td fontSize='sm' color='gray.600'>
                {new Date(s.submittedAt).toLocaleTimeString()}
              </Td>
              <Td>
                <Badge colorScheme={s.status === 'graded' ? 'green' : 'yellow'}>
                  {s.status}
                </Badge>
              </Td>
              <Td>
                <Button size='xs' variant='ghost'>
                  Review
                </Button>
              </Td>
            </Tr>
          ))}
        </Tbody>
      </Table>
    </CardBody>
  </Card>
);

export default RecentSubmissions;
