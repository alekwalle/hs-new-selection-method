import { useMemo, useState } from "react";

import coreIcon from "./svg/core.svg";
import coreSelectedIcon from "./svg/core-selected.svg";
import stockIcon from "./svg/stock.svg";
import stockSelectedIcon from "./svg/stock-selected.svg";
import mapsIcon from "./svg/maps.svg";
import mapsSelectedIcon from "./svg/maps-selected.svg";
import ganttIcon from "./svg/gantt.svg";
import ganttSelectedIcon from "./svg/gantt-selected.svg";

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
    icon: stockIcon,
    iconSelected: stockSelectedIcon,
  },
  {
    key: "maps" as const,
    name: "Maps",
    icon: mapsIcon,
    iconSelected: mapsSelectedIcon,
  },
  {
    key: "gantt" as const,
    name: "Gantt",
    icon: ganttIcon,
    iconSelected: ganttSelectedIcon,
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
              <img src={hasSeats ? coreSelectedIcon : coreIcon} alt="" width={32} height={32} />
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
                <img src={module.active ? module.iconSelected : module.icon} alt="" width={32} height={32} />
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
