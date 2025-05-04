
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Label } from "@/components/ui/label";
import { Bell, Calendar, Mail, FileText } from "lucide-react";

interface Notification {
  id: string;
  title: string;
  message: string;
  type: "deadline" | "update" | "document";
  date: string;
  isRead: boolean;
}

interface NotificationCenterProps {
  notifications: Notification[];
  onReadNotification: (id: string) => void;
  onUpdatePreferences: (preferences: any) => void;
}

export function NotificationCenter({ 
  notifications, 
  onReadNotification,
  onUpdatePreferences
}: NotificationCenterProps) {
  const [preferences, setPreferences] = useState({
    email: true,
    inApp: true,
    mobile: false,
    deadlines: true,
    statusUpdates: true,
    documentUploads: true
  });

  const handlePreferenceChange = (key: string, value: boolean) => {
    const updatedPreferences = { ...preferences, [key]: value };
    setPreferences(updatedPreferences);
    onUpdatePreferences(updatedPreferences);
  };

  const getIconForType = (type: string) => {
    switch (type) {
      case "deadline": return <Calendar size={16} className="text-amber-500" />;
      case "update": return <Bell size={16} className="text-blue-500" />;
      case "document": return <FileText size={16} className="text-green-500" />;
      default: return <Bell size={16} />;
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Bell size={18} /> Notifications
          <Badge variant="outline" className="ml-auto">
            {notifications.filter(n => !n.isRead).length} new
          </Badge>
        </CardTitle>
        <CardDescription>Stay updated on deadlines and status changes</CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="notifications">
          <TabsList className="mb-4 w-full">
            <TabsTrigger value="notifications" className="flex-1">Notifications</TabsTrigger>
            <TabsTrigger value="preferences" className="flex-1">Preferences</TabsTrigger>
          </TabsList>
          
          <TabsContent value="notifications">
            {notifications.length > 0 ? (
              <div className="space-y-3 max-h-80 overflow-auto">
                {notifications.map(notification => (
                  <div 
                    key={notification.id} 
                    className={`border p-3 rounded-lg ${notification.isRead ? 'bg-transparent' : 'bg-muted'}`}
                  >
                    <div className="flex justify-between items-start">
                      <div className="flex items-center gap-2">
                        {getIconForType(notification.type)}
                        <h4 className="font-medium text-sm">{notification.title}</h4>
                      </div>
                      {!notification.isRead && (
                        <Badge variant="secondary" className="text-xs">New</Badge>
                      )}
                    </div>
                    <p className="text-sm text-muted-foreground mt-1">{notification.message}</p>
                    <div className="flex justify-between items-center mt-2">
                      <span className="text-xs text-muted-foreground">{notification.date}</span>
                      {!notification.isRead && (
                        <Button 
                          variant="ghost" 
                          size="sm"
                          onClick={() => onReadNotification(notification.id)}
                        >
                          Mark as read
                        </Button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="py-8 text-center text-muted-foreground">
                No notifications to display
              </div>
            )}
          </TabsContent>
          
          <TabsContent value="preferences">
            <div className="space-y-4">
              <h3 className="text-sm font-medium">Notification Channels</h3>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Mail size={16} />
                    <Label htmlFor="email-pref">Email Notifications</Label>
                  </div>
                  <Switch 
                    id="email-pref" 
                    checked={preferences.email}
                    onCheckedChange={(value) => handlePreferenceChange("email", value)} 
                  />
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Bell size={16} />
                    <Label htmlFor="inapp-pref">In-App Notifications</Label>
                  </div>
                  <Switch 
                    id="inapp-pref" 
                    checked={preferences.inApp}
                    onCheckedChange={(value) => handlePreferenceChange("inApp", value)} 
                  />
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Bell size={16} />
                    <Label htmlFor="mobile-pref">Mobile Push Notifications</Label>
                  </div>
                  <Switch 
                    id="mobile-pref" 
                    checked={preferences.mobile}
                    onCheckedChange={(value) => handlePreferenceChange("mobile", value)} 
                  />
                </div>
              </div>
              
              <h3 className="text-sm font-medium pt-2">Notification Types</h3>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Calendar size={16} />
                    <Label htmlFor="deadline-pref">Deadline Reminders</Label>
                  </div>
                  <Switch 
                    id="deadline-pref" 
                    checked={preferences.deadlines}
                    onCheckedChange={(value) => handlePreferenceChange("deadlines", value)} 
                  />
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Bell size={16} />
                    <Label htmlFor="status-pref">Status Updates</Label>
                  </div>
                  <Switch 
                    id="status-pref" 
                    checked={preferences.statusUpdates}
                    onCheckedChange={(value) => handlePreferenceChange("statusUpdates", value)} 
                  />
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <FileText size={16} />
                    <Label htmlFor="doc-pref">Document Uploads</Label>
                  </div>
                  <Switch 
                    id="doc-pref" 
                    checked={preferences.documentUploads}
                    onCheckedChange={(value) => handlePreferenceChange("documentUploads", value)} 
                  />
                </div>
              </div>
              
              <Button 
                className="w-full mt-4"
                onClick={() => onUpdatePreferences(preferences)}
              >
                Save Preferences
              </Button>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}
