# MartAI Style Guide

> Design system standards for consistent, accessible, and maintainable UI

---

## 1. Spacing System (8px Grid)

All spacing uses multiples of 8px for visual consistency.

### Spacing Scale

| Token | Value | Use Case                        |
| ----- | ----- | ------------------------------- |
| `1`   | 4px   | Tight spacing, icons            |
| `2`   | 8px   | Small gaps, inline elements     |
| `3`   | 12px  | Compact padding                 |
| `4`   | 16px  | Standard padding, button height |
| `5`   | 20px  | Section gaps                    |
| `6`   | 24px  | Card padding                    |
| `8`   | 32px  | Section spacing                 |
| `10`  | 40px  | Large gaps                      |
| `12`  | 48px  | Major sections                  |
| `16`  | 64px  | Page margins                    |
| `20`  | 80px  | Hero spacing                    |

### Rules

- **Always use 8px multiples** for margins and padding
- **4px** allowed for fine-tuning icons and tight spaces
- **Never use arbitrary values** like 7px, 13px, etc.

```tsx
// ✅ Correct
<Box p={4} mb={8} />  // 16px padding, 32px margin

// ❌ Incorrect
<Box p="13px" mb="7px" />  // Arbitrary values
```

---

## 2. Typography

### Fonts

- **Headings**: Poppins (bold, tight letter-spacing)
- **Body**: Inter (readable, modern)

### Type Scale

| Component | Size Token | Font Size | Line Height | Use Case                  |
| --------- | ---------- | --------- | ----------- | ------------------------- |
| `xs`      | xs         | 12px      | 16px        | Captions, labels          |
| `sm`      | sm         | 14px      | 20px        | Secondary text, help text |
| `md`      | md         | 16px      | 24px        | Body text (default)       |
| `lg`      | lg         | 18px      | 28px        | Lead paragraphs           |
| `xl`      | xl         | 20px      | 28px        | Sub-headings              |
| `2xl`     | 2xl        | 24px      | 32px        | H4 headings               |
| `3xl`     | 3xl        | 30px      | 36px        | H3 headings               |
| `4xl`     | 4xl        | 36px      | 40px        | H2 headings               |
| `5xl`     | 5xl        | 48px      | 1           | H1 headings               |

### Rules

- **Minimum body text**: 16px (md)
- **Line height**: 1.5× for body, 1.2× for headings
- **Max line width**: 65-75 characters for readability

```tsx
// ✅ Correct
<Heading size="2xl">Page Title</Heading>
<Text fontSize="md">Body content</Text>

// ❌ Avoid inline font sizes
<Text style={{ fontSize: '15px' }}>Arbitrary</Text>
```

---

## 3. Colors

### Brand Colors

| Name             | Hex       | Usage                 |
| ---------------- | --------- | --------------------- |
| **Brand Orange** | `#F7941E` | Primary CTAs, accents |
| **Brand Red**    | `#E0183C` | Gradient end, errors  |
| **Brand Teal**   | `#40DEC7` | Success, highlights   |

### Brand Gradient

```css
/* Primary gradient */
background: linear-gradient(135deg, #f7941e 0%, #e0183c 100%);

/* Hover gradient */
background: linear-gradient(135deg, #ffaf4b 0%, #ff4d6d 100%);
```

### Semantic Colors

| Token       | Light Mode | Dark Mode | Usage            |
| ----------- | ---------- | --------- | ---------------- |
| `bg.light`  | #FFFFFF    | -         | Backgrounds      |
| `bg.dark`   | -          | #1A202C   | Dark backgrounds |
| `bg.subtle` | #F7FAFC    | #2D3748   | Cards, inputs    |
| `gray.600`  | #718096    | #A0AEC0   | Secondary text   |
| `gray.800`  | #1A202C    | #E2E8F0   | Primary text     |

### Color Rules

- Use **brand gradient** for primary CTAs only
- Use **gray scale** for text hierarchy
- Ensure **4.5:1 contrast ratio** for text
- Test all colors in **light and dark modes**

---

## 4. Components

### Buttons

| Variant                         | Use Case             |
| ------------------------------- | -------------------- |
| `solid` + `colorScheme="brand"` | Primary CTA          |
| `outline`                       | Secondary actions    |
| `ghost`                         | Tertiary, navigation |

```tsx
// Primary CTA
<Button colorScheme="brand" variant="solid">Get Started</Button>

// Secondary
<Button variant="outline">Learn More</Button>
```

### Cards

| Variant | Use Case              |
| ------- | --------------------- |
| default | Content containers    |
| `glass` | Overlay cards, modals |

```tsx
// Standard card
<Card borderRadius="xl" boxShadow="sm">
  <CardBody p={6}>Content</CardBody>
</Card>

// Glass card
<Card variant="glass">Content</Card>
```

### Border Radius

| Token  | Value  | Use                    |
| ------ | ------ | ---------------------- |
| `md`   | 6px    | Inputs, small elements |
| `lg`   | 8px    | Buttons, badges        |
| `xl`   | 12px   | Cards                  |
| `2xl`  | 16px   | Modals, large cards    |
| `full` | 9999px | Pills, avatars         |

---

## 5. Layout

### Breakpoints

| Token  | Width  | Device        |
| ------ | ------ | ------------- |
| `base` | 0+     | Mobile        |
| `sm`   | 480px  | Large mobile  |
| `md`   | 768px  | Tablet        |
| `lg`   | 992px  | Desktop       |
| `xl`   | 1280px | Large desktop |
| `2xl`  | 1536px | Extra large   |

### Container

- Max width: `1280px`
- Horizontal padding: `16px` (mobile), `24px` (tablet+)

---

## 6. Animation

### Timing

| Name   | Duration | Use             |
| ------ | -------- | --------------- |
| Fast   | 150ms    | Hover states    |
| Normal | 200ms    | Transitions     |
| Slow   | 300ms    | Modals, reveals |

### Easing

- **Default**: `ease-in-out`
- **Enter**: `ease-out`
- **Exit**: `ease-in`

### Hover Effects

```tsx
// Card hover
_hover={{ boxShadow: 'md', transform: 'translateY(-2px)' }}

// Button hover
_hover={{ transform: 'translateY(-1px)', boxShadow: 'lg' }}
```

---

## 7. Accessibility

- **Focus states**: Always visible, use `outline` or `ring`
- **Contrast**: 4.5:1 minimum for text
- **Touch targets**: 44px minimum
- **Labels**: All inputs must have labels
- **Alt text**: All images need alt text
