# MartAI Brand Guide

> Visual identity and brand standards for MartAI

---

## 1. Brand Overview

**MartAI** is an AI-powered SEO platform that helps small businesses grow organic traffic through intelligent content strategy.

### Brand Personality

- **Intelligent** - AI-powered, data-driven
- **Approachable** - Simple, not intimidating
- **Energetic** - Vibrant, optimistic
- **Trustworthy** - Reliable, professional

### Voice & Tone

- Clear and direct (no jargon)
- Helpful and encouraging
- Confident but not arrogant
- Technical accuracy with simple explanations

---

## 2. Logo

### Primary Mark

The MartAI logo combines the wordmark with the Mart character orb.

### Usage Rules

- **Minimum size**: 100px wide
- **Clear space**: Equal to the height of the "M" on all sides
- **Do not**: Stretch, rotate, add effects, or change colors

### Logo Variants

| Variant     | Use Case                         |
| ----------- | -------------------------------- |
| Full color  | Primary use on light backgrounds |
| White       | On dark or colored backgrounds   |
| Orange mono | Single-color applications        |

---

## 3. Color Palette

### Primary Colors

| Color                                                           | Name             | Hex       | RGB          | Usage                 |
| --------------------------------------------------------------- | ---------------- | --------- | ------------ | --------------------- |
| ![#F7941E](https://via.placeholder.com/20/F7941E/F7941E?text=+) | **Brand Orange** | `#F7941E` | 247, 148, 30 | Primary CTAs, accents |
| ![#E0183C](https://via.placeholder.com/20/E0183C/E0183C?text=+) | **Brand Red**    | `#E0183C` | 224, 24, 60  | Gradient end, urgency |
| ![#40DEC7](https://via.placeholder.com/20/40DEC7/40DEC7?text=+) | **Brand Teal**   | `#40DEC7` | 64, 222, 199 | Success, highlights   |

### Brand Gradient

```css
/* Primary gradient - use for CTAs, hero elements */
background: linear-gradient(135deg, #f7941e 0%, #e0183c 100%);
```

### Extended Palette

| Shade | Orange Scale | Red Scale |
| ----- | ------------ | --------- |
| 50    | `#FFF5F5`    | -         |
| 100   | `#FED7D7`    | -         |
| 200   | `#FEB2B2`    | -         |
| 300   | `#FC8181`    | -         |
| 400   | `#F56565`    | -         |
| 500   | `#E53E3E`    | `#E0183C` |
| 600   | `#C53030`    | -         |
| 700   | `#9B2C2C`    | -         |
| 800   | `#822727`    | -         |
| 900   | `#63171B`    | -         |

### Background Colors

| Name   | Light     | Dark      |
| ------ | --------- | --------- |
| Page   | `#F7FAFC` | `#1A202C` |
| Card   | `#FFFFFF` | `#2D3748` |
| Subtle | `#EDF2F7` | `#4A5568` |

---

## 4. Typography

### Font Families

| Purpose      | Font    | Weight  | Fallback   |
| ------------ | ------- | ------- | ---------- |
| **Headings** | Poppins | 600-700 | sans-serif |
| **Body**     | Inter   | 400-500 | sans-serif |

### Font Stack

```css
--font-heading: 'Poppins', -apple-system, BlinkMacSystemFont, sans-serif;
--font-body: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
```

### Type Hierarchy

| Level   | Font    | Size | Weight | Use              |
| ------- | ------- | ---- | ------ | ---------------- |
| H1      | Poppins | 48px | 700    | Page titles      |
| H2      | Poppins | 36px | 700    | Section headers  |
| H3      | Poppins | 30px | 600    | Subsections      |
| H4      | Poppins | 24px | 600    | Cards headers    |
| Body    | Inter   | 16px | 400    | Paragraphs       |
| Small   | Inter   | 14px | 400    | Help text        |
| Caption | Inter   | 12px | 400    | Labels, metadata |

---

## 5. Iconography

### Style

- **Line weight**: 1.5px stroke
- **Style**: Rounded corners, simple
- **Library**: Feather Icons (react-icons/fi)

### Common Icons

| Icon         | Name       | Usage             |
| ------------ | ---------- | ----------------- |
| FiTrendingUp | Growth     | Analytics, trends |
| FiZap        | Quick wins | Fast actions      |
| FiTarget     | Goals      | Targeting, SEO    |
| FiLayers     | Clusters   | Grouping content  |
| FiFileText   | Content    | Briefs, drafts    |

---

## 6. Imagery

### Photography Style

- **Authentic** - Real people, not stock
- **Diverse** - Inclusive representation
- **Bright** - Well-lit, optimistic
- **Professional** - Business context

### Illustrations

- **Simple** - Minimal detail
- **On-brand** - Use brand gradient
- **Purposeful** - Support the message

### Mart Character

The orb/particle character represents MartAI's AI personality:

- Ambient, dreamy animation
- Orange/purple/teal color palette
- Responds to user interaction
- Appears during loading/thinking states

---

## 7. UI Elements

### Buttons

| Type      | Appearance    | Use                   |
| --------- | ------------- | --------------------- |
| Primary   | Gradient fill | Main CTA (1 per view) |
| Secondary | Outline       | Alternative actions   |
| Ghost     | Text only     | Navigation, tertiary  |

### Cards

- Border radius: 12px (xl)
- Shadow: sm (default), md (hover)
- Glass variant for overlays

### Inputs

- Border radius: 6px
- Border: 1px gray.300
- Focus: brand orange ring

---

## 8. Motion

### Principles

- **Meaningful** - Motion has purpose
- **Subtle** - Never distract
- **Fast** - Under 300ms
- **Smooth** - Ease-in-out

### Standard Timings

| Action | Duration |
| ------ | -------- |
| Hover  | 150ms    |
| Fade   | 200ms    |
| Slide  | 250ms    |
| Modal  | 300ms    |

---

## 9. Do's and Don'ts

### ✅ Do

- Use the brand gradient for primary CTAs
- Maintain consistent spacing (8px grid)
- Keep text readable (16px minimum)
- Test in light and dark modes

### ❌ Don't

- Use brand orange for errors (use red.500)
- Mix more than 3 colors per component
- Use all-caps for body text
- Exceed 75 characters per line
