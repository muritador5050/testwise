import {
  HStack,
  VStack,
  Heading,
  Text,
  Button,
  IconButton,
  Stack,
} from '@chakra-ui/react';
import { Link } from 'react-router-dom';
import { Plus, LogOut } from 'lucide-react';
import { useLogoutUser } from '../../api/services/authService';

const InstructorHeader = () => {
  const logoutMutation = useLogoutUser();

  return (
    <HStack justify='space-between' align='start' mb={8} flexWrap='wrap'>
      {/* Left side */}
      <VStack align='start' spacing={1}>
        <Heading size='lg'>Instructor Dashboard</Heading>
        <Text color='gray.600' fontSize='sm'>
          Manage your exams, students, and track performance
        </Text>
      </VStack>

      {/* Right side */}
      <Stack
        direction={{ base: 'column', md: 'row' }}
        spacing={3}
        align='flex-start'
      >
        <Button
          as={Link}
          to='/instructor/exams/create'
          leftIcon={<Plus />}
          colorScheme='purple'
          w={{ base: 'full', md: 'auto' }}
        >
          Create Exam
        </Button>
        <Button
          as={Link}
          to='/instructor/questions/create'
          leftIcon={<Plus />}
          variant='outline'
          w={{ base: 'full', md: 'auto' }}
        >
          Add Question
        </Button>

        {/* Logout Icon */}
        <IconButton
          aria-label='Logout'
          icon={<LogOut />}
          colorScheme='red'
          variant='ghost'
          onClick={() => logoutMutation.mutate()}
        />
      </Stack>
    </HStack>
  );
};

export default InstructorHeader;
