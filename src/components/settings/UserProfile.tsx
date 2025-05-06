
import React, { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { toast } from "@/hooks/use-toast";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

// Define validation schema for profile form
const profileFormSchema = z.object({
  name: z.string().min(2, {
    message: "Name must be at least 2 characters.",
  }),
  email: z.string().email({
    message: "Please enter a valid email address.",
  }),
  username: z.string().min(2, {
    message: "Username must be at least 2 characters.",
  }),
  phone: z.string().optional(),
  title: z.string().optional(),
});

// Define validation schema for password form
const passwordFormSchema = z.object({
  currentPassword: z.string().min(8, {
    message: "Password must be at least 8 characters.",
  }),
  newPassword: z.string().min(8, {
    message: "Password must be at least 8 characters.",
  }),
  confirmPassword: z.string().min(8, {
    message: "Password must be at least 8 characters.",
  }),
}).refine((data) => data.newPassword === data.confirmPassword, {
  message: "Passwords do not match",
  path: ["confirmPassword"],
});

// Define validation schema for notification preferences
const notificationFormSchema = z.object({
  emailNotifications: z.boolean().default(true),
  inAppNotifications: z.boolean().default(true),
  taskReminders: z.boolean().default(true),
  deadlineAlerts: z.boolean().default(true),
  clientActivity: z.boolean().default(false),
  teamActivity: z.boolean().default(true),
  marketingUpdates: z.boolean().default(false),
});

// Mock user data
const mockUser = {
  id: "1",
  name: "John Doe",
  email: "john.doe@example.com",
  username: "johndoe",
  user_id: "u1",
  created_at: "2023-01-01T12:00:00Z",
  updated_at: "2023-05-15T09:00:00Z"
};

// Mock notification preferences
const mockNotifications = {
  emailNotifications: true,
  inAppNotifications: true,
  taskReminders: true,
  deadlineAlerts: true,
  clientActivity: false,
  teamActivity: true,
  marketingUpdates: false,
};

// Mock dashboard preferences
const mockDashboardPreferences = {
  defaultView: "client-list",
  showCompletedTasks: false,
  showClientStatus: true,
  showUpcomingDeadlines: true,
  enableDarkMode: false,
  autoRefreshInterval: 5,
  compactView: false,
};

const UserProfile = () => {
  const [user, setUser] = useState(mockUser);
  const [notifications, setNotifications] = useState(mockNotifications);
  const [dashboardPreferences, setDashboardPreferences] = useState(mockDashboardPreferences);
  const [isAvatarDialogOpen, setIsAvatarDialogOpen] = useState(false);

  // Initialize profile form
  const profileForm = useForm<z.infer<typeof profileFormSchema>>({
    resolver: zodResolver(profileFormSchema),
    defaultValues: {
      name: user.name,
      email: user.email,
      username: user.username,
      // These fields don't exist in the current mockUser type, so using empty strings
      phone: "",
      title: "",
    },
  });

  // Initialize password form
  const passwordForm = useForm<z.infer<typeof passwordFormSchema>>({
    resolver: zodResolver(passwordFormSchema),
    defaultValues: {
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    },
  });

  // Initialize notification form
  const notificationForm = useForm<z.infer<typeof notificationFormSchema>>({
    resolver: zodResolver(notificationFormSchema),
    defaultValues: notifications,
  });

  // Handle profile form submission
  const onSubmitProfile = (values: z.infer<typeof profileFormSchema>) => {
    // In a real app, this would update the user profile via API
    setUser({
      ...user,
      name: values.name,
      email: values.email,
      username: values.username,
    });
    
    toast({
      title: "Profile Updated",
      description: "Your profile information has been updated.",
    });
  };

  // Handle password form submission
  const onSubmitPassword = (values: z.infer<typeof passwordFormSchema>) => {
    // In a real app, this would update the password via API
    passwordForm.reset({
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    });
    
    toast({
      title: "Password Updated",
      description: "Your password has been changed successfully.",
    });
  };

  // Handle notification preferences submission
  const onSubmitNotifications = (values: z.infer<typeof notificationFormSchema>) => {
    // Fix: Ensure all required properties are present when setting state
    setNotifications({
      emailNotifications: values.emailNotifications,
      inAppNotifications: values.inAppNotifications,
      taskReminders: values.taskReminders,
      deadlineAlerts: values.deadlineAlerts,
      clientActivity: values.clientActivity,
      teamActivity: values.teamActivity,
      marketingUpdates: values.marketingUpdates,
    });
    
    toast({
      title: "Notification Preferences Updated",
      description: "Your notification preferences have been updated.",
    });
  };

  // Handle dashboard preference change
  const handleDashboardPreferenceChange = (key: string, value: any) => {
    setDashboardPreferences({
      ...dashboardPreferences,
      [key]: value,
    });
    
    toast({
      title: "Dashboard Preference Updated",
      description: `${key} setting has been updated.`,
    });
  };

  return (
    <Tabs defaultValue="profile" className="w-full">
      <TabsList className="mb-6">
        <TabsTrigger value="profile">Profile Information</TabsTrigger>
        <TabsTrigger value="security">Security</TabsTrigger>
        <TabsTrigger value="notifications">Notifications</TabsTrigger>
        <TabsTrigger value="preferences">Preferences</TabsTrigger>
      </TabsList>

      {/* Profile Information Tab */}
      <TabsContent value="profile">
        <Card>
          <CardHeader>
            <CardTitle>Profile Information</CardTitle>
            <CardDescription>
              Update your personal information and profile settings
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
              <div className="flex-shrink-0">
                <Avatar className="h-20 w-20">
                  <AvatarImage src="/placeholder.svg" alt={user.name} />
                  <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
                </Avatar>
              </div>
              <div className="flex-1 space-y-2">
                <h3 className="font-medium text-lg">{user.name}</h3>
                <p className="text-sm text-muted-foreground">{user.username}</p>
                <div className="flex space-x-2">
                  <Button variant="outline" size="sm">
                    Change Avatar
                  </Button>
                  <Button variant="secondary" size="sm">
                    Remove
                  </Button>
                </div>
              </div>
            </div>

            <Form {...profileForm}>
              <form onSubmit={profileForm.handleSubmit(onSubmitProfile)} className="space-y-4">
                <div className="grid gap-4 md:grid-cols-2">
                  <FormField
                    control={profileForm.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Full Name</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={profileForm.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Email</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={profileForm.control}
                    name="username"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Username</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={profileForm.control}
                    name="phone"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Phone</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={profileForm.control}
                    name="title"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Job Title</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <div className="flex justify-end">
                  <Button type="submit">Save Profile</Button>
                </div>
              </form>
            </Form>
          </CardContent>
        </Card>
      </TabsContent>

      {/* Security Tab */}
      <TabsContent value="security">
        <Card>
          <CardHeader>
            <CardTitle>Security</CardTitle>
            <CardDescription>
              Manage your password and security preferences
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <h3 className="text-lg font-medium mb-4">Change Password</h3>
              <Form {...passwordForm}>
                <form onSubmit={passwordForm.handleSubmit(onSubmitPassword)} className="space-y-4">
                  <FormField
                    control={passwordForm.control}
                    name="currentPassword"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Current Password</FormLabel>
                        <FormControl>
                          <Input type="password" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <div className="grid gap-4 md:grid-cols-2">
                    <FormField
                      control={passwordForm.control}
                      name="newPassword"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>New Password</FormLabel>
                          <FormControl>
                            <Input type="password" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={passwordForm.control}
                      name="confirmPassword"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Confirm New Password</FormLabel>
                          <FormControl>
                            <Input type="password" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  <div className="flex justify-end">
                    <Button type="submit">Update Password</Button>
                  </div>
                </form>
              </Form>
            </div>

            <div className="pt-6 border-t">
              <h3 className="text-lg font-medium mb-4">Account Security</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="two-factor">Two-Factor Authentication</Label>
                    <p className="text-sm text-muted-foreground">
                      Add an extra layer of security to your account
                    </p>
                  </div>
                  <Switch id="two-factor" />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="session-timeout">Session Timeout</Label>
                    <p className="text-sm text-muted-foreground">
                      Automatically log out after 30 minutes of inactivity
                    </p>
                  </div>
                  <Switch id="session-timeout" defaultChecked />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="login-notifications">Login Notifications</Label>
                    <p className="text-sm text-muted-foreground">
                      Receive notifications for new login attempts
                    </p>
                  </div>
                  <Switch id="login-notifications" defaultChecked />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </TabsContent>

      {/* Notifications Tab */}
      <TabsContent value="notifications">
        <Card>
          <CardHeader>
            <CardTitle>Notification Preferences</CardTitle>
            <CardDescription>
              Manage how and when you receive notifications
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...notificationForm}>
              <form onSubmit={notificationForm.handleSubmit(onSubmitNotifications)} className="space-y-6">
                <div className="space-y-4">
                  <h3 className="text-lg font-medium">Notification Channels</h3>
                  <div className="grid gap-4 md:grid-cols-2">
                    <FormField
                      control={notificationForm.control}
                      name="emailNotifications"
                      render={({ field }) => (
                        <FormItem className="flex items-center justify-between space-x-2 border p-4 rounded-md">
                          <div>
                            <FormLabel>Email Notifications</FormLabel>
                            <FormDescription>
                              Receive notifications via email
                            </FormDescription>
                          </div>
                          <FormControl>
                            <Switch
                              checked={field.value}
                              onCheckedChange={field.onChange}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={notificationForm.control}
                      name="inAppNotifications"
                      render={({ field }) => (
                        <FormItem className="flex items-center justify-between space-x-2 border p-4 rounded-md">
                          <div>
                            <FormLabel>In-App Notifications</FormLabel>
                            <FormDescription>
                              Receive notifications within the app
                            </FormDescription>
                          </div>
                          <FormControl>
                            <Switch
                              checked={field.value}
                              onCheckedChange={field.onChange}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </div>

                <div className="space-y-4 pt-6 border-t">
                  <h3 className="text-lg font-medium">Notification Types</h3>
                  <div className="grid gap-4 md:grid-cols-2">
                    <FormField
                      control={notificationForm.control}
                      name="taskReminders"
                      render={({ field }) => (
                        <FormItem className="flex items-center justify-between space-x-2 border p-4 rounded-md">
                          <div>
                            <FormLabel>Task Reminders</FormLabel>
                            <FormDescription>
                              Get notified about upcoming tasks
                            </FormDescription>
                          </div>
                          <FormControl>
                            <Switch
                              checked={field.value}
                              onCheckedChange={field.onChange}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={notificationForm.control}
                      name="deadlineAlerts"
                      render={({ field }) => (
                        <FormItem className="flex items-center justify-between space-x-2 border p-4 rounded-md">
                          <div>
                            <FormLabel>Deadline Alerts</FormLabel>
                            <FormDescription>
                              Get notified about approaching deadlines
                            </FormDescription>
                          </div>
                          <FormControl>
                            <Switch
                              checked={field.value}
                              onCheckedChange={field.onChange}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={notificationForm.control}
                      name="clientActivity"
                      render={({ field }) => (
                        <FormItem className="flex items-center justify-between space-x-2 border p-4 rounded-md">
                          <div>
                            <FormLabel>Client Activity</FormLabel>
                            <FormDescription>
                              Get notified about client actions
                            </FormDescription>
                          </div>
                          <FormControl>
                            <Switch
                              checked={field.value}
                              onCheckedChange={field.onChange}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={notificationForm.control}
                      name="teamActivity"
                      render={({ field }) => (
                        <FormItem className="flex items-center justify-between space-x-2 border p-4 rounded-md">
                          <div>
                            <FormLabel>Team Activity</FormLabel>
                            <FormDescription>
                              Get notified about team actions
                            </FormDescription>
                          </div>
                          <FormControl>
                            <Switch
                              checked={field.value}
                              onCheckedChange={field.onChange}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={notificationForm.control}
                      name="marketingUpdates"
                      render={({ field }) => (
                        <FormItem className="flex items-center justify-between space-x-2 border p-4 rounded-md">
                          <div>
                            <FormLabel>Marketing Updates</FormLabel>
                            <FormDescription>
                              Receive product updates and news
                            </FormDescription>
                          </div>
                          <FormControl>
                            <Switch
                              checked={field.value}
                              onCheckedChange={field.onChange}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </div>

                <div className="flex justify-end">
                  <Button type="submit">Save Notification Preferences</Button>
                </div>
              </form>
            </Form>
          </CardContent>
        </Card>
      </TabsContent>

      {/* Preferences Tab */}
      <TabsContent value="preferences">
        <Card>
          <CardHeader>
            <CardTitle>Dashboard Preferences</CardTitle>
            <CardDescription>
              Customize how your dashboard looks and works
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-4">
              <div className="flex items-center justify-between border p-4 rounded-md">
                <div>
                  <Label htmlFor="default-view">Default Dashboard View</Label>
                  <p className="text-sm text-muted-foreground">
                    Choose which view to show when you first login
                  </p>
                </div>
                <select
                  id="default-view"
                  value={dashboardPreferences.defaultView}
                  onChange={(e) => handleDashboardPreferenceChange("defaultView", e.target.value)}
                  className="rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background"
                >
                  <option value="client-list">Client List</option>
                  <option value="running-works">Running Works & Status</option>
                  <option value="task-list">Task List</option>
                  <option value="calendar">Calendar</option>
                </select>
              </div>

              <div className="flex items-center justify-between border p-4 rounded-md">
                <div>
                  <Label htmlFor="show-completed">Show Completed Tasks</Label>
                  <p className="text-sm text-muted-foreground">
                    Display completed tasks in task lists
                  </p>
                </div>
                <Switch
                  id="show-completed"
                  checked={dashboardPreferences.showCompletedTasks}
                  onCheckedChange={(checked) => handleDashboardPreferenceChange("showCompletedTasks", checked)}
                />
              </div>

              <div className="flex items-center justify-between border p-4 rounded-md">
                <div>
                  <Label htmlFor="show-client-status">Show Client Status</Label>
                  <p className="text-sm text-muted-foreground">
                    Show client status indicators on dashboard
                  </p>
                </div>
                <Switch
                  id="show-client-status"
                  checked={dashboardPreferences.showClientStatus}
                  onCheckedChange={(checked) => handleDashboardPreferenceChange("showClientStatus", checked)}
                />
              </div>

              <div className="flex items-center justify-between border p-4 rounded-md">
                <div>
                  <Label htmlFor="show-deadlines">Show Upcoming Deadlines</Label>
                  <p className="text-sm text-muted-foreground">
                    Display upcoming deadlines on dashboard
                  </p>
                </div>
                <Switch
                  id="show-deadlines"
                  checked={dashboardPreferences.showUpcomingDeadlines}
                  onCheckedChange={(checked) => handleDashboardPreferenceChange("showUpcomingDeadlines", checked)}
                />
              </div>

              <div className="flex items-center justify-between border p-4 rounded-md">
                <div>
                  <Label htmlFor="dark-mode">Dark Mode</Label>
                  <p className="text-sm text-muted-foreground">
                    Use dark color scheme for the interface
                  </p>
                </div>
                <Switch
                  id="dark-mode"
                  checked={dashboardPreferences.enableDarkMode}
                  onCheckedChange={(checked) => handleDashboardPreferenceChange("enableDarkMode", checked)}
                />
              </div>

              <div className="flex items-center justify-between border p-4 rounded-md">
                <div>
                  <Label htmlFor="auto-refresh">Auto-Refresh (minutes)</Label>
                  <p className="text-sm text-muted-foreground">
                    Automatically refresh dashboard data
                  </p>
                </div>
                <select
                  id="auto-refresh"
                  value={dashboardPreferences.autoRefreshInterval}
                  onChange={(e) => handleDashboardPreferenceChange("autoRefreshInterval", parseInt(e.target.value))}
                  className="rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background"
                >
                  <option value="0">Off</option>
                  <option value="1">1 minute</option>
                  <option value="5">5 minutes</option>
                  <option value="10">10 minutes</option>
                  <option value="30">30 minutes</option>
                </select>
              </div>

              <div className="flex items-center justify-between border p-4 rounded-md">
                <div>
                  <Label htmlFor="compact-view">Compact View</Label>
                  <p className="text-sm text-muted-foreground">
                    Use compact layout to fit more content
                  </p>
                </div>
                <Switch
                  id="compact-view"
                  checked={dashboardPreferences.compactView}
                  onCheckedChange={(checked) => handleDashboardPreferenceChange("compactView", checked)}
                />
              </div>
            </div>
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button variant="outline">Reset to Defaults</Button>
            <Button>Save Preferences</Button>
          </CardFooter>
        </Card>
      </TabsContent>
    </Tabs>
  );
};

export default UserProfile;
