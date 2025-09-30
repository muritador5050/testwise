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
  Icon,
} from '@chakra-ui/react';
import { AlertCircle, Clock } from 'lucide-react';

import { getPriorityColor } from './utils';

interface Action {
  id: number;
  type: string;
  description: string;
  priority: string;
}

interface PendingActionsProps {
  actions: Action[];
  borderColor: string;
}

const PendingActions = ({ actions, borderColor }: PendingActionsProps) => (
  <Card mb={6} borderColor={borderColor}>
    <CardHeader>
      <HStack>
        <Icon as={AlertCircle} boxSize={5} color='orange.500' />
        <Heading size='md'>Pending Actions</Heading>
      </HStack>
    </CardHeader>
    <CardBody>
      <VStack spacing={3} align='stretch'>
        {actions.map((a) => (
          <Box
            key={a.id}
            p={3}
            borderWidth='1px'
            borderRadius='md'
            borderColor={borderColor}
            _hover={{ shadow: 'sm', cursor: 'pointer' }}
          >
            <HStack justify='space-between'>
              <VStack align='start' spacing={0}>
                <Text fontSize='sm' fontWeight='semibold'>
                  {a.description}
                </Text>
                <Badge size='sm' colorScheme={getPriorityColor(a.priority)}>
                  {a.priority} priority
                </Badge>
              </VStack>
              <Icon as={Clock} color='gray.500' />
            </HStack>
          </Box>
        ))}
      </VStack>
    </CardBody>
  </Card>
);

export default PendingActions;
