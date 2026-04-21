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
  const [activeTab, setActiveTab] = useState("alle"); // "alle" | "favoriten" | "plan"
  const [plan, setPlan] = useState([]); // [{id, customWait}]
  const [dragOver, setDragOver] = useState(null);
  const [dragging, setDragging] = useState(null);

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
    <div className="min-h-screen font-sans" style={{background: dm ? "linear-gradient(to bottom, #0a0a1a, #0f0f2e)" : "linear-gradient(to bottom, #002790, #0038b8)"}}>  

      {/* Header */}
      <header className="sticky top-0 z-10 shadow-xl" style={{backgroundColor: dm ? "#05051a" : "#001a6e"}}>
        <div className="max-w-2xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full flex items-center justify-center shadow-md" style={{backgroundColor: "#C8A44A"}}>
              <span className="font-black text-lg" style={{color: "#001a6e"}}>✦</span>
            </div>
            <div>
              <h1 className="text-white font-black text-xl tracking-tight leading-none">ParcWizard</h1>
              <p className="text-xs" style={{color: "#93c5fd"}}>Wartezeiten und mehr · ver. 1.3</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="text-right">
              <p className="text-xs" style={{color: "#93c5fd"}}>Aktualisiert</p>
              <p className="text-white text-xs font-semibold">{lastUpdated}</p>
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
