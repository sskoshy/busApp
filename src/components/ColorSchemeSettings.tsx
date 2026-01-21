import { useState } from 'react';
import { Palette, Plus, Trash2, Eye, Check, Info } from 'lucide-react';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Label } from './ui/label';
import { Input } from './ui/input';
import { useColorScheme } from '../contexts/ColorSchemeContext';
import { ColorScheme, PRESET_COLOR_SCHEMES } from '../types/colorScheme';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from './ui/dialog';
import { ScrollArea } from './ui/scroll-area';
import { Separator } from './ui/separator';
import { Alert, AlertDescription } from './ui/alert';

const busLinePatterns = [
  { name: 'A Line', pattern: 'solid' },
  { name: 'C Line', pattern: 'dots' },
  { name: 'G Line', pattern: 'stripes' },
  { name: 'M Line', pattern: 'dots' },
  { name: 'P Line', pattern: 'grid' },
  { name: 'Q Line', pattern: 'waves' },
  { name: 'W Line', pattern: 'grid' },
];

function PatternPreview({ color, pattern }: { color: string; pattern: string }) {
  const baseStyle = {
    width: '40px',
    height: '24px',
    borderRadius: '4px',
    border: '2px solid rgba(0,0,0,0.2)',
  };

  if (pattern === 'solid') {
    return <div style={{ ...baseStyle, backgroundColor: color }} />;
  }

  if (pattern === 'dots') {
    return (
      <div
        style={{
          ...baseStyle,
          backgroundColor: color,
          backgroundImage: `radial-gradient(circle, rgba(255,255,255,0.5) 2px, transparent 2px)`,
          backgroundSize: '8px 8px',
        }}
      />
    );
  }

  if (pattern === 'stripes') {
    return (
      <div
        style={{
          ...baseStyle,
          backgroundColor: color,
          backgroundImage: `repeating-linear-gradient(45deg, transparent, transparent 4px, rgba(255,255,255,0.5) 4px, rgba(255,255,255,0.5) 8px)`,
        }}
      />
    );
  }

  if (pattern === 'grid') {
    return (
      <div
        style={{
          ...baseStyle,
          backgroundColor: color,
          backgroundImage: `linear-gradient(rgba(255,255,255,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.5) 1px, transparent 1px)`,
          backgroundSize: '6px 6px',
        }}
      />
    );
  }

  if (pattern === 'waves') {
    return (
      <div
        style={{
          ...baseStyle,
          backgroundColor: color,
          backgroundImage: `repeating-radial-gradient(circle at 0 0, transparent 0, ${color} 4px, transparent 4px, transparent 8px, rgba(255,255,255,0.5) 8px, rgba(255,255,255,0.5) 12px)`,
          backgroundSize: '8px 8px',
        }}
      />
    );
  }

  return <div style={baseStyle} />;
}

function CustomColorSchemeDialog({ onSave }: { onSave: (scheme: ColorScheme) => void }) {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [colors, setColors] = useState({
    busLine1: '#0066CC',
    busLine2: '#CC3333',
    busLine3: '#33AA33',
    busLine4: '#CC6600',
    busLine5: '#9933CC',
    busLine6: '#FF9933',
    busLine7: '#0099CC',
    primary: '#0066CC',
    secondary: '#6B7280',
    success: '#33AA33',
    warning: '#FF9933',
    error: '#CC3333',
    info: '#0099CC',
  });

  const handleSave = () => {
    if (!name.trim()) return;

    const newScheme: ColorScheme = {
      id: `custom-${Date.now()}`,
      name: name.trim(),
      description: description.trim() || 'Custom color scheme',
      isAccessible: false,
      isCustom: true,
      colors,
    };

    onSave(newScheme);
    setOpen(false);
    setName('');
    setDescription('');
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="gap-2">
          <Plus className="w-4 h-4" />
          Create Custom Theme
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[90vh]">
        <DialogHeader>
          <DialogTitle>Create Custom Color Scheme</DialogTitle>
          <DialogDescription>
            Design your own color palette. Patterns help distinguish bus lines even with similar colors.
          </DialogDescription>
        </DialogHeader>
        <ScrollArea className="max-h-[60vh] pr-4">
          <div className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="scheme-name">Theme Name</Label>
              <Input
                id="scheme-name"
                placeholder="My Custom Theme"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="scheme-description">Description (Optional)</Label>
              <Input
                id="scheme-description"
                placeholder="A brief description of your theme"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
            </div>

            <Separator />

            <div className="space-y-3">
              <h4 className="text-gray-900 dark:text-gray-100">Bus Line Colors</h4>
              {busLinePatterns.map((line, index) => (
                <div key={index} className="flex items-center gap-3">
                  <div className="flex items-center gap-2 flex-1">
                    <PatternPreview
                      color={colors[`busLine${index + 1}` as keyof typeof colors]}
                      pattern={line.pattern}
                    />
                    <Label className="flex-1">{line.name}</Label>
                  </div>
                  <Input
                    type="color"
                    value={colors[`busLine${index + 1}` as keyof typeof colors]}
                    onChange={(e) =>
                      setColors((prev) => ({
                        ...prev,
                        [`busLine${index + 1}`]: e.target.value,
                      }))
                    }
                    className="w-20 h-10 cursor-pointer"
                  />
                </div>
              ))}
            </div>

            <Separator />

            <div className="space-y-3">
              <h4 className="text-gray-900 dark:text-gray-100">UI Colors</h4>
              {[
                { key: 'primary', label: 'Primary' },
                { key: 'secondary', label: 'Secondary' },
                { key: 'success', label: 'Success' },
                { key: 'warning', label: 'Warning' },
                { key: 'error', label: 'Error' },
                { key: 'info', label: 'Info' },
              ].map(({ key, label }) => (
                <div key={key} className="flex items-center gap-3">
                  <div className="flex items-center gap-2 flex-1">
                    <div
                      className="w-10 h-6 rounded border-2 border-gray-300 dark:border-gray-600"
                      style={{ backgroundColor: colors[key as keyof typeof colors] }}
                    />
                    <Label className="flex-1">{label}</Label>
                  </div>
                  <Input
                    type="color"
                    value={colors[key as keyof typeof colors]}
                    onChange={(e) =>
                      setColors((prev) => ({
                        ...prev,
                        [key]: e.target.value,
                      }))
                    }
                    className="w-20 h-10 cursor-pointer"
                  />
                </div>
              ))}
            </div>
          </div>
        </ScrollArea>
        <div className="flex justify-end gap-3 pt-4 border-t">
          <Button variant="outline" onClick={() => setOpen(false)}>
            Cancel
          </Button>
          <Button onClick={handleSave} disabled={!name.trim()}>
            Save Theme
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

export function ColorSchemeSettings() {
  const {
    colorScheme,
    setColorScheme,
    customSchemes,
    addCustomScheme,
    deleteCustomScheme,
  } = useColorScheme();

  const allSchemes = [...PRESET_COLOR_SCHEMES, ...customSchemes];

  return (
    <div className="space-y-6">
      <Card>
        <div className="p-4">
          <div className="flex items-start gap-3 mb-4">
            <Palette className="w-6 h-6 text-blue-500 dark:text-blue-400 flex-shrink-0 mt-1" />
            <div className="flex-1">
              <h2 className="text-gray-900 dark:text-gray-100 mb-1">Color Scheme</h2>
              <p className="text-gray-600 dark:text-gray-400">
                Choose a color palette that works best for you. All themes use patterns for additional differentiation.
              </p>
            </div>
          </div>

          <Alert className="bg-blue-50 dark:bg-blue-950 border-blue-200 dark:border-blue-800">
            <Info className="w-4 h-4 text-blue-600 dark:text-blue-400" />
            <AlertDescription className="text-blue-900 dark:text-blue-100">
              Patterns (dots, stripes, grids, waves) help distinguish bus lines regardless of color, making the app
              accessible for all users including those with color vision deficiencies.
            </AlertDescription>
          </Alert>
        </div>
      </Card>

      <div className="flex justify-between items-center">
        <h3 className="text-gray-900 dark:text-gray-100">Available Themes</h3>
        <CustomColorSchemeDialog onSave={addCustomScheme} />
      </div>

      <div className="grid gap-4">
        {allSchemes.map((scheme) => (
          <Card
            key={scheme.id}
            className={`cursor-pointer transition-all ${
              colorScheme.id === scheme.id
                ? 'ring-2 ring-blue-500 dark:ring-blue-400 bg-blue-50 dark:bg-blue-950'
                : 'hover:bg-gray-50 dark:hover:bg-gray-800'
            }`}
            onClick={() => setColorScheme(scheme)}
          >
            <div className="p-4">
              <div className="flex items-start justify-between gap-4 mb-3">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <h4 className="text-gray-900 dark:text-gray-100">{scheme.name}</h4>
                    {scheme.isAccessible && (
                      <Badge variant="secondary" className="gap-1">
                        <Eye className="w-3 h-3" />
                        Accessible
                      </Badge>
                    )}
                    {scheme.isCustom && (
                      <Badge variant="outline">Custom</Badge>
                    )}
                    {colorScheme.id === scheme.id && (
                      <Badge className="bg-blue-500 dark:bg-blue-600 gap-1">
                        <Check className="w-3 h-3" />
                        Active
                      </Badge>
                    )}
                  </div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">{scheme.description}</p>
                </div>
                {scheme.isCustom && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={(e) => {
                      e.stopPropagation();
                      deleteCustomScheme(scheme.id);
                    }}
                    className="text-red-600 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                )}
              </div>

              {/* Bus Line Color Preview */}
              <div className="space-y-2">
                <div className="grid grid-cols-7 gap-2">
                  {busLinePatterns.map((line, index) => (
                    <div key={index} className="text-center">
                      <PatternPreview
                        color={scheme.colors[`busLine${index + 1}` as keyof typeof scheme.colors]}
                        pattern={line.pattern}
                      />
                      <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                        {line.name.split(' ')[0]}
                      </p>
                    </div>
                  ))}
                </div>

                {/* UI Color Preview */}
                <div className="flex gap-2 flex-wrap pt-2">
                  {['primary', 'secondary', 'success', 'warning', 'error', 'info'].map((key) => (
                    <div key={key} className="flex items-center gap-1">
                      <div
                        className="w-6 h-6 rounded border-2 border-gray-300 dark:border-gray-600"
                        style={{
                          backgroundColor: scheme.colors[key as keyof typeof scheme.colors],
                        }}
                      />
                      <span className="text-xs text-gray-600 dark:text-gray-400 capitalize">{key}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {customSchemes.length === 0 && (
        <Card>
          <div className="p-6 text-center">
            <Palette className="w-12 h-12 text-gray-400 dark:text-gray-500 mx-auto mb-3" />
            <h4 className="text-gray-900 dark:text-gray-100 mb-2">No Custom Themes Yet</h4>
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              Create your own color scheme to match your preferences
            </p>
            <CustomColorSchemeDialog onSave={addCustomScheme} />
          </div>
        </Card>
      )}
    </div>
  );
}
