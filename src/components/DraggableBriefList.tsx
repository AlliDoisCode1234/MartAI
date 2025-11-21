'use client';

import { useState } from 'react';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import {
  useSortable,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Box, VStack, HStack, Text, Badge } from '@chakra-ui/react';
import type { Brief, BriefId } from '@/types';

// Pass whole brief object to maintain type inference
interface DraggableBriefListProps {
  briefs: Brief[];
  onReorder: (briefs: Brief[]) => void;
  onReschedule?: (briefId: BriefId, newDate: number) => void;
}

interface SortableBriefItemProps {
  brief: Brief;
  onReschedule?: (briefId: BriefId, newDate: number) => void;
}

function SortableBriefItem({ brief, onReschedule }: SortableBriefItemProps) {
  const briefId = (brief._id || brief.id || '') as string;
  
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: briefId });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  const date = new Date(brief.scheduledDate);
  const week = brief.week || Math.floor((brief.scheduledDate - Date.now()) / (7 * 24 * 60 * 60 * 1000)) + 1;

  return (
    <Box
      ref={setNodeRef}
      style={style}
      p={4}
      bg="white"
      borderRadius="md"
      border="1px"
      borderColor="gray.200"
      shadow={isDragging ? 'lg' : 'sm'}
      _hover={{ shadow: 'md', borderColor: 'brand.orange' }}
      transition="all 0.2s"
      cursor="grab"
      {...attributes}
      {...listeners}
    >
      <HStack justify="space-between">
        <VStack align="start" spacing={1} flex={1}>
          <Text fontWeight="semibold" fontSize="sm">
            {brief.title}
          </Text>
          <HStack spacing={2}>
            <Badge colorScheme="orange" fontSize="xs">
              Week {week}
            </Badge>
            <Text fontSize="xs" color="gray.600">
              {date.toLocaleDateString()}
            </Text>
            <Badge colorScheme={brief.status === 'draft' ? 'gray' : 'green'} fontSize="xs">
              {brief.status}
            </Badge>
          </HStack>
        </VStack>
        <Text fontSize="lg" color="gray.400">
          ⋮⋮
        </Text>
      </HStack>
    </Box>
  );
}

export function DraggableBriefList({ briefs, onReorder, onReschedule }: DraggableBriefListProps) {
  const [items, setItems] = useState<Brief[]>(briefs);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      setItems((currentItems) => {
        const getBriefId = (brief: Brief) => (brief._id || brief.id || '') as string;
        const oldIndex = currentItems.findIndex((item) => getBriefId(item) === active.id);
        const newIndex = currentItems.findIndex((item) => getBriefId(item) === over.id);
        
        if (oldIndex === -1 || newIndex === -1) return currentItems;
        
        const newItems = arrayMove(currentItems, oldIndex, newIndex);
        onReorder(newItems);
        return newItems;
      });
    }
  };

  const getBriefId = (brief: Brief): string => (brief._id || brief.id || '') as string;

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragEnd={handleDragEnd}
    >
      <SortableContext
        items={items.map(getBriefId)}
        strategy={verticalListSortingStrategy}
      >
        <VStack spacing={3} align="stretch">
          {items.map((brief) => {
            const id = getBriefId(brief);
            return (
              <SortableBriefItem
                key={id}
                brief={brief}
                onReschedule={onReschedule}
              />
            );
          })}
        </VStack>
      </SortableContext>
    </DndContext>
  );
}

