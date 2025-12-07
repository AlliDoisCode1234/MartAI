import React from 'react';
import {
  Card,
  CardBody,
  VStack,
  HStack,
  Box,
  Badge,
  Heading,
  Text,
  Button,
  useToast,
} from '@chakra-ui/react';

interface Insight {
  _id: string;
  type: string;
  title: string;
  description: string;
  action?: string;
}

interface InsightCardProps {
  insight: Insight;
  onApply: (id: string) => void;
}

export const getInsightColor = (type: string) => {
  switch (type) {
    case 'top_gainer':
      return {
        bg: 'linear(135deg, #48BB78 0%, #68D391 100%)',
        border: 'green.400',
        icon: '🚀',
        badgeColor: 'green',
        textColor: 'white',
      };
    case 'underperformer':
      return {
        bg: 'linear(135deg, #E0183C 0%, #FC8181 100%)',
        border: 'red.400',
        icon: '⚠️',
        badgeColor: 'red',
        textColor: 'white',
      };
    case 'quick_win':
      return {
        bg: 'linear(135deg, #F7941E 0%, #F6AD55 100%)',
        border: 'orange.400',
        icon: '⚡',
        badgeColor: 'orange',
        textColor: 'white',
      };
    default:
      return {
        bg: 'linear(135deg, #DEC1FF 0%, #E8D4FF 100%)',
        border: 'purple.400',
        icon: '💡',
        badgeColor: 'purple',
        textColor: 'white',
      };
  }
};

const InsightCard: React.FC<InsightCardProps> = ({ insight, onApply }) => {
  const toast = useToast();
  const colors = getInsightColor(insight.type);

  const handleAction = () => {
    if (insight.action === 'improve_meta') {
      toast({ title: 'Opening AI Generator...', status: 'info', position: 'top-right' });
    } else if (insight.action === 'optimize_keywords') {
      toast({ title: 'Redirecting to Keywords...', status: 'info', position: 'top-right' });
    } else {
      onApply(insight._id);
    }
  };

  return (
    <Card
      bgGradient={colors.bg}
      border="2px"
      borderColor={colors.border}
      shadow="xl"
      _hover={{ shadow: '2xl', transform: 'translateY(-4px) scale(1.02)' }}
      transition="all 0.3s cubic-bezier(0.4, 0, 0.2, 1)"
      overflow="hidden"
      position="relative"
    >
      {/* Decorative element */}
      <Box
        position="absolute"
        top={-20}
        right={-20}
        w="100px"
        h="100px"
        bg="white"
        opacity="0.1"
        borderRadius="full"
      />
      <CardBody position="relative" zIndex={1}>
        <VStack align="start" spacing={4}>
          <HStack justify="space-between" w="full">
            <Box bg="white" opacity="0.25" borderRadius="full" p={3} fontSize="2xl">
              {colors.icon}
            </Box>
            <Badge
              colorScheme={colors.badgeColor}
              fontSize="xs"
              px={3}
              py={1}
              fontWeight="bold"
              textTransform="capitalize"
            >
              {insight.type.replace('_', ' ')}
            </Badge>
          </HStack>
          <Heading size="md" fontFamily="heading" color={colors.textColor} lineHeight="1.2">
            {insight.title}
          </Heading>
          <Text fontSize="sm" color={colors.textColor} opacity={0.9} lineHeight="1.6">
            {insight.description}
          </Text>
          <Button
            size="sm"
            onClick={handleAction}
            bg="white"
            color={colors.border}
            _hover={{ bg: 'gray.50', transform: 'scale(1.05)' }}
            w="full"
            fontWeight="bold"
            transition="all 0.2s"
          >
            {insight.action === 'improve_meta'
              ? 'Auto-Fix Meta Tags'
              : insight.action === 'optimize_keywords'
                ? 'Research Keywords'
                : 'Mark as Resolved'}
          </Button>
        </VStack>
      </CardBody>
    </Card>
  );
};

export default InsightCard;
