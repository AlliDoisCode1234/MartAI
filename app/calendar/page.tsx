'use client';

/**
 * Calendar Page
 *
 * Component Hierarchy:
 * App → CalendarPage (this file)
 *   ├── CalendarMonthView
 *   ├── CalendarWeekView
 *   └── CalendarListView
 *
 * 12-week content calendar with month/week/list view toggle.
 */

import { useState, useMemo } from 'react';
import {
  Container,
  VStack,
  Heading,
  Text,
  Box,
  HStack,
  Button,
  ButtonGroup,
  Alert,
  AlertIcon,
} from '@chakra-ui/react';
import { FiGrid, FiList, FiCalendar, FiColumns } from 'react-icons/fi';
import { addWeeks, subWeeks } from 'date-fns';
import { useQuery } from 'convex/react';
import { api } from '@/convex/_generated/api';
import { useAuth } from '@/lib/useAuth';
import { useProject } from '@/lib/hooks';
import { CalendarMonthView, CalendarWeekView, CalendarListView } from '@/src/components/calendar';
import { CardSkeleton } from '@/components/skeletons';
import { EmptyState } from '@/src/components/feedback';

type ViewMode = 'month' | 'week' | 'list';

export default function CalendarPage() {
  const { isAuthenticated, loading: authLoading } = useAuth();
  const { projectId, isLoading: projectLoading } = useProject(null, { autoSelect: true });
  const [viewMode, setViewMode] = useState<ViewMode>('month');
  const [currentDate, setCurrentDate] = useState(new Date());

  // Calculate date range for current view (3 months window)
  const dateRange = useMemo(() => {
    const start = new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1);
    const end = new Date(currentDate.getFullYear(), currentDate.getMonth() + 2, 0);
    return {
      startDate: start.getTime(),
      endDate: end.getTime(),
    };
  }, [currentDate]);

  // Fetch calendar items
  const calendarItems = useQuery(
    api.content.calendars.listCalendarItems,
    projectId ? { projectId: projectId as any } : 'skip'
  );

  const handlePrevMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
  };

  const handleNextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
  };

  const handleToday = () => {
    setCurrentDate(new Date());
  };

  const handlePrevWeek = () => {
    setCurrentDate(subWeeks(currentDate, 1));
  };

  const handleNextWeek = () => {
    setCurrentDate(addWeeks(currentDate, 1));
  };

  // Loading state
  if (authLoading || projectLoading) {
    return (
      <Box minH="calc(100vh - 64px)" bg="brand.light">
        <Container maxW="container.xl" py={{ base: 8, md: 12 }} px={{ base: 4, md: 8 }}>
          <VStack spacing={6} align="stretch">
            <CardSkeleton />
            <CardSkeleton />
          </VStack>
        </Container>
      </Box>
    );
  }

  // Auth check
  if (!isAuthenticated) {
    return (
      <Box
        minH="calc(100vh - 64px)"
        bg="brand.light"
        display="flex"
        alignItems="center"
        justifyContent="center"
      >
        <Alert status="warning" maxW="md">
          <AlertIcon />
          Please sign in to view your content calendar
        </Alert>
      </Box>
    );
  }

  // No project check
  if (!projectId) {
    return (
      <Box
        minH="calc(100vh - 64px)"
        bg="brand.light"
        display="flex"
        alignItems="center"
        justifyContent="center"
      >
        <EmptyState type="calendar" onAction={() => (window.location.href = '/strategy')} />
      </Box>
    );
  }

  const items = calendarItems ?? [];

  return (
    <Box minH="calc(100vh - 64px)" bg="brand.light">
      <Container maxW="container.xl" py={{ base: 8, md: 12 }} px={{ base: 4, md: 8 }}>
        <VStack spacing={6} align="stretch">
          {/* Header */}
          <HStack justify="space-between" flexWrap="wrap" gap={4}>
            <VStack align="start" spacing={1}>
              <Heading size="xl" fontWeight="bold" fontFamily="heading" color="gray.800">
                Content Calendar
              </Heading>
              <Text color="gray.600">
                Your 12-week content schedule • {items.length} items planned
              </Text>
            </VStack>

            <HStack spacing={2}>
              <Button size="sm" variant="outline" leftIcon={<FiCalendar />} onClick={handleToday}>
                Today
              </Button>
              <ButtonGroup size="sm" isAttached variant="outline">
                <Button
                  leftIcon={<FiGrid />}
                  isActive={viewMode === 'month'}
                  onClick={() => setViewMode('month')}
                >
                  Month
                </Button>
                <Button
                  leftIcon={<FiColumns />}
                  isActive={viewMode === 'week'}
                  onClick={() => setViewMode('week')}
                >
                  Week
                </Button>
                <Button
                  leftIcon={<FiList />}
                  isActive={viewMode === 'list'}
                  onClick={() => setViewMode('list')}
                >
                  List
                </Button>
              </ButtonGroup>
            </HStack>
          </HStack>

          {/* Calendar View */}
          <Box bg="white" p={6} borderRadius="lg" shadow="sm">
            {viewMode === 'month' && (
              <CalendarMonthView
                items={items}
                currentDate={currentDate}
                onPrevMonth={handlePrevMonth}
                onNextMonth={handleNextMonth}
              />
            )}
            {viewMode === 'week' && (
              <CalendarWeekView
                items={items}
                currentDate={currentDate}
                onPrevWeek={handlePrevWeek}
                onNextWeek={handleNextWeek}
                onGoToToday={handleToday}
              />
            )}
            {viewMode === 'list' && <CalendarListView items={items} />}
          </Box>
        </VStack>
      </Container>
    </Box>
  );
}
