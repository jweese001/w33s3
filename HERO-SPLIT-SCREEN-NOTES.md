# Hero Section - Split Layout with Unified Background

**Date:** October 19, 2025
**Version:** Network on left (50%), content on right (50%), unified dark background
**Updated:** October 19, 2025 - Final layout with transparent content overlay

## Layout Overview

### Desktop (>1024px)
```
┌─────────────────────────────────────────────┐
│ .hero { background: #0a0a0a }              │
│ ┌──────────────┐  ┌─────────────────────┐  │
│ │ Network      │  │ Content             │  │
│ │ (Left 50%)   │  │ (Right 50%)         │  │
│ │              │  │                     │  │
│ │ Canvas with  │  │ Transparent bg      │  │
│ │ dark bg      │  │ Dark hero bg shows  │  │
│ │ #0a0a0a      │  │ through             │  │
│ │              │  │                     │  │
│ │ Auto-rotate  │  │ - Title             │  │
│ │ Network      │  │ - Subtitle          │  │
│ │              │  │ - Description       │  │
│ │ Hotpink →    │  │ - Stats             │  │
│ │ Cyan nodes   │  │ - CTA Buttons       │  │
│ └──────────────┘  └─────────────────────┘  │
└─────────────────────────────────────────────┘
```

### Tablet (768px - 1024px)
```
┌──────────────────────────────────────────┐
│  Network   │     Content Area           │
│  (Left 45%)│     (Right 55%)            │
│            │                             │
│  Network   │  Slightly compressed        │
│  Graph     │  content                    │
└──────────────────────────────────────────┘
```

### Mobile (<768px)
```
┌──────────────────────────┐
│    Network Graph         │
│    (Top 40vh)            │
│                          │
├──────────────────────────┤
│    Content Area          │
│    (Bottom 60vh)         │
│                          │
│    - Title               │
│    - Subtitle            │
│    - Description         │
│    - Stats (stacked)     │
│    - CTA Buttons         │
│                          │
└──────────────────────────┘
```

## Key CSS Classes

### Desktop/Tablet Layout
```css
.hero {
    background-color: #0a0a0a; /* Unified dark background */
    padding: 0 3rem; /* Inset from edges - pushes content toward center */
}

#home-section-background {
    width: 50%; /* Left half only */
    position: absolute;
    left: 0;
}

#home-section-content {
    margin-left: 50%; /* Content positioned on right half */
    background: transparent; /* Hero's dark bg shows through */
}
```

**Three.js Camera:**
```javascript
// No offset needed - naturally centered in its container
camera.position.set(0, 0, 150);
```

### Mobile Stack
```css
@media (max-width: 768px) {
    .hero {
        flex-direction: column;
        padding: 0 1.5rem; /* Reduced padding on mobile */
    }

    #home-section-background {
        position: relative;
        width: 100%;
        height: 40vh;
    }

    #home-section-content {
        margin-left: 0;
        width: 100%;
        min-height: 60vh;
    }
}
```

## Design Features

**Hero Container:**
- Background color: `#0a0a0a` (very dark, matches Three.js scene)
- Padding: `0 3rem` on desktop/tablet (insets content from edges)
- Padding: `0 1.5rem` on mobile (less padding for smaller screens)
- This provides unified dark background across entire section

**Network (Left 50%):**
- Three.js canvas constrained to left half
- 80 nodes with pulsing animation
- Hotpink → Cyan flowing connections
- Auto-rotation (Y-axis)
- Scene background: `0x0a0a0a` (matches hero container)
- Camera naturally centered (no offset)

**Content Area (Right 50%):**
- **Transparent background** - hero's dark background shows through
- White text on dark background for contrast
- Positioned on right 50% via `margin-left: 50%`
- Max-width: 600px for readability
- Stats displayed horizontally (desktop/tablet)
- Stats stacked vertically (mobile)

## Responsive Breakpoints

- **Desktop:** 1025px+ → 50/50 split
- **Tablet:** 769px - 1024px → 45/55 split
- **Mobile:** <768px → Stacked (40vh network / 60vh content)

## Visual Hierarchy (Right Content Area)

1. Title (3rem, white, bold)
2. Subtitle (1.25rem, white 90% opacity)
3. Description (1rem, white 80% opacity, max 600px width)
4. Stats (2.5rem numbers, white)
5. CTA Buttons (teal primary, purple outline secondary)

## Advantages of This Layout

✅ **Visual Unity:** Unified dark background across entire hero section
✅ **Clean Split:** Network perfectly centered in left column (as designed)
✅ **Content Focus:** Transparent content area floats over dark background
✅ **Hierarchy:** Clear 50/50 division between visual and informational content
✅ **Responsive:** Network stays proportional, content stacks naturally on mobile
✅ **Simplicity:** No camera offsets needed - natural centering in container

## To Revert to Full-Width Layout

See: `HERO-BACKUP-FULLWIDTH.md` for original code and instructions.

## Files Modified

- `styles.css` → Hero section and responsive media queries
- No HTML changes required (same structure works for both layouts)
- `hero-background.js` → No changes (adapts to container size)
