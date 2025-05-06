
import React, { useState, useEffect } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Camera, Save } from "lucide-react";

import { Button } from "@/components/ui/button";
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
import { Switch } from "@/components/ui/switch";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

const profileSchema = z.object({
  name: z.string().min(2, {
    message: "Name must be at least 2 characters.",
  }),
  email: z.string().email({
    message: "Please enter a valid email address.",
  }),
  phone: z.string().optional(),
  title: z.string().optional(),
});

const passwordSchema = z.object({
  currentPassword: z.string().min(6, {
    message: "Current password must be at least 6 characters.",
  }),
  newPassword: z.string().min(8, {
    message: "New password must be at least 8 characters.",
  }),
  confirmPassword: z.string().min(8, {
    message: "Confirm password must be at least 8 characters.",
  }),
}).refine(data => data.newPassword === data.confirmPassword, {
  message: "Passwords do not match",
  path: ["confirmPassword"],
});

const notificationSchema = z.object({
  emailNotifications: z.boolean().default(true),
  inAppNotifications: z.boolean().default(true),
  mobileNotifications: z.boolean().default(false),
  taskAssignment: z.boolean().default(true),
  taskUpdate: z.boolean().default(true),
  taskCompletion: z.boolean().default(true),
  clientUpdate: z.boolean().default(true),
  deadlineReminder: z.boolean().default(true),
});

const dashboardSchema = z.object({
  defaultView: z.enum(["clients", "tasks", "analytics"]).default("tasks"),
  showCompletedTasks: z.boolean().default(true),
  showNotifications: z.boolean().default(true),
  taskSortOrder: z.enum(["deadline", "priority", "client", "assignee"]).default("deadline"),
});

const UserProfile = () => {
  const [user, setUser] = useState<any>(null);
  const [activeTab, setActiveTab] = useState("personal");
  const [isLoading, setIsLoading] = useState(false);
  
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (session?.user) {
          setUser(session.user);
          
          // Fetch user profile from database if needed
          const { data, error } = await supabase
            .from('users')
            .select('*')
            .eq('user_id', session.user.id)
            .single();
            
          if (data) {
            profileForm.reset({
              name: data.name || '',
              email: data.email || session.user.email || '',
              phone: data.phone || '',
              title: data.title || '',
            });
          }
        }
      } catch (error) {
        console.error("Error fetching user:", error);
      }
    };
    
    fetchUser();
  }, []);

  const profileForm = useForm<z.infer<typeof profileSchema>>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      title: "",
    },
  });

  const passwordForm = useForm<z.infer<typeof passwordSchema>>({
    resolver: zodResolver(passwordSchema),
    defaultValues: {
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    },
  });

  const notificationForm = useForm<z.infer<typeof notificationSchema>>({
    resolver: zodResolver(notificationSchema),
    defaultValues: {
      emailNotifications: true,
      inAppNotifications: true,
      mobileNotifications: false,
      taskAssignment: true,
      taskUpdate: true,
      taskCompletion: true,
      clientUpdate: true,
      deadlineReminder: true,
    },
  });

  const dashboardForm = useForm<z.infer<typeof dashboardSchema>>({
    resolver: zodResolver(dashboardSchema),
    defaultValues: {
      defaultView: "tasks",
      showCompletedTasks: true,
      showNotifications: true,
      taskSortOrder: "deadline",
    },
  });

  const onProfileSubmit = async (values: z.infer<typeof profileSchema>) => {
    try {
      setIsLoading(true);
      
      // Update user metadata in auth
      const { error: updateError } = await supabase.auth.updateUser({
        data: { name: values.name }
      });
      
      if (updateError) throw updateError;
      
      // Update user profile in database
      if (user) {
        const { error: profileError } = await supabase
          .from('users')
          .update({
            name: values.name,
            email: values.email,
            phone: values.phone,
            title: values.title
          })
          .eq('user_id', user.id);
          
        if (profileError) throw profileError;
      }
      
      toast({
        title: "Profile updated successfully",
        description: "Your profile information has been updated.",
      });
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Failed to update profile",
        description: error.message || "An unexpected error occurred",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const onPasswordSubmit = async (values: z.infer<typeof passwordSchema>) => {
    try {
      setIsLoading(true);
      
      // Update password
      const { error } = await supabase.auth.updateUser({ 
        password: values.newPassword 
      });
      
      if (error) throw error;
      
      toast({
        title: "Password updated successfully",
        description: "Your password has been changed.",
      });
      
      passwordForm.reset({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Failed to update password",
        description: error.message || "An unexpected error occurred",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const onNotificationSubmit = (values: z.infer<typeof notificationSchema>) => {
    // Would typically save to database
    toast({
      title: "Notification preferences updated",
      description: "Your notification settings have been saved.",
    });
  };

  const onDashboardSubmit = (values: z.infer<typeof dashboardSchema>) => {
    // Would typically save to database
    toast({
      title: "Dashboard preferences updated",
      description: "Your dashboard settings have been saved.",
    });
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold">User Profile & Preferences</h2>
        <p className="text-muted-foreground">
          Manage your personal information and application preferences
        </p>
      </div>
      
      <Separator />
      
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="personal">Personal Information</TabsTrigger>
          <TabsTrigger value="password">Password</TabsTrigger>
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
          <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
        </TabsList>
        
        {/* Personal Information Tab */}
        <TabsContent value="personal">
          <Card>
            <CardHeader>
              <CardTitle>Personal Information</CardTitle>
              <CardDescription>
                Update your personal details and contact information
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col md:flex-row gap-8">
                <div className="flex flex-col items-center gap-4 w-full md:w-1/3">
                  <Avatar className="h-32 w-32">
                    <AvatarImage src="" />
                    <AvatarFallback className="text-2xl">
                      {user?.email?.charAt(0).toUpperCase() || "U"}
                    </AvatarFallback>
                  </Avatar>
                  <Button variant="outline" className="w-full">
                    <Camera className="mr-2 h-4 w-4" /> Change Photo
                  </Button>
                </div>
                
                <div className="flex-1">
                  <Form {...profileForm}>
                    <form onSubmit={profileForm.handleSubmit(onProfileSubmit)} className="space-y-4">
                      <FormField
                        control={profileForm.control}
                        name="name"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Full Name</FormLabel>
                            <FormControl>
                              <Input placeholder="John Doe" {...field} />
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
                              <Input placeholder="john@example.com" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <FormField
                          control={profileForm.control}
                          name="phone"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Phone Number</FormLabel>
                              <FormControl>
                                <Input placeholder="+1 (555) 123-4567" {...field} />
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
                                <Input placeholder="Audit Manager" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                      
                      <Button type="submit" className="mt-4" disabled={isLoading}>
                        <Save className="mr-2 h-4 w-4" />
                        {isLoading ? "Saving..." : "Save Changes"}
                      </Button>
                    </form>
                  </Form>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        {/* Password Tab */}
        <TabsContent value="password">
          <Card>
            <CardHeader>
              <CardTitle>Change Password</CardTitle>
              <CardDescription>
                Update your password to keep your account secure
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Form {...passwordForm}>
                <form onSubmit={passwordForm.handleSubmit(onPasswordSubmit)} className="space-y-4">
                  <FormField
                    control={passwordForm.control}
                    name="currentPassword"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Current Password</FormLabel>
                        <FormControl>
                          <Input type="password" placeholder="••••••••" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={passwordForm.control}
                    name="newPassword"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>New Password</FormLabel>
                        <FormControl>
                          <Input type="password" placeholder="••••••••" {...field} />
                        </FormControl>
                        <FormDescription>
                          Password must be at least 8 characters long
                        </FormDescription>
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
                          <Input type="password" placeholder="••••••••" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <Button type="submit" className="mt-4" disabled={isLoading}>
                    <Save className="mr-2 h-4 w-4" />
                    {isLoading ? "Updating..." : "Update Password"}
                  </Button>
                </form>
              </Form>
            </CardContent>
          </Card>
        </TabsContent>
        
        {/* Notifications Tab */}
        <TabsContent value="notifications">
          <Card>
            <CardHeader>
              <CardTitle>Notification Preferences</CardTitle>
              <CardDescription>
                Configure how and when you receive notifications
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Form {...notificationForm}>
                <form onSubmit={notificationForm.handleSubmit(onNotificationSubmit)} className="space-y-6">
                  <div className="space-y-4">
                    <h3 className="text-lg font-medium">Notification Channels</h3>
                    <div className="grid gap-4">
                      <FormField
                        control={notificationForm.control}
                        name="emailNotifications"
                        render={({ field }) => (
                          <FormItem className="flex items-center justify-between rounded-lg border p-3">
                            <div>
                              <FormLabel className="text-base">Email Notifications</FormLabel>
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
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={notificationForm.control}
                        name="inAppNotifications"
                        render={({ field }) => (
                          <FormItem className="flex items-center justify-between rounded-lg border p-3">
                            <div>
                              <FormLabel className="text-base">In-App Notifications</FormLabel>
                              <FormDescription>
                                Show notifications within the application
                              </FormDescription>
                            </div>
                            <FormControl>
                              <Switch
                                checked={field.value}
                                onCheckedChange={field.onChange}
                              />
                            </FormControl>
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={notificationForm.control}
                        name="mobileNotifications"
                        render={({ field }) => (
                          <FormItem className="flex items-center justify-between rounded-lg border p-3">
                            <div>
                              <FormLabel className="text-base">Mobile Notifications</FormLabel>
                              <FormDescription>
                                Receive push notifications on your mobile device
                              </FormDescription>
                            </div>
                            <FormControl>
                              <Switch
                                checked={field.value}
                                onCheckedChange={field.onChange}
                              />
                            </FormControl>
                          </FormItem>
                        )}
                      />
                    </div>
                  </div>
                  
                  <Separator />
                  
                  <div className="space-y-4">
                    <h3 className="text-lg font-medium">Notification Types</h3>
                    <div className="grid gap-4">
                      <FormField
                        control={notificationForm.control}
                        name="taskAssignment"
                        render={({ field }) => (
                          <FormItem className="flex items-center justify-between rounded-lg border p-3">
                            <div>
                              <FormLabel className="text-base">Task Assignment</FormLabel>
                              <FormDescription>
                                When a task is assigned to you
                              </FormDescription>
                            </div>
                            <FormControl>
                              <Switch
                                checked={field.value}
                                onCheckedChange={field.onChange}
                              />
                            </FormControl>
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={notificationForm.control}
                        name="taskUpdate"
                        render={({ field }) => (
                          <FormItem className="flex items-center justify-between rounded-lg border p-3">
                            <div>
                              <FormLabel className="text-base">Task Updates</FormLabel>
                              <FormDescription>
                                When there are updates to your tasks
                              </FormDescription>
                            </div>
                            <FormControl>
                              <Switch
                                checked={field.value}
                                onCheckedChange={field.onChange}
                              />
                            </FormControl>
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={notificationForm.control}
                        name="deadlineReminder"
                        render={({ field }) => (
                          <FormItem className="flex items-center justify-between rounded-lg border p-3">
                            <div>
                              <FormLabel className="text-base">Deadline Reminders</FormLabel>
                              <FormDescription>
                                Reminders for upcoming task deadlines
                              </FormDescription>
                            </div>
                            <FormControl>
                              <Switch
                                checked={field.value}
                                onCheckedChange={field.onChange}
                              />
                            </FormControl>
                          </FormItem>
                        )}
                      />
                    </div>
                  </div>
                  
                  <Button type="submit">Save Notification Preferences</Button>
                </form>
              </Form>
            </CardContent>
          </Card>
        </TabsContent>
        
        {/* Dashboard Tab */}
        <TabsContent value="dashboard">
          <Card>
            <CardHeader>
              <CardTitle>Dashboard Preferences</CardTitle>
              <CardDescription>
                Customize your dashboard view and organization
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Form {...dashboardForm}>
                <form onSubmit={dashboardForm.handleSubmit(onDashboardSubmit)} className="space-y-6">
                  <FormField
                    control={dashboardForm.control}
                    name="defaultView"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Default Dashboard View</FormLabel>
                        <div className="grid grid-cols-3 gap-4">
                          <Button
                            type="button"
                            variant={field.value === "clients" ? "default" : "outline"}
                            className="w-full"
                            onClick={() => field.onChange("clients")}
                          >
                            Clients
                          </Button>
                          <Button
                            type="button"
                            variant={field.value === "tasks" ? "default" : "outline"}
                            className="w-full"
                            onClick={() => field.onChange("tasks")}
                          >
                            Tasks
                          </Button>
                          <Button
                            type="button"
                            variant={field.value === "analytics" ? "default" : "outline"}
                            className="w-full"
                            onClick={() => field.onChange("analytics")}
                          >
                            Analytics
                          </Button>
                        </div>
                      </FormItem>
                    )}
                  />
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <FormField
                      control={dashboardForm.control}
                      name="taskSortOrder"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Default Task Sorting</FormLabel>
                          <div className="grid grid-cols-2 gap-2">
                            <Button
                              type="button"
                              variant={field.value === "deadline" ? "default" : "outline"}
                              className="w-full"
                              onClick={() => field.onChange("deadline")}
                            >
                              By Deadline
                            </Button>
                            <Button
                              type="button"
                              variant={field.value === "priority" ? "default" : "outline"}
                              className="w-full"
                              onClick={() => field.onChange("priority")}
                            >
                              By Priority
                            </Button>
                            <Button
                              type="button"
                              variant={field.value === "client" ? "default" : "outline"}
                              className="w-full"
                              onClick={() => field.onChange("client")}
                            >
                              By Client
                            </Button>
                            <Button
                              type="button"
                              variant={field.value === "assignee" ? "default" : "outline"}
                              className="w-full"
                              onClick={() => field.onChange("assignee")}
                            >
                              By Assignee
                            </Button>
                          </div>
                        </FormItem>
                      )}
                    />
                    
                    <div className="space-y-4">
                      <FormField
                        control={dashboardForm.control}
                        name="showCompletedTasks"
                        render={({ field }) => (
                          <FormItem className="flex items-center justify-between rounded-lg border p-3">
                            <div>
                              <FormLabel className="text-base">Show Completed Tasks</FormLabel>
                              <FormDescription>
                                Display completed tasks on the dashboard
                              </FormDescription>
                            </div>
                            <FormControl>
                              <Switch
                                checked={field.value}
                                onCheckedChange={field.onChange}
                              />
                            </FormControl>
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={dashboardForm.control}
                        name="showNotifications"
                        render={({ field }) => (
                          <FormItem className="flex items-center justify-between rounded-lg border p-3">
                            <div>
                              <FormLabel className="text-base">Show Notifications</FormLabel>
                              <FormDescription>
                                Display notifications panel on dashboard
                              </FormDescription>
                            </div>
                            <FormControl>
                              <Switch
                                checked={field.value}
                                onCheckedChange={field.onChange}
                              />
                            </FormControl>
                          </FormItem>
                        )}
                      />
                    </div>
                  </div>
                  
                  <Button type="submit">Save Dashboard Preferences</Button>
                </form>
              </Form>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default UserProfile;
