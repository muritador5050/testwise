import {
  Avatar,
  AvatarBadge,
  HStack,
  VStack,
  Heading,
  Text,
  IconButton,
  Spacer,
} from '@chakra-ui/react';
import { LogOut } from 'lucide-react';
import { useLogoutUser } from '../../api/services/authService';

interface Props {
  studentName: string;
}

const WelcomeSection: React.FC<Props> = ({ studentName }) => {
  const logoutMutation = useLogoutUser();

  return (
    <HStack spacing={4} mb={8} w='full'>
      <Avatar size='lg' name={studentName}>
        <AvatarBadge boxSize='1.25em' bg='green.500' />
      </Avatar>

      <VStack align='start' spacing={0} flex='1'>
        <Heading size='lg'>Welcome back, {studentName}!</Heading>
        <Text color='gray.600' fontSize='sm'>
          Ready to continue your learning journey?
        </Text>
      </VStack>

      <Spacer />

      <IconButton
        aria-label='Logout'
        icon={<LogOut />}
        colorScheme='red'
        variant='ghost'
        onClick={() => logoutMutation.mutate()}
      />
    </HStack>
  );
};

export default WelcomeSection;
