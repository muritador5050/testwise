// pages/admin/ExamsPage.tsx
import React from 'react';
import {
  Box,
  Heading,
  Button,
  HStack,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Badge,
  IconButton,
} from '@chakra-ui/react';
import { EditIcon, DeleteIcon, ViewIcon } from '@chakra-ui/icons';
import { Link } from 'react-router-dom';

const ExamsPage: React.FC = () => {
  // Mock data - replace with actual data
  const exams = [
    {
      id: 1,
      title: 'Mathematics Final Exam',
      description: 'End of semester mathematics assessment',
      duration: 120,
      maxAttempts: 3,
      isPublished: true,
      questionCount: 25,
    },
    {
      id: 2,
      title: 'Science Quiz',
      description: 'Basic science knowledge quiz',
      duration: 60,
      maxAttempts: 1,
      isPublished: false,
      questionCount: 15,
    },
  ];

  return (
    <Box>
      <HStack justify='space-between' mb={6}>
        <Heading size='lg'>Exams</Heading>
        <Button as={Link} to='/admin/exams/create' colorScheme='blue'>
          Create New Exam
        </Button>
      </HStack>

      <Box bg='white' shadow='md' borderRadius='lg' overflow='hidden'>
        <Table variant='simple'>
          <Thead>
            <Tr>
              <Th>Title</Th>
              <Th>Duration</Th>
              <Th>Questions</Th>
              <Th>Attempts</Th>
              <Th>Status</Th>
              <Th>Actions</Th>
            </Tr>
          </Thead>
          <Tbody>
            {exams.map((exam) => (
              <Tr key={exam.id}>
                <Td>
                  <Box>
                    <Box fontWeight='medium'>{exam.title}</Box>
                    <Box fontSize='sm' color='gray.600'>
                      {exam.description}
                    </Box>
                  </Box>
                </Td>
                <Td>{exam.duration} min</Td>
                <Td>{exam.questionCount}</Td>
                <Td>{exam.maxAttempts}</Td>
                <Td>
                  <Badge colorScheme={exam.isPublished ? 'green' : 'yellow'}>
                    {exam.isPublished ? 'Published' : 'Draft'}
                  </Badge>
                </Td>
                <Td>
                  <HStack spacing={2}>
                    <IconButton
                      aria-label='View exam'
                      icon={<ViewIcon />}
                      size='sm'
                      variant='outline'
                    />
                    <IconButton
                      aria-label='Edit exam'
                      icon={<EditIcon />}
                      size='sm'
                      variant='outline'
                      as={Link}
                      to={`/admin/exams/${exam.id}/edit`}
                    />
                    <IconButton
                      aria-label='Delete exam'
                      icon={<DeleteIcon />}
                      size='sm'
                      variant='outline'
                      colorScheme='red'
                    />
                  </HStack>
                </Td>
              </Tr>
            ))}
          </Tbody>
        </Table>
      </Box>
    </Box>
  );
};

export default ExamsPage;
