'use client';

/**
 * Content Calendar Page
 *
 * Component Hierarchy:
 * App → StudioLayout → CalendarPage (this file)
 *
 * Month grid view of scheduled content pieces with filters.
 * Inspiration: CoSchedule + Clearscope hybrid.
 */

import { useState, useMemo } from 'react';
import {
  Box,
  Grid,
  GridItem,
  Heading,
  Text,
  HStack,
  VStack,
  Button,
  Icon,
  SimpleGrid,
  Badge,
  Select,
} from '@chakra-ui/react';
import { useQuery } from 'convex/react';
import { api } from '@/convex/_generated/api';
import { StudioLayout } from '@/src/components/studio';
import { CalendarCard } from '@/src/components/studio/CalendarCard';
import { FiChevronLeft, FiChevronRight, FiPlus, FiCalendar } from 'react-icons/fi';
import Link from 'next/link';
import { Id } from '@/convex/_generated/dataModel';

// ============================================================================
// Types
// ============================================================================

interface ContentPiece {
  _id: Id<'contentPieces'>;
  title: string;
  contentType: string;
  phooContentType?: string;
  status: string;
  seoScore?: number;
  priority?: 'P0' | 'P1' | 'P2';
  scheduledDate?: number;
}

// ============================================================================
// Helpers
// ============================================================================

const MONTHS = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December',
];

const DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

function getMonthDays(year: number, month: number): Date[] {
  const days: Date[] = [];
  const firstDay = new Date(year, month, 1);
  const lastDay = new Date(year, month + 1, 0);

  // Add padding for days before month starts
  const startPadding = firstDay.getDay();
  for (let i = startPadding - 1; i >= 0; i--) {
    const d = new Date(year, month, -i);
    days.push(d);
  }

  // Add all days of the month
  for (let day = 1; day <= lastDay.getDate(); day++) {
    days.push(new Date(year, month, day));
  }

  // Add padding for days after month ends (complete the week)
  const endPadding = 7 - (days.length % 7);
  if (endPadding < 7) {
    for (let i = 1; i <= endPadding; i++) {
      days.push(new Date(year, month + 1, i));
    }
  }

  return days;
}

function isSameDay(d1: Date, d2: Date): boolean {
  return (
    d1.getFullYear() === d2.getFullYear() &&
    d1.getMonth() === d2.getMonth() &&
    d1.getDate() === d2.getDate()
  );
}

function isToday(date: Date): boolean {
  return isSameDay(date, new Date());
}

// ============================================================================
// Components
// ============================================================================

interface DayCellProps {
  date: Date;
  isCurrentMonth: boolean;
  pieces: ContentPiece[];
}

function DayCell({ date, isCurrentMonth, pieces }: DayCellProps) {
  const today = isToday(date);

  return (
    <Box
      bg={today ? 'rgba(255, 157, 0, 0.1)' : 'rgba(255, 255, 255, 0.02)'}
      border={today ? '1px solid rgba(255, 157, 0, 0.3)' : '1px solid rgba(255, 255, 255, 0.05)'}
      borderRadius="8px"
      p={2}
      minH="120px"
      opacity={isCurrentMonth ? 1 : 0.4}
      transition="all 0.15s ease"
      _hover={{
        bg: isCurrentMonth ? 'rgba(255, 255, 255, 0.05)' : undefined,
      }}
    >
      {/* Date Number */}
      <Text
        fontSize="sm"
        fontWeight={today ? 'bold' : 'medium'}
        color={today ? '#FF9D00' : isCurrentMonth ? 'white' : 'gray.600'}
        mb={2}
      >
        {date.getDate()}
      </Text>

      {/* Content Cards */}
      <VStack spacing={1} align="stretch">
        {pieces.slice(0, 3).map((piece) => (
          <CalendarCard key={piece._id} contentPiece={piece} />
        ))}
        {pieces.length > 3 && (
          <Text fontSize="xs" color="gray.500" textAlign="center">
            +{pieces.length - 3} more
          </Text>
        )}
      </VStack>
    </Box>
  );
}

// ============================================================================
// Main Page
// ============================================================================

export default function CalendarPage() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [priorityFilter, setPriorityFilter] = useState<string>('all');

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  // TODO: Get projectId from context/URL
  // For now, use first project from user
  const projects = useQuery(api.projects.projects.list);
  const projectId = projects?.[0]?._id;

  // Calculate date range for query
  const startDate = new Date(year, month, 1).getTime();
  const endDate = new Date(year, month + 1, 0, 23, 59, 59).getTime();

  // Fetch scheduled content
  const scheduledContent = useQuery(
    api.contentPieces.listByScheduledDate,
    projectId ? { projectId, startDate, endDate } : 'skip'
  );

  // Get month days
  const days = useMemo(() => getMonthDays(year, month), [year, month]);

  // Group content by date
  const contentByDate = useMemo(() => {
    const map = new Map<string, ContentPiece[]>();
    if (!scheduledContent) return map;

    let filtered = scheduledContent as ContentPiece[];

    // Apply priority filter
    if (priorityFilter !== 'all') {
      filtered = filtered.filter((p) => p.priority === priorityFilter);
    }

    for (const piece of filtered) {
      if (piece.scheduledDate) {
        const date = new Date(piece.scheduledDate);
        const key = `${date.getFullYear()}-${date.getMonth()}-${date.getDate()}`;
        if (!map.has(key)) {
          map.set(key, []);
        }
        map.get(key)!.push(piece);
      }
    }
    return map;
  }, [scheduledContent, priorityFilter]);

  // Navigation
  const prevMonth = () => setCurrentDate(new Date(year, month - 1, 1));
  const nextMonth = () => setCurrentDate(new Date(year, month + 1, 1));
  const goToToday = () => setCurrentDate(new Date());

  // Stats
  const totalScheduled = scheduledContent?.length ?? 0;
  const p0Count = (scheduledContent ?? []).filter(
    (p: { priority?: string }) => p.priority === 'P0'
  ).length;

  return (
    <StudioLayout>
      <VStack align="stretch" spacing={6}>
        {/* Header */}
        <HStack justify="space-between" wrap="wrap" gap={4}>
          <Box>
            <Heading size="lg" bgGradient="linear(to-r, white, gray.400)" bgClip="text">
              Content Calendar
            </Heading>
            <Text color="gray.500" mt={1}>
              {totalScheduled} pieces scheduled • {p0Count} high priority
            </Text>
          </Box>
          <HStack spacing={3}>
            <Link href="/studio/create">
              <Button
                size="sm"
                bg="linear-gradient(135deg, #FF9D00, #FF6B00)"
                color="white"
                _hover={{ opacity: 0.9 }}
                leftIcon={<Icon as={FiPlus} />}
              >
                New Content
              </Button>
            </Link>
          </HStack>
        </HStack>

        {/* Filters & Navigation */}
        <HStack
          justify="space-between"
          bg="rgba(255, 255, 255, 0.03)"
          border="1px solid rgba(255, 255, 255, 0.08)"
          borderRadius="12px"
          p={4}
        >
          {/* Month Navigation */}
          <HStack spacing={4}>
            <Button
              size="sm"
              variant="ghost"
              color="gray.400"
              onClick={prevMonth}
              _hover={{ color: 'white' }}
            >
              <Icon as={FiChevronLeft} />
            </Button>
            <Heading size="md" color="white" minW="200px" textAlign="center">
              {MONTHS[month]} {year}
            </Heading>
            <Button
              size="sm"
              variant="ghost"
              color="gray.400"
              onClick={nextMonth}
              _hover={{ color: 'white' }}
            >
              <Icon as={FiChevronRight} />
            </Button>
            <Button
              size="xs"
              variant="ghost"
              color="gray.500"
              onClick={goToToday}
              _hover={{ color: 'white' }}
              leftIcon={<Icon as={FiCalendar} />}
            >
              Today
            </Button>
          </HStack>

          {/* Filters */}
          <HStack spacing={3}>
            <Select
              size="sm"
              bg="rgba(255, 255, 255, 0.05)"
              border="1px solid rgba(255, 255, 255, 0.1)"
              color="white"
              value={priorityFilter}
              onChange={(e) => setPriorityFilter(e.target.value)}
              w="120px"
            >
              <option value="all" style={{ background: '#1a1a2e' }}>
                All Priority
              </option>
              <option value="P0" style={{ background: '#1a1a2e' }}>
                P0 Only
              </option>
              <option value="P1" style={{ background: '#1a1a2e' }}>
                P1 Only
              </option>
              <option value="P2" style={{ background: '#1a1a2e' }}>
                P2 Only
              </option>
            </Select>
          </HStack>
        </HStack>

        {/* Calendar Grid */}
        <Box>
          {/* Day Headers */}
          <SimpleGrid columns={7} spacing={2} mb={2}>
            {DAYS.map((day) => (
              <Text
                key={day}
                fontSize="sm"
                fontWeight="semibold"
                color="gray.500"
                textAlign="center"
              >
                {day}
              </Text>
            ))}
          </SimpleGrid>

          {/* Day Cells */}
          <SimpleGrid columns={7} spacing={2}>
            {days.map((date, idx) => {
              const key = `${date.getFullYear()}-${date.getMonth()}-${date.getDate()}`;
              const pieces = contentByDate.get(key) || [];
              const isCurrentMonth = date.getMonth() === month;

              return (
                <DayCell key={idx} date={date} isCurrentMonth={isCurrentMonth} pieces={pieces} />
              );
            })}
          </SimpleGrid>
        </Box>

        {/* Empty State */}
        {totalScheduled === 0 && (
          <Box
            bg="rgba(255, 255, 255, 0.03)"
            border="1px dashed rgba(255, 255, 255, 0.1)"
            borderRadius="16px"
            p={12}
            textAlign="center"
          >
            <Icon as={FiCalendar} boxSize={12} color="gray.600" mb={4} />
            <Heading size="md" color="white" mb={2}>
              No Content Scheduled
            </Heading>
            <Text color="gray.500" mb={4}>
              Your content calendar will populate during onboarding or when you schedule content.
            </Text>
            <Link href="/studio/create?fromStrategy=true">
              <Button
                bg="linear-gradient(135deg, #FF9D00, #FF6B00)"
                color="white"
                _hover={{ opacity: 0.9 }}
              >
                Create from Strategy
              </Button>
            </Link>
          </Box>
        )}

        {/* Legend */}
        <HStack spacing={4} justify="center" pt={4}>
          <HStack spacing={2}>
            <Box w={3} h={3} borderRadius="2px" bg="rgba(113, 128, 150, 0.3)" />
            <Text fontSize="xs" color="gray.500">
              Draft
            </Text>
          </HStack>
          <HStack spacing={2}>
            <Box w={3} h={3} borderRadius="2px" bg="rgba(139, 92, 246, 0.3)" />
            <Text fontSize="xs" color="gray.500">
              Scheduled
            </Text>
          </HStack>
          <HStack spacing={2}>
            <Box w={3} h={3} borderRadius="2px" bg="rgba(34, 197, 94, 0.3)" />
            <Text fontSize="xs" color="gray.500">
              Published
            </Text>
          </HStack>
        </HStack>
      </VStack>
    </StudioLayout>
  );
}
