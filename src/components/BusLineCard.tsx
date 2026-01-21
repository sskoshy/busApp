import { BusLine } from '../types/bus';
import { Bus, MapPin } from 'lucide-react';
import { Card } from './ui/card';

interface BusLineCardProps {
  line: BusLine;
  isActive: boolean;
  onClick: () => void;
}

export function BusLineCard({ line, isActive, onClick }: BusLineCardProps) {
  const getPatternClass = (pattern: string) => {
    switch (pattern) {
      case 'dots':
        return 'bg-[radial-gradient(circle,_currentColor_1px,_transparent_1px)] bg-[length:8px_8px]';
      case 'stripes':
        return 'bg-[repeating-linear-gradient(45deg,_currentColor,_currentColor_2px,_transparent_2px,_transparent_8px)]';
      case 'grid':
        return 'bg-[linear-gradient(currentColor_1px,_transparent_1px),_linear-gradient(90deg,_currentColor_1px,_transparent_1px)] bg-[length:10px_10px]';
      case 'waves':
        return 'bg-[repeating-linear-gradient(0deg,_currentColor_0px,_currentColor_2px,_transparent_2px,_transparent_6px)]';
      default:
        return '';
    }
  };

  return (
    <Card
      onClick={onClick}
      className={`cursor-pointer transition-all hover:shadow-lg ${
        isActive ? 'ring-4 ring-blue-500 shadow-lg' : ''
      }`}
    >
      <div className="p-4">
        <div className="flex items-center gap-3">
          <div className="relative">
            <div
              className={`w-12 h-12 rounded-lg border-2 border-gray-800 dark:border-gray-200 ${getPatternClass(line.pattern)}`}
              style={{ color: line.color }}
            />
            <Bus className="absolute inset-0 m-auto w-6 h-6 text-gray-900 dark:text-gray-100" />
          </div>
          <div className="flex-1">
            <h3 className="text-gray-900 dark:text-gray-100">{line.name}</h3>
            <div className="flex items-center gap-1 text-gray-600 dark:text-gray-400">
              <MapPin className="w-4 h-4" />
              <span className="text-sm">{line.stops.length} stops</span>
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
}
