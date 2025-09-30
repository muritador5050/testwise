import {
  Card,
  CardHeader,
  CardBody,
  HStack,
  Heading,
  VStack,
  Box,
  Text,
  Button,
  Progress,
} from '@chakra-ui/react';
import { Link } from 'react-router-dom';
import { TrendingUp } from 'lucide-react';

interface Result {
  id: number;
  examTitle: string;
  score: number;
  totalQuestions: number;
  date: string;
  status: string;
}

interface Props {
  results: Result[];
}

const RecentResults: React.FC<Props> = ({ results }) => (
  <Card>
    <CardHeader>
      <HStack justify='space-between'>
        <HStack>
          <TrendingUp size={16} color='green.500' />
          <Heading size='md'>Recent Results</Heading>
        </HStack>
        <Button as={Link} to='/student/results' size='sm' variant='ghost'>
          View All
        </Button>
      </HStack>
    </CardHeader>
    <CardBody>
      <VStack spacing={4} align='stretch'>
        {results.map((result) => (
          <Box
            key={result.id}
            p={4}
            borderWidth='1px'
            borderRadius='lg'
            borderColor='gray.200'
          >
            <HStack justify='space-between' mb={2}>
              <VStack align='start' spacing={0}>
                <Heading size='sm'>{result.examTitle}</Heading>
                <Text fontSize='sm' color='gray.600'>
                  {new Date(result.date).toLocaleDateString()}
                </Text>
              </VStack>
              <VStack align='end' spacing={0}>
                <Heading
                  size='lg'
                  color={result.score >= 70 ? 'green.500' : 'red.500'}
                >
                  {result.score}%
                </Heading>
                <Text fontSize='xs' color='gray.600'>
                  {result.totalQuestions} questions
                </Text>
              </VStack>
            </HStack>
            <Progress
              value={result.score}
              colorScheme={result.score >= 70 ? 'green' : 'red'}
              size='sm'
              borderRadius='full'
            />
          </Box>
        ))}
      </VStack>
    </CardBody>
  </Card>
);

export default RecentResults;
