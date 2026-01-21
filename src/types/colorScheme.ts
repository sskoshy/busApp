export interface ColorScheme {
  id: string;
  name: string;
  description: string;
  isAccessible: boolean;
  isCustom?: boolean;
  colors: {
    // Bus line colors (7 colors for 7 lines)
    busLine1: string;
    busLine2: string;
    busLine3: string;
    busLine4: string;
    busLine5: string;
    busLine6: string;
    busLine7: string;
    // UI accent colors
    primary: string;
    secondary: string;
    success: string;
    warning: string;
    error: string;
    info: string;
  };
}

export const PRESET_COLOR_SCHEMES: ColorScheme[] = [
  {
    id: 'default',
    name: 'Default',
    description: 'Standard colorful theme with good contrast',
    isAccessible: true,
    colors: {
      busLine1: '#0066CC', // Blue (A Line)
      busLine2: '#CC3333', // Red (C Line)
      busLine3: '#33AA33', // Green (G Line)
      busLine4: '#CC6600', // Orange (M Line)
      busLine5: '#9933CC', // Purple (P Line)
      busLine6: '#FF9933', // Light Orange (Q Line)
      busLine7: '#0099CC', // Cyan (W Line)
      primary: '#0066CC',
      secondary: '#6B7280',
      success: '#33AA33',
      warning: '#FF9933',
      error: '#CC3333',
      info: '#0099CC',
    },
  },
  {
    id: 'high-contrast-bw',
    name: 'High Contrast (B&W)',
    description: 'Maximum contrast with black and white for users with low vision',
    isAccessible: true,
    colors: {
      busLine1: '#000000',
      busLine2: '#1a1a1a',
      busLine3: '#333333',
      busLine4: '#4d4d4d',
      busLine5: '#666666',
      busLine6: '#808080',
      busLine7: '#999999',
      primary: '#000000',
      secondary: '#666666',
      success: '#000000',
      warning: '#333333',
      error: '#000000',
      info: '#4d4d4d',
    },
  },
  {
    id: 'high-contrast-yb',
    name: 'High Contrast (Yellow & Black)',
    description: 'Yellow on black for enhanced visibility and reduced eye strain',
    isAccessible: true,
    colors: {
      busLine1: '#FFD700',
      busLine2: '#FFED4E',
      busLine3: '#F4C430',
      busLine4: '#FFC000',
      busLine5: '#FFBF00',
      busLine6: '#FADA5E',
      busLine7: '#FFE135',
      primary: '#FFD700',
      secondary: '#CCAA00',
      success: '#FFD700',
      warning: '#FFC000',
      error: '#FFD700',
      info: '#FFED4E',
    },
  },
  {
    id: 'grayscale',
    name: 'Grayscale',
    description: 'Neutral grayscale palette for maximum clarity',
    isAccessible: true,
    colors: {
      busLine1: '#000000',
      busLine2: '#262626',
      busLine3: '#404040',
      busLine4: '#595959',
      busLine5: '#737373',
      busLine6: '#8c8c8c',
      busLine7: '#a6a6a6',
      primary: '#404040',
      secondary: '#737373',
      success: '#404040',
      warning: '#595959',
      error: '#262626',
      info: '#737373',
    },
  },
  {
    id: 'deuteranopia-friendly',
    name: 'Deuteranopia-Friendly',
    description: 'Optimized for red-green colorblindness (deuteranopia)',
    isAccessible: true,
    colors: {
      busLine1: '#0066CC', // Blue
      busLine2: '#CC8800', // Orange
      busLine3: '#6B4C9A', // Purple
      busLine4: '#0099CC', // Cyan
      busLine5: '#CC6677', // Rose
      busLine6: '#88CCEE', // Sky blue
      busLine7: '#882255', // Wine
      primary: '#0066CC',
      secondary: '#6B4C9A',
      success: '#0099CC',
      warning: '#CC8800',
      error: '#CC6677',
      info: '#88CCEE',
    },
  },
  {
    id: 'protanopia-friendly',
    name: 'Protanopia-Friendly',
    description: 'Optimized for red-green colorblindness (protanopia)',
    isAccessible: true,
    colors: {
      busLine1: '#0066CC', // Blue
      busLine2: '#DDAA33', // Gold
      busLine3: '#004488', // Dark blue
      busLine4: '#BB5566', // Brick
      busLine5: '#0099CC', // Cyan
      busLine6: '#997700', // Olive
      busLine7: '#77AADD', // Light blue
      primary: '#0066CC',
      secondary: '#004488',
      success: '#0099CC',
      warning: '#DDAA33',
      error: '#BB5566',
      info: '#77AADD',
    },
  },
  {
    id: 'tritanopia-friendly',
    name: 'Tritanopia-Friendly',
    description: 'Optimized for blue-yellow colorblindness (tritanopia)',
    isAccessible: true,
    colors: {
      busLine1: '#EE3377', // Rose
      busLine2: '#009988', // Teal
      busLine3: '#CC3311', // Red
      busLine4: '#33BBEE', // Cyan
      busLine5: '#EE7733', // Orange
      busLine6: '#0077BB', // Blue
      busLine7: '#CC9933', // Sand
      primary: '#EE3377',
      secondary: '#009988',
      success: '#009988',
      warning: '#EE7733',
      error: '#CC3311',
      info: '#0077BB',
    },
  },
  {
    id: 'cool-blues',
    name: 'Cool Blues',
    description: 'Calming blue tones with high contrast',
    isAccessible: true,
    colors: {
      busLine1: '#003f5c',
      busLine2: '#2f4b7c',
      busLine3: '#665191',
      busLine4: '#a05195',
      busLine5: '#d45087',
      busLine6: '#f95d6a',
      busLine7: '#ff7c43',
      primary: '#2f4b7c',
      secondary: '#665191',
      success: '#003f5c',
      warning: '#ff7c43',
      error: '#f95d6a',
      info: '#2f4b7c',
    },
  },
  {
    id: 'warm-tones',
    name: 'Warm Tones',
    description: 'Warm, earthy colors with good contrast',
    isAccessible: true,
    colors: {
      busLine1: '#8B4513', // Brown
      busLine2: '#D2691E', // Chocolate
      busLine3: '#CD853F', // Peru
      busLine4: '#DEB887', // Burlywood
      busLine5: '#B8860B', // Dark goldenrod
      busLine6: '#DAA520', // Goldenrod
      busLine7: '#F4A460', // Sandy brown
      primary: '#8B4513',
      secondary: '#CD853F',
      success: '#B8860B',
      warning: '#DAA520',
      error: '#D2691E',
      info: '#DEB887',
    },
  },
];
