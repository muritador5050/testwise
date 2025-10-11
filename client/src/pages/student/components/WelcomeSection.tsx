import {
  Avatar,
  AvatarBadge,
  HStack,
  VStack,
  Heading,
  Text,
  IconButton,
  Button,
  useBreakpointValue,
} from '@chakra-ui/react';
import { ArrowRight, LogOut } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useCurrentUser } from '../../../api/services/authService';

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
  // Control layout based on screen size
  const isMobile = useBreakpointValue({ base: true, md: false });
  const currentUser = useCurrentUser();

  return (
    <VStack spacing={3} mb={8} w='full' align='stretch'>
      {/* Top row: Avatar + Name + Logout */}
      <HStack spacing={3} w='full'>
        <Avatar size={{ base: 'md', md: 'lg' }} src={avatar} name={studentName}>
          <AvatarBadge boxSize='1.25em' bg='green.500' />
        </Avatar>

        <VStack align='start' spacing={0} flex='1' minW={0}>
          <Heading size={{ base: 'sm', md: 'lg' }} noOfLines={1}>
            Welcome back, {studentName}!
          </Heading>
          {/* Hide subtitle on mobile */}
          <Text
            color='gray.600'
            fontSize={{ base: 'xs', md: 'sm' }}
            display={{ base: 'none', sm: 'block' }}
          >
            Ready to continue your learning journey?
          </Text>
          {currentUser.data?.role === 'ADMIN' && (
            <Text as={Link} to='/admin' color='green' size='sm'>
              Back to ADMIN
            </Text>
          )}
        </VStack>

        <IconButton
          aria-label='Logout'
          icon={<LogOut size={isMobile ? 18 : 20} />}
          colorScheme='red'
          variant='ghost'
          size={{ base: 'sm', md: 'md' }}
          onClick={handleLogout}
        />
      </HStack>

      {/* Bottom row: Browse Tests button (full width on mobile) */}
      <Button
        colorScheme='blue'
        size={{ base: 'sm', md: 'md' }}
        as={Link}
        to={'/student/exams'}
        rightIcon={<ArrowRight size={16} />}
        w={{ base: 'full', md: 'auto' }}
        alignSelf={{ base: 'stretch', md: 'flex-end' }}
        boxShadow='sm'
        _hover={{ transform: 'translateY(-2px)', boxShadow: 'md' }}
      >
        {isMobile ? 'Browse Tests' : 'Browse Tests'}
      </Button>
    </VStack>
  );
};

export default WelcomeSection;
