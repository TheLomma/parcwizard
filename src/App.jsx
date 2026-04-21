import { useState, useEffect } from "react";

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
  const [searchQuery, setSearchQuery] = useState("");
  const [lastUpdated, setLastUpdated] = useState("");
  const [darkMode, setDarkMode] = useState(false);
  const [notifEnabled, setNotifEnabled] = useState(false);
  const [notifThreshold, setNotifThreshold] = useState(20);
  const [notifications, setNotifications] = useState([]);
  const [liveData, setLiveData] = useState(attractions.map(a => ({...a})));
  const prevData = useState(attractions.map(a => ({...a})))[0];
  const prevRef = { current: attractions.map(a => ({...a})) };
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
  const [dragOver, setDragOver] = useState(null);
  const [dragging, setDragging] = useState(null);
  const [tooltip, setTooltip] = useState(null);
  const [refreshing, setRefreshing] = useState(false);
  const [pullY, setPullY] = useState(0);
  const touchStartY = { current: 0 };

  const triggerRefresh = () => {
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
      triggerRefresh();
    } else {
      setPullY(0);
    }
  };

  const addToPlan = (attraction) => {
    if (!plan.find((p) => p.id === attraction.id)) {
      setPlan((prev) => [...prev, { id: attraction.id, customWait: attraction.wait }]);
    }
  };
  const removeFromPlan = (id) => setPlan((prev) => prev.filter((p) => p.id !== id));
  const movePlan = (fromIdx, toIdx) => {
    const updated = [...plan];
    const [moved] = updated.splice(fromIdx, 1);
    updated.splice(toIdx, 0, moved);
    setPlan(updated);
  };
  const planAttractions = plan.map((p) => ({ ...attractions.find((a) => a.id === p.id), customWait: p.customWait }));

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
    setFavorites((prev) => prev.includes(id) ? prev.filter((f) => f !== id) : [...prev, id]);
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
            <div className="w-10 h-10 rounded-full flex items-center justify-center shadow-md" style={{backgroundColor: "#C8A44A"}}>
              <span className="font-black text-lg" style={{color: "#001a6e"}}>✦</span>
            </div>
            <div>
              <h1 className="text-white font-black text-xl tracking-tight leading-none">ParcWizard</h1>
              <p className="text-xs" style={{color: "#93c5fd"}}>Wartezeiten und mehr · ver. 1.6</p>
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
              onClick={() => setSelectedLand(land)}
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
              onClick={() => setSortBy(s.key)}
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

        {/* Attraction List */}
        <div className="space-y-3">
          {filtered.length === 0 && (
            <div className="text-center py-10" style={{color: "#93c5fd"}}>Keine Attraktionen gefunden.</div>
          )}
          {activeTab === "favoriten" && favorites.length === 0 && (
            <div className="text-center py-10" style={{color: "#93c5fd"}}>
              <p className="text-3xl mb-3">⭐</p>
              <p className="font-semibold text-white">Noch keine Favoriten</p>
              <p className="text-sm mt-1">Tippe auf den Stern bei einer Attraktion, um sie zu merken.</p>
            </div>
          )}
          {filtered.map((a) => (
            <div
              key={a.id}
              className={`rounded-2xl p-4 flex items-center justify-between shadow ${waitColor(a.wait, a.status, dm)}`}
            >
              <button
                onClick={() => toggleFavorite(a.id)}
                className="mr-3 text-xl flex-shrink-0 transition-transform active:scale-125"
                title={favorites.includes(a.id) ? "Aus Favoriten entfernen" : "Zu Favoriten hinzufügen"}
              >
                {favorites.includes(a.id) ? "⭐" : "☆"}
              </button>
              <div className="flex-1 min-w-0">
                <p className={`font-bold truncate ${dm ? "text-gray-100" : "text-gray-900"}`}>{a.name}</p>
                <p className={`text-xs mt-0.5 ${dm ? "text-gray-400" : "text-gray-500"}`}>{a.land}</p>
              </div>
              <button
                onClick={() => addToPlan(a)}
                className="mr-2 flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center text-sm transition-all"
                style={{ backgroundColor: plan.find((p) => p.id === a.id) ? "#C8A44A" : "rgba(0,0,0,0.15)", color: plan.find((p) => p.id === a.id) ? "#001a6e" : "inherit" }}
                title={plan.find((p) => p.id === a.id) ? "Im Tagesplan" : "Zum Tagesplan hinzufügen"}
              >
                {plan.find((p) => p.id === a.id) ? "✔️" : "+"}
              </button>
              <div className={`ml-2 flex-shrink-0 rounded-xl px-4 py-2 text-center min-w-16 ${waitBadgeColor(a.wait, a.status)}`}>
                {a.status === "closed" ? (
                  <span className="text-xs font-bold">Geschlossen</span>
                ) : (
                  <>
                    <p className="font-black text-lg leading-none">{a.wait}</p>
                    <p className="text-xs opacity-80">min</p>
                  </>
                )}
              </div>
            </div>
          ))}
        </div>

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
