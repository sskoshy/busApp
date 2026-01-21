import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { ColorScheme, PRESET_COLOR_SCHEMES } from '../types/colorScheme';

interface ColorSchemeContextType {
  colorScheme: ColorScheme;
  setColorScheme: (scheme: ColorScheme) => void;
  customSchemes: ColorScheme[];
  addCustomScheme: (scheme: ColorScheme) => void;
  deleteCustomScheme: (id: string) => void;
  getBusLineColor: (lineIndex: number) => string;
  getUIColor: (type: 'primary' | 'secondary' | 'success' | 'warning' | 'error' | 'info') => string;
}

const ColorSchemeContext = createContext<ColorSchemeContextType | undefined>(undefined);

export function ColorSchemeProvider({ children }: { children: ReactNode }) {
  const [colorScheme, setColorSchemeState] = useState<ColorScheme>(() => {
    const saved = localStorage.getItem('colorScheme');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        return PRESET_COLOR_SCHEMES[0];
      }
    }
    return PRESET_COLOR_SCHEMES[0];
  });

  const [customSchemes, setCustomSchemes] = useState<ColorScheme[]>(() => {
    const saved = localStorage.getItem('customColorSchemes');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        return [];
      }
    }
    return [];
  });

  useEffect(() => {
    localStorage.setItem('colorScheme', JSON.stringify(colorScheme));
  }, [colorScheme]);

  useEffect(() => {
    localStorage.setItem('customColorSchemes', JSON.stringify(customSchemes));
  }, [customSchemes]);

  const setColorScheme = (scheme: ColorScheme) => {
    setColorSchemeState(scheme);
  };

  const addCustomScheme = (scheme: ColorScheme) => {
    setCustomSchemes((prev) => [...prev, scheme]);
  };

  const deleteCustomScheme = (id: string) => {
    setCustomSchemes((prev) => prev.filter((s) => s.id !== id));
    // If deleting the active scheme, switch to default
    if (colorScheme.id === id) {
      setColorSchemeState(PRESET_COLOR_SCHEMES[0]);
    }
  };

  const getBusLineColor = (lineIndex: number): string => {
    const colorKeys = [
      'busLine1',
      'busLine2',
      'busLine3',
      'busLine4',
      'busLine5',
      'busLine6',
      'busLine7',
    ] as const;
    const key = colorKeys[lineIndex % 7];
    return colorScheme.colors[key];
  };

  const getUIColor = (type: 'primary' | 'secondary' | 'success' | 'warning' | 'error' | 'info'): string => {
    return colorScheme.colors[type];
  };

  return (
    <ColorSchemeContext.Provider
      value={{
        colorScheme,
        setColorScheme,
        customSchemes,
        addCustomScheme,
        deleteCustomScheme,
        getBusLineColor,
        getUIColor,
      }}
    >
      {children}
    </ColorSchemeContext.Provider>
  );
}

export function useColorScheme() {
  const context = useContext(ColorSchemeContext);
  if (context === undefined) {
    throw new Error('useColorScheme must be used within a ColorSchemeProvider');
  }
  return context;
}
