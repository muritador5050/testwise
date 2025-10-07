import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  SimpleGrid,
  VStack,
  Text,
  Card,
  CardBody,
  useColorModeValue,
} from '@chakra-ui/react';
import {
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import { useGetAttemptAnalytics } from '../../../api/services/attemptService';

const ResultsAnalyticsCharts: React.FC = () => {
  const { data } = useGetAttemptAnalytics();
  const navigate = useNavigate();

  const cardBg = useColorModeValue('white', 'gray.700');
  const borderColor = useColorModeValue('gray.200', 'gray.600');
  const chartTextColor = useColorModeValue('#374151', '#9CA3AF');

  // Navigation handler
  const handleChartClick = () => {
    navigate('/admin/results');
  };

  // Data for pie chart - Attempt Status Distribution
  const attemptStatusData = [
    {
      name: 'Completed',
      value: data?.completedAttempts || 0,
      color: '#10B981',
    },
    {
      name: 'In Progress',
      value: data?.inProgressAttempts || 0,
      color: '#F59E0B',
    },
    { name: 'Timed Out', value: data?.timedOutAttempts || 0, color: '#EF4444' },
  ];

  // Data for bar chart - Key Metrics Comparison
  const metricsData = [
    { name: 'Pass Rate', value: data?.passRate || 0, fill: '#8B5CF6' },
    { name: 'Avg Score', value: data?.averageScore || 0, fill: '#3B82F6' },
    {
      name: 'Completion',
      value: data?.totalAttempts
        ? ((data?.completedAttempts || 0) / data.totalAttempts) * 100
        : 0,
      fill: '#10B981',
    },
  ];

  // Data for line chart - Performance Trends (mock data for demonstration)
  const performanceTrendData = [
    { attempt: 1, score: 35, time: 15000 },
    { attempt: 2, score: 42, time: 18000 },
    { attempt: 3, score: 38, time: 17000 },
    { attempt: 4, score: 55, time: 22000 },
    { attempt: 5, score: 47, time: 19000 },
    { attempt: 6, score: 60, time: 21000 },
    { attempt: 7, score: 52, time: 19500 },
    { attempt: 8, score: 48, time: 20500 },
  ];

  return (
    <VStack spacing={6} align='stretch'>
      {/* Charts Grid */}
      <SimpleGrid columns={{ base: 1, lg: 2 }} spacing={6}>
        {/* Attempt Status Distribution - Pie Chart */}
        <Card
          bg={cardBg}
          borderWidth='1px'
          borderColor={borderColor}
          cursor='pointer'
          onClick={handleChartClick}
          _hover={{ boxShadow: 'lg', transform: 'translateY(-2px)' }}
          transition='all 0.2s'
        >
          <CardBody>
            <VStack align='stretch' spacing={4}>
              <Text fontSize='lg' fontWeight='semibold'>
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
                        backgroundColor: cardBg,
                        borderColor: borderColor,
                        color: chartTextColor,
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
          bg={cardBg}
          borderWidth='1px'
          borderColor={borderColor}
          cursor='pointer'
          onClick={handleChartClick}
          _hover={{ boxShadow: 'lg', transform: 'translateY(-2px)' }}
          transition='all 0.2s'
        >
          <CardBody>
            <VStack align='stretch' spacing={4}>
              <Text fontSize='lg' fontWeight='semibold'>
                Key Metrics Comparison
              </Text>
              <Box height='300px'>
                <ResponsiveContainer width='100%' height='100%'>
                  <BarChart data={metricsData} onClick={handleChartClick}>
                    <CartesianGrid strokeDasharray='3 3' stroke={borderColor} />
                    <XAxis
                      dataKey='name'
                      stroke={chartTextColor}
                      fontSize={12}
                    />
                    <YAxis
                      stroke={chartTextColor}
                      fontSize={12}
                      label={{
                        value: 'Percentage (%)',
                        angle: -90,
                        position: 'insideLeft',
                        style: { fill: chartTextColor },
                      }}
                    />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: cardBg,
                        borderColor: borderColor,
                        color: chartTextColor,
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

      {/* Performance Trends - Line Chart */}
      <Card
        bg={cardBg}
        borderWidth='1px'
        borderColor={borderColor}
        cursor='pointer'
        onClick={handleChartClick}
        _hover={{ boxShadow: 'lg', transform: 'translateY(-2px)' }}
        transition='all 0.2s'
      >
        <CardBody>
          <VStack align='stretch' spacing={4}>
            <Text fontSize='lg' fontWeight='semibold'>
              Performance Trends (Example)
            </Text>
            <Box height='300px'>
              <ResponsiveContainer width='100%' height='100%'>
                <LineChart
                  data={performanceTrendData}
                  onClick={handleChartClick}
                >
                  <CartesianGrid strokeDasharray='3 3' stroke={borderColor} />
                  <XAxis
                    dataKey='attempt'
                    stroke={chartTextColor}
                    label={{
                      value: 'Attempt Number',
                      position: 'insideBottom',
                      offset: -5,
                      style: { fill: chartTextColor },
                    }}
                  />
                  <YAxis
                    yAxisId='left'
                    stroke={chartTextColor}
                    label={{
                      value: 'Score (%)',
                      angle: -90,
                      position: 'insideLeft',
                      style: { fill: chartTextColor },
                    }}
                  />
                  <YAxis
                    yAxisId='right'
                    orientation='right'
                    stroke={chartTextColor}
                    label={{
                      value: 'Time (seconds)',
                      angle: -90,
                      position: 'insideRight',
                      style: { fill: chartTextColor },
                    }}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: cardBg,
                      borderColor: borderColor,
                      color: chartTextColor,
                    }}
                  />
                  <Legend />
                  <Line
                    yAxisId='left'
                    type='monotone'
                    dataKey='score'
                    stroke='#3B82F6'
                    strokeWidth={2}
                    name='Score (%)'
                    dot={{ fill: '#3B82F6', strokeWidth: 2, r: 4 }}
                    onClick={handleChartClick}
                    style={{ cursor: 'pointer' }}
                  />
                  <Line
                    yAxisId='right'
                    type='monotone'
                    dataKey='time'
                    stroke='#10B981'
                    strokeWidth={2}
                    name='Time Spent (s)'
                    dot={{ fill: '#10B981', strokeWidth: 2, r: 4 }}
                    onClick={handleChartClick}
                    style={{ cursor: 'pointer' }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </Box>
          </VStack>
        </CardBody>
      </Card>
    </VStack>
  );
};

export default ResultsAnalyticsCharts;
