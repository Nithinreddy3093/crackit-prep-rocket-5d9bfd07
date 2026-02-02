

# Top AI-Recommended Resources Carousel - Implementation Plan

## Overview

Add a premium, visually distinct "Top AI-Recommended Resources" section to the Learning Resources page. This section will feature a horizontal scrolling carousel with 3 handpicked YouTube videos, positioned between the category filters and the existing resource grid.

---

## Architecture

### New Component Structure

```text
src/components/resources/
    |-- AIRecommendedCarousel.tsx (NEW - main carousel container)
    |-- AIRecommendedVideoCard.tsx (NEW - individual video card)
    |-- VideoModal.tsx (EXISTING - reuse for inline preview)
```

### Data Structure

```typescript
interface AIRecommendedVideo {
  id: string;
  title: string;
  description: string;
  youtubeVideoId: string;
  category: string;
  badge: string;
}
```

---

## Component Details

### 1. AIRecommendedCarousel.tsx

**Features:**
- Horizontal scrolling carousel using Embla Carousel (already installed)
- Auto-scroll with pause on hover (implemented via CSS animation + JS control)
- Arrow navigation buttons (left/right)
- Touch/swipe support on mobile (native to Embla)
- Responsive: Shows 1 card on mobile, 2 on tablet, 3 on desktop

**Sections:**
- AI context line: "Recommended by Crackit AI based on interview & exam trends"
- Section title: "Top AI-Recommended Resources" with fire emoji
- Subtitle: "Handpicked videos to build strong fundamentals before practice"
- Carousel with navigation arrows

### 2. AIRecommendedVideoCard.tsx

**Card Elements:**
- YouTube thumbnail (using `https://img.youtube.com/vi/{VIDEO_ID}/maxresdefault.jpg`)
- Top-left badge: "AI Recommended" with gradient styling
- Video title (max 2 lines with truncation)
- Descriptor line (e.g., "Interview Essential - One Shot")
- Action buttons:
  - "Watch" - Opens YouTube in new tab
  - "Play" - Opens in VideoModal for inline preview

**Styling:**
- Larger cards than normal resources (emphasized size)
- Rounded corners with subtle glow/border
- Dark theme matching Crackit palette
- Hover effects: scale, glow intensify
- Glassmorphism effect for premium feel

---

## Video Data

The 3 videos to display (data-driven for easy future updates):

| Title | Video ID | Category |
|-------|----------|----------|
| OOPS in Java - Zero to Hero (One Shot) | dT-4mt3lxJo | Interview Essential |
| DBMS Full Playlist - Syllabus Discussion | kBdlM6hNDAE | GATE & UGC NET |
| Beginner / How to Start Learning | 0bHoB32fuj0 | Career Guidance |

---

## Layout & Placement

```text
Resources Page Structure:
--------------------------
|  Navbar               |
|  Header + Search      |
|  Category Filters     |
|------------------------|
|  [NEW SECTION]         |
|  AI Context Line       |
|  Section Title         |
|  Carousel Container    |
|     <- [Card] [Card] [Card] ->  |
|------------------------|
|  Existing Resources    |
|  Grid (unchanged)      |
|------------------------|
|  Footer               |
--------------------------
```

---

## Technical Implementation

### Auto-Scroll Behavior
Since `embla-carousel-autoplay` is not installed, we will implement auto-scroll using:
- `setInterval` with `api.scrollNext()`
- Pause on hover via `onMouseEnter` / `onMouseLeave`
- Loop enabled via Embla options

### Mobile Responsiveness
- Carousel item basis: `basis-full` (mobile), `basis-1/2` (tablet), `basis-1/3` (desktop)
- Touch swipe: Native to Embla Carousel
- Navigation arrows: Hidden on mobile (swipe only), visible on tablet/desktop

### Performance Optimizations
- YouTube thumbnails loaded as standard images (no iframe until play)
- Lazy loading for thumbnails
- Component isolation: No impact on existing resource grid rendering

---

## Files to Create

| File | Purpose |
|------|---------|
| `src/components/resources/AIRecommendedCarousel.tsx` | Main carousel container with auto-scroll |
| `src/components/resources/AIRecommendedVideoCard.tsx` | Individual video card component |

## Files to Modify

| File | Changes |
|------|---------|
| `src/pages/Resources.tsx` | Import and add `AIRecommendedCarousel` between filters and grid |

---

## Visual Design Specifications

### Color Palette (Matching Crackit Dark Theme)
- Card background: `#1e293b` (darkBlue-800)
- Glow border: `primary` color with 20% opacity
- Badge gradient: `from-orange-500 to-red-500` (fire theme)
- Text: White with varying opacities

### Card Dimensions
- Width: ~320px per card on desktop
- Height: ~280px (thumbnail + content)
- Thumbnail aspect ratio: 16:9
- Border radius: `rounded-xl`

### Animations
- Entrance: Fade in + slide up (Framer Motion)
- Hover: Scale 1.02 + glow intensify
- Auto-scroll: Smooth 5-second interval

---

## Implementation Steps

1. **Create AIRecommendedVideoCard component**
   - YouTube thumbnail display
   - Badge overlay
   - Title and descriptor
   - Watch/Play buttons
   - Hover animations

2. **Create AIRecommendedCarousel component**
   - Setup Embla carousel with loop option
   - Implement auto-scroll with interval
   - Add pause on hover functionality
   - Navigation arrows
   - Responsive item sizing
   - Section header and AI context line

3. **Integrate into Resources page**
   - Import carousel component
   - Add between category filters and resource grid
   - Pass VideoModal state handlers for inline play

4. **Add custom animations**
   - Subtle glow keyframe animation for premium feel
   - Staggered entrance animation for cards

---

## Reusability

The carousel component will be designed to accept video data as props:

```typescript
interface AIRecommendedCarouselProps {
  videos: AIRecommendedVideo[];
  onPlayVideo: (videoId: string, title: string) => void;
}
```

This allows:
- Easy addition/removal of recommended videos
- Potential reuse on other pages (Dashboard, UPSC section)
- A/B testing different video sets

