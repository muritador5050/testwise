import {
  Card,
  CardHeader,
  CardBody,
  HStack,
  Heading,
  VStack,
  Box,
  Badge,
  Text,
  Button,
} from '@chakra-ui/react';
import { Link } from 'react-router-dom';
import { Calendar, Clock, Book } from 'lucide-react';

interface Exam {
  id: number;
  title: string;
  subject: string;
  date: string;
  duration: number;
  questions: number;
  status: string;
}

interface Props {
  exams: Exam[];
}

const UpcomingExams: React.FC<Props> = ({ exams }) => (
  <Card mb={6}>
    <CardHeader>
      <HStack justify='space-between'>
        <HStack>
          <Calendar size={16} />

          <Heading size='md'>Upcoming Exams</Heading>
        </HStack>
        <Button as={Link} to='/student/exams' size='sm' variant='ghost'>
          View All
        </Button>
      </HStack>
    </CardHeader>
    <CardBody>
      <VStack spacing={4} align='stretch'>
        {exams.map((exam) => (
          <Box key={exam.id} p={4} borderWidth='1px' borderRadius='lg'>
            <HStack justify='space-between' mb={2}>
              <VStack align='start'>
                <Heading size='sm'>{exam.title}</Heading>
                <Text fontSize='sm'>{exam.subject}</Text>
              </VStack>
              <Badge colorScheme='orange'>{exam.status}</Badge>
            </HStack>
            <HStack fontSize='sm' color='gray.600'>
              <HStack>
                <Calendar size={16} />
                <Text>{new Date(exam.date).toLocaleDateString()}</Text>
              </HStack>
              <HStack>
                <Clock size={16} />

                <Text>{exam.duration} min</Text>
              </HStack>
              <HStack>
                <Book size={16} />
                <Text>{exam.questions} questions</Text>
              </HStack>
            </HStack>
            <Button
              as={Link}
              to={`/student/exams/${exam.id}/start`}
              mt={3}
              colorScheme='blue'
              size='sm'
              width='full'
            >
              Start Exam
            </Button>
          </Box>
        ))}
      </VStack>
    </CardBody>
  </Card>
);

export default UpcomingExams;
