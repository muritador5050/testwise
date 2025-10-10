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
    </VStack>
  );
};

export default ResultsAnalyticsCharts;
