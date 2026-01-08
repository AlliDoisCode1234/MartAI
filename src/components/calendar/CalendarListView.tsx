'use client';

/**
 * CalendarListView Component
 *
 * Component Hierarchy:
 * App → Calendar → CalendarListView (this file)
 *
 * Chronological list view of content items grouped by week.
 */

import { useMemo } from 'react';
import { useRouter } from 'next/navigation';
import {
  Box,
  VStack,
  HStack,
  Text,
  Badge,
  Button,
  Card,
  CardBody,
  Heading,
  Icon,
} from '@chakra-ui/react';
import { FiCalendar, FiEdit3, FiFileText } from 'react-icons/fi';
import { getStatusColorScheme } from '@/lib/constants/statusColors';

type CalendarItem = {
  _id: string;
  title: string;
  status: string;
  contentType: string;
  publishDate?: number;
  briefId?: string;
};

type Props = {
  items: CalendarItem[];
};

type WeekGroup = {
  weekStart: Date;
  weekEnd: Date;
  items: CalendarItem[];
};

function getWeekStart(date: Date): Date {
  const d = new Date(date);
  const day = d.getDay();
  const diff = d.getDate() - day;
  return new Date(d.setDate(diff));
}

function getWeekEnd(date: Date): Date {
  const start = getWeekStart(date);
  return new Date(start.getTime() + 6 * 24 * 60 * 60 * 1000);
}

function groupByWeek(items: CalendarItem[]): WeekGroup[] {
  const groups: Map<string, WeekGroup> = new Map();

  items
    .filter((item) => item.publishDate)
    .sort((a, b) => (a.publishDate || 0) - (b.publishDate || 0))
    .forEach((item) => {
      const date = new Date(item.publishDate!);
      const weekStart = getWeekStart(date);
      const key = weekStart.toISOString();

      if (!groups.has(key)) {
        groups.set(key, {
          weekStart,
          weekEnd: getWeekEnd(date),
          items: [],
        });
      }
      groups.get(key)!.items.push(item);
    });

  return Array.from(groups.values());
}

export function CalendarListView({ items }: Props) {
  const router = useRouter();
  const weekGroups = useMemo(() => groupByWeek(items), [items]);

  const handleItemClick = (item: CalendarItem) => {
    if (item.briefId) {
      router.push(`/content?briefId=${item.briefId}`);
    }
  };

  if (items.length === 0) {
    return (
      <Box textAlign="center" py={12}>
        <Icon as={FiCalendar} boxSize={12} color="gray.300" mb={4} />
        <Heading size="md" color="gray.500" mb={2}>
          No content scheduled
        </Heading>
        <Text color="gray.400">
          Generate a content plan from your Strategy page to populate your calendar.
        </Text>
      </Box>
    );
  }

  return (
    <VStack align="stretch" spacing={6}>
      {weekGroups.map((group) => (
        <Card key={group.weekStart.toISOString()} variant="outline">
          <CardBody>
            <HStack mb={4} justify="space-between">
              <HStack>
                <Icon as={FiCalendar} color="orange.500" />
                <Heading size="sm">
                  Week of{' '}
                  {group.weekStart.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                </Heading>
              </HStack>
              <Badge colorScheme="orange">{group.items.length} items</Badge>
            </HStack>

            <VStack align="stretch" spacing={2}>
              {group.items.map((item) => (
                <HStack
                  key={item._id}
                  p={3}
                  bg="gray.50"
                  borderRadius="md"
                  justify="space-between"
                  _hover={{ bg: 'gray.100' }}
                >
                  <HStack spacing={3}>
                    <Icon as={FiFileText} color="gray.500" />
                    <Box>
                      <Text fontWeight="medium">{item.title}</Text>
                      <Text fontSize="sm" color="gray.500">
                        {new Date(item.publishDate!).toLocaleDateString('en-US', {
                          weekday: 'short',
                          month: 'short',
                          day: 'numeric',
                        })}
                        {' · '}
                        {item.contentType}
                      </Text>
                    </Box>
                  </HStack>
                  <HStack>
                    <Badge colorScheme={getStatusColorScheme(item.status)}>{item.status}</Badge>
                    <Button
                      size="sm"
                      variant="ghost"
                      leftIcon={<FiEdit3 />}
                      onClick={() => handleItemClick(item)}
                    >
                      Edit
                    </Button>
                  </HStack>
                </HStack>
              ))}
            </VStack>
          </CardBody>
        </Card>
      ))}
    </VStack>
  );
}
