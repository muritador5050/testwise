import React from 'react';
import {
  Box,
  Card,
  CardBody,
  CardHeader,
  Heading,
  VStack,
  HStack,
  Text,
  Badge,
  SimpleGrid,
  Avatar,
  Flex,
} from '@chakra-ui/react';
import { useAdminMonitoring } from '../../hooks/useAdminMonitoring';
import { useGetLiveAttempts } from '../../api/services/attemptService';
import { Users, Activity, Clock } from 'lucide-react';
import { colors } from '../../utils/colors';

const LiveMonitoring: React.FC = () => {
  const {
    liveAttempts: wsLiveAttempts,
    activityFeed,
    isConnected,
  } = useAdminMonitoring();

  const { data: apiLiveAttempts } = useGetLiveAttempts();

  const liveAttempts = apiLiveAttempts || wsLiveAttempts;

  return (
    <Box p={6} bg={colors.pageBg} minH='100vh'>
      <VStack spacing={6} align='stretch'>
        {/* Header */}
        <Heading size='lg' color={colors.textPrimary}>
          Live Exam Monitoring
        </Heading>

        {/* Stats Cards */}
        <SimpleGrid columns={{ base: 1, md: 3 }} spacing={4}>
          <Card
            bg={colors.cardBg}
            borderColor={colors.border}
            borderWidth='1px'
          >
            <CardBody>
              <HStack spacing={3}>
                <Box p={3} bg={colors.primary} borderRadius='lg' color='white'>
                  <Users size={24} />
                </Box>
                <Box>
                  <Text fontSize='sm' color={colors.textSecondary}>
                    Active Students
                  </Text>
                  <Text
                    fontSize='2xl'
                    fontWeight='bold'
                    color={colors.textPrimary}
                  >
                    {liveAttempts?.length || 0}
                  </Text>
                </Box>
              </HStack>
            </CardBody>
          </Card>

          <Card
            bg={colors.cardBg}
            borderColor={colors.border}
            borderWidth='1px'
          >
            <CardBody>
              <HStack spacing={3}>
                <Box
                  p={3}
                  bg={isConnected ? colors.success : colors.error}
                  borderRadius='lg'
                  color='white'
                >
                  <Activity size={24} />
                </Box>
                <Box>
                  <Text fontSize='sm' color={colors.textSecondary}>
                    Connection
                  </Text>
                  <Text
                    fontSize='2xl'
                    fontWeight='bold'
                    color={colors.textPrimary}
                  >
                    {isConnected ? 'Live' : 'Offline'}
                  </Text>
                </Box>
              </HStack>
            </CardBody>
          </Card>

          <Card
            bg={colors.cardBg}
            borderColor={colors.border}
            borderWidth='1px'
          >
            <CardBody>
              <HStack spacing={3}>
                <Box p={3} bg={colors.warning} borderRadius='lg' color='white'>
                  <Clock size={24} />
                </Box>
                <Box>
                  <Text fontSize='sm' color={colors.textSecondary}>
                    Live Activity
                  </Text>
                  <Text
                    fontSize='2xl'
                    fontWeight='bold'
                    color={colors.textPrimary}
                  >
                    {activityFeed.length}
                  </Text>
                </Box>
              </HStack>
            </CardBody>
          </Card>
        </SimpleGrid>

        {/* Live Attempts */}
        <Card bg={colors.cardBg} borderColor={colors.border} borderWidth='1px'>
          <CardHeader>
            <Heading size='md' color={colors.textPrimary}>
              Active Exams
            </Heading>
          </CardHeader>
          <CardBody>
            {liveAttempts && liveAttempts.length > 0 ? (
              <VStack spacing={3} align='stretch'>
                {liveAttempts.map((attempt) => (
                  <Card
                    key={attempt.attemptId}
                    bg={colors.sectionBg}
                    borderColor={colors.border}
                    borderWidth='1px'
                  >
                    <CardBody>
                      <Flex justify='space-between' align='center'>
                        <HStack spacing={3}>
                          <Avatar size='sm' name={attempt.user?.name} />
                          <Box>
                            <Text fontWeight='bold' color={colors.textPrimary}>
                              {attempt.user?.name}
                            </Text>
                            <Text fontSize='sm' color={colors.textSecondary}>
                              {attempt.test?.title}
                            </Text>
                          </Box>
                        </HStack>
                        <VStack spacing={1} align='flex-end'>
                          <Badge colorScheme='green'>In Progress </Badge>
                          <Text fontSize='xs' color={colors.textSecondary}>
                            {attempt?.answeredQuestions} answered
                          </Text>
                        </VStack>
                      </Flex>
                    </CardBody>
                  </Card>
                ))}
              </VStack>
            ) : (
              <Text color={colors.textSecondary} textAlign='center' py={8}>
                No active exams at the moment
              </Text>
            )}
          </CardBody>
        </Card>

        {/* Live Activity Feed */}
        <Card bg={colors.cardBg} borderColor={colors.border} borderWidth='1px'>
          <CardHeader>
            <Heading size='md' color={colors.textPrimary}>
              Live Activity Feed
            </Heading>
          </CardHeader>
          <CardBody>
            {activityFeed.length > 0 ? (
              <VStack spacing={2} align='stretch'>
                {activityFeed.slice(0, 10).map((activity, index) => (
                  <Flex
                    key={index}
                    justify='space-between'
                    p={3}
                    bg={colors.sectionBg}
                    borderRadius='md'
                  >
                    <HStack spacing={2}>
                      <Badge
                        colorScheme={
                          activity.type === 'started'
                            ? 'blue'
                            : activity.type === 'completed'
                            ? 'green'
                            : activity.type === 'timed_out'
                            ? 'red'
                            : 'yellow'
                        }
                      >
                        {activity.type}
                      </Badge>
                      <Text fontSize='sm' color={colors.textPrimary}>
                        {activity.message}
                      </Text>
                    </HStack>
                    <Text fontSize='xs' color={colors.textSecondary}>
                      {activity.timestamp.toLocaleTimeString()}
                    </Text>
                  </Flex>
                ))}
              </VStack>
            ) : (
              <Text color={colors.textSecondary} textAlign='center' py={8}>
                No recent activity
              </Text>
            )}
          </CardBody>
        </Card>
      </VStack>
    </Box>
  );
};

export default LiveMonitoring;
