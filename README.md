# 🚦 SafeRoute

### *Safety-first navigation prototype*
## 📌 About

**SafeRoute** is a **prototype navigation app** that prioritizes *user safety* over just the fastest route.

Most navigation apps optimize for time, but in real-world scenarios—especially at night—**safer routes matter more than shorter ones**.

SafeRoute introduces a system where users can choose routes based on:

* 🌙 Lighting conditions
* 🏪 Nearby activity (open shops)
* 👥 Crowd density

---

## 💡 Inspiration

Inspired by urban safety initiatives, this project explores how navigation systems can evolve to include **safety as a core metric**, not just speed.

> *Because saving 2 minutes is never worth risking safety.*

---

## ✨ Features

### 🔄 Route Selection

* Toggle between:

  * Standard route
  * Safety-optimized route

### 📊 Reporting System

* Users can report:

  * Lighting quality
  * Crowd levels
* Updates dynamically affect route safety

### ⏱️ Real-Time Simulation

* Simulates user movement along routes
* Built using:

```javascript
useEffect
setInterval
```

### 🎨 UI/UX

* Dark mode interface 🌑
* High-contrast safety indicators
* Mobile-first design

---

## ⚠️ Challenges

### 📍 Path Synchronization

* Mapping accurate X/Y coordinates on SVG paths
* Keeping movement speed consistent

### 📱 UI State Management

Handling multiple states:

* Search
* Navigation
* Arrival
* Reporting

### 🔄 Dynamic Updates

* Real-time propagation of safety reports
* Immediate UI refresh

---

## 📚 What I Learned

* Prototyping complex systems
* Managing multi-state UI flows
* Designing accessible interfaces
* Writing clear micro-copy
* Using color for meaningful feedback

---

## Built With

- **TypeScript** - Language
- **React 19** - UI Framework
- **Tailwind CSS 4** - Styling
- **Framer Motion** - Animations
- **Lucide React** - Icons
- **Vite** - Build Tool
- **Google AI Studio** - Development Platform

---

## 🚀 Getting Started

### Installation

```bash
git clone https://github.com/your-username/saferoute.git
cd saferoute
npm install
npm start
```

---

## 🎮 Usage

1. Enter your destination
2. Choose route type (standard / safe)
3. View simulated navigation
4. Submit safety reports
---

1. Main Home Page:
   ![Alt Text](https://github.com/Dishitha0607/WalkSure/blob/2b25c3a1349e1c047cbe7905f60ee73aa64f4cd6/pictures/main_screen.png)
---

2. Emergency conatcts and Report Safety Status features are added:
   ![Alt Text](https://github.com/Dishitha0607/WalkSure/blob/2b25c3a1349e1c047cbe7905f60ee73aa64f4cd6/pictures/add_features.png)

---

3.SOS message and live location that is sent to the emergency conntact:
 ![Alt Text](https://github.com/Dishitha0607/WalkSure/blob/2b25c3a1349e1c047cbe7905f60ee73aa64f4cd6/pictures/sos.png)

---

## 🔮 Future Scope

* Integration with real-time Maps API
* Live lighting & crowd data
* AI-based safety recommendations
