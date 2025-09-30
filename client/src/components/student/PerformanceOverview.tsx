import {
  Card,
  CardHeader,
  CardBody,
  HStack,
  Heading,
  VStack,
  Text,
  Progress,
  Divider,
} from '@chakra-ui/react';
import { Target } from 'lucide-react';

const PerformanceOverview: React.FC = () => (
  <Card mb={6}>
    <CardHeader>
      <HStack>
        <Target size={16} color='purple.500' />
        <Heading size='md'>Performance</Heading>
      </HStack>
    </CardHeader>
    <CardBody>
      <VStack spacing={4} align='stretch'>
        <BoxSection label='Completion Rate' value={75} color='blue' />
        <Divider />
        <BoxSection label='Accuracy Rate' value={82} color='green' />
        <Divider />
        <BoxSection label='Time Management' value={88} color='purple' />
      </VStack>
    </CardBody>
  </Card>
);

interface BoxSectionProps {
  label: string;
  value: number;
  color: string;
}

const BoxSection: React.FC<BoxSectionProps> = ({ label, value, color }) => (
  <div>
    <HStack justify='space-between' mb={2}>
      <Text fontSize='sm'>{label}</Text>
      <Text fontSize='sm' fontWeight='bold'>
        {value}%
      </Text>
    </HStack>
    <Progress value={value} colorScheme={color} size='sm' />
  </div>
);

export default PerformanceOverview;
