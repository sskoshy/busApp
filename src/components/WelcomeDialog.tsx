import { useState } from 'react';
import { Bell, BellRing, Settings } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from './ui/dialog';
import { Button } from './ui/button';

interface WelcomeDialogProps {
  open: boolean;
  onEnableNotifications: () => void;
  onSkip: () => void;
  onOpenSettings: () => void;
}

export function WelcomeDialog({
  open,
  onEnableNotifications,
  onSkip,
  onOpenSettings,
}: WelcomeDialogProps) {
  const [showSettings, setShowSettings] = useState(false);

  return (
    <Dialog open={open} onOpenChange={() => {}}>
      <DialogContent className="sm:max-w-md" onInteractOutside={(e) => e.preventDefault()}>
        <DialogHeader>
          <div className="flex justify-center mb-4">
            <div className="w-16 h-16 bg-blue-500 rounded-full flex items-center justify-center">
              <BellRing className="w-8 h-8 text-white" />
            </div>
          </div>
          <DialogTitle className="text-center text-gray-900 dark:text-gray-100">
            Welcome to UC Davis Unitrans!
          </DialogTitle>
          <DialogDescription className="text-center">
            Would you like to enable notifications for bus schedules and stop alerts?
          </DialogDescription>
        </DialogHeader>

        <div className="py-4">
          <div className="bg-blue-50 dark:bg-blue-950 rounded-lg p-4 border-2 border-blue-200 dark:border-blue-800">
            <div className="flex items-start gap-3">
              <Bell className="w-5 h-5 text-blue-500 flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-gray-900 dark:text-gray-100 mb-1">
                  Stay informed about your bus
                </p>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Notifications help you know when your bus is arriving, if there are delays, 
                  and when to head to your stop. You can customize these settings anytime.
                </p>
              </div>
            </div>
          </div>
        </div>

        <DialogFooter className="flex-col gap-2 sm:flex-col">
          <Button
            onClick={onEnableNotifications}
            className="w-full bg-blue-500 hover:bg-blue-600"
          >
            <BellRing className="w-4 h-4 mr-2" />
            Yes, Enable Notifications
          </Button>
          <Button
            variant="outline"
            onClick={onSkip}
            className="w-full"
          >
            No, Thanks
          </Button>
          <Button
            variant="ghost"
            onClick={onOpenSettings}
            className="w-full text-sm text-gray-600 dark:text-gray-400"
          >
            <Settings className="w-4 h-4 mr-2" />
            I'll configure this later in Settings
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
