'use client';

/**
 * CalendarMonthView Component
 *
 * Component Hierarchy:
 * App → Calendar → CalendarMonthView (this file)
 *   └── CalendarItemCard
 *
 * 7-column grid calendar view with day cells showing scheduled content.
 */

import { useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { Box, Grid, GridItem, Text, VStack, HStack, IconButton, Heading } from '@chakra-ui/react';
import { FiChevronLeft, FiChevronRight, FiPlus } from 'react-icons/fi';
import { CalendarItemCard } from './CalendarItemCard';
import { formatMonthYear, isSameDay } from '@/lib/dateUtils';

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
  currentDate: Date;
  onPrevMonth: () => void;
  onNextMonth: () => void;
};

const DAYS_OF_WEEK = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

function getDaysInMonth(year: number, month: number): Date[] {
  const days: Date[] = [];
  const firstDay = new Date(year, month, 1);
  const lastDay = new Date(year, month + 1, 0);

  // Add leading days from previous month
  const startDayOfWeek = firstDay.getDay();
  for (let i = startDayOfWeek - 1; i >= 0; i--) {
    const date = new Date(year, month, -i);
    days.push(date);
  }

  // Add days of current month
  for (let day = 1; day <= lastDay.getDate(); day++) {
    days.push(new Date(year, month, day));
  }

  // Add trailing days to complete the grid (6 rows = 42 cells)
  const remainingDays = 42 - days.length;
  for (let i = 1; i <= remainingDays; i++) {
    days.push(new Date(year, month + 1, i));
  }

  return days;
}

export function CalendarMonthView({ items, currentDate, onPrevMonth, onNextMonth }: Props) {
  const router = useRouter();
  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();
  const today = new Date();

  const days = useMemo(() => getDaysInMonth(year, month), [year, month]);

  const getItemsForDay = (date: Date): CalendarItem[] => {
    return items.filter((item) => {
      if (!item.publishDate) return false;
      const itemDate = new Date(item.publishDate);
      return isSameDay(itemDate, date);
    });
  };

  const handleItemClick = (item: CalendarItem) => {
    if (item.briefId) {
      router.push(`/content?briefId=${item.briefId}`);
    }
  };

  const monthName = formatMonthYear(currentDate);

  return (
    <VStack align="stretch" spacing={4}>
      {/* Header with navigation */}
      <HStack justify="space-between">
        <IconButton
          aria-label="Previous month"
          icon={<FiChevronLeft />}
          variant="ghost"
          onClick={onPrevMonth}
        />
        <Heading size="md">{monthName}</Heading>
        <IconButton
          aria-label="Next month"
          icon={<FiChevronRight />}
          variant="ghost"
          onClick={onNextMonth}
        />
      </HStack>

      {/* Day headers */}
      <Grid templateColumns="repeat(7, 1fr)" gap={1}>
        {DAYS_OF_WEEK.map((day) => (
          <GridItem key={day} textAlign="center">
            <Text fontWeight="semibold" fontSize="sm" color="gray.500">
              {day}
            </Text>
          </GridItem>
        ))}
      </Grid>

      {/* Calendar grid */}
      <Grid templateColumns="repeat(7, 1fr)" gap={1}>
        {days.map((date, index) => {
          const isCurrentMonth = date.getMonth() === month;
          const isToday = isSameDay(date, today);
          const dayItems = getItemsForDay(date);

          return (
            <GridItem
              key={index}
              minH="100px"
              p={1}
              bg={isToday ? 'orange.50' : isCurrentMonth ? 'white' : 'gray.50'}
              borderRadius="md"
              border="1px solid"
              borderColor={isToday ? 'orange.300' : 'gray.200'}
              position="relative"
              role="group"
            >
              {/* Hover add button */}
              <IconButton
                aria-label="Add content"
                icon={<FiPlus />}
                size="xs"
                colorScheme="orange"
                variant="solid"
                position="absolute"
                top={1}
                right={1}
                opacity={0}
                _groupHover={{ opacity: 1 }}
                transition="opacity 0.2s"
                onClick={() => router.push(`/content?date=${date.getTime()}`)}
                zIndex={1}
              />

              <Text
                fontSize="sm"
                fontWeight={isToday ? 'bold' : 'normal'}
                color={isCurrentMonth ? 'gray.700' : 'gray.400'}
                mb={1}
              >
                {date.getDate()}
              </Text>
              <VStack align="stretch" spacing={0}>
                {dayItems.slice(0, 3).map((item) => (
                  <CalendarItemCard
                    key={item._id}
                    id={item._id}
                    title={item.title}
                    status={item.status}
                    contentType={item.contentType}
                    onClick={() => handleItemClick(item)}
                  />
                ))}
                {dayItems.length > 3 && (
                  <Text fontSize="2xs" color="gray.500" textAlign="center">
                    +{dayItems.length - 3} more
                  </Text>
                )}
              </VStack>
            </GridItem>
          );
        })}
      </Grid>
    </VStack>
  );
}
