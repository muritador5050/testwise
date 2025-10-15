import React from 'react';
import {
  Box,
  SimpleGrid,
  VStack,
  HStack,
  Text,
  Card,
  CardBody,
  Stat,
  StatLabel,
  StatNumber,
} from '@chakra-ui/react';
import {
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import { TrendingUp, Users, Target, Clock } from 'lucide-react';
import { useGetAttemptAnalytics } from '../../api/services/attemptService';
import { colors, bgStyles, textStyles } from '../../utils/colors';

const ResultsStatistics: React.FC = () => {
  const { data } = useGetAttemptAnalytics();

  // Data for pie chart - Attempt Status Distribution
  const attemptStatusData = [
    {
      name: 'Completed',
      value: data?.completedAttempts || 0,
      color: colors.success,
    },
    {
      name: 'In Progress',
      value: data?.inProgressAttempts || 0,
      color: colors.warning,
    },
    {
      name: 'Timed Out',
      value: data?.timedOutAttempts || 0,
      color: colors.error,
    },
  ];

  // Data for bar chart - Key Metrics Comparison
  const metricsData = [
    { name: 'Pass Rate', value: data?.passRate || 0, fill: '#8B5CF6' },
    { name: 'Avg Score', value: data?.averageScore || 0, fill: colors.primary },
    {
      name: 'Completion',
      value: data?.totalAttempts
        ? ((data?.completedAttempts || 0) / data.totalAttempts) * 100
        : 0,
      fill: colors.success,
    },
  ];

  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}m ${secs}s`;
  };

  return (
    <VStack spacing={6} align='stretch'>
      {/* Key Metrics Overview */}
      <SimpleGrid columns={{ base: 2, md: 4 }} spacing={4}>
        <Card {...bgStyles.card}>
          <CardBody>
            <Stat>
              <HStack align='center' mb={2}>
                <Users color={colors.primary} size={20} />
                <StatLabel {...textStyles.body}>Total Attempts</StatLabel>
              </HStack>
              <StatNumber fontSize='2xl' {...textStyles.heading}>
                {data?.totalAttempts || 0}
              </StatNumber>
            </Stat>
          </CardBody>
        </Card>

        <Card {...bgStyles.card}>
          <CardBody>
            <Stat>
              <HStack align='center' mb={2}>
                <Target color={colors.success} size={20} />
                <StatLabel {...textStyles.body}>Pass Rate</StatLabel>
              </HStack>
              <StatNumber fontSize='2xl' color={colors.success}>
                {(data?.passRate || 0).toFixed(1)}%
              </StatNumber>
            </Stat>
          </CardBody>
        </Card>

        <Card {...bgStyles.card}>
          <CardBody>
            <Stat>
              <HStack align='center' mb={2}>
                <TrendingUp color='#8B5CF6' size={20} />
                <StatLabel {...textStyles.body}>Avg Score</StatLabel>
              </HStack>
              <StatNumber fontSize='2xl' color='#8B5CF6'>
                {(data?.averageScore || 0).toFixed(1)}%
              </StatNumber>
            </Stat>
          </CardBody>
        </Card>

        <Card {...bgStyles.card}>
          <CardBody>
            <Stat>
              <HStack align='center' mb={2}>
                <Clock color={colors.warning} size={20} />
                <StatLabel {...textStyles.body}>Avg Time</StatLabel>
              </HStack>
              <StatNumber fontSize='xl' color={colors.warning}>
                {formatTime(data?.averageTimeSpent || 0)}
              </StatNumber>
            </Stat>
          </CardBody>
        </Card>
      </SimpleGrid>

      {/* Charts Grid */}
      <SimpleGrid columns={{ base: 1, lg: 2 }} spacing={6}>
        {/* Attempt Status Distribution - Pie Chart */}
        <Card {...bgStyles.card}>
          <CardBody>
            <VStack align='stretch' spacing={4}>
              <Text fontSize='lg' fontWeight='semibold' {...textStyles.heading}>
                Attempt Status Distribution
              </Text>
              <Box height='300px'>
                <ResponsiveContainer width='100%' height='100%'>
                  <PieChart>
                    <Pie
                      data={attemptStatusData}
                      cx='50%'
                      cy='50%'
                      labelLine={false}
                      label={({ name, percent }) =>
                        `${name}: ${((percent as number) * 100).toFixed(0)}%`
                      }
                      outerRadius={80}
                      fill='#8884d8'
                      dataKey='value'
                    >
                      {attemptStatusData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip
                      contentStyle={{
                        backgroundColor: colors.cardBg,
                        borderColor: colors.border,
                        color: colors.textPrimary,
                      }}
                    />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </Box>
            </VStack>
          </CardBody>
        </Card>

        {/* Key Metrics Comparison - Bar Chart */}
        <Card {...bgStyles.card}>
          <CardBody>
            <VStack align='stretch' spacing={4}>
              <Text fontSize='lg' fontWeight='semibold' {...textStyles.heading}>
                Key Metrics Comparison
              </Text>
              <Box height='300px'>
                <ResponsiveContainer width='100%' height='100%'>
                  <BarChart data={metricsData}>
                    <CartesianGrid
                      strokeDasharray='3 3'
                      stroke={colors.border}
                    />
                    <XAxis
                      dataKey='name'
                      stroke={colors.textSecondary}
                      fontSize={12}
                    />
                    <YAxis
                      stroke={colors.textSecondary}
                      fontSize={12}
                      label={{
                        value: 'Percentage (%)',
                        angle: -90,
                        position: 'insideLeft',
                        style: { fill: colors.textSecondary },
                      }}
                    />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: colors.cardBg,
                        borderColor: colors.border,
                        color: colors.textPrimary,
                      }}
                    />
                    <Bar dataKey='value' radius={[4, 4, 0, 0]}>
                      {metricsData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.fill} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </Box>
            </VStack>
          </CardBody>
        </Card>
      </SimpleGrid>
    </VStack>
  );
};

export default ResultsStatistics;
