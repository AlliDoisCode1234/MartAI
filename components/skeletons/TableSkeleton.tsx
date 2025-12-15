'use client';

/**
 * TableSkeleton Component
 *
 * Component Hierarchy:
 * App → Any Page → TableSkeleton (this file)
 *
 * Matches dimensions of table rows for seamless loading.
 */

import { Table, Thead, Tbody, Tr, Th, Td, Skeleton, Card, CardBody } from '@chakra-ui/react';

type Props = {
  columns?: number;
  rows?: number;
  columnWidths?: string[];
};

export function TableSkeleton({ columns = 5, rows = 5, columnWidths = [] }: Props) {
  const widths =
    columnWidths.length > 0 ? columnWidths : Array.from({ length: columns }).map(() => '80%');

  return (
    <Card>
      <CardBody>
        <Table size="sm">
          <Thead>
            <Tr>
              {Array.from({ length: columns }).map((_, i) => (
                <Th key={i}>
                  <Skeleton height="12px" width={widths[i] || '80%'} />
                </Th>
              ))}
            </Tr>
          </Thead>
          <Tbody>
            {Array.from({ length: rows }).map((_, rowIndex) => (
              <Tr key={rowIndex}>
                {Array.from({ length: columns }).map((_, colIndex) => (
                  <Td key={colIndex}>
                    <Skeleton height="16px" width={widths[colIndex] || '80%'} />
                  </Td>
                ))}
              </Tr>
            ))}
          </Tbody>
        </Table>
      </CardBody>
    </Card>
  );
}
