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

  const dm = darkMode;

  useEffect(() => {
    const update = () => {
      const now = new Date();
      setLastUpdated(now.toLocaleString("de-DE", { day: "2-digit", month: "2-digit", year: "numeric", hour: "2-digit", minute: "2-digit" }) + " Uhr");
    };
    update();
    const interval = setInterval(update, 60000);
    return () => clearInterval(interval);
  }, []);

  const filtered = attractions
    .filter((a) => selectedLand === "Alle" || a.land === selectedLand)
    .filter((a) => a.name.toLowerCase().includes(searchQuery.toLowerCase()))
    .sort((a, b) => {
      if (sortBy === "wait") return b.wait - a.wait;
      if (sortBy === "land") return a.land.localeCompare(b.land);
      return a.name.localeCompare(b.name);
    });

  const openCount = attractions.filter((a) => a.status === "open").length;
  const avgWait = Math.round(
    attractions.filter((a) => a.status === "open").reduce((sum, a) => sum + a.wait, 0) /
      attractions.filter((a) => a.status === "open").length
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
              <p className="text-xs" style={{color: "#93c5fd"}}>Wartezeiten und mehr · ver. 1.2</p>
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

      <main className="max-w-2xl mx-auto px-4 py-6 space-y-5">

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
          {filtered.map((a) => (
            <div
              key={a.id}
              className={`rounded-2xl p-4 flex items-center justify-between shadow ${waitColor(a.wait, a.status, dm)}`}
            >
              <div className="flex-1 min-w-0">
                <p className={`font-bold truncate ${dm ? "text-gray-100" : "text-gray-900"}`}>{a.name}</p>
                <p className={`text-xs mt-0.5 ${dm ? "text-gray-400" : "text-gray-500"}`}>{a.land}</p>
              </div>
              <div className={`ml-4 flex-shrink-0 rounded-xl px-4 py-2 text-center min-w-16 ${waitBadgeColor(a.wait, a.status)}`}>
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
