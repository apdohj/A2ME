"use client";

import {
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
  useSyncExternalStore,
  type ReactNode,
} from "react";

export type DeviceType = "desktop" | "laptop" | "tablet" | "mobile";

interface DeviceOption {
  key: DeviceType;
  label: string;
  width: number;
  height: number;
  radius: number;
  screenRadius: number;
}

const OPTIONS: DeviceOption[] = [
  { key: "desktop", label: "Desktop", width: 0, height: 0, radius: 0, screenRadius: 0 },
  { key: "laptop", label: "Laptop", width: 1280, height: 800, radius: 24, screenRadius: 18 },
  { key: "tablet", label: "Tablet", width: 768, height: 1024, radius: 44, screenRadius: 36 },
  { key: "mobile", label: "Mobile", width: 390, height: 844, radius: 56, screenRadius: 48 },
];

export const DEVICES: { key: DeviceType; label: string }[] = OPTIONS.map(
  ({ key, label }) => ({ key, label })
);

const STORAGE_KEY = "a2me_device_preview";
const CHANGE_EVENT = "a2me-device-preview-change";

function readStoredDevice(): DeviceType {
  if (typeof window === "undefined") return "desktop";
  try {
    const stored = window.localStorage.getItem(STORAGE_KEY);
    return stored && OPTIONS.some((o) => o.key === stored)
      ? (stored as DeviceType)
      : "desktop";
  } catch {
    return "desktop";
  }
}

function subscribeToDevice(callback: () => void) {
  window.addEventListener(CHANGE_EVENT, callback);
  window.addEventListener("storage", callback);
  return () => {
    window.removeEventListener(CHANGE_EVENT, callback);
    window.removeEventListener("storage", callback);
  };
}

interface DevicePreviewContextValue {
  device: DeviceType;
  setDevice: (device: DeviceType) => void;
}

const DevicePreviewContext = createContext<DevicePreviewContextValue | undefined>(
  undefined
);

export function DevicePreviewProvider({ children }: { children: ReactNode }) {
  const device = useSyncExternalStore<DeviceType>(
    subscribeToDevice,
    readStoredDevice,
    () => "desktop"
  );
  const [scale, setScale] = useState(1);
  const screenRef = useRef<HTMLDivElement>(null);
  const option = OPTIONS.find((o) => o.key === device) ?? OPTIONS[1];

  const setDevice = (next: DeviceType) => {
    try {
      window.localStorage.setItem(STORAGE_KEY, next);
    } catch {
      // ignore storage errors
    }
    window.dispatchEvent(new Event(CHANGE_EVENT));
  };

  useEffect(() => {
    const isFrame = device !== "desktop";
    document.body.style.overflow = isFrame ? "hidden" : "";
    if (isFrame) {
      document.body.setAttribute("data-preview", device);
    } else {
      document.body.removeAttribute("data-preview");
    }
    screenRef.current?.scrollTo({ top: 0 });
  }, [device]);

  useEffect(() => {
    if (device === "desktop") return;
    const current = OPTIONS.find((o) => o.key === device);
    if (!current) return;
    const compute = () => {
      const s = Math.min(
        1,
        (window.innerWidth - 48) / current.width,
        (window.innerHeight - 120) / current.height
      );
      setScale(Math.max(0.1, s));
    };
    compute();
    window.addEventListener("resize", compute);
    return () => window.removeEventListener("resize", compute);
  }, [device]);

  return (
    <DevicePreviewContext.Provider value={{ device, setDevice }}>
      {device === "desktop" ? (
        children
      ) : (
        <div className="fixed inset-0 z-[70] overflow-hidden bg-black">
          <div className="absolute inset-0 flex items-start justify-center px-4 pt-6 pb-8">
            <div
              className="relative shrink-0"
              style={{
                width: option.width,
                height: option.height,
                borderRadius: option.radius,
                transform: `scale(${scale})`,
                transformOrigin: "top center",
              }}
            >
              {/* device body / bezel */}
              <div className="absolute inset-0 rounded-[inherit] bg-gradient-to-b from-[#2a2a2a] to-[#141414] border border-white/10 shadow-2xl shadow-black/90" />
              <div className="absolute -inset-[3px] rounded-[inherit] border border-black/70" />
              {/* screen */}
              <div
                ref={screenRef}
                className="absolute inset-[5px] overflow-y-auto overflow-x-hidden bg-obsidian"
                style={{ borderRadius: option.screenRadius }}
              >
                {device === "mobile" && <DynamicIsland />}
                {device === "tablet" && <TabletCamera />}
                {device === "mobile" && <HomeBar />}
                {children}
              </div>
            </div>
          </div>
        </div>
      )}
    </DevicePreviewContext.Provider>
  );
}

function DynamicIsland() {
  return (
    <div className="absolute top-2 left-1/2 -translate-x-1/2 z-[95] h-[22px] w-24 rounded-full bg-black border border-white/10 shadow-lg shadow-black/60" />
  );
}

function TabletCamera() {
  return (
    <div className="absolute top-2.5 left-1/2 -translate-x-1/2 z-[95] h-2.5 w-2.5 rounded-full bg-black border border-white/20" />
  );
}

function HomeBar() {
  return (
    <div className="absolute bottom-1.5 left-1/2 -translate-x-1/2 z-[95] h-1 w-24 rounded-full bg-white/25" />
  );
}

export function DeviceIcon({ type, className }: { type: DeviceType; className?: string }) {
  const common = {
    width: 16,
    height: 16,
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 1.7,
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
    className,
  };
  switch (type) {
    case "mobile":
      return (
        <svg {...common}>
          <rect x="7" y="2.5" width="10" height="19" rx="2.5" />
          <path d="M11 18.5h2" />
        </svg>
      );
    case "tablet":
      return (
        <svg {...common}>
          <rect x="4" y="3" width="16" height="18" rx="2.5" />
          <path d="M11 18h2" />
        </svg>
      );
    case "laptop":
      return (
        <svg {...common}>
          <rect x="4" y="4.5" width="16" height="11" rx="1.5" />
          <path d="M2.5 20h19" />
        </svg>
      );
    default:
      return (
        <svg {...common}>
          <rect x="3" y="4" width="18" height="12" rx="1.5" />
          <path d="M8 20h8M12 16v4" />
        </svg>
      );
  }
}

export function useDevicePreview() {
  const ctx = useContext(DevicePreviewContext);
  if (!ctx) throw new Error("useDevicePreview must be used within DevicePreviewProvider");
  return ctx;
}
