import { useMemo, useState } from "react";

const corePrice = 185;
const addonPrices = {
  stock: 185,
  maps: 65,
  gantt: 37,
} as const;

const moduleMeta = [
  {
    key: "stock" as const,
    name: "Stock",
    icon: (
      <>
        <path d="M6 22l6-8 5 6 6-10" />
        <path d="M22 10h4v4" />
      </>
    ),
  },
  {
    key: "maps" as const,
    name: "Maps",
    icon: (
      <>
        <path d="M6 8l8-3v19l-8 3z" />
        <path d="M18 6l8 3v15l-8-3z" />
        <path d="M14 6l4 1.5v19l-4-1.5z" />
      </>
    ),
  },
  {
    key: "gantt" as const,
    name: "Gantt",
    icon: (
      <>
        <path d="M6 10h12v4H6z" />
        <path d="M14 16h12v4H14z" />
        <path d="M6 22h8v4H6z" />
      </>
    ),
  },
];

export type AddonKey = keyof typeof addonPrices;

type AddonState = Record<AddonKey, boolean>;

const initialAddons: AddonState = {
  stock: false,
  maps: false,
  gantt: false,
};

function formatPrice(value: number) {
  return `${value.toFixed(2)} USD`;
}

function formatTotal(value: number) {
  return value.toLocaleString("en-US", { minimumFractionDigits: 0, maximumFractionDigits: 0 });
}

function App() {
  const [addons, setAddons] = useState<AddonState>(initialAddons);
  const [seats, setSeats] = useState<number>(0);

  const hasSeats = seats > 0;

  const handleSeatToggle = () => {
    if (hasSeats) {
      setAddons(initialAddons);
      setSeats(0);
    } else {
      setSeats(1);
    }
  };

  const handleAddonToggle = (key: AddonKey) => {
    setAddons((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const activeModules = useMemo(
    () => moduleMeta.map((module) => ({ ...module, active: addons[module.key] })),
    [addons]
  );

  const total = useMemo(() => {
    if (!hasSeats) return 0;
    const addonSum = activeModules
      .filter((m) => m.active)
      .reduce((sum, m) => sum + addonPrices[m.key], 0);
    return (corePrice + addonSum) * seats;
  }, [activeModules, seats, hasSeats]);

  const handleClear = () => {
    setAddons(initialAddons);
    setSeats(0);
  };

  return (
    <main className="page">
      <section className={`card${hasSeats ? " card--selected" : ""}`} aria-label="Highcharts selection">
        <div className="card__header">
          <div className="card__title-group">
            <span className="avatar" aria-hidden>
              <svg viewBox="0 0 40 40" role="presentation">
                <rect x="3" y="3" width="34" height="34" rx="9" fill="#f7f8fb" stroke="#d6d9df" />
                <circle cx="20" cy="20" r="11" fill="#74e4c4" />
                <path
                  d="M20 9c3.2 0 6.6 1.5 8.6 4.2L20 20z"
                  fill="#6972d8"
                />
                <circle cx="20" cy="20" r="2.4" fill="#5a67c8" />
              </svg>
            </span>
            <div>
              <h1 className="card__title">Highcharts Core</h1>
            </div>
          </div>
          <div className="header__pricing" aria-label="Pricing and seats">
            <div className="price-block">
              <div className="price price--main">{`${corePrice} USD`}</div>
              <div className="price-sub">per seat</div>
            </div>
            <button
              className="btn seat-add"
              onClick={handleSeatToggle}
              aria-label={hasSeats ? "Remove seat" : "Add seat"}
            >
              {hasSeats ? "Remove" : "Add"}
            </button>
          </div>
        </div>

        <div className="divider-row" role="presentation">
          <span className="divider" />
          <span className="divider-label">Additional Modules</span>
          <span className="divider" />
        </div>

        <div className="modules" aria-label="Addon modules">
          {activeModules.map((module) => (
            <article
              key={module.key}
              className={`module${module.active ? " active" : hasSeats ? " muted" : ""}${!hasSeats ? " disabled" : ""}`}
              data-key={module.key}
            >
              <div className="module__icon" aria-hidden>
                <svg viewBox="0 0 32 32" role="presentation">
                  {module.icon}
                </svg>
              </div>
              <h2>{module.name}</h2>
              <div className="price" data-price>
                {formatPrice(addonPrices[module.key])}
              </div>
              <button
                className={`btn${module.active ? " btn--remove" : ""}`}
                data-action="toggle"
                onClick={() => handleAddonToggle(module.key)}
                disabled={!hasSeats}
              >
                {module.active ? "Remove" : "Add module +"}
              </button>
            </article>
          ))}
        </div>
      </section>

      <section className="total-bar" aria-label="Total">
        <div className="total-pill">
          <span className="total-label">Total</span>
          <span className="total-value">${formatTotal(total)}</span>
          <button className="total-clear" onClick={handleClear} disabled={total === 0}>
            Clear
          </button>
        </div>
      </section>
    </main>
  );
}

export default App;
