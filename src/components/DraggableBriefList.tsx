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
import { Box, VStack, HStack, Text, Badge, IconButton } from '@chakra-ui/react';

type Brief = {
  _id?: string;
  id?: string;
  title: string;
  scheduledDate: number;
  clusterId?: string;
  status: string;
  week?: number;
};

type DraggableBriefListProps = {
  briefs: Brief[];
  onReorder: (briefs: Brief[]) => void;
  onReschedule?: (briefId: string, newDate: number) => void;
};

function SortableBriefItem({ brief, onReschedule }: { brief: Brief; onReschedule?: (briefId: string, newDate: number) => void }) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: brief._id || brief.id || '' });

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
  const [items, setItems] = useState(briefs);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      setItems((items) => {
        const oldIndex = items.findIndex((item) => (item._id || item.id) === active.id);
        const newIndex = items.findIndex((item) => (item._id || item.id) === over.id);
        
        const newItems = arrayMove(items, oldIndex, newIndex);
        onReorder(newItems);
        return newItems;
      });
    }
  };

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragEnd={handleDragEnd}
    >
      <SortableContext
        items={items.map((b) => b._id || b.id || '')}
        strategy={verticalListSortingStrategy}
      >
        <VStack spacing={3} align="stretch">
          {items.map((brief) => (
            <SortableBriefItem
              key={brief._id || brief.id}
              brief={brief}
              onReschedule={onReschedule}
            />
          ))}
        </VStack>
      </SortableContext>
    </DndContext>
  );
}

