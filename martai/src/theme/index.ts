import { extendTheme } from '@chakra-ui/react';

// Custom theme configuration for Chakra UI v2
export const theme = extendTheme({
  components: {
    Button: {
      defaultProps: {
        px: 6,
        py: 3,
      },
    },
  },
});

