import { createContext, useContext, useState, ReactNode } from 'react';

interface LayoutContextType {
  sidebarCollapsed: boolean;
  setSidebarCollapsed: (collapsed: boolean) => void;
  threadListCollapsed: boolean;
  setThreadListCollapsed: (collapsed: boolean) => void;
  showAIPanel: boolean;
  setShowAIPanel: (show: boolean) => void;
}

const LayoutContext = createContext<LayoutContextType | undefined>(undefined);

export function LayoutProvider({ children }: { children: ReactNode }) {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [threadListCollapsed, setThreadListCollapsed] = useState(false);
  const [showAIPanel, setShowAIPanel] = useState(false);

  return (
    <LayoutContext.Provider
      value={{
        sidebarCollapsed,
        setSidebarCollapsed,
        threadListCollapsed,
        setThreadListCollapsed,
        showAIPanel,
        setShowAIPanel,
      }}
    >
      {children}
    </LayoutContext.Provider>
  );
}

export function useLayout() {
  const context = useContext(LayoutContext);
  if (context === undefined) {
    throw new Error('useLayout must be used within a LayoutProvider');
  }
  return context;
}
