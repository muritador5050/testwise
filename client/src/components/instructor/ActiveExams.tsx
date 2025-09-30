import {
  Card,
  CardHeader,
  CardBody,
  HStack,
  VStack,
  Heading,
  Badge,
  Box,
  Text,
  Button,
  Progress,
  IconButton,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
} from '@chakra-ui/react';
import { Link } from 'react-router-dom';
import {
  FileText,
  Users,
  TrendingUp,
  MoreVertical,
  Eye,
  Edit,
  BarChart2,
  Trash2,
} from 'lucide-react';
import { getStatusColor } from './utils';

interface Exam {
  id: number;
  title: string;
  subject: string;
  startDate: string;
  endDate: string;
  totalStudents: number;
  completed: number;
  averageScore: number;
  status: string;
}

interface ActiveExamsProps {
  exams: Exam[];
  borderColor: string;
}

const ActiveExams = ({ exams, borderColor }: ActiveExamsProps) => (
  <Card mb={6} borderColor={borderColor}>
    <CardHeader>
      <HStack justify='space-between'>
        <HStack>
          <FileText size={20} color='var(--chakra-colors-purple-500)' />
          <Heading size='md'>Active Exams</Heading>
        </HStack>
        <Button as={Link} to='/instructor/exams' size='sm' variant='ghost'>
          View All
        </Button>
      </HStack>
    </CardHeader>
    <CardBody>
      <VStack spacing={4} align='stretch'>
        {exams.map((exam) => (
          <Box
            key={exam.id}
            p={4}
            borderWidth='1px'
            borderRadius='lg'
            borderColor={borderColor}
            _hover={{ shadow: 'md' }}
          >
            <HStack justify='space-between' mb={3}>
              <VStack align='start' spacing={0}>
                <HStack>
                  <Heading size='sm'>{exam.title}</Heading>
                  <Badge colorScheme={getStatusColor(exam.status)}>
                    {exam.status}
                  </Badge>
                </HStack>
                <Text fontSize='sm' color='gray.600'>
                  {exam.subject}
                </Text>
              </VStack>
              <Menu>
                <MenuButton
                  as={IconButton}
                  icon={<MoreVertical size={18} />}
                  variant='ghost'
                  size='sm'
                />
                <MenuList>
                  <MenuItem icon={<Eye size={16} />}>View Details</MenuItem>
                  <MenuItem icon={<Edit size={16} />}>Edit Exam</MenuItem>
                  <MenuItem icon={<BarChart2 size={16} />}>
                    View Results
                  </MenuItem>
                  <MenuItem icon={<Trash2 size={16} />} color='red.500'>
                    Delete
                  </MenuItem>
                </MenuList>
              </Menu>
            </HStack>

            <HStack spacing={4} fontSize='sm' color='gray.600' mb={3}>
              <HStack>
                <Users size={16} />
                <Text>
                  {exam.completed}/{exam.totalStudents} completed
                </Text>
              </HStack>
              <HStack>
                <TrendingUp size={16} />
                <Text>Avg: {exam.averageScore}%</Text>
              </HStack>
            </HStack>

            <Progress
              value={(exam.completed / exam.totalStudents) * 100}
              colorScheme='purple'
              size='sm'
              borderRadius='full'
              mb={3}
            />

            <HStack spacing={2}>
              <Button
                as={Link}
                to={`/instructor/exams/${exam.id}/results`}
                size='sm'
                colorScheme='purple'
                flex={1}
              >
                View Results
              </Button>
              <Button
                as={Link}
                to={`/instructor/exams/${exam.id}/edit`}
                size='sm'
                variant='outline'
                flex={1}
              >
                Edit Exam
              </Button>
            </HStack>
          </Box>
        ))}
      </VStack>
    </CardBody>
  </Card>
);

export default ActiveExams;
