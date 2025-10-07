import {
  Avatar,
  AvatarBadge,
  HStack,
  VStack,
  Heading,
  Text,
  IconButton,
  Spacer,
  Button,
} from '@chakra-ui/react';
import { LogOut } from 'lucide-react';
import { Link } from 'react-router-dom';

interface Props {
  studentName: string;
  avatar: string;
  handleLogout: () => void;
}

const WelcomeSection: React.FC<Props> = ({
  studentName,
  avatar,
  handleLogout,
}) => {
  return (
    <HStack spacing={4} mb={8} w='full'>
      <Avatar size={{ base: 'sm', md: 'lg' }} src={avatar} name={studentName}>
        <AvatarBadge boxSize='1.25em' bg='green.500' />
      </Avatar>

      <VStack align='start' spacing={0} flex='1'>
        <Heading size={{ base: 'sm', md: 'lg' }}>
          Welcome back, {studentName}!
        </Heading>
        <Text color='gray.600' fontSize='sm'>
          Ready to continue your learning journey?
        </Text>
      </VStack>

      <Spacer />
      <HStack>
        <Button variant='ghost' size='sm' as={Link} to={'/student/exams'}>
          Explore Tests
        </Button>
        <IconButton
          aria-label='Logout'
          icon={<LogOut />}
          colorScheme='red'
          variant='ghost'
          onClick={handleLogout}
        />
      </HStack>
    </HStack>
  );
};

export default WelcomeSection;
