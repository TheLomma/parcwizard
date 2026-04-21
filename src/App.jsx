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

const waitColor = (wait, status) => {
  if (status === "closed") return "bg-gray-200 text-gray-500";
  if (wait <= 15) return "bg-green-100 text-green-800";
  if (wait <= 40) return "bg-yellow-100 text-yellow-800";
  if (wait <= 70) return "bg-orange-100 text-orange-800";
  return "bg-red-100 text-red-800";
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
    <div className="min-h-screen bg-gradient-to-b from-blue-950 to-blue-900 font-sans">
      {/* Header */}
      <header className="bg-blue-950 shadow-lg sticky top-0 z-10">
        <div className="max-w-2xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-yellow-400 flex items-center justify-center shadow-md">
              <span className="text-blue-900 font-black text-lg">✦</span>
            </div>
            <div>
              <h1 className="text-white font-black text-xl tracking-tight leading-none">ParcWizard</h1>
              <p className="text-blue-300 text-xs">Wartezeiten und mehr · ver. 1.1</p>
            </div>
          </div>
          <div className="text-right">
            <p className="text-blue-300 text-xs">Aktualisiert</p>
            <p className="text-white text-xs font-semibold">{lastUpdated}</p>
          </div>
        </div>
      </header>

      <main className="max-w-2xl mx-auto px-4 py-6 space-y-5">
        {/* Stats Bar */}
        <div className="grid grid-cols-3 gap-3">
          <div className="bg-white bg-opacity-10 rounded-2xl p-4 text-center">
            <p className="text-yellow-400 font-black text-2xl">{openCount}</p>
            <p className="text-blue-200 text-xs mt-1">Attraktionen offen</p>
          </div>
          <div className="bg-white bg-opacity-10 rounded-2xl p-4 text-center">
            <p className="text-yellow-400 font-black text-2xl">{avgWait}<span className="text-sm font-normal"> min</span></p>
            <p className="text-blue-200 text-xs mt-1">Ø Wartezeit</p>
          </div>
          <div className="bg-white bg-opacity-10 rounded-2xl p-4 text-center">
            <p className="text-yellow-400 font-black text-2xl">{attractions.length - openCount}</p>
            <p className="text-blue-200 text-xs mt-1">Geschlossen</p>
          </div>
        </div>

        {/* Search */}
        <div className="relative">
          <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-lg">🔍</span>
          <input
            type="text"
            placeholder="Attraktion suchen..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-11 pr-4 py-3 rounded-2xl bg-white text-gray-800 placeholder-gray-400 shadow focus:outline-none focus:ring-2 focus:ring-yellow-400"
          />
        </div>

        {/* Land Filter */}
        <div className="flex flex-wrap gap-2">
          {lands.map((land) => (
            <button
              key={land}
              onClick={() => setSelectedLand(land)}
              className={`flex-shrink-0 px-4 py-2 rounded-full text-sm font-semibold transition-all ${
                selectedLand === land
                  ? "bg-yellow-400 text-blue-900 shadow"
                  : "bg-white bg-opacity-10 text-white hover:bg-opacity-20"
              }`}
            >
              {land}
            </button>
          ))}
        </div>

        {/* Sort */}
        <div className="flex items-center gap-2">
          <span className="text-blue-300 text-sm">Sortieren:</span>
          {[
            { key: "name", label: "Name" },
            { key: "wait", label: "Wartezeit" },
            { key: "land", label: "Bereich" },
          ].map((s) => (
            <button
              key={s.key}
              onClick={() => setSortBy(s.key)}
              className={`px-3 py-1 rounded-full text-xs font-semibold transition-all ${
                sortBy === s.key
                  ? "bg-yellow-400 text-blue-900"
                  : "bg-white bg-opacity-10 text-white hover:bg-opacity-20"
              }`}
            >
              {s.label}
            </button>
          ))}
        </div>

        {/* Attraction List */}
        <div className="space-y-3">
          {filtered.length === 0 && (
            <div className="text-center text-blue-300 py-10">Keine Attraktionen gefunden.</div>
          )}
          {filtered.map((a) => (
            <div
              key={a.id}
              className={`rounded-2xl p-4 flex items-center justify-between shadow ${waitColor(a.wait, a.status)}`}
            >
              <div className="flex-1 min-w-0">
                <p className="font-bold text-gray-900 truncate">{a.name}</p>
                <p className="text-xs text-gray-500 mt-0.5">{a.land}</p>
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
        <div className="bg-white bg-opacity-10 rounded-2xl p-4">
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
                <span className="text-blue-200 text-xs">{l.label}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Disclaimer */}
        <p className="text-center text-blue-400 text-xs pb-4">
          ParcWizard ist keine offizielle App von Disneyland Paris. Alle Daten sind Beispieldaten und dienen nur zur Demonstration.
        </p>
      </main>
    </div>
  );
}
