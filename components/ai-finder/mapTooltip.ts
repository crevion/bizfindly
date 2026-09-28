import tippy, { type Instance as TippyInstance } from "tippy.js";

/**
 * A Tippy tooltip for things drawn on a Google map.
 *
 * Tippy positions itself against a DOM element, and a Google Maps marker or
 * circle has none -- they are painted into the map's own overlay panes. So one
 * instance is created against a virtual reference, and every hover moves that
 * reference to the cursor before showing it. One instance rather than one per
 * marker, because the map rebuilds its markers whenever the results change and
 * there is only ever one tooltip on screen.
 */
export interface MapTooltip {
  show: (content: HTMLElement, at: { clientX: number; clientY: number }) => void;
  /** Reposition without rebuilding the content, for following the cursor. */
  moveTo: (at: { clientX: number; clientY: number }) => void;
  hide: () => void;
  destroy: () => void;
}

export function createMapTooltip(): MapTooltip {
  let point = { clientX: 0, clientY: 0 };

  const instance: TippyInstance = tippy(document.body, {
    // The cursor is a point, so the reference rect has no width or height.
    getReferenceClientRect: () =>
      ({
        width: 0,
        height: 0,
        top: point.clientY,
        bottom: point.clientY,
        left: point.clientX,
        right: point.clientX,
        x: point.clientX,
        y: point.clientY,
        toJSON: () => undefined,
      }) as DOMRect,
    trigger: "manual",
    hideOnClick: false,
    interactive: false,
    arrow: true,
    offset: [0, 14],
    placement: "top",
    theme: "bizfindly",
    animation: "shift-away-subtle",
    duration: [120, 80],
    // Above the Location & Area card, which the map sits behind.
    zIndex: 2000,
    appendTo: () => document.body,
  });

  return {
    show: (content, at) => {
      point = { clientX: at.clientX, clientY: at.clientY };
      instance.setContent(content);
      instance.show();
    },
    moveTo: (at) => {
      point = { clientX: at.clientX, clientY: at.clientY };
      // Only worth the reflow while it is actually on screen.
      if (instance.state.isVisible) instance.popperInstance?.update();
    },
    hide: () => instance.hide(),
    destroy: () => instance.destroy(),
  };
}

/** Where a Google Maps mouse event happened, in viewport coordinates. */
export function cursorOf(
  event: google.maps.MapMouseEvent | google.maps.MapMouseEvent[],
): { clientX: number; clientY: number } | null {
  const single = Array.isArray(event) ? event[0] : event;
  const dom = single?.domEvent as MouseEvent | TouchEvent | undefined;
  if (!dom) return null;
  if ("clientX" in dom) return { clientX: dom.clientX, clientY: dom.clientY };
  const touch = dom.touches?.[0] ?? dom.changedTouches?.[0];
  return touch ? { clientX: touch.clientX, clientY: touch.clientY } : null;
}

const el = (tag: string, className: string, text?: string) => {
  const node = document.createElement(tag);
  node.className = className;
  // textContent, never innerHTML: every value here is a listing's own name,
  // area or facilities, straight out of the database.
  if (text !== undefined) node.textContent = text;
  return node;
};

/** A tooltip body: a title, an optional subtitle, and a row of small facts. */
export function tooltipContent(options: {
  title: string;
  subtitle?: string;
  facts?: (string | null | undefined)[];
  accent?: string;
}): HTMLElement {
  const root = el("div", "map-tip");

  const heading = el("div", "map-tip__title", options.title);
  if (options.accent) heading.style.setProperty("--map-tip-accent", options.accent);
  root.append(heading);

  if (options.subtitle) root.append(el("div", "map-tip__subtitle", options.subtitle));

  const facts = (options.facts ?? []).filter((fact): fact is string => Boolean(fact));
  if (facts.length) {
    const row = el("div", "map-tip__facts");
    for (const fact of facts) row.append(el("span", "map-tip__fact", fact));
    root.append(row);
  }

  return root;
}
