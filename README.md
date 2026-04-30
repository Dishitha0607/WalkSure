# SafeRoute: Secure Navigation

A safety-focused navigation application that prioritizes well-lit, active routes with street light metrics and crowd density monitoring.

## About the Project

### Inspiration
SafeRoute was inspired by the need for a pedestrian-first navigation tool that values personal security over mere speed. Traditional maps often lead users through dimly lit short-cuts; SafeRoute changes the vertical to prioritize "Safe Paths" characterized by high business activity and exceptional lighting.

### How I Built It
- **Frontend:** Built with React 19 and Tailwind CSS 4 for a responsive, mobile-first interface.
- **Animation:** Used `motion/react` (Framer Motion) to handle complex UI transitions, such as the slide-up reporting panels and the user tracking simulation.
- **Logic:** Implemented a custom path-tracking algorithm that moves the user icon along SVG segments and calculates real-time ETA updates.
- **State:** Features a dynamic reporting system that allows the community to update lighting and crowd metrics in real-time.

### Challenges
- **SVG Animation:** Synchronizing the user's position indicator across multi-point paths with varying segment lengths.
- **State Propagation:** Ensuring that safety reports submitted via the UI correctly update the nested route data and trigger immediate map re-renders.
- **Haptic UI:** Designing buttons and panels that feel "tactile" and responsive on a mobile screen.

### Learnings
Deepened understanding of declarative animation in React and the importance of "Dark Mode" accessibility for night-time safety applications.

## Built With

- **TypeScript** - Language
- **React 19** - UI Framework
- **Tailwind CSS 4** - Styling
- **Framer Motion** - Animations
- **Lucide React** - Icons
- **Vite** - Build Tool
- **Google AI Studio** - Development Platform
