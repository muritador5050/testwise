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
import { colors, buttonStyles, textStyles } from '../../../utils/colors';

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
          <AvatarBadge boxSize='1.25em' bg={colors.success} />
        </Avatar>

        <VStack align='start' spacing={0} flex='1' minW={0}>
          <Heading
            size={{ base: 'sm', md: 'lg' }}
            noOfLines={1}
            {...textStyles.heading}
          >
            Welcome back, {studentName}!
          </Heading>
          {/* Hide subtitle on mobile */}
          <Text
            {...textStyles.body}
            fontSize={{ base: 'xs', md: 'sm' }}
            display={{ base: 'none', sm: 'block' }}
          >
            Ready to continue your learning journey?
          </Text>
          {currentUser.data?.role === 'ADMIN' && (
            <Text as={Link} to='/admin' color={colors.success} size='sm'>
              Back to ADMIN
            </Text>
          )}
        </VStack>

        <IconButton
          aria-label='Logout'
          icon={<LogOut size={isMobile ? 18 : 20} />}
          colorScheme='blue'
          variant='ghost'
          size={{ base: 'sm', md: 'md' }}
          onClick={handleLogout}
        />
      </HStack>

      {/* Bottom row: Browse Tests button (full width on mobile) */}
      <Button
        size={{ base: 'sm', md: 'md' }}
        as={Link}
        to={'/student/exams'}
        rightIcon={<ArrowRight size={16} />}
        w={{ base: 'full', md: 'auto' }}
        alignSelf={{ base: 'stretch', md: 'flex-end' }}
        boxShadow='sm'
        {...buttonStyles.primary}
      >
        {isMobile ? 'Browse Tests' : 'Browse Tests'}
      </Button>
    </VStack>
  );
};

export default WelcomeSection;
