import { useState, useEffect, useRef } from "react";

const attractions = [
  { id: 1, name: "Big Thunder Mountain", land: "Frontierland", wait: 45, status: "open" },
  { id: 2, name: "Pirates of the Caribbean", land: "Adventureland", wait: 10, status: "open" },
  { id: 3, name: "Haunted Mansion", land: "Fantasyland", wait: 30, status: "open" },
  { id: 4, name: "Space Mountain", land: "Discoveryland", wait: 75, status: "open" },
  { id: 5, name: "Peter Pan's Flight", land: "Fantasyland", wait: 60, status: "open" },
  { id: 6, name: "Indiana Jones and the Temple of Peril", land: "Adventureland", wait: 0, status: "closed" },
  { id: 7, name: "Buzz Lightyear Laser Blast", land: "Discoveryland", wait: 20, status: "open" },
  { id: 8, name: "It's a Small World", land: "Fantasyland", wait: 15, status: "open" },
  { id: 9, name: "Phantom Manor", land: "Frontierland", wait: 35, status: "open" },
  { id: 10, name: "Star Wars Hyperspace Mountain", land: "Discoveryland", wait: 90, status: "open" },
  { id: 11, name: "Crush's Coaster", land: "Walt Disney Studios", wait: 120, status: "open" },
  { id: 12, name: "Ratatouille Adventure", land: "Walt Disney Studios", wait: 55, status: "open" },
  { id: 13, name: "RC Racer", land: "Walt Disney Studios", wait: 0, status: "closed" },
  { id: 14, name: "Cars Road Trip", land: "Walt Disney Studios", wait: 25, status: "open" },
];

const restaurants = [
  { id: 1, name: "Plaza Gardens Restaurant", land: "Main Street", type: "Restaurant", open: "12:00", close: "21:00", reservation: true, reserved: false, cuisine: "Französisch", price: "€€€" },
  { id: 2, name: "Walt's – An American Restaurant", land: "Main Street", type: "Restaurant", open: "12:00", close: "22:00", reservation: true, reserved: true, cuisine: "Amerikanisch", price: "€€€" },
  { id: 3, name: "Blue Lagoon Restaurant", land: "Adventureland", type: "Restaurant", open: "11:30", close: "21:30", reservation: true, reserved: false, cuisine: "Karibisch", price: "€€€" },
  { id: 4, name: "Hakuna Matata Restaurant", land: "Adventureland", type: "Schnellimbiss", open: "11:00", close: "20:00", reservation: false, reserved: false, cuisine: "Afrikanisch", price: "€€" },
  { id: 5, name: "Cowboy Cookout Barbecue", land: "Frontierland", type: "Schnellimbiss", open: "11:00", close: "20:30", reservation: false, reserved: false, cuisine: "BBQ", price: "€€" },
  { id: 6, name: "Last Chance Café", land: "Frontierland", type: "Snack", open: "10:00", close: "18:00", reservation: false, reserved: false, cuisine: "Snacks", price: "€" },
  { id: 7, name: "Auberge de Cendrillon", land: "Fantasyland", type: "Restaurant", open: "12:00", close: "21:00", reservation: true, reserved: true, cuisine: "Französisch", price: "€€€" },
  { id: 8, name: "Pizzeria Bella Notte", land: "Fantasyland", type: "Schnellimbiss", open: "11:00", close: "20:00", reservation: false, reserved: false, cuisine: "Italienisch", price: "€€" },
  { id: 9, name: "Café Hyperion", land: "Discoveryland", type: "Schnellimbiss", open: "10:30", close: "19:30", reservation: false, reserved: false, cuisine: "Burger & Wraps", price: "€€" },
  { id: 10, name: "The Lucky Nugget Saloon", land: "Frontierland", type: "Restaurant", open: "12:00", close: "20:00", reservation: false, reserved: false, cuisine: "Amerikanisch", price: "€€" },
  { id: 11, name: "Bistrot Chez Rémy", land: "Walt Disney Studios", type: "Restaurant", open: "12:00", close: "21:30", reservation: true, reserved: false, cuisine: "Französisch", price: "€€€" },
  { id: 12, name: "Restaurant des Stars", land: "Walt Disney Studios", type: "Restaurant", open: "12:00", close: "21:00", reservation: true, reserved: true, cuisine: "Amerikanisch", price: "€€€" },
];

const shows = [
  { id: 1, name: "Disney Stars on Parade", type: "Parade", location: "Main Street", times: ["11:30", "15:00", "18:30"], duration: 30, emoji: "🎠" },
  { id: 2, name: "Disney Illuminations", type: "Feuerwerk", location: "Schloss", times: ["22:00"], duration: 25, emoji: "🎆" },
  { id: 3, name: "The Lion King: Rhythms of the Pride Lands", type: "Show", location: "Frontierland", times: ["12:00", "14:00", "16:00", "18:00"], duration: 20, emoji: "🦁" },
  { id: 4, name: "Mickey's PhilharMagic", type: "Show", location: "Fantasyland", times: ["11:00", "13:00", "15:30", "17:30"], duration: 12, emoji: "🎵" },
  { id: 5, name: "Star Wars: A Galactic Celebration", type: "Nachtshow", location: "Discoveryland", times: ["21:00"], duration: 20, emoji: "⭐" },
  { id: 6, name: "Frozen: A Musical Invitation", type: "Show", location: "Fantasyland", times: ["10:30", "12:30", "14:30", "16:30"], duration: 25, emoji: "❄️" },
  { id: 7, name: "Mickey and the Magician", type: "Show", location: "Walt Disney Studios", times: ["11:30", "14:00", "16:30"], duration: 45, emoji: "🎩" },
  { id: 8, name: "Moteurs… Action! Stunt Show", type: "Stuntshow", location: "Walt Disney Studios", times: ["11:00", "14:00", "17:00"], duration: 35, emoji: "🚗" },
];

const getNextTime = (times) => {
  const now = new Date();
  const nowMin = now.getHours() * 60 + now.getMinutes();
  for (const t of times) {
    const [h, m] = t.split(":").map(Number);
    const tMin = h * 60 + m;
    if (tMin > nowMin) {
      const diff = tMin - nowMin;
      return { time: t, diffMin: diff };
    }
  }
  return null;
};

const isOpen = (open, close) => {
  const now = new Date();
  const [oh, om] = open.split(":").map(Number);
  const [ch, cm] = close.split(":").map(Number);
  const nowMin = now.getHours() * 60 + now.getMinutes();
  return nowMin >= oh * 60 + om && nowMin <= ch * 60 + cm;
};

const lands = ["Alle", "Frontierland", "Adventureland", "Fantasyland", "Discoveryland", "Walt Disney Studios"];

const waitColor = (wait, status, dark) => {
  if (status === "closed") return dark ? "bg-gray-700 text-gray-400" : "bg-gray-200 text-gray-500";
  if (wait <= 15) return dark ? "bg-green-900 text-green-300" : "bg-green-100 text-green-800";
  if (wait <= 40) return dark ? "bg-yellow-900 text-yellow-300" : "bg-yellow-100 text-yellow-800";
  if (wait <= 70) return dark ? "bg-orange-900 text-orange-300" : "bg-orange-100 text-orange-800";
  return dark ? "bg-red-900 text-red-300" : "bg-red-100 text-red-800";
};

const waitBadgeColor = (wait, status) => {
  if (status === "closed") return "bg-gray-300 text-gray-600";
  if (wait <= 15) return "bg-green-500 text-white";
  if (wait <= 40) return "bg-yellow-400 text-white";
  if (wait <= 70) return "bg-orange-500 text-white";
  return "bg-red-600 text-white";
};

export default function DLPMobil() {
  const [selectedLand, setSelectedLand] = useState("Alle");
  const [sortBy, setSortBy] = useState("name");
  const [quickFilter, setQuickFilter] = useState(null); // null | "short" | "open" | "closed"
  const [searchQuery, setSearchQuery] = useState("");
  const [lastUpdated, setLastUpdated] = useState("");
  const [darkMode, setDarkMode] = useState(false);
  const [notifEnabled, setNotifEnabled] = useState(false);
  const [notifThreshold, setNotifThreshold] = useState(20);
  const [notifications, setNotifications] = useState([]);
  const [liveData, setLiveData] = useState(attractions.map(a => ({...a})));
  const [waitHistory, setWaitHistory] = useState(() => { const init = {}; attractions.forEach(a => { init[a.id] = [a.wait]; }); return init; });
  const prevRef = useRef(attractions.map(a => ({...a})));
  const [favorites, setFavorites] = useState([]);
  const [activeTab, setActiveTab] = useState("alle"); // "alle" | "favoriten" | "plan" | "karte" | "restaurants"
  const [restFilter, setRestFilter] = useState("Alle");
  const [showFilter, setShowFilter] = useState("Alle");
  const [now, setNow] = useState(new Date());

  useEffect(() => {
    const t = setInterval(() => setNow(new Date()), 30000);
    return () => clearInterval(t);
  }, []); // "alle" | "favoriten" | "plan" | "karte" // "alle" | "favoriten" | "plan"
  const [plan, setPlan] = useState([]); // [{id, customWait}]
  const [collapsedLands, setCollapsedLands] = useState({});
  const [swipeState, setSwipeState] = useState({});
  const [compactMode, setCompactMode] = useState(false); // {id: offsetX}
  const swipeTouchStart = useRef({});

  const handleSwipeStart = (id, e) => {
    swipeTouchStart.current[id] = e.touches[0].clientX;
  };
  const handleSwipeMove = (id, e) => {
    const delta = e.touches[0].clientX - (swipeTouchStart.current[id] || 0);
    if (delta < 0) {
      setSwipeState(prev => ({ ...prev, [id]: Math.max(delta, -80) }));
    } else if (delta > 0 && swipeState[id] < 0) {
      setSwipeState(prev => ({ ...prev, [id]: Math.min(delta + (swipeState[id] || 0), 0) }));
    }
  };
  const handleSwipeEnd = (id) => {
    const offset = swipeState[id] || 0;
    if (offset < -50) {
      toggleFavorite(id);
    }
    setSwipeState(prev => ({ ...prev, [id]: 0 }));
  };

  const toggleLand = (land) => { haptic("light"); setCollapsedLands(prev => ({ ...prev, [land]: !prev[land] })); };

  // Haptic Feedback
  const haptic = (type = "light") => {
    if (!navigator.vibrate) return;
    if (type === "light") navigator.vibrate(10);
    else if (type === "medium") navigator.vibrate(25);
    else if (type === "heavy") navigator.vibrate([30, 10, 30]);
    else if (type === "success") navigator.vibrate([10, 20, 10]);
    else if (type === "error") navigator.vibrate([50, 30, 50]);
  };
  const [tooltip, setTooltip] = useState(null);
  const [refreshing, setRefreshing] = useState(false);
  const [pullY, setPullY] = useState(0);
  const touchStartY = useRef(0);

  const triggerRefresh = () => {
    haptic("medium");
    setRefreshing(true);
    setTimeout(() => {
      setLiveData(prev => prev.map(a => {
        if (a.status === "open") {
          const delta = Math.floor(Math.random() * 15) - 7;
          return { ...a, wait: Math.max(0, a.wait + delta) };
        }
        return a;
      }));
      const now = new Date();
      setLastUpdated(now.toLocaleString("de-DE", { day: "2-digit", month: "2-digit", year: "numeric", hour: "2-digit", minute: "2-digit" }) + " Uhr");
      haptic("success");
      setRefreshing(false);
      setPullY(0);
    }, 1200);
  };

  const handleTouchStart = (e) => {
    touchStartY.current = e.touches[0].clientY;
  };
  const handleTouchMove = (e) => {
    const delta = e.touches[0].clientY - touchStartY.current;
    if (delta > 0 && window.scrollY === 0) {
      setPullY(Math.min(delta * 0.4, 80));
    }
  };
  const handleTouchEnd = () => {
    if (pullY > 50 && !refreshing) {
      haptic("heavy");
      triggerRefresh();
    } else {
      setPullY(0);
    }
  };

  const addToPlan = (attraction) => {
    if (!plan.find((p) => p.id === attraction.id)) {
      haptic("medium");
      setPlan((prev) => [...prev, { id: attraction.id, customWait: attraction.wait }]);
    } else {
      haptic("light");
    }
  };
  const removeFromPlan = (id) => { haptic("light"); setPlan((prev) => prev.filter((p) => p.id !== id)); };
  const movePlan = (fromIdx, toIdx) => {
    const updated = [...plan];
    const [moved] = updated.splice(fromIdx, 1);
    updated.splice(toIdx, 0, moved);
    setPlan(updated);
  };
  const planAttractions = plan.map((p) => { const live = liveData.find((a) => a.id === p.id); return { ...live, customWait: p.customWait }; });

  const dm = darkMode;

  // Simuliere Wartezeit-Änderungen alle 30 Sek.
  useEffect(() => {
    if (!notifEnabled) return;
    const interval = setInterval(() => {
      setLiveData(prev => {
        const updated = prev.map(a => {
          if (a.status === "closed" && Math.random() < 0.15) {
            return { ...a, status: "open", wait: Math.floor(Math.random() * 30) + 5 };
          }
          if (a.status === "open" && Math.random() < 0.08) {
            return { ...a, status: "closed", wait: 0 };
          }
          if (a.status === "open") {
            const delta = Math.floor(Math.random() * 21) - 10;
            return { ...a, wait: Math.max(0, a.wait + delta) };
          }
          return a;
        });

        // Benachrichtigungen prüfen
        const newNotifs = [];
        updated.forEach(a => {
          const old = prevRef.current.find(o => o.id === a.id);
          if (!old) return;
          const isFav = false; // wird unten geprüft
          // Status-Änderungen immer melden
          if (old.status === "closed" && a.status === "open") {
            newNotifs.push({ id: Date.now() + a.id, type: "open", text: `✅ ${a.name} ist jetzt geöffnet! (${a.wait} min)` });
          } else if (old.status === "open" && a.status === "closed") {
            newNotifs.push({ id: Date.now() + a.id, type: "closed", text: `🔴 ${a.name} hat gerade geschlossen.` });
          } else if (a.status === "open" && old.wait > notifThreshold && a.wait <= notifThreshold) {
            newNotifs.push({ id: Date.now() + a.id, type: "low", text: `⏱️ ${a.name}: Wartezeit jetzt nur noch ${a.wait} min!` });
          }
        });
        // Verlauf aufzeichnen
        setWaitHistory(prev => {
          const next = { ...prev };
          updated.forEach(a => {
            const hist = prev[a.id] || [];
            next[a.id] = [...hist, a.wait].slice(-12);
          });
          return next;
        });

        prevRef.current = updated;
        if (newNotifs.length > 0) {
          setNotifications(prev => [...newNotifs, ...prev].slice(0, 10));
        }
        return updated;
      });
    }, 8000); // 8 Sek. für Demo-Zwecke
    return () => clearInterval(interval);
  }, [notifEnabled, notifThreshold]);

  const toggleFavorite = (id) => {
    const isFav = favorites.includes(id);
    haptic(isFav ? "light" : "success");
    setFavorites((prev) => isFav ? prev.filter((f) => f !== id) : [...prev, id]);
  };

  useEffect(() => {
    const update = () => {
      const now = new Date();
      setLastUpdated(now.toLocaleString("de-DE", { day: "2-digit", month: "2-digit", year: "numeric", hour: "2-digit", minute: "2-digit" }) + " Uhr");
    };
    update();
    const interval = setInterval(update, 60000);
    return () => clearInterval(interval);
  }, []);

  const filtered = liveData
    .filter((a) => activeTab === "favoriten" ? favorites.includes(a.id) : true)
    .filter((a) => selectedLand === "Alle" || a.land === selectedLand)
    .filter((a) => a.name.toLowerCase().includes(searchQuery.toLowerCase()))
    .filter((a) => {
      if (quickFilter === "short") return a.status === "open" && a.wait <= 15;
      if (quickFilter === "open") return a.status === "open";
      if (quickFilter === "closed") return a.status === "closed";
      return true;
    })
    .sort((a, b) => {
      if (sortBy === "wait") return b.wait - a.wait;
      if (sortBy === "land") return a.land.localeCompare(b.land);
      return a.name.localeCompare(b.name);
    });

  const openCount = liveData.filter((a) => a.status === "open").length;
  const avgWait = Math.round(
    liveData.filter((a) => a.status === "open").reduce((sum, a) => sum + a.wait, 0) /
      (liveData.filter((a) => a.status === "open").length || 1)
  );

  return (
    <div
      className="min-h-screen font-sans"
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      style={{background: dm ? "linear-gradient(to bottom, #0a0a1a, #0f0f2e)" : "linear-gradient(to bottom, #002790, #0038b8)"}}>  

      {/* Header */}
      <header className="sticky top-0 z-10 shadow-xl" style={{backgroundColor: dm ? "#05051a" : "#001a6e"}}>
        <div className="max-w-2xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl overflow-hidden shadow-md flex-shrink-0" style={{backgroundColor: "#0d1b3e"}}>
              <img src="data:image/png;base64,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" alt="ParcWizard Icon" style={{width:'100%',height:'100%',objectFit:'cover',borderRadius:'12px'}}/>
            </div>
            <div>
              <h1 className="text-white font-black text-xl tracking-tight leading-none">ParcWizard</h1>
              <p className="text-xs" style={{color: "#93c5fd"}}>Wartezeiten und mehr · ver. 2.7</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="text-right">
              <p className="text-xs" style={{color: "#93c5fd"}}>Aktualisiert</p>
              <p className="text-white text-xs font-semibold">{lastUpdated}</p>
            <button
              onClick={triggerRefresh}
              disabled={refreshing}
              className="text-xs mt-0.5 font-semibold"
              style={{color: refreshing ? "#6b7280" : "#C8A44A"}}
            >
              {refreshing ? "..." : "🔄 Refresh"}
            </button>
            </div>
            {/* Dark Mode Toggle */}
            <button
              onClick={() => setDarkMode(!dm)}
              className="w-10 h-10 rounded-full flex items-center justify-center transition-all"
              style={{backgroundColor: dm ? "#C8A44A" : "rgba(255,255,255,0.15)", color: dm ? "#001a6e" : "white", fontSize: "1.2rem"}}
              title={dm ? "Hell-Modus" : "Dunkel-Modus"}
            >
              {dm ? "☀️" : "🌙"}
            </button>
          </div>
        </div>
      </header>

      {/* Pull-to-Refresh Indicator */}
      {(pullY > 10 || refreshing) && (
        <div
          className="flex items-center justify-center gap-2 overflow-hidden transition-all"
          style={{
            height: refreshing ? 48 : pullY,
            backgroundColor: dm ? "rgba(200,164,74,0.15)" : "rgba(255,255,255,0.1)"
          }}
        >
          <span
            className="text-xl"
            style={{
              display: "inline-block",
              transform: refreshing ? "rotate(0deg)" : `rotate(${pullY * 3}deg)`,
              transition: refreshing ? "none" : "transform 0.1s",
              animation: refreshing ? "spin 0.8s linear infinite" : "none"
            }}
          >
            🔄
          </span>
          <span className="text-sm font-semibold" style={{color: "#C8A44A"}}>
            {refreshing ? "Aktualisiere..." : pullY > 50 ? "Loslassen zum Aktualisieren" : "Herunterziehen zum Aktualisieren"}
          </span>
        </div>
      )}
      <style>{`@keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }`}</style>

      {/* Notification Banners */}
      {notifications.length > 0 && (
        <div className="fixed top-32 right-3 z-50 space-y-2 w-72">
          {notifications.slice(0, 3).map((n) => (
            <div key={n.id} className="rounded-xl px-4 py-3 shadow-xl flex items-start gap-2 text-sm font-semibold animate-pulse"
              style={{backgroundColor: n.type === "open" ? "#166534" : n.type === "closed" ? "#7f1d1d" : "#1e3a5f", color: "white", border: "1px solid #C8A44A"}}>
              <span className="flex-1">{n.text}</span>
              <button onClick={() => setNotifications(prev => prev.filter(x => x.id !== n.id))} className="text-white opacity-60 hover:opacity-100 ml-1">✕</button>
            </div>
          ))}
        </div>
      )}

      {/* Tab Bar */}
      <div className="sticky top-16 z-10 shadow" style={{backgroundColor: dm ? "#05051a" : "#001a6e"}}>
        <div className="max-w-2xl mx-auto px-4 flex gap-1 pb-2 pt-1">
          {[
            { key: "alle", label: "🎢 Alle Attraktionen" },
            { key: "favoriten", label: `⭐ Favoriten (${favorites.length})` },
            { key: "plan", label: `🗓️ Tagesplan (${plan.length})` },
            { key: "karte", label: "🗺️ Karte" },
            { key: "restaurants", label: "🍽️ Restaurants" },
            { key: "shows", label: "🎆 Shows" },
          ].map((t) => (
            <button
              key={t.key}
              onClick={() => setActiveTab(t.key)}
              className="flex-1 py-2 rounded-xl text-sm font-semibold transition-all"
              style={activeTab === t.key
                ? { backgroundColor: "#C8A44A", color: "#001a6e", fontWeight: 700 }
                : { backgroundColor: "rgba(255,255,255,0.12)", color: "white" }
              }
            >
              {t.label}
            </button>
          ))}
        </div>
      </div>

      <main className="max-w-2xl mx-auto px-4 py-6 space-y-5">

        {/* Beste Zeit jetzt – Banner */}
        {(() => {
          const bestLand = lands
            .filter(l => l !== "Alle")
            .map(land => {
              const open = liveData.filter(a => a.land === land && a.status === "open");
              if (open.length === 0) return null;
              const avg = Math.round(open.reduce((s, a) => s + a.wait, 0) / open.length);
              return { land, avg, count: open.length };
            })
            .filter(Boolean)
            .sort((a, b) => a.avg - b.avg)[0];
          const shortAttractions = liveData.filter(a => a.status === "open" && a.wait <= 15);
          if (!bestLand) return null;
          return (
            <div className="rounded-2xl p-4" style={{background: "linear-gradient(135deg, rgba(200,164,74,0.25), rgba(0,55,150,0.3))", border: "1px solid #C8A44A"}}>
              <div className="flex items-center gap-2 mb-2">
                <span className="text-xl">🏆</span>
                <p className="text-white font-black text-sm">Beste Zeit jetzt</p>
              </div>
              <p className="text-white font-bold">Jetzt ideal: <span style={{color: "#C8A44A"}}>{bestLand.land}</span></p>
              <p className="text-xs mt-0.5" style={{color: "#93c5fd"}}>Ø {bestLand.avg} min · {bestLand.count} Attraktion{bestLand.count !== 1 ? "en" : ""} offen</p>
              {shortAttractions.length > 0 && (
                <div className="mt-2 flex flex-wrap gap-1">
                  {shortAttractions.slice(0, 3).map(a => (
                    <span key={a.id} className="text-xs px-2 py-0.5 rounded-full font-semibold" style={{backgroundColor: "rgba(34,197,94,0.25)", color: "#86efac"}}>
                      ⚡ {a.name.split(" ").slice(0,2).join(" ")} – {a.wait} min
                    </span>
                  ))}
                  {shortAttractions.length > 3 && (
                    <span className="text-xs px-2 py-0.5 rounded-full" style={{backgroundColor: "rgba(255,255,255,0.1)", color: "#93c5fd"}}>+{shortAttractions.length - 3} weitere</span>
                  )}
                </div>
              )}
            </div>
          );
        })()}

        {/* Park-Auslastung */}
        {(() => {
          const openA = liveData.filter(a => a.status === "open");
          const avg = openA.length ? Math.round(openA.reduce((s,a) => s + a.wait, 0) / openA.length) : 0;
          const level = avg <= 20 ? "ruhig" : avg <= 45 ? "mittel" : "voll";
          const color = level === "ruhig" ? "#22c55e" : level === "mittel" ? "#facc15" : "#ef4444";
          const emoji = level === "ruhig" ? "🟢" : level === "mittel" ? "🟡" : "🔴";
          const label = level === "ruhig" ? "Ruhig – guter Tag!" : level === "mittel" ? "Mäßig besucht" : "Sehr voll – lange Wartezeiten";
          const pct = Math.min(100, Math.round((avg / 90) * 100));
          return (
            <div className="rounded-2xl p-4" style={{backgroundColor: dm ? "rgba(255,255,255,0.07)" : "rgba(255,255,255,0.12)", border: `1px solid ${color}44`}}>
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <span className="text-xl">{emoji}</span>
                  <p className="text-white font-bold text-sm">Park-Auslastung</p>
                </div>
                <span className="text-sm font-black" style={{color}}>{level.toUpperCase()}</span>
              </div>
              <div className="w-full rounded-full h-3 mb-2" style={{backgroundColor: "rgba(255,255,255,0.1)"}}>
                <div className="h-3 rounded-full transition-all" style={{width: `${pct}%`, backgroundColor: color, boxShadow: `0 0 8px ${color}88`}}/>
              </div>
              <div className="flex justify-between items-center">
                <p className="text-xs" style={{color: "#93c5fd"}}>{label}</p>
                <p className="text-xs font-bold" style={{color}}>Ø {avg} min</p>
              </div>
              <div className="flex gap-3 mt-2 flex-wrap">
                {[
                  { col: "#22c55e", lbl: "Ruhig", range: "≤ 20 min" },
                  { col: "#facc15", lbl: "Mittel", range: "21–45 min" },
                  { col: "#ef4444", lbl: "Voll", range: "> 45 min" },
                ].map(l => (
                  <div key={l.lbl} className="flex items-center gap-1">
                    <div className="w-2 h-2 rounded-full" style={{backgroundColor: l.col}}/>
                    <span className="text-xs" style={{color: "#93c5fd"}}>{l.lbl} ({l.range})</span>
                  </div>
                ))}
              </div>
            </div>
          );
        })()}

        {/* Notif Settings Banner */}
        <div className="rounded-2xl p-4 flex items-center gap-3" style={{backgroundColor: notifEnabled ? "rgba(200,164,74,0.2)" : dm ? "rgba(255,255,255,0.07)" : "rgba(255,255,255,0.12)", border: notifEnabled ? "1px solid #C8A44A" : "1px solid transparent"}}>
          <span className="text-2xl">{notifEnabled ? "🔔" : "🔕"}</span>
          <div className="flex-1">
            <p className="text-white font-semibold text-sm">Benachrichtigungen</p>
            {notifEnabled && (
              <div className="flex items-center gap-2 mt-1">
                <span className="text-xs" style={{color: "#93c5fd"}}>Alarm bei ≤</span>
                <input
                  type="number"
                  min="5" max="120" step="5"
                  value={notifThreshold}
                  onChange={(e) => setNotifThreshold(Number(e.target.value))}
                  className="w-14 px-2 py-0.5 rounded-lg text-xs font-bold text-center"
                  style={{backgroundColor: "#C8A44A", color: "#001a6e", border: "none"}}
                />
                <span className="text-xs" style={{color: "#93c5fd"}}>min Wartezeit</span>
              </div>
            )}
            {!notifEnabled && <p className="text-xs mt-0.5" style={{color: "#93c5fd"}}>Aktivieren für Warnungen bei Öffnung/Schließung & kurzen Wartezeiten</p>}
          </div>
          <button
            onClick={() => { setNotifEnabled(!notifEnabled); if (!notifEnabled) setNotifications([]); }}
            className="px-3 py-1.5 rounded-xl text-xs font-bold transition-all"
            style={notifEnabled ? {backgroundColor: "#C8A44A", color: "#001a6e"} : {backgroundColor: "rgba(255,255,255,0.15)", color: "white"}}
          >
            {notifEnabled ? "An" : "Aus"}
          </button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-3">
          {[
            { value: openCount, label: "Attraktionen offen" },
            { value: `${avgWait} min`, label: "Ø Wartezeit" },
            { value: attractions.length - openCount, label: "Geschlossen" },
          ].map(({ value, label }) => (
            <div key={label} className="rounded-2xl p-4 text-center" style={{backgroundColor: dm ? "rgba(255,255,255,0.07)" : "rgba(255,255,255,0.15)"}}>  
              <p className="font-black text-2xl" style={{color: "#C8A44A"}}>{value}</p>
              <p className="text-white text-xs mt-1">{label}</p>
            </div>
          ))}
        </div>

        {/* Search */}
        <div className="relative">
          <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-lg">🔍</span>
          <input
            type="text"
            placeholder="Attraktion suchen..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className={`w-full pl-11 pr-4 py-3 rounded-2xl shadow focus:outline-none ${dm ? "bg-gray-800 text-gray-100 placeholder-gray-500" : "bg-white text-gray-800 placeholder-gray-400"}`}
            style={{boxShadow: "0 0 0 2px #C8A44A"}}
          />
        </div>

        {/* Land Filter */}
        <div className="flex flex-wrap gap-2">
          {lands.map((land) => (
            <button
              key={land}
              onClick={() => { haptic("light"); setSelectedLand(land); }}
              className="px-4 py-2 rounded-full text-sm font-semibold transition-all"
              style={selectedLand === land
                ? { backgroundColor: "#C8A44A", color: "#001a6e", fontWeight: 700 }
                : { backgroundColor: dm ? "rgba(255,255,255,0.08)" : "rgba(255,255,255,0.15)", color: "white" }
              }
            >
              {land}
            </button>
          ))}
        </div>

        {/* Schnellfilter */}
        <div className="flex gap-2 flex-wrap">
          <span className="text-sm self-center" style={{color: "#93c5fd"}}>Schnell:</span>
          {[
            { key: "short", label: "⚡ ≤ 15 min", active: "#22c55e" },
            { key: "open",  label: "✅ Geöffnet",  active: "#3b82f6" },
            { key: "closed",label: "🔴 Geschlossen",active: "#ef4444" },
          ].map(f => (
            <button
              key={f.key}
              onClick={() => { haptic("light"); setQuickFilter(quickFilter === f.key ? null : f.key); }}
              className="px-3 py-1.5 rounded-full text-xs font-bold transition-all"
              style={quickFilter === f.key
                ? { backgroundColor: f.active, color: "white", boxShadow: `0 0 8px ${f.active}88` }
                : { backgroundColor: dm ? "rgba(255,255,255,0.08)" : "rgba(255,255,255,0.15)", color: "white" }
              }
            >
              {f.label}
            </button>
          ))}
          {quickFilter && (
            <button
              onClick={() => setQuickFilter(null)}
              className="px-3 py-1.5 rounded-full text-xs font-bold"
              style={{backgroundColor: "rgba(255,255,255,0.08)", color: "#f87171"}}
            >
              ✕ Reset
            </button>
          )}
        </div>

        {/* Kompakt-Modus Toggle */}
        <div className="flex justify-end">
          <button
            onClick={() => { haptic("light"); setCompactMode(!compactMode); }}
            className="flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-bold transition-all"
            style={compactMode
              ? { backgroundColor: "#C8A44A", color: "#001a6e" }
              : { backgroundColor: dm ? "rgba(255,255,255,0.08)" : "rgba(255,255,255,0.15)", color: "white" }
            }
          >
            {compactMode ? "⊡ Kompakt AN" : "☰ Kompakt AUS"}
          </button>
        </div>

        {/* Sort */}
        <div className="flex items-center gap-2">
          <span className="text-sm" style={{color: "#93c5fd"}}>Sortieren:</span>
          {[
            { key: "name", label: "Name" },
            { key: "wait", label: "Wartezeit" },
            { key: "land", label: "Bereich" },
          ].map((s) => (
            <button
              key={s.key}
              onClick={() => { haptic("light"); setSortBy(s.key); }}
              className="px-3 py-1 rounded-full text-xs font-semibold transition-all"
              style={sortBy === s.key
                ? { backgroundColor: "#C8A44A", color: "#001a6e", fontWeight: 700 }
                : { backgroundColor: dm ? "rgba(255,255,255,0.08)" : "rgba(255,255,255,0.15)", color: "white" }
              }
            >
              {s.label}
            </button>
          ))}
        </div>

        {/* Attraction List – nur auf Alle/Favoriten-Tab */}
        {(activeTab === "alle" || activeTab === "favoriten") && (() => {
          if (activeTab === "favoriten" && favorites.length === 0) return (
            <div className="text-center py-10" style={{color: "#93c5fd"}}>
              <p className="text-3xl mb-3">⭐</p>
              <p className="font-semibold text-white">Noch keine Favoriten</p>
              <p className="text-sm mt-1">Tippe auf den Stern bei einer Attraktion, um sie zu merken.</p>
            </div>
          );
          if (filtered.length === 0) return (
            <div className="text-center py-10" style={{color: "#93c5fd"}}>Keine Attraktionen gefunden.</div>
          );
          const grouped = lands
            .filter(l => l !== "Alle")
            .map(land => ({ land, items: filtered.filter(a => a.land === land) }))
            .filter(g => g.items.length > 0);
          return (
            <div className="space-y-4">
              {grouped.map(({ land, items }) => {
                const isCollapsed = collapsedLands[land];
                const avgLandWait = Math.round(items.filter(a => a.status === "open").reduce((s, a) => s + a.wait, 0) / (items.filter(a => a.status === "open").length || 1));
                const openInLand = items.filter(a => a.status === "open").length;
                return (
                  <div key={land}>
                    {/* Bereich-Header */}
                    <button
                      onClick={() => toggleLand(land)}
                      className="w-full flex items-center justify-between px-4 py-2.5 rounded-2xl mb-2 transition-all"
                      style={{backgroundColor: dm ? "rgba(200,164,74,0.15)" : "rgba(200,164,74,0.2)", border: "1px solid rgba(200,164,74,0.3)"}}
                    >
                      <div className="flex items-center gap-2">
                        <span className="text-white font-bold text-sm">{land}</span>
                        <span className="text-xs px-2 py-0.5 rounded-full" style={{backgroundColor: "rgba(255,255,255,0.15)", color: "#93c5fd"}}>
                          {openInLand}/{items.length} offen
                        </span>
                        {openInLand > 0 && (
                          <span className="text-xs font-bold" style={{color: "#C8A44A"}}>Ø {avgLandWait} min</span>
                        )}
                      </div>
                      <span className="text-white text-sm transition-transform" style={{transform: isCollapsed ? "rotate(-90deg)" : "rotate(0deg)"}}>▾</span>
                    </button>

                    {/* Attraktionen */}
                    {!isCollapsed && (
                      <div className={`pl-1 ${compactMode ? "space-y-1" : "space-y-2"}`}>
                        {items.map((a) => (
                          <div key={a.id} className="relative overflow-hidden rounded-2xl">
                            {/* Swipe-Hintergrund */}
                            <div className="absolute inset-0 flex items-center justify-end pr-5 rounded-2xl"
                              style={{backgroundColor: favorites.includes(a.id) ? "#ef4444" : "#C8A44A"}}>
                              <span className="text-2xl">{favorites.includes(a.id) ? "💔" : "⭐"}</span>
                            </div>
                            <div
                              className={`relative rounded-2xl flex items-center justify-between shadow ${waitColor(a.wait, a.status, dm)} ${compactMode ? "px-3 py-2" : "p-4"}`}
                              style={{transform: `translateX(${swipeState[a.id] || 0}px)`, transition: swipeState[a.id] === 0 ? "transform 0.3s ease" : "none"}}
                              onTouchStart={(e) => handleSwipeStart(a.id, e)}
                              onTouchMove={(e) => handleSwipeMove(a.id, e)}
                              onTouchEnd={() => handleSwipeEnd(a.id)}
                            >
                              <button
                                onClick={() => toggleFavorite(a.id)}
                                className={`flex-shrink-0 transition-transform active:scale-125 ${compactMode ? "mr-2 text-base" : "mr-3 text-xl"}`}
                              >
                                {favorites.includes(a.id) ? "⭐" : "☆"}
                              </button>
                              <div className="flex-1 min-w-0">
                                <p className={`font-bold truncate ${compactMode ? "text-sm" : "text-base"} ${dm ? "text-gray-100" : "text-gray-900"}`}>{a.name}</p>
                                {!compactMode && (
                                  <div className="flex items-center gap-2 mt-0.5">
                                    <p className={`text-xs ${dm ? "text-gray-400" : "text-gray-500"}`}>{a.land}</p>
                                  {/* Sparkline */}
                                  {(() => {
                                    const hist = waitHistory[a.id] || [a.wait];
                                    if (hist.length < 2) return null;
                                    const max = Math.max(...hist, 1);
                                    const w = 48, h = 16;
                                    const pts = hist.map((v, i) => {
                                      const x = (i / (hist.length - 1)) * w;
                                      const y = h - (v / max) * h;
                                      return `${x},${y}`;
                                    }).join(" ");
                                    const trend = hist[hist.length - 1] - hist[0];
                                    const color = trend > 5 ? "#ef4444" : trend < -5 ? "#22c55e" : "#facc15";
                                    const arrow = trend > 5 ? "↑" : trend < -5 ? "↓" : "→";
                                    return (
                                      <div className="flex items-center gap-1">
                                        <svg width={w} height={h} viewBox={`0 0 ${w} ${h}`}>
                                          <polyline points={pts} fill="none" stroke={color} strokeWidth="1.5" strokeLinejoin="round" strokeLinecap="round"/>
                                        </svg>
                                        <span className="text-xs font-bold" style={{color}}>{arrow}</span>
                                      </div>
                                    );
                                  })()}
                                  </div>
                                )}
                              </div>
                            <button
                              onClick={() => addToPlan(a)}
                              className={`flex-shrink-0 rounded-full flex items-center justify-center text-sm transition-all ${compactMode ? "mr-1 w-6 h-6 text-xs" : "mr-2 w-8 h-8"}`}
                              style={{ backgroundColor: plan.find((p) => p.id === a.id) ? "#C8A44A" : "rgba(0,0,0,0.15)", color: plan.find((p) => p.id === a.id) ? "#001a6e" : "inherit" }}
                            >
                              {plan.find((p) => p.id === a.id) ? "✔️" : "+"}
                            </button>
                            <div className={`flex-shrink-0 rounded-xl text-center ${waitBadgeColor(a.wait, a.status)} ${compactMode ? "ml-1 px-2 py-1 min-w-10" : "ml-2 px-4 py-2 min-w-16"}`}>
                              {a.status === "closed" ? (
                                <span className="text-xs font-bold">{compactMode ? "✕" : "Geschlossen"}</span>
                              ) : (
                                <>
                                  <p className={`font-black leading-none ${compactMode ? "text-sm" : "text-lg"}`}>{a.wait}</p>
                                  {!compactMode && <p className="text-xs opacity-80">min</p>}
                                  {compactMode && <p className="text-xs opacity-80">m</p>}
                                </>
                              )}
                            </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          );
        })()}

        {/* Tagesplan Tab */}
        {activeTab === "plan" && (
          <div className="space-y-4">
            {plan.length === 0 ? (
              <div className="text-center py-10" style={{color: "#93c5fd"}}>
                <p className="text-3xl mb-3">🗓️</p>
                <p className="font-semibold text-white">Noch kein Tagesplan</p>
                <p className="text-sm mt-1">Tippe auf das + bei einer Attraktion, um sie zum Plan hinzuzufügen.</p>
              </div>
            ) : (
              <>
                {/* Zeitschätzung */}
                {(() => {
                  const totalWait = planAttractions.reduce((s, a) => s + (a.status === "closed" ? 0 : a.customWait), 0);
                  const walkTime = (planAttractions.length - 1) * 10;
                  const totalMin = totalWait + walkTime;
                  const hours = Math.floor(totalMin / 60);
                  const mins = totalMin % 60;
                  return (
                    <div className="rounded-2xl p-4" style={{backgroundColor: "rgba(200,164,74,0.2)", border: "1px solid #C8A44A"}}>
                      <p className="text-white font-bold text-sm mb-1">⏱️ Geschätzte Gesamtdauer</p>
                      <p className="font-black text-2xl" style={{color: "#C8A44A"}}>{hours > 0 ? `${hours} Std. ` : ""}{mins} Min.</p>
                      <p className="text-xs mt-1" style={{color: "#93c5fd"}}>inkl. ~{walkTime} Min. Laufzeit zwischen Attraktionen</p>
                    </div>
                  );
                })()}

                {/* Plan-Liste */}
                <div className="space-y-2">
                  {planAttractions.map((a, idx) => {
                    const cumulativeWait = planAttractions.slice(0, idx).reduce((s, x) => s + (x.status === "closed" ? 0 : x.customWait) + 10, 0);
                    const startTime = new Date();
                    startTime.setMinutes(startTime.getMinutes() + cumulativeWait);
                    const timeStr = startTime.toLocaleTimeString("de-DE", { hour: "2-digit", minute: "2-digit" });
                    return (
                      <div key={a.id} className={`rounded-2xl p-3 flex items-center gap-3 shadow ${waitColor(a.wait, a.status, dm)}`}>
                        <div className="flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center font-black text-sm" style={{backgroundColor: "#C8A44A", color: "#001a6e"}}>
                          {idx + 1}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className={`font-bold text-sm truncate ${dm ? "text-gray-100" : "text-gray-900"}`}>{a.name}</p>
                          <p className={`text-xs ${dm ? "text-gray-400" : "text-gray-500"}`}>{a.land} · ab ca. {timeStr} Uhr</p>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className={`rounded-lg px-2 py-1 text-center text-xs font-bold ${waitBadgeColor(a.wait, a.status)}`}>
                            {a.status === "closed" ? "Zu" : `${a.customWait} min`}
                          </div>
                          <button onClick={() => removeFromPlan(a.id)} className="text-gray-400 hover:text-red-400 text-lg leading-none">×</button>
                        </div>
                      </div>
                    );
                  })}
                </div>

                <button
                  onClick={() => setPlan([])}
                  className="w-full py-2 rounded-xl text-sm font-semibold"
                  style={{backgroundColor: "rgba(255,255,255,0.1)", color: "#f87171"}}
                >
                  🗑️ Tagesplan leeren
                </button>
              </>
            )}
          </div>
        )}

        {/* Karten-Ansicht */}
        {activeTab === "karte" && (() => {
          // Koordinaten relativ zur SVG-Karte (800x600)
          const pinData = [
            { id: 1,  x: 200, y: 280 },
            { id: 2,  x: 160, y: 370 },
            { id: 3,  x: 420, y: 200 },
            { id: 4,  x: 600, y: 180 },
            { id: 5,  x: 390, y: 260 },
            { id: 6,  x: 130, y: 310 },
            { id: 7,  x: 630, y: 240 },
            { id: 8,  x: 440, y: 310 },
            { id: 9,  x: 220, y: 220 },
            { id: 10, x: 580, y: 140 },
            { id: 11, x: 560, y: 430 },
            { id: 12, x: 490, y: 460 },
            { id: 13, x: 620, y: 490 },
            { id: 14, x: 530, y: 380 },
          ];
          const pinColor = (a) => {
            if (a.status === "closed") return "#6b7280";
            if (a.wait <= 15) return "#22c55e";
            if (a.wait <= 40) return "#facc15";
            if (a.wait <= 70) return "#f97316";
            return "#dc2626";
          };
          return (
            <div className="space-y-3">
              <div className="rounded-2xl overflow-hidden shadow-xl" style={{backgroundColor: dm ? "rgba(255,255,255,0.07)" : "rgba(255,255,255,0.12)", border: "1px solid rgba(200,164,74,0.3)"}}>
                <div className="px-4 pt-3 pb-1">
                  <p className="text-white font-semibold text-sm">Parkübersicht – Disneyland Paris</p>
                  <p className="text-xs" style={{color:"#93c5fd"}}>Tippe auf einen Pin für Details</p>
                </div>
                <div className="relative w-full" style={{paddingBottom: "75%"}}>
                  <svg viewBox="0 0 800 600" className="absolute inset-0 w-full h-full" style={{fontFamily:"sans-serif"}}>
                    {/* Hintergrund */}
                    <rect width="800" height="600" fill={dm ? "#0f172a" : "#1e3a5f"} rx="0"/>

                    {/* Bereiche */}
                    <ellipse cx="400" cy="320" rx="320" ry="240" fill="rgba(0,55,150,0.25)" stroke="rgba(200,164,74,0.2)" strokeWidth="1"/>

                    {/* Main Street */}
                    <rect x="350" y="350" width="100" height="160" rx="8" fill="rgba(200,164,74,0.15)" stroke="rgba(200,164,74,0.3)" strokeWidth="1"/>
                    <text x="400" y="445" textAnchor="middle" fill="#C8A44A" fontSize="11" fontWeight="bold">Main Street</text>

                    {/* Frontierland */}
                    <ellipse cx="195" cy="260" rx="100" ry="80" fill="rgba(180,100,30,0.2)" stroke="rgba(180,100,30,0.4)" strokeWidth="1"/>
                    <text x="195" y="175" textAnchor="middle" fill="#fbbf24" fontSize="10" fontWeight="bold">Frontierland</text>

                    {/* Adventureland */}
                    <ellipse cx="160" cy="370" rx="90" ry="65" fill="rgba(34,100,34,0.2)" stroke="rgba(34,150,34,0.4)" strokeWidth="1"/>
                    <text x="160" y="445" textAnchor="middle" fill="#86efac" fontSize="10" fontWeight="bold">Adventureland</text>

                    {/* Fantasyland */}
                    <ellipse cx="420" cy="240" rx="100" ry="80" fill="rgba(150,50,200,0.15)" stroke="rgba(180,80,220,0.4)" strokeWidth="1"/>
                    <text x="420" y="155" textAnchor="middle" fill="#d8b4fe" fontSize="10" fontWeight="bold">Fantasyland</text>

                    {/* Discoveryland */}
                    <ellipse cx="610" cy="200" rx="100" ry="75" fill="rgba(30,80,180,0.2)" stroke="rgba(60,130,220,0.4)" strokeWidth="1"/>
                    <text x="610" y="120" textAnchor="middle" fill="#93c5fd" fontSize="10" fontWeight="bold">Discoveryland</text>

                    {/* Walt Disney Studios */}
                    <ellipse cx="570" cy="440" rx="120" ry="90" fill="rgba(180,30,30,0.15)" stroke="rgba(220,60,60,0.4)" strokeWidth="1"/>
                    <text x="570" y="545" textAnchor="middle" fill="#fca5a5" fontSize="10" fontWeight="bold">Walt Disney Studios</text>

                    {/* Pins */}
                    {pinData.map((pin) => {
                      const a = liveData.find(x => x.id === pin.id);
                      if (!a) return null;
                      const col = pinColor(a);
                      const isActive = tooltip === a.id;
                      return (
                        <g key={a.id} style={{cursor:"pointer"}} onClick={() => setTooltip(isActive ? null : a.id)}>
                          <circle cx={pin.x} cy={pin.y} r={isActive ? 18 : 14} fill={col} stroke="white" strokeWidth={isActive ? 3 : 2} opacity="0.95"/>
                          <text x={pin.x} y={pin.y+5} textAnchor="middle" fill="white" fontSize="10" fontWeight="bold">
                            {a.status === "closed" ? "✕" : `${a.wait}`}
                          </text>
                          {isActive && (
                            <>
                              <rect x={pin.x - 70} y={pin.y - 58} width="140" height="48" rx="8" fill={dm ? "#1e293b" : "#001a6e"} stroke="#C8A44A" strokeWidth="1.5"/>
                              <text x={pin.x} y={pin.y - 38} textAnchor="middle" fill="white" fontSize="9" fontWeight="bold">{a.name.length > 18 ? a.name.slice(0,18)+"…" : a.name}</text>
                              <text x={pin.x} y={pin.y - 22} textAnchor="middle" fill="#C8A44A" fontSize="9">
                                {a.status === "closed" ? "Geschlossen" : `Wartezeit: ${a.wait} min`}
                              </text>
                            </>
                          )}
                        </g>
                      );
                    })}
                  </svg>
                </div>
              </div>

              {/* Legende Karte */}
              <div className="rounded-2xl p-3 grid grid-cols-2 gap-2" style={{backgroundColor: dm ? "rgba(255,255,255,0.07)" : "rgba(255,255,255,0.12)"}}>
                {[
                  { color: "#22c55e", label: "≤ 15 min" },
                  { color: "#facc15", label: "16–40 min" },
                  { color: "#f97316", label: "41–70 min" },
                  { color: "#dc2626", label: "> 70 min" },
                  { color: "#6b7280", label: "Geschlossen" },
                ].map(l => (
                  <div key={l.label} className="flex items-center gap-2">
                    <div className="w-4 h-4 rounded-full flex-shrink-0" style={{backgroundColor: l.color}}/>
                    <span className="text-white text-xs">{l.label}</span>
                  </div>
                ))}
              </div>
            </div>
          );
        })()}

        {/* Restaurant Tab */}
        {activeTab === "restaurants" && (() => {
          const restTypes = ["Alle", "Restaurant", "Schnellimbiss", "Snack"];
          const filtered = restaurants.filter(r => restFilter === "Alle" || r.type === restFilter);
          return (
            <div className="space-y-4">
              {/* Filter */}
              <div className="flex flex-wrap gap-2">
                {restTypes.map(t => (
                  <button key={t} onClick={() => setRestFilter(t)}
                    className="px-4 py-2 rounded-full text-sm font-semibold transition-all"
                    style={restFilter === t
                      ? { backgroundColor: "#C8A44A", color: "#001a6e", fontWeight: 700 }
                      : { backgroundColor: dm ? "rgba(255,255,255,0.08)" : "rgba(255,255,255,0.15)", color: "white" }
                    }>{t}</button>
                ))}
              </div>

              {/* Liste */}
              <div className="space-y-3">
                {filtered.map(r => {
                  const open = isOpen(r.open, r.close);
                  return (
                    <div key={r.id} className="rounded-2xl p-4 shadow" style={{backgroundColor: dm ? "rgba(255,255,255,0.07)" : "rgba(255,255,255,0.13)", border: open ? "1px solid rgba(34,197,94,0.4)" : "1px solid rgba(255,255,255,0.08)"}}>
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 flex-wrap">
                            <p className="text-white font-bold text-sm">{r.name}</p>
                            <span className="text-xs px-2 py-0.5 rounded-full font-semibold"
                              style={{backgroundColor: open ? "rgba(34,197,94,0.2)" : "rgba(107,114,128,0.3)", color: open ? "#86efac" : "#9ca3af"}}>
                              {open ? "● Geöffnet" : "● Geschlossen"}
                            </span>
                          </div>
                          <p className="text-xs mt-1" style={{color: "#93c5fd"}}>{r.land} · {r.cuisine} · {r.price}</p>
                          <p className="text-xs mt-0.5" style={{color: "#93c5fd"}}>🕒 {r.open} – {r.close} Uhr</p>
                        </div>
                        <div className="flex flex-col items-end gap-1 flex-shrink-0">
                          <span className="text-xs px-2 py-0.5 rounded-full" style={{backgroundColor: "rgba(200,164,74,0.2)", color: "#C8A44A"}}>{r.type}</span>
                          {r.reservation && (
                            <span className="text-xs px-2 py-0.5 rounded-full font-semibold"
                              style={{backgroundColor: r.reserved ? "rgba(220,38,38,0.2)" : "rgba(34,197,94,0.15)", color: r.reserved ? "#fca5a5" : "#86efac"}}>
                              {r.reserved ? "🔴 Ausgebucht" : "✅ Reservierbar"}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              <p className="text-center text-xs pb-2" style={{color: "#93c5fd"}}>Öffnungszeiten basieren auf aktueller Uhrzeit · Beispieldaten</p>
            </div>
          );
        })()}

        {/* Shows & Paraden Tab */}
        {activeTab === "shows" && (() => {
          const showTypes = ["Alle", "Parade", "Show", "Nachtshow", "Stuntshow", "Feuerwerk"];
          const filteredShows = shows.filter(s => showFilter === "Alle" || s.type === showFilter);
          const nowMin = now.getHours() * 60 + now.getMinutes();

          return (
            <div className="space-y-4">
              {/* Filter */}
              <div className="flex flex-wrap gap-2">
                {showTypes.map(t => (
                  <button key={t} onClick={() => setShowFilter(t)}
                    className="px-3 py-1.5 rounded-full text-sm font-semibold transition-all"
                    style={showFilter === t
                      ? { backgroundColor: "#C8A44A", color: "#001a6e", fontWeight: 700 }
                      : { backgroundColor: dm ? "rgba(255,255,255,0.08)" : "rgba(255,255,255,0.15)", color: "white" }
                    }>{t}</button>
                ))}
              </div>

              {/* Show-Liste */}
              <div className="space-y-3">
                {filteredShows.map(s => {
                  const next = getNextTime(s.times);
                  const isNow = s.times.some(t => {
                    const [h, m] = t.split(":").map(Number);
                    const tMin = h * 60 + m;
                    return nowMin >= tMin && nowMin <= tMin + s.duration;
                  });
                  const countdownStr = next
                    ? next.diffMin < 60
                      ? `in ${next.diffMin} Min.`
                      : `in ${Math.floor(next.diffMin/60)}h ${next.diffMin%60}min`
                    : "Heute vorbei";

                  return (
                    <div key={s.id} className="rounded-2xl p-4 shadow" style={{
                      backgroundColor: dm ? "rgba(255,255,255,0.07)" : "rgba(255,255,255,0.12)",
                      border: isNow ? "1px solid #C8A44A" : "1px solid rgba(255,255,255,0.08)"
                    }}>
                      <div className="flex items-start gap-3">
                        <span className="text-3xl flex-shrink-0">{s.emoji}</span>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 flex-wrap">
                            <p className="text-white font-bold text-sm">{s.name}</p>
                            {isNow && (
                              <span className="text-xs px-2 py-0.5 rounded-full font-bold animate-pulse"
                                style={{backgroundColor: "rgba(200,164,74,0.3)", color: "#C8A44A"}}>
                                ▶ Läuft jetzt
                              </span>
                            )}
                          </div>
                          <p className="text-xs mt-0.5" style={{color: "#93c5fd"}}>{s.location} · {s.type} · {s.duration} Min.</p>

                          {/* Nächste Vorstellung */}
                          {next && (
                            <div className="mt-2 flex items-center gap-2">
                              <span className="text-xs font-bold px-2 py-1 rounded-lg"
                                style={{backgroundColor: next.diffMin <= 30 ? "rgba(200,164,74,0.3)" : "rgba(255,255,255,0.1)", color: next.diffMin <= 30 ? "#C8A44A" : "#93c5fd"}}>
                                ⏰ {next.time} Uhr – {countdownStr}
                              </span>
                            </div>
                          )}
                          {!next && !isNow && (
                            <p className="text-xs mt-1" style={{color: "#6b7280"}}>Keine weiteren Vorstellungen heute</p>
                          )}

                          {/* Alle Zeiten */}
                          <div className="flex flex-wrap gap-1 mt-2">
                            {s.times.map(t => {
                              const [h, m] = t.split(":").map(Number);
                              const tMin = h * 60 + m;
                              const past = tMin + s.duration < nowMin;
                              const running = nowMin >= tMin && nowMin <= tMin + s.duration;
                              return (
                                <span key={t} className="text-xs px-2 py-0.5 rounded-full"
                                  style={{
                                    backgroundColor: running ? "rgba(200,164,74,0.3)" : past ? "rgba(255,255,255,0.05)" : "rgba(255,255,255,0.12)",
                                    color: running ? "#C8A44A" : past ? "#4b5563" : "white",
                                    textDecoration: past ? "line-through" : "none"
                                  }}>
                                  {t}
                                </span>
                              );
                            })}
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
              <p className="text-center text-xs pb-2" style={{color: "#93c5fd"}}>Zeiten aktualisieren sich automatisch · Beispieldaten</p>
            </div>
          );
        })()}

        {/* Legend */}
        <div className="rounded-2xl p-4" style={{backgroundColor: dm ? "rgba(255,255,255,0.07)" : "rgba(255,255,255,0.15)"}}>
          <p className="text-white font-semibold text-sm mb-3">Legende</p>
          <div className="grid grid-cols-2 gap-2">
            {[
              { color: "bg-green-500", label: "≤ 15 min – Kurz" },
              { color: "bg-yellow-400", label: "16–40 min – Mittel" },
              { color: "bg-orange-500", label: "41–70 min – Lang" },
              { color: "bg-red-600", label: "> 70 min – Sehr lang" },
            ].map((l) => (
              <div key={l.label} className="flex items-center gap-2">
                <div className={`w-3 h-3 rounded-full ${l.color}`} />
                <span className="text-white text-xs">{l.label}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Disclaimer */}
        <p className="text-center text-xs pb-4" style={{color: "#93c5fd"}}>
          ParcWizard ist keine offizielle App von Disneyland Paris. Alle Daten sind Beispieldaten.
        </p>
      </main>
    </div>
  );
}
