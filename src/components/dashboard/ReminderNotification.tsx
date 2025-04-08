
import { useState, useEffect, useRef } from 'react';
import { Bell } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { toast } from 'sonner';

interface Reminder {
  id: string;
  title: string;
  amount: number;
  dueDate: string;
}

interface ReminderNotificationProps {
  reminders: Reminder[];
}

const ReminderNotification = ({ reminders }: ReminderNotificationProps) => {
  const [activeReminders, setActiveReminders] = useState<Reminder[]>([]);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  
  useEffect(() => {
    // Create audio element for notifications
    audioRef.current = new Audio('/notification.mp3');
    
    // Filter out reminders that are due today or past due
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const dueReminders = reminders.filter(reminder => {
      const dueDate = new Date(reminder.dueDate);
      dueDate.setHours(0, 0, 0, 0);
      return dueDate <= today;
    });
    
    setActiveReminders(dueReminders);
    
    // Play sound notification if there are due reminders
    if (dueReminders.length > 0) {
      // Show toast
      toast("Payment Reminder", {
        description: `You have ${dueReminders.length} payment${dueReminders.length > 1 ? 's' : ''} due today.`,
        action: {
          label: "View",
          onClick: () => console.log("Viewing reminders"),
        },
      });
      
      // Play sound (with user interaction on first load)
      const playSound = () => {
        if (audioRef.current) {
          audioRef.current.play().catch(e => console.log('Audio play failed:', e));
        }
      };
      
      // Attempt to play sound (may need user interaction first)
      playSound();
      
      // Setup interval to play sound periodically
      const soundInterval = setInterval(playSound, 60000); // Every minute
      
      return () => {
        clearInterval(soundInterval);
        if (audioRef.current) {
          audioRef.current.pause();
          audioRef.current = null;
        }
      };
    }
  }, [reminders]);
  
  const markAsPaid = (id: string) => {
    setActiveReminders(prev => prev.filter(r => r.id !== id));
    toast.success("Payment marked as complete!", { 
      description: "Your payment has been recorded." 
    });
  };
  
  if (activeReminders.length === 0) {
    return null;
  }
  
  return (
    <Card className="budget-card border-budget-red">
      <CardHeader className="pb-3 flex flex-row items-center justify-between">
        <CardTitle className="text-lg flex items-center">
          <Bell className="h-5 w-5 mr-2 text-budget-red animate-pulse-ring" />
          Payment Reminders
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {activeReminders.map((reminder) => (
            <div key={reminder.id} className="flex items-center justify-between p-2 bg-budget-light-red rounded-lg">
              <div>
                <div className="font-medium">{reminder.title}</div>
                <div className="text-sm text-muted-foreground">Due: {reminder.dueDate}</div>
              </div>
              <div className="flex items-center gap-2">
                <div className="flex items-center text-budget-red font-semibold">
                  ₹{reminder.amount.toLocaleString()}
                </div>
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={() => markAsPaid(reminder.id)}
                  className="border-budget-green text-budget-green hover:bg-budget-green hover:text-white"
                >
                  Mark Paid
                </Button>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default ReminderNotification;
