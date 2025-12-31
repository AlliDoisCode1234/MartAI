/**
 * Dark Glass Design Tokens
 *
 * Centralized dark glassmorphic theme tokens for the Content Studio.
 * Use these tokens consistently to maintain visual cohesion.
 */

export const darkGlass = {
  // Backgrounds
  bg: 'rgba(30, 30, 30, 0.6)',
  bgSubtle: 'rgba(30, 30, 30, 0.4)',
  bgSolid: 'rgba(13, 13, 13, 0.98)',
  bgHover: 'rgba(255, 255, 255, 0.05)',
  bgActive: 'rgba(255, 157, 0, 0.15)',

  // Borders
  border: 'rgba(255, 255, 255, 0.1)',
  borderHover: 'rgba(255, 255, 255, 0.2)',
  borderActive: 'rgba(255, 157, 0, 0.3)',

  // Text
  text: 'white',
  textMuted: 'gray.400',
  textSubtle: 'gray.500',

  // Accents
  accentOrange: '#FF9D00',
  accentOrangeHover: '#FF6B00',
  accentOrangeBg: 'rgba(255, 157, 0, 0.1)',

  // Effects
  blur: 'blur(10px)',
  shadow: 'lg',
  shadowGlow: '0 0 20px rgba(255, 157, 0, 0.2)',

  // Border radius
  radius: 'xl',
  radiusLg: '2xl',
};

// Pre-composed card styles
export const glassCardProps = {
  bg: darkGlass.bg,
  backdropFilter: darkGlass.blur,
  borderWidth: '1px',
  borderColor: darkGlass.border,
  borderRadius: darkGlass.radius,
};

// Pre-composed input styles
export const glassInputProps = {
  bg: 'rgba(255, 255, 255, 0.05)',
  borderColor: darkGlass.border,
  color: darkGlass.text,
  _placeholder: { color: 'gray.500' },
  _hover: { borderColor: darkGlass.borderHover },
  _focus: {
    borderColor: 'orange.400',
    boxShadow: '0 0 0 1px var(--chakra-colors-orange-400)',
  },
};

// Solid dark header (for minimal nav)
export const glassSolidHeaderProps = {
  bg: darkGlass.bgSolid,
  borderBottom: `1px solid ${darkGlass.border}`,
  backdropFilter: darkGlass.blur,
};
