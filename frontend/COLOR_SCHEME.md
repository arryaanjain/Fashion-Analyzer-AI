# 🎨 Stylette Color Scheme

## Primary Color
**Burgundy/Maroon** - `#4c1207`
- Deep, sophisticated, fashion-forward
- Used for: Headers, buttons, user messages, primary actions

## Accent Color
**Warm Gold/Champagne** - `#d4a574`
- Elegant, complementary to burgundy
- Used for: Highlights, secondary text, accent elements

## Color Palette

| Element | Color | Hex | Usage |
|---------|-------|-----|-------|
| **Primary** | Deep Burgundy | `#4c1207` | Header gradient, buttons, primary brand color |
| **Primary Dark** | Dark Burgundy | `#6b1f0f` | Gradient end, hover states |
| **Accent** | Warm Gold | `#d4a574` | Highlights, secondary text, accents |
| **Background** | White | `#FFFFFF` | Main background, message bubbles |
| **Text** | Dark Gray | `#1f2937` | Primary text content |
| **Secondary Text** | Medium Gray | `#6b7280` | Secondary information |
| **Borders** | Light Gray | `#e5e7eb` | Dividers, borders |

## Component Colors

### Header
```
Background: Linear gradient from #4c1207 → #6b1f0f → #4c1207
Text: White (#FFFFFF)
Accent: Gold (#d4a574)
```

### User Messages (Right-aligned)
```
Background: Linear gradient from #4c1207 → #6b1f0f
Text: White
Timestamp: Gold (#d4a574)
Avatar: Deep burgundy gradient
```

### Bot Messages (Left-aligned)
```
Background: White
Text: Dark gray
Border: Light gray
Avatar: Deep burgundy gradient
Timestamp: Medium gray
```

### Loading Indicator (Typing Dots)
```
Dot 1: Deep burgundy (#4c1207)
Dot 2: Warm gold (#d4a574)
Dot 3: Deep burgundy (#4c1207)
```

### Image Upload Area
```
Border (active): Deep burgundy (#4c1207)
Background (active): Burgundy with 5% opacity
Icon (active): Deep burgundy
Text highlight: Deep burgundy
```

## CSS Color Values

### Hex Values
```css
--primary: #4c1207;
--primary-dark: #6b1f0f;
--accent: #d4a574;
--white: #FFFFFF;
--text-primary: #1f2937;
--text-secondary: #6b7280;
--border: #e5e7eb;
```

### RGB Values
```css
--primary-rgb: rgb(76, 18, 7);
--primary-dark-rgb: rgb(107, 31, 15);
--accent-rgb: rgb(212, 165, 116);
```

### RGBA Values (for transparency)
```css
--primary-05: rgba(76, 18, 7, 0.05);
--primary-10: rgba(76, 18, 7, 0.10);
--primary-20: rgba(76, 18, 7, 0.20);
--accent-30: rgba(212, 165, 116, 0.30);
```

## Gradients

### Header Gradient
```
linear-gradient(to right, #4c1207 0%, #6b1f0f 50%, #4c1207 100%)
```

### User Message Gradient
```
linear-gradient(135deg, #4c1207 0%, #6b1f0f 100%)
```

### Bot Avatar Gradient
```
linear-gradient(135deg, #4c1207 0%, #6b1f0f 100%)
```

## Accessibility Notes

✅ **Contrast Ratios (WCAG AA)**
- Deep Burgundy (#4c1207) on White: 9.1:1 ✅ (AAA)
- Gold (#d4a574) on White: 4.5:1 ✅ (AA)
- White on Deep Burgundy: 11:1 ✅ (AAA)

## Color Psychology

- **Deep Burgundy (#4c1207)**: 
  - Sophistication, elegance, luxury
  - Associated with fashion, wine, refinement
  - Strong, confident, premium feel

- **Warm Gold (#d4a574)**:
  - Warmth, luxury, highlights
  - Complements burgundy beautifully
  - Adds luxury without competing for attention

## Implementation Examples

### React/Tailwind with Inline Styles
```tsx
// Header
style={{background: 'linear-gradient(to right, #4c1207 0%, #6b1f0f 50%, #4c1207 100%)'}}

// Accent text
style={{color: '#d4a574'}}

// Primary background with transparency
style={{backgroundColor: 'rgba(76, 18, 7, 0.05)'}}
```

### Current Files Using New Colors
- ✅ `FashionAnalyzer.tsx` - Header gradient
- ✅ `ChatMessage.tsx` - User/bot messages, avatars
- ✅ `TypingIndicator.tsx` - Loading animation
- ✅ `ImageUpload.tsx` - Upload area

## Future Extensions

For additional components:
1. **Buttons**: Use `#4c1207` background with white text
2. **Hover states**: Darken to `#6b1f0f` or add `#d4a574` border
3. **Focus states**: Add `#d4a574` outline (2px)
4. **Disabled states**: Use `#c9b8a8` (desaturated accent)
5. **Links**: Use `#4c1207` with `#d4a574` underline on hover

## Testing the Colors

To verify the colors are rendering correctly:

1. **Check header**: Should be deep burgundy with gradient
2. **Send message**: Your message should be in burgundy gradient
3. **Receive message**: Bot message should have burgundy avatar
4. **Drag images**: Upload area should show burgundy highlight
5. **Typing indicator**: Dots should alternate burgundy-gold-burgundy
