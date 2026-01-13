import { useState } from 'react';
import { MainLayout } from '@/components/layout/MainLayout';
import { useBudget } from '@/contexts/BudgetContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { 
  Settings as SettingsIcon, 
  User, 
  Bell, 
  Shield, 
  Save,
  ChevronRight
} from 'lucide-react';
import { toast } from 'sonner';

export default function Settings() {
  const { user } = useBudget();
  const [name, setName] = useState(user?.name || '');
  const [email, setEmail] = useState(user?.email || '');
  const [university, setUniversity] = useState(user?.university || '');
  
  const [notifications, setNotifications] = useState({
    spending: true,
    savings: true,
    withdrawals: true,
    weekly: false,
  });

  const handleSave = () => {
    toast.success('Settings saved successfully!');
  };

  return (
    <MainLayout>
      <div className="max-w-3xl space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-2xl lg:text-3xl font-bold font-heading flex items-center gap-3">
            <SettingsIcon className="h-8 w-8 text-primary" />
            Settings
          </h1>
          <p className="text-muted-foreground mt-2">
            Manage your account and preferences
          </p>
        </div>

        {/* Profile Section */}
        <div className="stat-card">
          <div className="flex items-center gap-3 mb-6">
            <User className="h-5 w-5 text-primary" />
            <h3 className="font-semibold">Profile Information</h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">Full Name</Label>
              <Input
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="university">University</Label>
              <Input
                id="university"
                value={university}
                onChange={(e) => setUniversity(e.target.value)}
                placeholder="e.g., National University of Lesotho"
              />
            </div>
          </div>
        </div>

        {/* Notifications */}
        <div className="stat-card">
          <div className="flex items-center gap-3 mb-6">
            <Bell className="h-5 w-5 text-primary" />
            <h3 className="font-semibold">Notifications</h3>
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Spending Alerts</p>
                <p className="text-sm text-muted-foreground">
                  Notify when approaching budget limit
                </p>
              </div>
              <Switch 
                checked={notifications.spending}
                onCheckedChange={(c) => setNotifications(prev => ({ ...prev, spending: c }))}
              />
            </div>
            
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Savings Reminders</p>
                <p className="text-sm text-muted-foreground">
                  Remind to save towards goals
                </p>
              </div>
              <Switch 
                checked={notifications.savings}
                onCheckedChange={(c) => setNotifications(prev => ({ ...prev, savings: c }))}
              />
            </div>
            
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Cash Withdrawal Tracking</p>
                <p className="text-sm text-muted-foreground">
                  Remind to log cash spending
                </p>
              </div>
              <Switch 
                checked={notifications.withdrawals}
                onCheckedChange={(c) => setNotifications(prev => ({ ...prev, withdrawals: c }))}
              />
            </div>
            
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Weekly Summary</p>
                <p className="text-sm text-muted-foreground">
                  Receive weekly spending reports
                </p>
              </div>
              <Switch 
                checked={notifications.weekly}
                onCheckedChange={(c) => setNotifications(prev => ({ ...prev, weekly: c }))}
              />
            </div>
          </div>
        </div>

        {/* Security */}
        <div className="stat-card">
          <div className="flex items-center gap-3 mb-6">
            <Shield className="h-5 w-5 text-primary" />
            <h3 className="font-semibold">Security</h3>
          </div>

          <div className="space-y-3">
            <Button variant="outline" className="w-full justify-between">
              Change Password
              <ChevronRight className="h-4 w-4" />
            </Button>
            <Button variant="outline" className="w-full justify-between">
              Export My Data
              <ChevronRight className="h-4 w-4" />
            </Button>
            <Button variant="outline" className="w-full justify-between text-destructive hover:text-destructive">
              Delete Account
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Save Button */}
        <div className="flex justify-end">
          <Button onClick={handleSave} className="gap-2">
            <Save className="h-4 w-4" />
            Save Changes
          </Button>
        </div>
      </div>
    </MainLayout>
  );
}
