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
  Badge,
} from '@chakra-ui/react';
import { Link } from 'react-router-dom';
import { TrendingUp } from 'lucide-react';
import type { AttemptStatus, UserActivityStats } from '../../types/api';

interface Props {
  results: UserActivityStats;
}

const getStatusColor = (status: AttemptStatus) => {
  switch (status) {
    case 'COMPLETED':
      return 'green';
    case 'IN_PROGRESS':
      return 'blue';
    case 'TIMED_OUT':
      return 'red';
    default:
      return 'gray';
  }
};

const getStatusLabel = (status: AttemptStatus) => {
  return status
    .split('_')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
};

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
        {results.recentActivity.map((activity, index) => (
          <Box
            key={index}
            p={4}
            borderWidth='1px'
            borderRadius='lg'
            borderColor='gray.200'
          >
            <HStack justify='space-between' mb={2}>
              <VStack align='start' spacing={0}>
                <Heading size='sm'>{activity.testTitle}</Heading>
                <Text fontSize='sm' color='gray.600'>
                  {new Date(activity.startedAt).toLocaleDateString()}
                </Text>
              </VStack>
              <VStack align='end' spacing={1}>
                <Badge colorScheme={getStatusColor(activity.status)}>
                  {getStatusLabel(activity.status)}
                </Badge>
                {activity.status === 'COMPLETED' && (
                  <Heading
                    size='lg'
                    color={activity.score >= 70 ? 'green.500' : 'red.500'}
                  >
                    {activity.score}%
                  </Heading>
                )}
              </VStack>
            </HStack>
            {activity.status === 'COMPLETED' && (
              <Progress
                value={activity.score}
                colorScheme={activity.score >= 70 ? 'green' : 'red'}
                size='sm'
                borderRadius='full'
              />
            )}
          </Box>
        ))}
        {results.recentActivity.length === 0 && (
          <Text color='gray.500' textAlign='center' py={4}>
            No recent activity
          </Text>
        )}
      </VStack>
    </CardBody>
  </Card>
);

export default RecentResults;
