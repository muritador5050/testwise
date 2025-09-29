import React, { useState, useCallback } from 'react';
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  VStack,
  HStack,
  Text,
  Button,
  Alert,
  AlertIcon,
  Box,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Badge,
} from '@chakra-ui/react';
import type { Question } from '../../types/api';

interface BulkUploadModalProps {
  isOpen: boolean;
  onClose: () => void;
  onUpload: (questions: Question[]) => void;
}

const BulkUploadModal: React.FC<BulkUploadModalProps> = ({
  isOpen,
  onClose,
  onUpload,
}) => {
  const [template, setTemplate] = useState<string>('');

  const handleTemplateCopy = useCallback(async () => {
    const templateText = `Question Text,Type,Points,Option 1,Option 2,Option 3,Option 4,Correct Answer
What is the capital of France?,MULTIPLE_CHOICE,1,Paris,London,Berlin,Madrid,1
The Earth is flat.,TRUE_FALSE,1,True,False,,,2
Explain photosynthesis...,SHORT_ANSWER,2,,,,,
Discuss the impact of AI...,ESSAY,5,,,,,`;

    try {
      await navigator.clipboard.writeText(templateText);
      setTemplate(templateText);
    } catch (error) {
      console.error('Failed to copy template:', error);
    }
  }, []);

  const handleFileUpload = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const file = event.target.files?.[0];
      if (!file) return;

      // Implement CSV parsing logic here
      // This would parse the CSV and convert to Question objects
      console.log('File uploaded:', file);

      // Reset the input
      event.target.value = '';
    },
    []
  );

  const handleUpload = useCallback(() => {
    // For now, this is a placeholder - you would implement actual CSV parsing here
    const sampleQuestions: Question[] = [
      {
        id: 1,
        text: 'Sample uploaded question',
        questionType: 'MULTIPLE_CHOICE',
        points: 1,
        order: 1,
        testId: 1,
        options: [],
      },
    ];
    onUpload(sampleQuestions);
  }, [onUpload]);

  return (
    <Modal isOpen={isOpen} onClose={onClose} size='4xl'>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Bulk Upload Questions</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <VStack spacing={6} align='stretch'>
            <Alert status='info'>
              <AlertIcon />
              Upload questions using a CSV template. Download the template below
              to get started.
            </Alert>

            <Box>
              <Text mb={2} fontWeight='bold'>
                CSV Format:
              </Text>
              <Table variant='simple' size='sm'>
                <Thead>
                  <Tr>
                    <Th>Column</Th>
                    <Th>Description</Th>
                    <Th>Example</Th>
                  </Tr>
                </Thead>
                <Tbody>
                  <Tr>
                    <Td>Question Text</Td>
                    <Td>The question content</Td>
                    <Td>"What is 2+2?"</Td>
                  </Tr>
                  <Tr>
                    <Td>Type</Td>
                    <Td>MULTIPLE_CHOICE, TRUE_FALSE, SHORT_ANSWER, ESSAY</Td>
                    <Td>
                      <Badge>MULTIPLE_CHOICE</Badge>
                    </Td>
                  </Tr>
                  <Tr>
                    <Td>Points</Td>
                    <Td>Point value for the question</Td>
                    <Td>1.0</Td>
                  </Tr>
                  <Tr>
                    <Td>Option 1-4</Td>
                    <Td>Answer options (for multiple choice/true false)</Td>
                    <Td>"Paris", "London", etc.</Td>
                  </Tr>
                  <Tr>
                    <Td>Correct Answer</Td>
                    <Td>Number of correct option (1-4)</Td>
                    <Td>1</Td>
                  </Tr>
                </Tbody>
              </Table>
            </Box>

            <VStack spacing={3}>
              <Button onClick={handleTemplateCopy} colorScheme='blue'>
                Copy CSV Template to Clipboard
              </Button>

              <Text fontSize='sm' color='gray.600'>
                OR
              </Text>

              <Button as='label' variant='outline' cursor='pointer'>
                Upload CSV File
                <input
                  type='file'
                  accept='.csv'
                  onChange={handleFileUpload}
                  style={{ display: 'none' }}
                />
              </Button>
            </VStack>
          </VStack>
        </ModalBody>

        <ModalFooter>
          <HStack>
            <Button variant='outline' onClick={onClose}>
              Cancel
            </Button>
            <Button colorScheme='blue' onClick={handleUpload}>
              Upload Questions
            </Button>
          </HStack>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default BulkUploadModal;
