import React, { useState, useEffect, useRef } from 'react';
import { 
  Search, 
  Navigation, 
  ShieldCheck, 
  Zap, 
  Map as MapIcon, 
  Users, 
  Lightbulb, 
  Store, 
  AlertTriangle, 
  Lock,
  ArrowRight,
  Menu,
  MoreVertical,
  Compass,
  MapPin,
  Pause
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface Route {
  id: string;
  name: string;
  time: number;
  lights: number;
  lightingGrade: 'Exceptional' | 'Good' | 'Fair' | 'Poor';
  crowd: 'High' | 'Moderate' | 'Low' | 'Empty';
  businesses: number;
  color: string;
  path: string; // SVG path data
  isSafest?: boolean;
  shops: { x: number; y: number; name: string; type: string }[];
  points: { x: number; y: number }[];
}

const destinationAlpha: Route[] = [
  {
    id: 'fastest',
    name: 'Fastest Route',
    time: 12,
    lights: 4,
    lightingGrade: 'Poor',
    crowd: 'Low',
    businesses: 2,
    color: '#3b82f6', // blue-500
    path: 'M 50 100 L 250 100 L 250 300 L 350 300',
    shops: [
      { x: 150, y: 85, name: 'Quick Stop Deli', type: 'Shop' },
      { x: 265, y: 200, name: 'Central Bank ATM', type: 'Bank' }
    ],
    points: [
      { x: 50, y: 100 }, { x: 150, y: 100 }, { x: 250, y: 100 }, 
      { x: 250, y: 200 }, { x: 250, y: 300 }, { x: 350, y: 300 }
    ]
  },
  {
    id: 'secondary',
    name: 'Residential Path',
    time: 16,
    lights: 15,
    lightingGrade: 'Fair',
    crowd: 'Moderate',
    businesses: 5,
    color: '#94a3b8', // slate-400
    path: 'M 50 100 L 100 150 L 100 250 L 200 350 L 350 300',
    shops: [
      { x: 80, y: 135, name: 'Quiet Library', type: 'Library' },
      { x: 115, y: 180, name: 'Family Bakery', type: 'Cafe' },
      { x: 85, y: 230, name: 'Corner Flowers', type: 'Shop' },
      { x: 165, y: 315, name: 'Pet Groomers', type: 'Shop' },
      { x: 250, y: 345, name: 'Night Chemist', type: 'Pharmacy' },
    ],
    points: [
      { x: 50, y: 100 }, { x: 100, y: 150 }, { x: 100, y: 250 }, 
      { x: 200, y: 350 }, { x: 350, y: 300 }
    ]
  },
  {
    id: 'safest',
    name: 'Safe Path Recommended',
    time: 18,
    lights: 78,
    lightingGrade: 'Exceptional',
    crowd: 'High',
    businesses: 14,
    color: '#22c55e', // green-500
    isSafest: true,
    path: 'M 50 100 L 50 200 L 150 200 L 150 300 L 250 350 L 350 300',
    shops: [
      { x: 35, y: 130, name: 'The Urban Grind', type: 'Cafe' },
      { x: 35, y: 170, name: '24/7 Bodega', type: 'Shop' },
      { x: 80, y: 185, name: 'Golden Spoon', type: 'Restaurant' },
      { x: 120, y: 185, name: 'Blue Note Jazz', type: 'Bar' },
      { x: 165, y: 230, name: 'City Library', type: 'Library' },
      { x: 165, y: 270, name: 'Green Grocery', type: 'Shop' },
      { x: 180, y: 315, name: 'Late Night Tacos', type: 'Restaurant' },
      { x: 220, y: 345, name: 'The Daily News', type: 'Shop' },
      { x: 280, y: 345, name: 'Main St Pharmacy', type: 'Pharmacy' },
      { x: 350, y: 315, name: 'Oak St Coffee', type: 'Cafe' },
      { x: 65, y: 155, name: 'Boutique Books', type: 'Shop' },
      { x: 135, y: 215, name: 'Pasta House', type: 'Restaurant' },
      { x: 165, y: 285, name: 'Local Bank', type: 'Bank' },
      { x: 200, y: 325, name: 'Community Hub', type: 'Public' }
    ],
    points: [
      { x: 50, y: 100 }, { x: 50, y: 200 }, { x: 150, y: 200 }, 
      { x: 150, y: 300 }, { x: 250, y: 350 }, { x: 350, y: 300 }
    ]
  }
];

const destinationBeta: Route[] = [
  {
    id: 'beta-fast',
    name: 'Bridge Shortcut',
    time: 25,
    lights: 8,
    lightingGrade: 'Fair',
    crowd: 'Low',
    businesses: 4,
    color: '#0ea5e9',
    path: 'M 50 100 L 100 80 L 300 80 L 320 200 L 280 320',
    shops: [
      { x: 110, y: 70, name: 'Bridge View', type: 'Park' },
      { x: 250, y: 70, name: 'Skyline Shop', type: 'Shop' },
      { x: 180, y: 75, name: 'Misty Coffee', type: 'Cafe' },
      { x: 310, y: 140, name: 'River Pharmacy', type: 'Pharmacy' }
    ],
    points: [{ x: 50, y: 100 }, { x: 100, y: 80 }, { x: 300, y: 80 }, { x: 320, y: 200 }, { x: 280, y: 320 }]
  },
  {
    id: 'beta-safe',
    name: 'Well-Lit Transit Way',
    time: 32,
    lights: 95,
    lightingGrade: 'Exceptional',
    crowd: 'High',
    businesses: 12,
    color: '#10b981',
    isSafest: true,
    path: 'M 50 100 L 40 250 L 150 270 L 200 150 L 300 150 L 280 320',
    shops: [
      { x: 60, y: 240, name: 'Transit Hub', type: 'Transport' },
      { x: 160, y: 260, name: 'Main Plaza', type: 'Public' },
      { x: 210, y: 140, name: 'Grand Hotel', type: 'Public' },
      { x: 270, y: 160, name: 'Safety Post', type: 'Security' },
      { x: 50, y: 180, name: 'Central Bank', type: 'Bank' },
      { x: 100, y: 260, name: 'Plaza Grill', type: 'Restaurant' },
      { x: 150, y: 230, name: 'City Market', type: 'Shop' },
      { x: 230, y: 160, name: 'Hotel Bar', type: 'Bar' },
      { x: 280, y: 200, name: 'Safe Haven', type: 'Public' },
      { x: 310, y: 220, name: 'Express Mart', type: 'Shop' },
      { x: 180, y: 200, name: 'Public Library', type: 'Library' },
      { x: 260, y: 280, name: 'Midnight Diner', type: 'Restaurant' }
    ],
    points: [{ x: 50, y: 100 }, { x: 40, y: 250 }, { x: 150, y: 270 }, { x: 200, y: 150 }, { x: 300, y: 150 }, { x: 280, y: 320 }]
  }
];

const destinations = [
  { id: 'alpha', name: 'Oak Street Coffee', address: '128 Oak St, Downtown', routes: destinationAlpha },
  { id: 'beta', name: 'Grand Central Station', address: '89 Main Blvd, North', routes: destinationBeta }
];

export default function App() {
  const [activeDest, setActiveDest] = useState(destinations[0]);
  const [routesData, setRoutesData] = useState<Route[]>(destinations[0].routes);
  const [selectedRoute, setSelectedRoute] = useState<Route>(destinations[0].routes[destinations[0].routes.length - 1]);
  const [isAlertActive, setIsAlertActive] = useState(false);
  const [isNavigating, setIsNavigating] = useState(false);
  const [userPos, setUserPos] = useState({ x: 50, y: 100 });
  const [remainingTime, setRemainingTime] = useState(selectedRoute.time);
  const [panelState, setPanelState] = useState<'expanded' | 'collapsed'>('expanded');
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isContactsOpen, setIsContactsOpen] = useState(false);
  const [isReportOpen, setIsReportOpen] = useState(false);
  const [isReporting, setIsReporting] = useState(false);
  const [showArrivalNotification, setShowArrivalNotification] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  
  const [reportData, setReportData] = useState({
    routeId: selectedRoute.id,
    lighting: 'Exceptional' as Route['lightingGrade'],
    crowd: 'High' as Route['crowd'],
    shops: 14
  });

  const [contacts, setContacts] = useState([
    { id: '1', name: 'Mom', phone: '+1 (555) 123-4567' },
    { id: '2', name: 'Dad', phone: '+1 (555) 987-6543' },
    { id: '3', name: 'Local Security', phone: '911' },
    { id: '4', name: 'Best Friend', phone: '+1 (555) 000-1111' },
  ]);

  const handleDestinationChange = (dest: typeof destinations[0]) => {
    setActiveDest(dest);
    setRoutesData(dest.routes);
    const initialRoute = dest.routes[dest.routes.length - 1]; // Default to safest
    setSelectedRoute(initialRoute);
    setRemainingTime(initialRoute.time);
    setUserPos({ x: 50, y: 100 });
    setIsSearching(false);
    setSearchQuery('');
    setPanelState('expanded');
    setShowArrivalNotification(false);
    setIsNavigating(false);
  };
  
  useEffect(() => {
    let interval: any;
    if (isNavigating) {
      let currentPointIndex = 0;
      let t = 0; // percentage of current segment (0 to 1)
      const step = 0.005; // Adjust this for speed (smaller = slower)

      interval = setInterval(() => {
        t += step;
        
        if (t >= 1) {
          t = 0;
          currentPointIndex++;
        }

        if (currentPointIndex >= selectedRoute.points.length - 1) {
          clearInterval(interval);
          setIsNavigating(false);
          setShowArrivalNotification(true);
          return;
        }

        const startPoint = selectedRoute.points[currentPointIndex];
        const endPoint = selectedRoute.points[currentPointIndex + 1];

        const x = startPoint.x + (endPoint.x - startPoint.x) * t;
        const y = startPoint.y + (endPoint.y - startPoint.y) * t;
        
        setUserPos({ x, y });

        // Update remaining time based on total progress
        const totalPoints = selectedRoute.points.length;
        const totalProgress = (currentPointIndex + t) / (totalPoints - 1);
        setRemainingTime(Math.max(1, Math.round(selectedRoute.time * (1 - totalProgress))));
      }, 30); // ~33fps for smooth motion
    } else {
      setUserPos({ x: 50, y: 100 });
      setRemainingTime(selectedRoute.time);
    }

    return () => clearInterval(interval);
  }, [isNavigating, selectedRoute]);

  return (
    <div className="relative h-screen w-full bg-slate-950 overflow-hidden font-sans selection:bg-green-500/30">
      {/* Mock Status Bar */}
      <div className="absolute top-0 left-0 right-0 z-40 flex justify-between items-center px-8 py-3 text-white text-[10px] font-medium pointer-events-none">
        <span>9:00 PM</span>
        <div className="flex gap-1.5 items-center">
          {isNavigating && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="mr-2 flex items-center gap-1"
            >
              <div className="w-1.5 h-1.5 bg-red-500 rounded-full animate-pulse" />
              <span className="text-[8px] font-black tracking-widest text-red-500">LIVE</span>
            </motion.div>
          )}
          <div className="w-3 h-1.5 bg-white/40 rounded-sm"></div>
          <div className="w-3 h-3 bg-white/20 rounded-full"></div>
          <div className="w-3 h-3 bg-white rounded-full"></div>
        </div>
      </div>

      {/* Background Map Mockup */}
      <div className="absolute inset-0 z-0">
        <MockMap selectedRoute={selectedRoute} userPos={userPos} routes={routesData} destinationName={activeDest.name} />
      </div>

      {/* Top Navigation Bar */}
      <motion.div 
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        className="absolute top-0 left-0 right-0 z-[60] p-4 pt-10"
      >
        <div className="bg-slate-900/90 backdrop-blur-md border border-white/10 rounded-2xl shadow-xl p-3 flex flex-col gap-2">
          <div className="flex items-center gap-3">
            <Menu className="w-5 h-5 text-slate-400 cursor-pointer" onClick={() => setIsMenuOpen(true)} />
            <div 
              className="flex-1 flex flex-col cursor-pointer" 
              onClick={() => setIsSearching(!isSearching)}
            >
              <span className="text-[10px] uppercase tracking-widest text-white/50 font-black">Destination</span>
              <div className="flex items-center gap-2">
                <span className="text-white font-bold">{activeDest.name}</span>
                <Search className="w-3 h-3 text-green-500" />
              </div>
            </div>
            <motion.div 
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setIsNavigating(!isNavigating)}
              className={`w-10 h-10 ${isNavigating ? 'bg-red-500' : 'bg-green-500'} rounded-full flex items-center justify-center shadow-lg transition-colors`}
            >
              {isNavigating ? (
                <Pause className="w-4 h-4 text-white" fill="currentColor" />
              ) : (
                <Navigation className="w-4 h-4 text-slate-950" fill="currentColor" />
              )}
            </motion.div>
          </div>

          <AnimatePresence>
            {isSearching && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="overflow-hidden"
              >
                <div className="pt-3 border-t border-white/5 space-y-2">
                  <div className="relative">
                    <input 
                      type="text"
                      placeholder="Search safe destinations..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:ring-1 focus:ring-green-500/50"
                      autoFocus
                    />
                  </div>
                  
                  <div className="space-y-1">
                    <label className="text-[9px] font-black text-white/30 uppercase tracking-widest px-1">Nearby Safe Spots</label>
                    {destinations.filter(d => d.name.toLowerCase().includes(searchQuery.toLowerCase())).map(dest => (
                      <button
                        key={dest.id}
                        onClick={() => handleDestinationChange(dest)}
                        className={`w-full flex items-center gap-3 p-3 rounded-xl transition-all ${
                          activeDest.id === dest.id ? 'bg-green-500/10 border border-green-500/20' : 'bg-transparent border border-transparent hover:bg-white/5'
                        }`}
                      >
                        <div className="w-8 h-8 rounded-lg bg-slate-800 flex items-center justify-center text-slate-400">
                          <MapPin className="w-4 h-4" />
                        </div>
                        <div className="text-left">
                          <div className="text-sm font-bold text-white">{dest.name}</div>
                          <div className="text-[10px] text-white/40">{dest.address}</div>
                        </div>
                        {activeDest.id === dest.id && <div className="ml-auto w-1.5 h-1.5 rounded-full bg-green-500" />}
                      </button>
                    ))}
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>


      {/* Emergency Quick Action Buttons */}
      <div className="absolute bottom-[35%] right-4 z-20 flex flex-col gap-3">
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setIsAlertActive(true)}
          className="w-14 h-14 bg-red-600 rounded-full shadow-lg shadow-red-900/50 flex items-center justify-center border-2 border-red-500"
        >
          <span className="text-[11px] font-black text-white">SOS</span>
        </motion.button>
      </div>

      {/* Bottom Information Panel */}
      <motion.div 
        initial={{ y: '100%' }}
        animate={{ y: panelState === 'expanded' ? 0 : 'calc(100% - 100px)' }}
        transition={{ type: 'spring', damping: 25, stiffness: 200 }}
        drag="y"
        dragConstraints={{ top: 0, bottom: 0 }}
        onDragEnd={(_, info) => {
          if (info.offset.y > 50) setPanelState('collapsed');
          else if (info.offset.y < -50) setPanelState('expanded');
        }}
        className="absolute bottom-0 left-0 right-0 z-30 bg-slate-950/95 backdrop-blur-xl border-t border-white/10 px-6 pt-2 pb-8 shadow-[0_-20px_50px_rgba(0,0,0,0.5)] touch-none"
      >
        <div 
          className="w-16 h-1 bg-white/20 rounded-full mx-auto my-4 mb-6 cursor-grab active:cursor-grabbing" 
          onClick={() => setPanelState(panelState === 'expanded' ? 'collapsed' : 'expanded')}
        />
        
        <div className="space-y-6">
          <header className="flex justify-between items-start">
            <div onClick={() => setPanelState('expanded')} className="cursor-pointer">
              <h2 className="text-lg font-bold text-white flex items-center gap-2 leading-tight">
                {isNavigating ? `Navigating to ${activeDest.name}` : `Heading to ${activeDest.name}`}
                <ShieldCheck className={`w-4 h-4 ${isNavigating ? 'text-blue-500' : 'text-green-500'}`} />
              </h2>
              <p className="text-green-400 text-[10px] uppercase font-bold tracking-tight mt-0.5">
                via {selectedRoute.isSafest ? 'Safe Path Recommended' : selectedRoute.name}
              </p>
            </div>
            <div className="text-right">
              <span className={`text-2xl font-black text-white leading-none block ${isNavigating ? 'animate-pulse' : ''}`}>
                {isNavigating ? remainingTime : selectedRoute.time} min
              </span>
              <span className="text-[10px] text-white/50 tracking-tighter">1.1 km • 9:18 PM Arrival</span>
            </div>
          </header>

          <AnimatePresence>
            {panelState === 'expanded' && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="space-y-6 overflow-hidden"
              >
                <div className="flex gap-2 overflow-x-auto pb-2 no-scrollbar">
                  {routesData.map((route) => (
                    <button
                      key={route.id}
                      onClick={() => {
                        setSelectedRoute(route);
                        setShowArrivalNotification(false);
                        if (!isNavigating) setRemainingTime(route.time);
                      }}
                      disabled={isNavigating}
                      className={`flex-shrink-0 px-4 py-3 rounded-2xl border transition-all ${
                        selectedRoute.id === route.id 
                          ? `bg-white/10 border-white/20 ring-1 ring-white/10` 
                          : 'bg-white/5 border-white/5 opacity-50'
                      } ${isNavigating ? 'cursor-not-allowed' : 'cursor-pointer'}`}
                    >
                      <div className="flex items-center gap-2 mb-1">
                        <div className={`w-2 h-2 rounded-full`} style={{ backgroundColor: route.color }} />
                        <span className="text-[9px] font-black uppercase text-white/40">{route.time} MIN</span>
                      </div>
                      <div className="text-xs font-bold text-white whitespace-nowrap">{route.name}</div>
                    </button>
                  ))}
                </div>

                <div className="grid grid-cols-3 gap-2 bg-white/5 p-4 rounded-2xl border border-white/5">
                  <MetricCard 
                    icon={
                      <div className={`w-5 h-5 flex items-center justify-center rounded-full ${
                        selectedRoute.lightingGrade === 'Exceptional' ? 'bg-yellow-400/20 text-yellow-400' : 
                        selectedRoute.lightingGrade === 'Good' ? 'bg-yellow-400/10 text-yellow-400/70' : 
                        'bg-zinc-800 text-zinc-500'
                      }`}>☀</div>
                    }
                    label="Lights"
                    value={selectedRoute.lightingGrade}
                    active={true}
                  />
                  <MetricCard 
                    icon={
                      <div className={`w-5 h-5 flex items-center justify-center rounded-full ${
                        selectedRoute.crowd === 'High' ? 'bg-blue-400/20 text-blue-400' : 
                        selectedRoute.crowd === 'Moderate' ? 'bg-blue-400/10 text-blue-400/70' : 
                        'bg-zinc-800 text-zinc-500'
                      }`}>☺</div>
                    }
                    label="Crowd"
                    value={selectedRoute.crowd}
                    active={true}
                  />
                  <MetricCard 
                    icon={
                      <div className={`w-5 h-5 flex items-center justify-center rounded-full ${
                        selectedRoute.businesses > 10 ? 'bg-green-400/20 text-green-400' : 
                        selectedRoute.businesses > 0 ? 'bg-green-400/10 text-green-400/70' : 
                        'bg-zinc-800 text-zinc-500'
                      }`}>☖</div>
                    }
                    label="Shops"
                    value={`${selectedRoute.businesses} Open`}
                    active={true}
                  />
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          <div className="flex gap-4 items-center">
            <button 
              onClick={() => {
                const starting = !isNavigating;
                if (starting) setShowArrivalNotification(false);
                setIsNavigating(starting);
              }}
              className={`flex-1 ${isNavigating ? 'bg-red-500/10 text-red-500 border border-red-500/50' : 'bg-green-500 text-slate-950'} font-bold h-14 rounded-2xl flex items-center justify-center gap-2 transition-all shadow-lg active:scale-[0.98]`}
            >
              {isNavigating ? (
                <>
                  STOP NAVIGATION
                  <Pause className="w-5 h-5" />
                </>
              ) : (
                <>
                  START NAVIGATION
                  <ArrowRight className="w-5 h-5" />
                </>
              )}
            </button>
            <button 
              onClick={() => setIsMenuOpen(true)}
              className="w-14 h-14 bg-white/5 border border-white/10 rounded-2xl flex items-center justify-center text-white hover:bg-white/10 transition-colors"
            >
              <MoreVertical className="w-6 h-6" />
            </button>
          </div>

          <div className="w-24 h-1 bg-white/20 mx-auto mt-2 rounded-full" />
        </div>
      </motion.div>

      {/* Options Menu Sheet */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 z-50 bg-slate-950/60 backdrop-blur-sm flex items-end"
            onClick={() => setIsMenuOpen(false)}
          >
            <motion.div 
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              className="w-full bg-slate-900 rounded-t-[32px] p-6 pb-12 space-y-3"
              onClick={e => e.stopPropagation()}
            >
              <div className="w-12 h-1.5 bg-white/10 rounded-full mx-auto mb-6" />
              <button 
                onClick={() => { setIsMenuOpen(false); setIsContactsOpen(true); }}
                className="w-full p-5 bg-white/5 border border-white/10 rounded-2xl flex items-center gap-4 text-white hover:bg-white/10 transition-all font-bold"
              >
                <div className="w-10 h-10 bg-blue-500/20 rounded-xl flex items-center justify-center text-blue-400">
                  <Lock className="w-5 h-5" />
                </div>
                Emergency Contacts
              </button>
              <button 
                onClick={() => { setIsMenuOpen(false); setIsReportOpen(true); }}
                className="w-full p-5 bg-white/5 border border-white/10 rounded-2xl flex items-center gap-4 text-white hover:bg-white/10 transition-all font-bold"
              >
                <div className="w-10 h-10 bg-yellow-500/20 rounded-xl flex items-center justify-center text-yellow-400">
                  <Lightbulb className="w-5 h-5" />
                </div>
                Report Safety Status
              </button>
              <button 
                onClick={() => setIsMenuOpen(false)}
                className="w-full p-5 text-zinc-500 font-bold"
              >
                Dismiss
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Safety Reporting Modal */}
      <AnimatePresence>
        {isReportOpen && (
          <motion.div 
            initial={{ opacity: 0, y: 100 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 100 }}
            className="absolute inset-0 z-[70] bg-slate-950 flex flex-col p-6"
          >
            <div className="flex justify-between items-center mb-8 pt-8">
              <h2 className="text-2xl font-black text-white">CONTRIBUTE DATA</h2>
              <button 
                onClick={() => setIsReportOpen(false)}
                className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-white"
              >
                <ArrowRight className="w-5 h-5 rotate-180" />
              </button>
            </div>

            <div className="flex-1 space-y-8 overflow-y-auto no-scrollbar">
              <section>
                <label className="text-[10px] font-black text-white/40 uppercase tracking-widest mb-4 block">Select Route to Update</label>
                <div className="grid grid-cols-1 gap-2">
                  {routesData.map((route) => (
                    <button 
                      key={route.id}
                      onClick={() => setReportData({ 
                        ...reportData, 
                        routeId: route.id,
                        lighting: route.lightingGrade,
                        crowd: route.crowd,
                        shops: route.businesses
                      })}
                      className={`p-4 rounded-xl border flex items-center justify-between transition-all ${
                        reportData.routeId === route.id ? 'bg-white/10 border-white/40 ring-1 ring-white/20' : 'bg-white/5 border-white/5'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-3 h-3 rounded-full" style={{ backgroundColor: route.color }} />
                        <span className="font-bold text-white text-sm">{route.name}</span>
                      </div>
                      {reportData.routeId === route.id && <ShieldCheck className="w-4 h-4 text-green-500" />}
                    </button>
                  ))}
                </div>
              </section>

              <section>
                <label className="text-[10px] font-black text-white/40 uppercase tracking-widest mb-4 block">Lighting Grade</label>
                <div className="grid grid-cols-2 gap-3">
                  {['Exceptional', 'Good', 'Fair', 'Poor'].map((grade) => (
                    <button 
                      key={grade}
                      onClick={() => setReportData({ ...reportData, lighting: grade as Route['lightingGrade'] })}
                      className={`p-4 rounded-xl border font-bold transition-all ${
                        reportData.lighting === grade ? 'bg-yellow-500 text-black border-yellow-500' : 'bg-white/5 border-white/10 text-white/60'
                      }`}
                    >
                      {grade}
                    </button>
                  ))}
                </div>
              </section>

              <section>
                <label className="text-[10px] font-black text-white/40 uppercase tracking-widest mb-4 block">Crowd Level</label>
                <div className="flex gap-2 overflow-x-auto no-scrollbar">
                  {['High', 'Moderate', 'Low', 'Empty'].map((level) => (
                    <button 
                      key={level}
                      onClick={() => setReportData({ ...reportData, crowd: level as Route['crowd'] })}
                      className={`flex-shrink-0 px-6 py-3 rounded-full border font-bold transition-all ${
                        reportData.crowd === level ? 'bg-blue-500 text-white border-blue-500' : 'bg-white/5 border-white/10 text-white/40'
                      }`}
                    >
                      {level}
                    </button>
                  ))}
                </div>
              </section>

              <section>
                <label className="text-[10px] font-black text-white/40 uppercase tracking-widest mb-4 block">Open Shops Nearby</label>
                <div className="flex items-center justify-between bg-white/5 p-6 rounded-2xl border border-white/10">
                  <button 
                    onClick={() => setReportData({ ...reportData, shops: Math.max(0, reportData.shops - 1) })}
                    className="w-12 h-12 bg-white/5 rounded-full text-2xl font-bold"
                  >-</button>
                  <div className="text-center">
                    <span className="text-4xl font-black text-white">{reportData.shops}</span>
                    <span className="block text-[10px] text-white/30 uppercase font-black">Businesses</span>
                  </div>
                  <button 
                    onClick={() => setReportData({ ...reportData, shops: reportData.shops + 1 })}
                    className="w-12 h-12 bg-white/10 rounded-full text-2xl font-bold"
                  >+</button>
                </div>
              </section>
            </div>

            <div className="pt-6 pb-8">
              <button 
                onClick={() => {
                  setIsReporting(true);
                  setTimeout(() => {
                    // Update the routes state
                    const updatedRoutes = routesData.map(r => {
                      if (r.id === reportData.routeId) {
                        return {
                          ...r,
                          lightingGrade: reportData.lighting,
                          crowd: reportData.crowd,
                          businesses: reportData.shops
                        };
                      }
                      return r;
                    });
                    
                    setRoutesData(updatedRoutes);
                    
                    // If the updated route is the selected route, update selectedRoute state too for immediate UI refresh
                    if (selectedRoute.id === reportData.routeId) {
                      setSelectedRoute(updatedRoutes.find(r => r.id === reportData.routeId)!);
                    }
                    
                    setIsReporting(false);
                    setIsReportOpen(false);
                  }, 1500);
                }}
                className={`w-full h-16 rounded-2xl font-black text-lg transition-all flex items-center justify-center gap-3 ${
                  isReporting ? 'bg-white/10 text-white/50 cursor-not-allowed' : 'bg-green-500 text-slate-950 shadow-lg shadow-green-500/20'
                }`}
              >
                {isReporting ? (
                  <>
                    <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1 }}><Compass className="w-6 h-6" /></motion.div>
                    SYNCING STATUS...
                  </>
                ) : (
                  'SUBMIT REPORT'
                )}
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Contacts Management Modal */}
      <AnimatePresence>
        {isContactsOpen && (
          <motion.div 
            initial={{ opacity: 0, scale: 1.1 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.1 }}
            className="absolute inset-0 z-[60] bg-slate-950 flex flex-col p-6"
          >
            <div className="flex justify-between items-center mb-8 pt-8">
              <h2 className="text-2xl font-black text-white">EMERGENCY CONTACTS</h2>
              <button 
                onClick={() => setIsContactsOpen(false)}
                className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-white"
              >
                <ArrowRight className="w-5 h-5 rotate-180" />
              </button>
            </div>

            <div className="flex-1 space-y-4 overflow-y-auto no-scrollbar">
              {contacts.map((contact) => (
                <div key={contact.id} className="p-4 bg-white/5 border border-white/10 rounded-2xl flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-blue-500/20 rounded-full flex items-center justify-center text-blue-400 font-bold">
                      {contact.name.charAt(0)}
                    </div>
                    <div>
                      <div className="text-white font-bold">{contact.name}</div>
                      <div className="text-white/40 text-sm">{contact.phone}</div>
                    </div>
                  </div>
                  <Lock className="w-4 h-4 text-white/20" />
                </div>
              ))}
              
              <button className="w-full p-4 border border-dashed border-white/20 rounded-2xl flex items-center justify-center gap-2 text-white/40 hover:text-white hover:border-white/40 transition-all">
                <Users className="w-5 h-5" />
                Add New Contact
              </button>
            </div>

            <div className="pb-8 pt-4">
              <p className="text-[10px] text-white/30 uppercase tracking-widest text-center">
                Contacts will be alerted immediately if SOS is triggered.
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* SOS Modal Overlay */}
      <AnimatePresence>
        {isAlertActive && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 z-50 bg-red-600/90 backdrop-blur-xl flex flex-col items-center justify-center p-8 text-center"
          >
            <motion.div
              initial={{ scale: 0.5, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="bg-white/10 p-12 rounded-full border-4 border-white mb-8"
            >
              <AlertTriangle className="w-24 h-24 text-white" />
            </motion.div>
            <h1 className="text-4xl font-black text-white mb-4">SOS ACTIVE</h1>
            <p className="text-white/80 text-lg max-w-xs mb-12">
              Alerting 4 emergency contacts and local security services with your current location.
            </p>
            <button 
              onClick={() => setIsAlertActive(false)}
              className="bg-white text-red-600 px-8 py-4 rounded-2xl font-bold text-xl uppercase tracking-wider"
            >
              Cancel Alert
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Destination Reached Notification */}
      <AnimatePresence>
        {showArrivalNotification && (
          <motion.div 
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="absolute inset-0 z-[100] flex items-center justify-center p-6 bg-slate-950/80 backdrop-blur-md"
          >
            <motion.div 
              className="bg-slate-900 border border-white/10 rounded-[32px] p-8 w-full max-w-sm shadow-2xl text-center relative overflow-hidden"
              initial={{ y: 50 }}
              animate={{ y: 0 }}
            >
              {/* Celebration background effect */}
              <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-green-500 via-emerald-400 to-green-500 animate-pulse" />
              
              <div className="mb-6 relative inline-block">
                <motion.div 
                  className="w-20 h-20 bg-green-500/20 rounded-full flex items-center justify-center text-green-500 mx-auto"
                  animate={{ 
                    scale: [1, 1.1, 1],
                    rotate: [0, 5, -5, 0]
                  }}
                  transition={{ duration: 3, repeat: Infinity }}
                >
                  <ShieldCheck className="w-10 h-10" />
                </motion.div>
                <motion.div 
                  className="absolute -top-1 -right-1 w-6 h-6 bg-green-500 rounded-full flex items-center justify-center border-4 border-slate-900"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.5 }}
                >
                  <motion.div 
                    className="w-1.5 h-1.5 bg-white rounded-full"
                    animate={{ opacity: [0, 1, 0] }}
                    transition={{ repeat: Infinity, duration: 1.5 }}
                  />
                </motion.div>
              </div>
              
              <h2 className="text-2xl font-black text-white mb-2 leading-tight">ARRIVED SAFELY</h2>
              <p className="text-white/60 text-sm mb-8 leading-relaxed">
                You've reached <span className="text-white font-bold">{activeDest.name}</span>. 
                Your emergency contacts have been notified that you arrived at your destination.
              </p>
              
              <div className="space-y-3">
                <button 
                  onClick={() => setShowArrivalNotification(false)}
                  className="w-full h-14 bg-green-500 text-slate-950 font-black rounded-2xl shadow-lg shadow-green-500/20 active:scale-[0.98] transition-all"
                >
                  DISMISS
                </button>
                <button 
                  onClick={() => {
                    setShowArrivalNotification(false);
                    setIsReportOpen(true);
                  }}
                  className="w-full h-14 bg-white/5 border border-white/10 text-white font-bold rounded-2xl hover:bg-white/10 transition-all"
                >
                  REPORT STATUS
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function MetricCard({ icon, label, value, active }: { icon: React.ReactNode, label: string, value: string, active?: boolean }) {
  return (
    <div className={`flex flex-col items-center gap-1 transition-opacity ${active ? 'opacity-100' : 'opacity-40'}`}>
      {icon}
      <div className="text-[8px] text-white/50 uppercase font-bold text-center leading-tight">
        {label}<br /><span className="text-white">{value}</span>
      </div>
    </div>
  );
}

function MockMap({ selectedRoute, userPos, routes, destinationName }: { selectedRoute: Route, userPos: { x: number, y: number }, routes: Route[], destinationName: string }) {
  const [hoveredShop, setHoveredShop] = useState<{ name: string; type: string; x: number; y: number } | null>(null);
  const [rotation, setRotation] = useState(0);
  const prevPos = useRef(userPos);

  const destPoint = selectedRoute.points[selectedRoute.points.length - 1];

  // Derive visual intensity from safety metrics
  const lightIntensity = 
    selectedRoute.lightingGrade === 'Exceptional' ? 40 : 
    selectedRoute.lightingGrade === 'Good' ? 25 : 
    selectedRoute.lightingGrade === 'Fair' ? 12 : 5;

  const crowdPulseSpeed = 
    selectedRoute.crowd === 'High' ? 1 : 
    selectedRoute.crowd === 'Moderate' ? 2 : 
    selectedRoute.crowd === 'Low' ? 4 : 8;

  // Calculate rotation based on movement direction
  useEffect(() => {
    const dx = userPos.x - prevPos.current.x;
    const dy = userPos.y - prevPos.current.y;
    
    if (Math.abs(dx) > 0.1 || Math.abs(dy) > 0.1) {
      const angle = Math.atan2(dy, dx) * (180 / Math.PI) + 90;
      setRotation(angle);
    }
    prevPos.current = userPos;
  }, [userPos]);

  return (
    <div className="relative w-full h-full bg-slate-950">
      {/* Grid Pattern */}
      <div className="absolute inset-0 opacity-[0.05] bg-[linear-gradient(rgba(255,255,255,.1)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,.1)_1px,transparent_1px)] bg-[size:40px_40px]" />
      
      <svg className="absolute inset-0 w-full h-full" viewBox="0 0 400 600" preserveAspectRatio="xMidYMid slice">
        {/* Street Layout Slate Lines */}
        <path d="M 0 100 L 400 100" stroke="#1e293b" strokeWidth="20" fill="none" opacity="0.3" />
        <path d="M 0 200 L 400 200" stroke="#1e293b" strokeWidth="20" fill="none" opacity="0.3" />
        <path d="M 0 300 L 400 300" stroke="#1e293b" strokeWidth="20" fill="none" opacity="0.3" />
        <path d="M 50 0 L 50 600" stroke="#1e293b" strokeWidth="20" fill="none" opacity="0.3" />
        <path d="M 150 0 L 150 600" stroke="#1e293b" strokeWidth="20" fill="none" opacity="0.3" />
        <path d="M 250 0 L 250 600" stroke="#1e293b" strokeWidth="20" fill="none" opacity="0.3" />
        <path d="M 350 0 L 350 600" stroke="#1e293b" strokeWidth="20" fill="none" opacity="0.3" />

        {/* Landmarks */}
        <text x="20" y="50" fill="white" opacity="0.1" fontSize="10" fontWeight="bold" className="uppercase tracking-widest">Central Core District</text>

        {/* Destination Marker (📍 Emoji style) */}
        <g transform={`translate(${destPoint.x}, ${destPoint.y})`}>
          <motion.text 
            x="-10" y="5" 
            fontSize="20" 
            animate={{ y: [5, -5, 5] }} 
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          >
            📍
          </motion.text>
          <text x="12" y="-10" fill="white" opacity="0.6" fontSize="10" fontWeight="black" className="uppercase tracking-tighter">{destinationName}</text>
          <circle cx="0" cy="0" r="15" fill={selectedRoute.color} opacity="0.1" />
        </g>

        {/* Street Lights (Glow Icons) */}
        {Array.from({ length: lightIntensity }).map((_, i) => (
          <motion.circle 
            key={i} 
            cx={50 + (i % 6) * 60 + (Math.sin(i * 1.5) * 30)} 
            cy={50 + Math.floor(i / 6) * 100 + (Math.cos(i * 1.5) * 30)} 
            r={selectedRoute.lightingGrade === 'Exceptional' ? "1.8" : "1.2"} 
            fill="#eab308" 
            animate={{ 
              opacity: selectedRoute.lightingGrade === 'Exceptional' ? [0.8, 1, 0.8] : [0.3, 0.6, 0.3],
              scale: selectedRoute.lightingGrade === 'Exceptional' ? [1, 1.2, 1] : [1, 1, 1]
            }}
            transition={{ duration: 2 + Math.random() * 2, repeat: Infinity }}
            style={{ filter: `drop-shadow(0 0 ${selectedRoute.lightingGrade === 'Exceptional' ? '6px' : '3px'} rgba(234, 179, 8, 0.8))` }}
          />
        ))}

        {/* Routes */}
        {routes.map((route) => (
          <path
            key={route.id}
            d={route.path}
            stroke={route.color}
            strokeWidth={route.id === selectedRoute.id ? "6" : "3"}
            strokeDasharray={route.id === 'fastest' ? "8,8" : route.id === 'secondary' ? "4,4" : "0"}
            strokeOpacity={route.id === selectedRoute.id ? "1" : "0.1"}
            fill="none"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="transition-all duration-500"
          />
        ))}

        {/* Shop Markers */}
        <AnimatePresence>
          {selectedRoute.shops.slice(0, selectedRoute.businesses).map((shop, i) => (
            <motion.g
              key={`${selectedRoute.id}-shop-${i}`}
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0 }}
              transition={{ delay: i * 0.05 }}
              onMouseEnter={() => setHoveredShop(shop)}
              onMouseLeave={() => setHoveredShop(null)}
              className="cursor-pointer"
            >
              <circle cx={shop.x} cy={shop.y} r="6" fill={selectedRoute.color} opacity="0.2" />
              <circle cx={shop.x} cy={shop.y} r="2" fill={selectedRoute.color} />
              <motion.circle 
                cx={shop.x} cy={shop.y} r="10" 
                stroke={selectedRoute.color} strokeWidth="0.5" fill="none" opacity="0.3"
                animate={{ 
                  scale: selectedRoute.crowd === 'Empty' ? [1, 1, 1] : [1, 1.8, 1], 
                  opacity: selectedRoute.crowd === 'Empty' ? [0.1, 0.1, 0.1] : [0.4, 0, 0.4] 
                }}
                transition={{ duration: crowdPulseSpeed, repeat: Infinity, delay: i * 0.2 }}
              />
            </motion.g>
          ))}
        </AnimatePresence>

        {/* Shop Hover Text */}
        <AnimatePresence>
          {hoveredShop && (
            <motion.g
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
            >
              <rect 
                x={hoveredShop.x - 50} 
                y={hoveredShop.y - 45} 
                width="100" 
                height="30" 
                rx="6" 
                fill="#0f172a" 
                stroke={selectedRoute.color} 
                strokeWidth="1" 
                opacity="0.95" 
              />
              <text 
                x={hoveredShop.x} 
                y={hoveredShop.y - 33} 
                textAnchor="middle" 
                fill="white" 
                fontSize="8" 
                fontWeight="black" 
                className="uppercase tracking-tighter"
              >
                {hoveredShop.name}
              </text>
              <text 
                x={hoveredShop.x} 
                y={hoveredShop.y - 23} 
                textAnchor="middle" 
                fill={selectedRoute.color} 
                fontSize="7" 
                fontWeight="bold" 
                className="uppercase"
              >
                {hoveredShop.type}
              </text>
            </motion.g>
          )}
        </AnimatePresence>

        {/* User Marker */}
        <motion.g 
          animate={{ x: userPos.x, y: userPos.y }}
          transition={{ 
            type: 'tween',
            ease: 'linear',
            duration: 0.03
          }}
        >
          {/* Signal Pulse */}
          <motion.circle 
            cx="0" cy="0" r="18" fill="#3b82f6" opacity="0"
            animate={{ scale: [1, 2], opacity: [0.3, 0] }}
            transition={{ duration: 1.5, repeat: Infinity }}
          />
          
          {/* Main Position Circle */}
          <circle 
            cx="0" cy="0" r="8" 
            fill="#3b82f6" 
            stroke="white" 
            strokeWidth="2.5"
          />
        </motion.g>

        {/* Route Tooltips */}
        {routes.map((route) => (
          route.id === selectedRoute.id && (
            <motion.g 
              key={`${route.id}-label`}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <rect x="20" y="340" width="220" height="35" rx="8" fill="#0f172a" opacity="0.9" stroke="rgba(255,255,255,0.05)" strokeWidth="1" />
              <text x="30" y="354" fill={route.id === 'safest' ? '#4ade80' : 'white'} fontSize="8" fontWeight="bold" className="uppercase tracking-tighter">
                {route.id === 'safest' ? 'SAFE PATH RECOMMENDED' : route.name} ({route.time} min)
              </text>
              <text x="30" y="366" fill="white" opacity="0.7" fontSize="8">
                {route.lights} Street Lights • {route.crowd} Crowd • {route.businesses} Shops
              </text>
            </motion.g>
          )
        ))}
      </svg>
    </div>
  );
}
