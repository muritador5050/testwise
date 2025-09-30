import {
  Card,
  CardHeader,
  CardBody,
  CardFooter,
  HStack,
  Heading,
  VStack,
  Box,
  Text,
  Badge,
  Button,
} from '@chakra-ui/react';
import { Link } from 'react-router-dom';
import { Award, Clock } from 'lucide-react';

interface Practice {
  id: number;
  subject: string;
  topic: string;
  difficulty: string;
  estimatedTime: number;
}

interface Props {
  practices: Practice[];
}

const getDifficultyColor = (difficulty: string) => {
  switch (difficulty.toLowerCase()) {
    case 'easy':
      return 'green';
    case 'medium':
      return 'yellow';
    case 'hard':
      return 'red';
    default:
      return 'gray';
  }
};

const PracticeRecommendations: React.FC<Props> = ({ practices }) => (
  <Card>
    <CardHeader>
      <HStack>
        <Award size={16} color='orange.500' />

        <Heading size='md'>Practice</Heading>
      </HStack>
    </CardHeader>
    <CardBody>
      <VStack spacing={3} align='stretch'>
        {practices.map((practice) => (
          <Box
            key={practice.id}
            p={3}
            borderWidth='1px'
            borderRadius='md'
            borderColor='gray.200'
            _hover={{ shadow: 'sm', borderColor: 'blue.300' }}
            cursor='pointer'
          >
            <VStack align='start' spacing={1}>
              <Text fontWeight='semibold' fontSize='sm'>
                {practice.topic}
              </Text>
              <HStack spacing={2}>
                <Badge size='sm' colorScheme='blue'>
                  {practice.subject}
                </Badge>
                <Badge
                  size='sm'
                  colorScheme={getDifficultyColor(practice.difficulty)}
                >
                  {practice.difficulty}
                </Badge>
              </HStack>
              <HStack fontSize='xs' color='gray.600'>
                <Clock size={16} />
                <Text>{practice.estimatedTime} min</Text>
              </HStack>
            </VStack>
          </Box>
        ))}
      </VStack>
    </CardBody>
    <CardFooter>
      <Button
        as={Link}
        to='/student/practice'
        colorScheme='orange'
        width='full'
        size='sm'
      >
        Browse All Topics
      </Button>
    </CardFooter>
  </Card>
);

export default PracticeRecommendations;
