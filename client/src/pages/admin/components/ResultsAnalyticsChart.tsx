import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  SimpleGrid,
  VStack,
  Text,
  Card,
  CardBody,
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
import { useGetAttemptAnalytics } from '../../../api/services/attemptService';
import { colors, bgStyles, textStyles } from '../../../utils/colors';

const ResultsAnalyticsCharts: React.FC = () => {
  const { data } = useGetAttemptAnalytics();
  const navigate = useNavigate();

  // Navigation handler
  const handleChartClick = () => {
    navigate('/admin/results');
  };

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

  return (
    <VStack spacing={6} align='stretch'>
      {/* Charts Grid */}
      <SimpleGrid columns={{ base: 1, lg: 2 }} spacing={6}>
        {/* Attempt Status Distribution - Pie Chart */}
        <Card
          {...bgStyles.card}
          cursor='pointer'
          onClick={handleChartClick}
          _hover={{ boxShadow: 'lg', transform: 'translateY(-2px)' }}
          transition='all 0.2s'
        >
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
                      onClick={handleChartClick}
                      style={{ cursor: 'pointer' }}
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
        <Card
          {...bgStyles.card}
          cursor='pointer'
          onClick={handleChartClick}
          _hover={{ boxShadow: 'lg', transform: 'translateY(-2px)' }}
          transition='all 0.2s'
        >
          <CardBody>
            <VStack align='stretch' spacing={4}>
              <Text fontSize='lg' fontWeight='semibold' {...textStyles.heading}>
                Key Metrics Comparison
              </Text>
              <Box height='300px'>
                <ResponsiveContainer width='100%' height='100%'>
                  <BarChart data={metricsData} onClick={handleChartClick}>
                    <CartesianGrid
                      strokeDasharray='3 3'
                      stroke={colors.border}
                    />
                    <XAxis
                      dataKey='name'
                      stroke={colors.textPrimary}
                      fontSize={12}
                    />
                    <YAxis
                      stroke={colors.textPrimary}
                      fontSize={12}
                      label={{
                        value: 'Percentage (%)',
                        angle: -90,
                        position: 'insideLeft',
                        style: { fill: colors.textPrimary },
                      }}
                    />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: colors.cardBg,
                        borderColor: colors.border,
                        color: colors.textPrimary,
                      }}
                    />
                    <Bar
                      dataKey='value'
                      radius={[4, 4, 0, 0]}
                      onClick={handleChartClick}
                      style={{ cursor: 'pointer' }}
                    >
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

export default ResultsAnalyticsCharts;
