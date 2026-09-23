import { createContext, useContext, useEffect, useState, type ReactNode } from "react";

export const DEFAULT_CLOAK = {
  title: "Cool FlashCards",
  icon: "/cool-games-icon.png",
};

export const CLOAK_PRESETS = [
  DEFAULT_CLOAK,
  {
    title: "Google Drive",
    icon: "https://ssl.gstatic.com/images/branding/product/1x/drive_2020q4_32dp.png",
  },
  {
    title: "Google Classroom",
    icon: "https://ssl.gstatic.com/classroom/favicon.png",
  },
  {
    title: "Canvas",
    icon: "https://du11hjcvx0uqb.cloudfront.net/dist/images/favicon-e10d657a73.ico",
  },
] as const;

type Cloak = { title: string; icon: string };
type TabCloakContextValue = Cloak & {
  applyCloak: (cloak: Cloak) => void;
  resetCloak: () => void;
};

const STORAGE_KEY = "cool-games-tab-cloak";
const TabCloakContext = createContext<TabCloakContextValue | null>(null);

function updateBrowserTab({ title, icon }: Cloak) {
  document.title = title;
  let favicon = document.querySelector<HTMLLinkElement>('link[rel~="icon"]');
  if (!favicon) {
    favicon = document.createElement("link");
    favicon.rel = "icon";
    document.head.appendChild(favicon);
  }
  favicon.href = icon;
}

export function TabCloakProvider({ children }: { children: ReactNode }) {
  const [cloak, setCloak] = useState<Cloak>(DEFAULT_CLOAK);

  useEffect(() => {
    try {
      const saved = window.localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved) as Partial<Cloak>;
        if (typeof parsed.title === "string" && typeof parsed.icon === "string") {
          setCloak({ title: parsed.title, icon: parsed.icon });
          return;
        }
      }
    } catch {
      window.localStorage.removeItem(STORAGE_KEY);
    }
    updateBrowserTab(DEFAULT_CLOAK);
  }, []);

  useEffect(() => {
    updateBrowserTab(cloak);
  }, [cloak]);

  const applyCloak = (next: Cloak) => {
    setCloak(next);
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
  };

  const resetCloak = () => {
    setCloak(DEFAULT_CLOAK);
    window.localStorage.removeItem(STORAGE_KEY);
  };

  return (
    <TabCloakContext.Provider value={{ ...cloak, applyCloak, resetCloak }}>
      {children}
    </TabCloakContext.Provider>
  );
}

export function useTabCloak() {
  const context = useContext(TabCloakContext);
  if (!context) throw new Error("useTabCloak must be used inside TabCloakProvider");
  return context;
}