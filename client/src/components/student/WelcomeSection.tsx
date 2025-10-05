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

interface Props {
  studentName: string;
  handleLogout: () => void;
}

const WelcomeSection: React.FC<Props> = ({ studentName, handleLogout }) => {
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
        onClick={handleLogout}
      />
    </HStack>
  );
};

export default WelcomeSection;
