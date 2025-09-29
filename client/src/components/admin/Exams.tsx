import {
  Table,
  TableContainer,
  Tbody,
  Thead,
  Th,
  Tr,
  Td,
} from '@chakra-ui/react';

interface ExamsProps {
  hData: string[];
  bData: string[][];
}

export default function Exams({ hData, bData }: ExamsProps) {
  return (
    <TableContainer>
      <Table variant='simple'>
        <Thead>
          <Tr>
            {hData.map((header, index) => (
              <Th key={index}>{header}</Th>
            ))}
          </Tr>
        </Thead>
        <Tbody>
          {bData.map((row, rowIndex) => (
            <Tr key={rowIndex}>
              {row.map((cell, cellIndex) => (
                <Td key={cellIndex}>{cell}</Td>
              ))}
            </Tr>
          ))}
        </Tbody>
      </Table>
    </TableContainer>
  );
}
