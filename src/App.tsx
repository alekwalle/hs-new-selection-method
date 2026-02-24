import { useCallback, useMemo, useRef, useState } from "react";
import { Button } from "highsoft-ui";
import "highsoft-ui/css";

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

  const allSelected = hasSeats && activeModules.every((m) => m.active);

  const subtotal = useMemo(() => {
    if (!hasSeats) return 0;
    const addonSum = activeModules
      .filter((m) => m.active)
      .reduce((sum, m) => sum + addonPrices[m.key], 0);
    return (corePrice + addonSum) * seats;
  }, [activeModules, seats, hasSeats]);

  const discount = allSelected ? Math.round(subtotal * 0.1) : 0;
  const total = subtotal - discount;

  const [tooltip, setTooltip] = useState<{ visible: boolean; x: number; y: number }>({
    visible: false,
    x: 0,
    y: 0,
  });
  const tooltipRef = useRef<HTMLDivElement>(null);

  const handleTooltipMove = useCallback(
    (e: React.MouseEvent) => {
      if (hasSeats) return;
      setTooltip({ visible: true, x: e.clientX, y: e.clientY });
    },
    [hasSeats]
  );

  const handleTooltipLeave = useCallback(() => {
    setTooltip((prev) => ({ ...prev, visible: false }));
  }, []);

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
              <h1 className="card__title">Core</h1>
            </div>
          </div>
          <div className="header__pricing" aria-label="Pricing and seats">
            <div className="price-block">
              <div className="price price--main">{`${corePrice} USD`}</div>
            </div>
            <Button
              variant={hasSeats ? "transparent" : "success"}
              size={200}
              onClick={handleSeatToggle}
              aria-label={hasSeats ? "Remove seat" : "Add seat"}
            >
              {hasSeats ? "Remove" : "Add Core"}
            </Button>
          </div>
        </div>

        <div className="divider-row" role="presentation">
          <span className="divider" />
          <span className="divider-label">Additional Modules (requires Core)</span>
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
              <span
                onMouseMove={!hasSeats ? handleTooltipMove : undefined}
                onMouseLeave={!hasSeats ? handleTooltipLeave : undefined}
              >
                <Button
                  variant={module.active ? "transparent" : "success"}
                  size={100}
                  data-action="toggle"
                  onClick={() => handleAddonToggle(module.key)}
                  disabled={!hasSeats}
                >
                  {module.active ? "Remove" : "Add module +"}
                </Button>
              </span>
            </article>
          ))}
        </div>
      </section>

      <section className="cart" aria-label="Cart">
        <h2 className="cart__title">Summary</h2>
        {hasSeats ? (
          <>
            <ul className="cart__items">
              <li className="cart__item">
                <span>Highcharts Core</span>
                <span>{formatPrice(corePrice)}</span>
              </li>
              {activeModules
                .filter((m) => m.active)
                .map((m) => (
                  <li key={m.key} className="cart__item">
                    <span>{m.name}</span>
                    <span>{formatPrice(addonPrices[m.key])}</span>
                  </li>
                ))}
            </ul>
            {allSelected && (
              <>
                <div className="cart__divider" />
                <div className="cart__item cart__discount">
                  <span>Bundle discount (10%)</span>
                  <span>-{formatPrice(discount)}</span>
                </div>
              </>
            )}
            <div className="cart__divider" />
            <div className="cart__total">
              <span>Total</span>
              <span>${formatTotal(total)}</span>
            </div>
            <button className="cart__clear" onClick={handleClear}>
              Clear selection
            </button>
          </>
        ) : (
          <p className="cart__empty">No products selected</p>
        )}
      </section>
      {tooltip.visible && (
        <div
          ref={tooltipRef}
          className="cursor-tooltip"
          style={{ left: tooltip.x, top: tooltip.y }}
        >
          Select Core first
        </div>
      )}
    </main>
  );
}

export default App;
