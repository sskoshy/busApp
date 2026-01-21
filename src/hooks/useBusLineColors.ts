import { useColorScheme } from '../contexts/ColorSchemeContext';
import { BusLine } from '../types/bus';

export function useBusLineColors(busLines: BusLine[]): BusLine[] {
  const { getBusLineColor } = useColorScheme();
  
  return busLines.map((line, index) => ({
    ...line,
    color: getBusLineColor(index),
  }));
}
