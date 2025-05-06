
import React, { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Calendar, Mail, Link as LinkIcon, RotateCw, FilePlus, FileText, KeyRound, ExternalLink } from "lucide-react";

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
import { Card, CardContent, CardFooter, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { toast } from "@/hooks/use-toast";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";

const emailIntegrationSchema = z.object({
  provider: z.enum(["outlook", "gmail", "smtp", "none"]).default("none"),
  emailServer: z.string().optional(),
  username: z.string().optional(),
  password: z.string().optional(),
  port: z.string().optional(),
  useTLS: z.boolean().default(true),
  defaultSender: z.string().email().optional(),
  enableSignature: z.boolean().default(true),
  signature: z.string().optional(),
});

const calendarIntegrationSchema = z.object({
  provider: z.enum(["outlook", "google", "none"]).default("none"),
  syncEnabled: z.boolean().default(false),
  syncFrequencyMinutes: z.string().default("60"),
  defaultReminder: z.string().default("30"),
  includeClientMeetings: z.boolean().default(true),
  includeInternalMeetings: z.boolean().default(true),
  includeDeadlines: z.boolean().default(true),
});

const accountingIntegrationSchema = z.object({
  provider: z.enum(["quickbooks", "xero", "tally", "custom", "none"]).default("none"),
  apiKey: z.string().optional(),
  apiSecret: z.string().optional(),
  clientId: z.string().optional(),
  refreshToken: z.string().optional(),
  syncEnabled: z.boolean().default(false),
  syncFrequencyHours: z.string().default("24"),
});

const apiKeySchema = z.object({
  name: z.string().min(1, "Name is required"),
  key: z.string().min(10, "API key must be at least 10 characters"),
  permissions: z.object({
    read: z.boolean().default(true),
    write: z.boolean().default(false),
    delete: z.boolean().default(false),
  }),
  expiresAt: z.string().optional(),
});

// Sample API keys
const apiKeys = [
  {
    id: 1,
    name: "Dashboard Integration",
    key: "sk_test_h4J8MxAP9OxFln•••••••••••••••••",
    created: "2023-03-15",
    lastUsed: "2023-05-01",
    permissions: { read: true, write: false, delete: false },
  },
  {
    id: 2,
    name: "Mobile App Integration",
    key: "sk_live_9pTb5JwNZh7Lar•••••••••••••••••",
    created: "2023-04-10",
    lastUsed: "2023-05-06",
    permissions: { read: true, write: true, delete: false },
  },
];

const IntegrationManagement = () => {
  const [activeTab, setActiveTab] = useState("email");
  const [isKeyDialogOpen, setIsKeyDialogOpen] = useState(false);
  
  const emailForm = useForm<z.infer<typeof emailIntegrationSchema>>({
    resolver: zodResolver(emailIntegrationSchema),
    defaultValues: {
      provider: "none",
      emailServer: "",
      username: "",
      password: "",
      port: "587",
      useTLS: true,
      defaultSender: "",
      enableSignature: true,
      signature: "",
    },
  });
  
  const calendarForm = useForm<z.infer<typeof calendarIntegrationSchema>>({
    resolver: zodResolver(calendarIntegrationSchema),
    defaultValues: {
      provider: "none",
      syncEnabled: false,
      syncFrequencyMinutes: "60",
      defaultReminder: "30",
      includeClientMeetings: true,
      includeInternalMeetings: true,
      includeDeadlines: true,
    },
  });
  
  const accountingForm = useForm<z.infer<typeof accountingIntegrationSchema>>({
    resolver: zodResolver(accountingIntegrationSchema),
    defaultValues: {
      provider: "none",
      apiKey: "",
      apiSecret: "",
      clientId: "",
      refreshToken: "",
      syncEnabled: false,
      syncFrequencyHours: "24",
    },
  });
  
  const apiKeyForm = useForm<z.infer<typeof apiKeySchema>>({
    resolver: zodResolver(apiKeySchema),
    defaultValues: {
      name: "",
      key: "",
      permissions: {
        read: true,
        write: false,
        delete: false,
      },
      expiresAt: "",
    },
  });
  
  const onEmailSubmit = (values: z.infer<typeof emailIntegrationSchema>) => {
    toast({
      title: "Email integration updated",
      description: `Email integration settings for ${values.provider} have been saved.`,
    });
  };
  
  const onCalendarSubmit = (values: z.infer<typeof calendarIntegrationSchema>) => {
    toast({
      title: "Calendar integration updated",
      description: `Calendar integration settings for ${values.provider} have been saved.`,
    });
  };
  
  const onAccountingSubmit = (values: z.infer<typeof accountingIntegrationSchema>) => {
    toast({
      title: "Accounting integration updated",
      description: `Accounting integration settings for ${values.provider} have been saved.`,
    });
  };
  
  const onApiKeySubmit = (values: z.infer<typeof apiKeySchema>) => {
    toast({
      title: "API key created",
      description: `New API key "${values.name}" has been created.`,
    });
    
    setIsKeyDialogOpen(false);
    apiKeyForm.reset();
  };
  
  const handleDeleteKey = (id: number) => {
    toast({
      title: "API key deleted",
      description: `API key has been deleted.`,
    });
  };
  
  const generateApiKey = () => {
    const randomKey = "sk_" + Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
    apiKeyForm.setValue("key", randomKey);
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold">Integration Management</h2>
        <p className="text-muted-foreground">
          Configure integrations with external services and manage API keys
        </p>
      </div>
      
      <Separator />
      
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="email">Email Integration</TabsTrigger>
          <TabsTrigger value="calendar">Calendar Sync</TabsTrigger>
          <TabsTrigger value="accounting">Accounting Software</TabsTrigger>
          <TabsTrigger value="api">API Management</TabsTrigger>
        </TabsList>
        
        {/* Email Integration Tab */}
        <TabsContent value="email">
          <Card>
            <CardHeader>
              <CardTitle>Email Integration</CardTitle>
              <CardDescription>
                Configure email server settings for sending notifications and documents
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Form {...emailForm}>
                <form onSubmit={emailForm.handleSubmit(onEmailSubmit)} className="space-y-6">
                  <FormField
                    control={emailForm.control}
                    name="provider"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Email Provider</FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select email provider" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="none">None (No Integration)</SelectItem>
                            <SelectItem value="outlook">Microsoft Outlook</SelectItem>
                            <SelectItem value="gmail">Gmail</SelectItem>
                            <SelectItem value="smtp">Custom SMTP Server</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormDescription>
                          Choose your email service provider
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  {emailForm.watch("provider") === "smtp" && (
                    <div className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <FormField
                          control={emailForm.control}
                          name="emailServer"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>SMTP Server</FormLabel>
                              <FormControl>
                                <Input placeholder="smtp.example.com" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        
                        <FormField
                          control={emailForm.control}
                          name="port"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Port</FormLabel>
                              <FormControl>
                                <Input placeholder="587" type="number" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <FormField
                          control={emailForm.control}
                          name="username"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Username</FormLabel>
                              <FormControl>
                                <Input placeholder="user@example.com" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        
                        <FormField
                          control={emailForm.control}
                          name="password"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Password</FormLabel>
                              <FormControl>
                                <Input type="password" placeholder="••••••••" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                      
                      <FormField
                        control={emailForm.control}
                        name="useTLS"
                        render={({ field }) => (
                          <FormItem className="flex items-center justify-between rounded-lg border p-3">
                            <div>
                              <FormLabel className="text-base">Use TLS</FormLabel>
                              <FormDescription>
                                Enable Transport Layer Security for email
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
                  )}
                  
                  {emailForm.watch("provider") !== "none" && (
                    <div className="space-y-4">
                      <FormField
                        control={emailForm.control}
                        name="defaultSender"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Default Sender Email</FormLabel>
                            <FormControl>
                              <Input placeholder="audit@yourfirm.com" {...field} />
                            </FormControl>
                            <FormDescription>
                              Default email address to use as sender
                            </FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={emailForm.control}
                        name="enableSignature"
                        render={({ field }) => (
                          <FormItem className="flex items-center justify-between rounded-lg border p-3">
                            <div>
                              <FormLabel className="text-base">Email Signature</FormLabel>
                              <FormDescription>
                                Include signature in outgoing emails
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
                      
                      {emailForm.watch("enableSignature") && (
                        <FormField
                          control={emailForm.control}
                          name="signature"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Signature</FormLabel>
                              <FormControl>
                                <Input
                                  placeholder="Your signature text or HTML"
                                  {...field}
                                />
                              </FormControl>
                              <FormDescription>
                                Enter your email signature (HTML supported)
                              </FormDescription>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      )}
                      
                      <div className="flex justify-between">
                        <Button type="button" variant="outline">
                          Test Connection
                        </Button>
                        <Button type="submit">Save Email Settings</Button>
                      </div>
                    </div>
                  )}
                  
                  {emailForm.watch("provider") === "none" && (
                    <div className="text-center py-6">
                      <Mail className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
                      <h3 className="text-lg font-medium">No Email Integration Selected</h3>
                      <p className="text-muted-foreground">
                        Select an email provider to configure integration settings
                      </p>
                    </div>
                  )}
                </form>
              </Form>
            </CardContent>
          </Card>
        </TabsContent>
        
        {/* Calendar Sync Tab */}
        <TabsContent value="calendar">
          <Card>
            <CardHeader>
              <CardTitle>Calendar Synchronization</CardTitle>
              <CardDescription>
                Configure calendar integration for deadlines and meetings
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Form {...calendarForm}>
                <form onSubmit={calendarForm.handleSubmit(onCalendarSubmit)} className="space-y-6">
                  <FormField
                    control={calendarForm.control}
                    name="provider"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Calendar Provider</FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select calendar provider" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="none">None (No Integration)</SelectItem>
                            <SelectItem value="outlook">Microsoft Outlook</SelectItem>
                            <SelectItem value="google">Google Calendar</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormDescription>
                          Choose your calendar service provider
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  {calendarForm.watch("provider") !== "none" && (
                    <div className="space-y-4">
                      <FormField
                        control={calendarForm.control}
                        name="syncEnabled"
                        render={({ field }) => (
                          <FormItem className="flex items-center justify-between rounded-lg border p-3">
                            <div>
                              <FormLabel className="text-base">Enable Calendar Sync</FormLabel>
                              <FormDescription>
                                Synchronize deadlines and meetings with calendar
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
                      
                      {calendarForm.watch("syncEnabled") && (
                        <>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <FormField
                              control={calendarForm.control}
                              name="syncFrequencyMinutes"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>Sync Frequency (minutes)</FormLabel>
                                  <Select
                                    onValueChange={field.onChange}
                                    defaultValue={field.value}
                                  >
                                    <FormControl>
                                      <SelectTrigger>
                                        <SelectValue placeholder="Select sync frequency" />
                                      </SelectTrigger>
                                    </FormControl>
                                    <SelectContent>
                                      <SelectItem value="15">15 minutes</SelectItem>
                                      <SelectItem value="30">30 minutes</SelectItem>
                                      <SelectItem value="60">60 minutes</SelectItem>
                                      <SelectItem value="120">2 hours</SelectItem>
                                      <SelectItem value="360">6 hours</SelectItem>
                                    </SelectContent>
                                  </Select>
                                  <FormDescription>
                                    How often to synchronize with your calendar
                                  </FormDescription>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                            
                            <FormField
                              control={calendarForm.control}
                              name="defaultReminder"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>Default Reminder (minutes)</FormLabel>
                                  <Select
                                    onValueChange={field.onChange}
                                    defaultValue={field.value}
                                  >
                                    <FormControl>
                                      <SelectTrigger>
                                        <SelectValue placeholder="Select default reminder" />
                                      </SelectTrigger>
                                    </FormControl>
                                    <SelectContent>
                                      <SelectItem value="10">10 minutes</SelectItem>
                                      <SelectItem value="30">30 minutes</SelectItem>
                                      <SelectItem value="60">1 hour</SelectItem>
                                      <SelectItem value="120">2 hours</SelectItem>
                                      <SelectItem value="1440">1 day</SelectItem>
                                    </SelectContent>
                                  </Select>
                                  <FormDescription>
                                    Default reminder time for calendar events
                                  </FormDescription>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                          </div>
                          
                          <h3 className="text-lg font-medium">Sync Options</h3>
                          <div className="space-y-3">
                            <FormField
                              control={calendarForm.control}
                              name="includeClientMeetings"
                              render={({ field }) => (
                                <FormItem className="flex items-center justify-between rounded-lg border p-3">
                                  <FormLabel className="text-base">Client Meetings</FormLabel>
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
                              control={calendarForm.control}
                              name="includeInternalMeetings"
                              render={({ field }) => (
                                <FormItem className="flex items-center justify-between rounded-lg border p-3">
                                  <FormLabel className="text-base">Internal Meetings</FormLabel>
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
                              control={calendarForm.control}
                              name="includeDeadlines"
                              render={({ field }) => (
                                <FormItem className="flex items-center justify-between rounded-lg border p-3">
                                  <FormLabel className="text-base">Task Deadlines</FormLabel>
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
                          
                          <div className="flex justify-between">
                            <Button 
                              type="button" 
                              variant="outline"
                              className="flex items-center"
                            >
                              <RotateCw className="mr-2 h-4 w-4" /> Sync Now
                            </Button>
                            <Button type="submit">Save Calendar Settings</Button>
                          </div>
                        </>
                      )}
                    </div>
                  )}
                  
                  {calendarForm.watch("provider") === "none" && (
                    <div className="text-center py-6">
                      <Calendar className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
                      <h3 className="text-lg font-medium">No Calendar Integration Selected</h3>
                      <p className="text-muted-foreground">
                        Select a calendar provider to configure integration settings
                      </p>
                    </div>
                  )}
                </form>
              </Form>
            </CardContent>
          </Card>
        </TabsContent>
        
        {/* Accounting Software Tab */}
        <TabsContent value="accounting">
          <Card>
            <CardHeader>
              <CardTitle>Accounting Software Integration</CardTitle>
              <CardDescription>
                Configure connection to external accounting software
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Form {...accountingForm}>
                <form onSubmit={accountingForm.handleSubmit(onAccountingSubmit)} className="space-y-6">
                  <FormField
                    control={accountingForm.control}
                    name="provider"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Accounting Software</FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select accounting software" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="none">None (No Integration)</SelectItem>
                            <SelectItem value="quickbooks">QuickBooks</SelectItem>
                            <SelectItem value="xero">Xero</SelectItem>
                            <SelectItem value="tally">Tally</SelectItem>
                            <SelectItem value="custom">Custom API</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormDescription>
                          Choose your accounting software provider
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  {accountingForm.watch("provider") !== "none" && (
                    <div className="space-y-4">
                      <div className="grid grid-cols-1 gap-4">
                        <FormField
                          control={accountingForm.control}
                          name="apiKey"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>API Key</FormLabel>
                              <FormControl>
                                <Input type="password" placeholder="••••••••••••••••" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        
                        <FormField
                          control={accountingForm.control}
                          name="apiSecret"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>API Secret</FormLabel>
                              <FormControl>
                                <Input type="password" placeholder="••••••••••••••••" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        
                        {(accountingForm.watch("provider") === "quickbooks" || accountingForm.watch("provider") === "xero") && (
                          <>
                            <FormField
                              control={accountingForm.control}
                              name="clientId"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>Client ID</FormLabel>
                                  <FormControl>
                                    <Input placeholder="Client ID" {...field} />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                            
                            <FormField
                              control={accountingForm.control}
                              name="refreshToken"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>Refresh Token</FormLabel>
                                  <FormControl>
                                    <Input type="password" placeholder="••••••••••••••••" {...field} />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                          </>
                        )}
                      </div>
                      
                      <FormField
                        control={accountingForm.control}
                        name="syncEnabled"
                        render={({ field }) => (
                          <FormItem className="flex items-center justify-between rounded-lg border p-3">
                            <div>
                              <FormLabel className="text-base">Enable Data Synchronization</FormLabel>
                              <FormDescription>
                                Automatically synchronize data with accounting software
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
                      
                      {accountingForm.watch("syncEnabled") && (
                        <FormField
                          control={accountingForm.control}
                          name="syncFrequencyHours"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Sync Frequency (hours)</FormLabel>
                              <Select
                                onValueChange={field.onChange}
                                defaultValue={field.value}
                              >
                                <FormControl>
                                  <SelectTrigger>
                                    <SelectValue placeholder="Select sync frequency" />
                                  </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                  <SelectItem value="6">6 hours</SelectItem>
                                  <SelectItem value="12">12 hours</SelectItem>
                                  <SelectItem value="24">24 hours</SelectItem>
                                  <SelectItem value="48">48 hours</SelectItem>
                                </SelectContent>
                              </Select>
                              <FormDescription>
                                How often to synchronize data
                              </FormDescription>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      )}
                      
                      <div className="flex justify-between">
                        <Button type="button" variant="outline">
                          Verify Connection
                        </Button>
                        <Button type="submit">Save Accounting Settings</Button>
                      </div>
                    </div>
                  )}
                  
                  {accountingForm.watch("provider") === "none" && (
                    <div className="text-center py-6">
                      <FileText className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
                      <h3 className="text-lg font-medium">No Accounting Integration Selected</h3>
                      <p className="text-muted-foreground">
                        Select an accounting software provider to configure integration settings
                      </p>
                    </div>
                  )}
                </form>
              </Form>
            </CardContent>
          </Card>
        </TabsContent>
        
        {/* API Management Tab */}
        <TabsContent value="api">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>API Keys Management</CardTitle>
                <CardDescription>
                  Manage API keys for external integrations and applications
                </CardDescription>
              </div>
              <Dialog open={isKeyDialogOpen} onOpenChange={setIsKeyDialogOpen}>
                <DialogTrigger asChild>
                  <Button>
                    <FilePlus className="mr-2 h-4 w-4" /> Generate API Key
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Create New API Key</DialogTitle>
                    <DialogDescription>
                      Generate a new API key for external integrations
                    </DialogDescription>
                  </DialogHeader>
                  
                  <Form {...apiKeyForm}>
                    <form onSubmit={apiKeyForm.handleSubmit(onApiKeySubmit)} className="space-y-4">
                      <FormField
                        control={apiKeyForm.control}
                        name="name"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Key Name</FormLabel>
                            <FormControl>
                              <Input placeholder="Dashboard Integration" {...field} />
                            </FormControl>
                            <FormDescription>
                              Identify what this API key will be used for
                            </FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={apiKeyForm.control}
                        name="key"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>API Key</FormLabel>
                            <div className="flex space-x-2">
                              <FormControl>
                                <Input placeholder="API key will be generated" readOnly {...field} />
                              </FormControl>
                              <Button 
                                type="button" 
                                variant="outline" 
                                onClick={generateApiKey}
                              >
                                Generate
                              </Button>
                            </div>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={apiKeyForm.control}
                        name="expiresAt"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Expiration (Optional)</FormLabel>
                            <FormControl>
                              <Input type="date" {...field} />
                            </FormControl>
                            <FormDescription>
                              Leave blank for non-expiring key
                            </FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <div className="space-y-2">
                        <h3 className="text-sm font-medium">Permissions</h3>
                        <div className="grid grid-cols-3 gap-2">
                          <FormField
                            control={apiKeyForm.control}
                            name="permissions.read"
                            render={({ field }) => (
                              <FormItem className="flex items-center space-x-2">
                                <FormControl>
                                  <Switch
                                    checked={field.value}
                                    onCheckedChange={field.onChange}
                                  />
                                </FormControl>
                                <FormLabel>Read</FormLabel>
                              </FormItem>
                            )}
                          />
                          
                          <FormField
                            control={apiKeyForm.control}
                            name="permissions.write"
                            render={({ field }) => (
                              <FormItem className="flex items-center space-x-2">
                                <FormControl>
                                  <Switch
                                    checked={field.value}
                                    onCheckedChange={field.onChange}
                                  />
                                </FormControl>
                                <FormLabel>Write</FormLabel>
                              </FormItem>
                            )}
                          />
                          
                          <FormField
                            control={apiKeyForm.control}
                            name="permissions.delete"
                            render={({ field }) => (
                              <FormItem className="flex items-center space-x-2">
                                <FormControl>
                                  <Switch
                                    checked={field.value}
                                    onCheckedChange={field.onChange}
                                  />
                                </FormControl>
                                <FormLabel>Delete</FormLabel>
                              </FormItem>
                            )}
                          />
                        </div>
                      </div>
                      
                      <DialogFooter>
                        <Button type="submit">Create API Key</Button>
                      </DialogFooter>
                    </form>
                  </Form>
                </DialogContent>
              </Dialog>
            </CardHeader>
            <CardContent>
              {apiKeys.length === 0 ? (
                <div className="text-center py-6">
                  <KeyRound className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
                  <h3 className="text-lg font-medium">No API Keys Found</h3>
                  <p className="text-muted-foreground mb-4">
                    Create your first API key to enable external integrations
                  </p>
                  <Button onClick={() => setIsKeyDialogOpen(true)}>
                    Generate API Key
                  </Button>
                </div>
              ) : (
                <div className="space-y-4">
                  {apiKeys.map((key) => (
                    <Card key={key.id} className="overflow-hidden">
                      <CardHeader className="pb-2">
                        <div className="flex justify-between items-center">
                          <CardTitle className="text-base">{key.name}</CardTitle>
                          <Button 
                            variant="destructive" 
                            size="sm"
                            onClick={() => handleDeleteKey(key.id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </CardHeader>
                      <CardContent className="pb-2">
                        <div className="flex items-center space-x-2 mb-2">
                          <div className="text-sm font-mono bg-muted p-1 px-2 rounded">
                            {key.key}
                          </div>
                          <Button variant="outline" size="sm">
                            Copy
                          </Button>
                        </div>
                        <div className="flex items-center text-sm text-muted-foreground space-x-4">
                          <span>Created: {new Date(key.created).toLocaleDateString()}</span>
                          <span>Last used: {new Date(key.lastUsed).toLocaleDateString()}</span>
                        </div>
                      </CardContent>
                      <CardFooter className="bg-muted/50 py-2 flex items-center justify-between">
                        <div className="flex space-x-2">
                          <span className={`text-xs px-2 py-0.5 rounded-full ${key.permissions.read ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-800"}`}>
                            Read
                          </span>
                          <span className={`text-xs px-2 py-0.5 rounded-full ${key.permissions.write ? "bg-blue-100 text-blue-800" : "bg-gray-100 text-gray-800"}`}>
                            Write
                          </span>
                          <span className={`text-xs px-2 py-0.5 rounded-full ${key.permissions.delete ? "bg-red-100 text-red-800" : "bg-gray-100 text-gray-800"}`}>
                            Delete
                          </span>
                        </div>
                        <Button variant="ghost" size="sm" className="text-sm">
                          View Logs <ExternalLink className="ml-1 h-3 w-3" />
                        </Button>
                      </CardFooter>
                    </Card>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default IntegrationManagement;
