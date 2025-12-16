'use client';

/**
 * CalendarWeekView Component
 *
 * Component Hierarchy:
 * App → Calendar → CalendarWeekView (this file)
 *   └── CalendarItemCard
 *
 * Google Calendar-style week view with day columns and content items.
 * Uses date-fns for timezone-aware date handling.
 */

import { useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { Box, Grid, GridItem, Text, VStack, HStack, IconButton, Heading } from '@chakra-ui/react';
import { FiChevronLeft, FiChevronRight, FiPlus } from 'react-icons/fi';
import {
  startOfWeek,
  endOfWeek,
  eachDayOfInterval,
  format,
  isSameDay,
  isToday,
  addWeeks,
  subWeeks,
} from 'date-fns';
import { CalendarItemCard } from './CalendarItemCard';

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
  onPrevWeek: () => void;
  onNextWeek: () => void;
  onGoToToday: () => void;
};

export function CalendarWeekView({
  items,
  currentDate,
  onPrevWeek,
  onNextWeek,
  onGoToToday,
}: Props) {
  const router = useRouter();

  // Get days of current week (Sunday to Saturday by default)
  const weekDays = useMemo(() => {
    const start = startOfWeek(currentDate, { weekStartsOn: 0 });
    const end = endOfWeek(currentDate, { weekStartsOn: 0 });
    return eachDayOfInterval({ start, end });
  }, [currentDate]);

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

  // Week date range for header
  const weekStart = weekDays[0];
  const weekEnd = weekDays[6];
  const weekLabel = `${format(weekStart, 'MMM d')} - ${format(weekEnd, 'MMM d, yyyy')}`;

  return (
    <VStack align="stretch" spacing={4}>
      {/* Header with navigation */}
      <HStack justify="space-between">
        <HStack>
          <IconButton
            aria-label="Previous week"
            icon={<FiChevronLeft />}
            variant="ghost"
            onClick={onPrevWeek}
          />
          <IconButton
            aria-label="Next week"
            icon={<FiChevronRight />}
            variant="ghost"
            onClick={onNextWeek}
          />
        </HStack>
        <Heading size="md">{weekLabel}</Heading>
        <Text
          fontSize="sm"
          color="orange.500"
          cursor="pointer"
          fontWeight="medium"
          _hover={{ textDecoration: 'underline' }}
          onClick={onGoToToday}
        >
          Today
        </Text>
      </HStack>

      {/* Day columns */}
      <Grid templateColumns="repeat(7, 1fr)" gap={2}>
        {weekDays.map((day) => {
          const dayItems = getItemsForDay(day);
          const isCurrentDay = isToday(day);

          return (
            <GridItem
              key={day.toISOString()}
              minH="200px"
              bg={isCurrentDay ? 'orange.50' : 'white'}
              borderRadius="lg"
              border="1px solid"
              borderColor={isCurrentDay ? 'orange.300' : 'gray.200'}
              overflow="hidden"
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
                top={2}
                right={2}
                opacity={0}
                _groupHover={{ opacity: 1 }}
                transition="opacity 0.2s"
                onClick={() => router.push(`/content?date=${day.getTime()}`)}
                zIndex={1}
              />

              {/* Day header */}
              <Box
                p={2}
                bg={isCurrentDay ? 'orange.100' : 'gray.50'}
                borderBottom="1px solid"
                borderColor={isCurrentDay ? 'orange.200' : 'gray.200'}
              >
                <VStack spacing={0}>
                  <Text fontSize="xs" color="gray.500" textTransform="uppercase">
                    {format(day, 'EEE')}
                  </Text>
                  <Text
                    fontSize="lg"
                    fontWeight={isCurrentDay ? 'bold' : 'medium'}
                    color={isCurrentDay ? 'orange.600' : 'gray.700'}
                  >
                    {format(day, 'd')}
                  </Text>
                </VStack>
              </Box>

              {/* Day content */}
              <VStack align="stretch" p={2} spacing={1}>
                {dayItems.length === 0 ? (
                  <Text fontSize="xs" color="gray.400" textAlign="center" py={4}>
                    No content
                  </Text>
                ) : (
                  dayItems.map((item) => (
                    <CalendarItemCard
                      key={item._id}
                      id={item._id}
                      title={item.title}
                      status={item.status}
                      contentType={item.contentType}
                      publishDate={item.publishDate}
                      onClick={() => handleItemClick(item)}
                    />
                  ))
                )}
              </VStack>
            </GridItem>
          );
        })}
      </Grid>
    </VStack>
  );
}
