"use client";

import { useState, useCallback, useEffect, useRef, ReactNode } from "react";
import { ResponsiveGridLayout, LayoutItem, ResponsiveLayouts } from "react-grid-layout";
import WidgetCard from "./WidgetCard";

const STORAGE_KEY  = "peykgoz-dashboard-layout-v1";
const DRAG_HANDLE  = "widget-header";

/** Default 12-column layout */
const DEFAULT_LAYOUT: LayoutItem[] = [
  { i: "kpi",        x: 0,  y: 0,  w: 4,  h: 4,  minW: 3, maxW: 12, minH: 3 },
  { i: "riskzone",   x: 4,  y: 0,  w: 4,  h: 4,  minW: 3, maxW: 12, minH: 3 },
  { i: "vessels",    x: 8,  y: 0,  w: 4,  h: 4,  minW: 3, maxW: 12, minH: 3 },
  { i: "activity",   x: 0,  y: 4,  w: 4,  h: 6,  minW: 3, maxW: 12, minH: 4 },
  { i: "conversion", x: 4,  y: 4,  w: 8,  h: 6,  minW: 4, maxW: 12, minH: 4 },
  { i: "history",    x: 0,  y: 10, w: 12, h: 6,  minW: 6, maxW: 12, minH: 4 },
];

const DEFAULT_LAYOUTS: ResponsiveLayouts = {
  lg:  DEFAULT_LAYOUT,
  md:  DEFAULT_LAYOUT.map(l => ({ ...l, w: Math.min(l.w, 10) })),
  sm:  DEFAULT_LAYOUT.map(l => ({ ...l, x: 0, w: 6 })),
  xs:  DEFAULT_LAYOUT.map(l => ({ ...l, x: 0, w: 4 })),
  xxs: DEFAULT_LAYOUT.map(l => ({ ...l, x: 0, w: 2 })),
};

const WIDGET_TITLES: Record<string, string> = {
  kpi:        "Incident KPIs",
  riskzone:   "Risk Zone Breakdown",
  vessels:    "AIS Vessels",
  activity:   "Activity Log",
  conversion: "Circular Recovery",
  history:    "Detection History",
};

export type WidgetDef = {
  id: string;
  content: ReactNode;
};

type Props = {
  widgets: WidgetDef[];
};

export default function WidgetGrid({ widgets }: Props) {
  const [layouts, setLayouts] = useState<ResponsiveLayouts>(DEFAULT_LAYOUTS);
  const [width, setWidth]     = useState(800);
  const [isMobile, setIsMobile] = useState(false);
  const [mounted, setMounted]   = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Hydrate from localStorage on client mount only
  useEffect(() => {
    setMounted(true);
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) setLayouts(JSON.parse(saved) as ResponsiveLayouts);
    } catch { /* corrupt — use defaults */ }
  }, []);

  // Measure container width using ResizeObserver
  useEffect(() => {
    if (!containerRef.current) return;
    const obs = new ResizeObserver(entries => {
      const w = entries[0]?.contentRect.width ?? 800;
      setWidth(w);
      setIsMobile(w < 768);
    });
    obs.observe(containerRef.current);
    return () => obs.disconnect();
  }, [mounted]);

  const handleLayoutChange = useCallback((layout: readonly LayoutItem[], all: ResponsiveLayouts) => {
    void layout;
    setLayouts(all);
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(all)); } catch { /* storage full */ }
  }, []);

  const handleReset = useCallback(() => {
    setLayouts(DEFAULT_LAYOUTS);
    try { localStorage.removeItem(STORAGE_KEY); } catch { /* ignore */ }
  }, []);

  const widgetMap = Object.fromEntries(widgets.map(w => [w.id, w]));

  // Skip SSR — avoid layout/width hydration mismatch
  if (!mounted) return null;

  return (
    <div ref={containerRef} style={{ position: "relative" }}>
      {/* Toolbar */}
      <div style={{ display: "flex", justifyContent: "flex-end", padding: "10px 12px 0" }}>
        <button className="reset-layout-btn" onClick={handleReset} title="Reset to default layout">
          <svg width="11" height="11" viewBox="0 0 12 12" fill="none">
            <path d="M1 6a5 5 0 1 0 1.1-3.1" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
            <path d="M1 2v3h3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          Reset layout
        </button>
      </div>

      <ResponsiveGridLayout
        layouts={layouts}
        onLayoutChange={handleLayoutChange}
        width={width}
        breakpoints={{ lg: 1200, md: 996, sm: 768, xs: 480, xxs: 0 }}
        cols={{ lg: 12, md: 10, sm: 6, xs: 4, xxs: 2 }}
        rowHeight={72}
        margin={[10, 10]}
        containerPadding={[12, 8]}
        dragConfig={{ handle: `.${DRAG_HANDLE}`, enabled: !isMobile }}
        resizeConfig={{ handles: ["se"], enabled: !isMobile }}
      >
        {DEFAULT_LAYOUT.map(({ i }) => {
          const widget = widgetMap[i];
          if (!widget) return null;
          return (
            <div key={i}>
              <WidgetCard title={WIDGET_TITLES[i] ?? i} dragHandleClass={DRAG_HANDLE}>
                {widget.content}
              </WidgetCard>
            </div>
          );
        })}
      </ResponsiveGridLayout>
    </div>
  );
}
