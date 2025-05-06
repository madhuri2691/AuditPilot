
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
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
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
import { Switch } from "@/components/ui/switch";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Badge } from "@/components/ui/badge";
import { toast } from "@/hooks/use-toast";
import { Trash2, Edit, Check, Copy, Plus, RefreshCw } from "lucide-react";

// Define validation schema for API key form
const apiKeyFormSchema = z.object({
  name: z.string().min(2, {
    message: "Name must be at least 2 characters.",
  }),
  description: z.string().optional(),
  expiry: z.string().optional(),
});

// Define validation schema for email integration
const emailIntegrationSchema = z.object({
  smtpServer: z.string().min(1, {
    message: "SMTP server is required.",
  }),
  smtpPort: z.coerce.number().int().positive().min(1, {
    message: "SMTP port must be a positive number.",
  }),
  username: z.string().min(1, {
    message: "Username is required.",
  }),
  password: z.string().min(1, {
    message: "Password is required.",
  }),
  fromEmail: z.string().email({
    message: "From email must be a valid email address.",
  }),
  fromName: z.string().min(1, {
    message: "From name is required.",
  }),
});

// Define validation schema for accounting integration
const accountingIntegrationSchema = z.object({
  provider: z.string().min(1, {
    message: "Provider is required.",
  }),
  apiKey: z.string().min(1, {
    message: "API key is required.",
  }),
  apiSecret: z.string().optional(),
  tokenUrl: z.string().url().optional(),
  callbackUrl: z.string().url().optional(),
  autoSync: z.boolean().default(false),
  syncInterval: z.coerce.number().int().positive().optional(),
});

// Define validation schema for calendar integration
const calendarIntegrationSchema = z.object({
  provider: z.string().min(1, {
    message: "Provider is required.",
  }),
  clientId: z.string().min(1, {
    message: "Client ID is required.",
  }),
  clientSecret: z.string().min(1, {
    message: "Client Secret is required.",
  }),
  redirectUri: z.string().url({
    message: "Redirect URI must be a valid URL.",
  }),
  scope: z.string().min(1, {
    message: "Scope is required.",
  }),
  autoSync: z.boolean().default(false),
  defaultCalendar: z.string().optional(),
});

// Mock data for API keys
const mockApiKeys = [
  {
    id: "1",
    name: "Client Portal Integration",
    key: "sk_test_abcdefghijklmnopqrstuvwxyz123456",
    created: "2023-05-01T12:00:00Z",
    lastUsed: "2023-05-15T08:12:34Z",
    expiry: "2024-05-01T12:00:00Z",
    description: "Used for client portal integration",
  },
  {
    id: "2",
    name: "Accounting System API",
    key: "sk_test_zyxwvutsrqponmlkjihgfedcba654321",
    created: "2023-06-15T09:30:00Z",
    lastUsed: "2023-06-20T14:22:11Z",
    expiry: "2024-06-15T09:30:00Z",
    description: "For accounting software integration",
  },
];

// Mock data for connected services
const mockConnectedServices = {
  email: {
    connected: true,
    provider: "SMTP",
    lastSync: "2023-07-01T10:15:22Z",
    details: {
      smtpServer: "smtp.example.com",
      smtpPort: 587,
      username: "notifications@yourfirm.com",
      password: "********",
      fromEmail: "notifications@yourfirm.com",
      fromName: "Audit App Notifications",
    },
  },
  accounting: {
    connected: false,
    provider: "",
    lastSync: null,
    details: {
      provider: "",
      apiKey: "",
      apiSecret: "",
      tokenUrl: "",
      callbackUrl: "",
      autoSync: false,
      syncInterval: 24,
    },
  },
  calendar: {
    connected: true,
    provider: "Google Calendar",
    lastSync: "2023-07-12T08:45:11Z",
    details: {
      provider: "Google Calendar",
      clientId: "google-client-id-example",
      clientSecret: "********",
      redirectUri: "https://yourapp.com/auth/callback",
      scope: "https://www.googleapis.com/auth/calendar",
      autoSync: true,
      defaultCalendar: "Audit Deadlines",
    },
  },
};

const IntegrationManagement = () => {
  const [apiKeys, setApiKeys] = useState(mockApiKeys);
  const [connectedServices, setConnectedServices] = useState(mockConnectedServices);
  const [showAPIKey, setShowAPIKey] = useState<string | null>(null);
  const [isAddingKey, setIsAddingKey] = useState(false);
  const [isEditingEmail, setIsEditingEmail] = useState(false);
  const [isEditingAccounting, setIsEditingAccounting] = useState(false);
  const [isEditingCalendar, setIsEditingCalendar] = useState(false);

  // Form handling for API keys
  const apiKeyForm = useForm<z.infer<typeof apiKeyFormSchema>>({
    resolver: zodResolver(apiKeyFormSchema),
    defaultValues: {
      name: "",
      description: "",
      expiry: "",
    },
  });

  // Form handling for email integration
  const emailForm = useForm<z.infer<typeof emailIntegrationSchema>>({
    resolver: zodResolver(emailIntegrationSchema),
    defaultValues: {
      smtpServer: connectedServices.email.details.smtpServer,
      smtpPort: connectedServices.email.details.smtpPort,
      username: connectedServices.email.details.username,
      password: connectedServices.email.details.password,
      fromEmail: connectedServices.email.details.fromEmail,
      fromName: connectedServices.email.details.fromName,
    },
  });

  // Form handling for accounting integration
  const accountingForm = useForm<z.infer<typeof accountingIntegrationSchema>>({
    resolver: zodResolver(accountingIntegrationSchema),
    defaultValues: {
      provider: connectedServices.accounting.details.provider,
      apiKey: connectedServices.accounting.details.apiKey,
      apiSecret: connectedServices.accounting.details.apiSecret,
      tokenUrl: connectedServices.accounting.details.tokenUrl,
      callbackUrl: connectedServices.accounting.details.callbackUrl,
      autoSync: connectedServices.accounting.details.autoSync,
      syncInterval: connectedServices.accounting.details.syncInterval,
    },
  });

  // Form handling for calendar integration
  const calendarForm = useForm<z.infer<typeof calendarIntegrationSchema>>({
    resolver: zodResolver(calendarIntegrationSchema),
    defaultValues: {
      provider: connectedServices.calendar.details.provider,
      clientId: connectedServices.calendar.details.clientId,
      clientSecret: connectedServices.calendar.details.clientSecret,
      redirectUri: connectedServices.calendar.details.redirectUri,
      scope: connectedServices.calendar.details.scope,
      autoSync: connectedServices.calendar.details.autoSync,
      defaultCalendar: connectedServices.calendar.details.defaultCalendar,
    },
  });

  // Handle API key submission
  const onSubmitAPIKey = (values: z.infer<typeof apiKeyFormSchema>) => {
    const newApiKey = {
      id: `${apiKeys.length + 1}`,
      name: values.name,
      key: `sk_test_${Math.random().toString(36).substring(2, 15)}${Math.random().toString(36).substring(2, 15)}`,
      created: new Date().toISOString(),
      lastUsed: null,
      expiry: values.expiry ? new Date(values.expiry).toISOString() : null,
      description: values.description || "",
    };

    setApiKeys([...apiKeys, newApiKey]);
    setIsAddingKey(false);
    apiKeyForm.reset();

    toast({
      title: "API Key Created",
      description: "Your new API key has been created successfully.",
    });
  };

  // Handle email integration submission
  const onSubmitEmailIntegration = (values: z.infer<typeof emailIntegrationSchema>) => {
    setConnectedServices({
      ...connectedServices,
      email: {
        ...connectedServices.email,
        connected: true,
        lastSync: new Date().toISOString(),
        details: {
          smtpServer: values.smtpServer,
          smtpPort: values.smtpPort,
          username: values.username,
          password: values.password,
          fromEmail: values.fromEmail,
          fromName: values.fromName,
        },
      },
    });

    setIsEditingEmail(false);
    toast({
      title: "Email Integration Updated",
      description: "Your email integration settings have been updated.",
    });
  };

  // Handle accounting integration submission
  const onSubmitAccountingIntegration = (values: z.infer<typeof accountingIntegrationSchema>) => {
    setConnectedServices({
      ...connectedServices,
      accounting: {
        ...connectedServices.accounting,
        connected: true,
        provider: values.provider,
        lastSync: new Date().toISOString(),
        details: {
          provider: values.provider,
          apiKey: values.apiKey,
          apiSecret: values.apiSecret || "",
          tokenUrl: values.tokenUrl || "",
          callbackUrl: values.callbackUrl || "",
          autoSync: values.autoSync,
          syncInterval: values.syncInterval || 24,
        },
      },
    });

    setIsEditingAccounting(false);
    toast({
      title: "Accounting Integration Connected",
      description: `Your ${values.provider} integration has been set up successfully.`,
    });
  };

  // Handle calendar integration submission
  const onSubmitCalendarIntegration = (values: z.infer<typeof calendarIntegrationSchema>) => {
    setConnectedServices({
      ...connectedServices,
      calendar: {
        ...connectedServices.calendar,
        connected: true,
        provider: values.provider,
        lastSync: new Date().toISOString(),
        details: {
          provider: values.provider,
          clientId: values.clientId,
          clientSecret: values.clientSecret,
          redirectUri: values.redirectUri,
          scope: values.scope,
          autoSync: values.autoSync,
          defaultCalendar: values.defaultCalendar || "",
        },
      },
    });

    setIsEditingCalendar(false);
    toast({
      title: "Calendar Integration Updated",
      description: "Your calendar integration settings have been updated.",
    });
  };

  // Toggle API key visibility
  const toggleShowAPIKey = (keyId: string) => {
    if (showAPIKey === keyId) {
      setShowAPIKey(null);
    } else {
      setShowAPIKey(keyId);
    }
  };

  // Copy API key to clipboard
  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: "Copied to Clipboard",
      description: "API key copied to clipboard.",
    });
  };

  // Delete API key
  const deleteApiKey = (keyId: string) => {
    setApiKeys(apiKeys.filter((key) => key.id !== keyId));
    toast({
      title: "API Key Deleted",
      description: "The API key has been deleted successfully.",
    });
  };

  // Disconnect a service
  const disconnectService = (serviceType: "email" | "accounting" | "calendar") => {
    setConnectedServices({
      ...connectedServices,
      [serviceType]: {
        ...connectedServices[serviceType],
        connected: false,
        lastSync: null,
      },
    });

    toast({
      title: "Service Disconnected",
      description: `${serviceType.charAt(0).toUpperCase() + serviceType.slice(1)} integration has been disconnected.`,
    });
  };

  // Manually sync a service
  const syncService = (serviceType: "email" | "accounting" | "calendar") => {
    setConnectedServices({
      ...connectedServices,
      [serviceType]: {
        ...connectedServices[serviceType],
        lastSync: new Date().toISOString(),
      },
    });

    toast({
      title: "Sync Complete",
      description: `${serviceType.charAt(0).toUpperCase() + serviceType.slice(1)} integration has been synced.`,
    });
  };

  // Format date for display
  const formatDate = (dateString: string | null) => {
    if (!dateString) return "Never";
    return new Date(dateString).toLocaleString();
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Integration Management</CardTitle>
        <CardDescription>
          Manage integrations with external services and API keys
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="api-keys">
          <TabsList className="mb-4">
            <TabsTrigger value="api-keys">API Keys</TabsTrigger>
            <TabsTrigger value="services">Connected Services</TabsTrigger>
          </TabsList>

          <TabsContent value="api-keys">
            <div className="mb-4 flex justify-between items-center">
              <h3 className="text-lg font-medium">API Keys</h3>
              <Dialog open={isAddingKey} onOpenChange={setIsAddingKey}>
                <DialogTrigger asChild>
                  <Button>
                    <Plus className="mr-2 h-4 w-4" />
                    Create API Key
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Create New API Key</DialogTitle>
                    <DialogDescription>
                      API keys allow secure access to the application's API.
                    </DialogDescription>
                  </DialogHeader>
                  <Form {...apiKeyForm}>
                    <form onSubmit={apiKeyForm.handleSubmit(onSubmitAPIKey)} className="space-y-4">
                      <FormField
                        control={apiKeyForm.control}
                        name="name"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Name</FormLabel>
                            <FormControl>
                              <Input placeholder="Integration name" {...field} />
                            </FormControl>
                            <FormDescription>
                              A descriptive name for this API key
                            </FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={apiKeyForm.control}
                        name="description"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Description (Optional)</FormLabel>
                            <FormControl>
                              <Input placeholder="What this key will be used for" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={apiKeyForm.control}
                        name="expiry"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Expiry Date (Optional)</FormLabel>
                            <FormControl>
                              <Input type="date" {...field} />
                            </FormControl>
                            <FormDescription>
                              When this key should expire
                            </FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <DialogFooter>
                        <Button type="submit">Create API Key</Button>
                      </DialogFooter>
                    </form>
                  </Form>
                </DialogContent>
              </Dialog>
            </div>

            <div className="space-y-4">
              {apiKeys.map((apiKey) => (
                <div key={apiKey.id} className="border rounded-lg p-4 space-y-2">
                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className="font-medium">{apiKey.name}</h4>
                      <p className="text-sm text-muted-foreground">
                        {apiKey.description}
                      </p>
                    </div>
                    <div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => deleteApiKey(apiKey.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                  <div className="bg-muted p-2 rounded flex items-center">
                    <code className="text-sm flex-1">
                      {showAPIKey === apiKey.id
                        ? apiKey.key
                        : apiKey.key.substring(0, 10) + "..." + apiKey.key.substring(apiKey.key.length - 5)}
                    </code>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => toggleShowAPIKey(apiKey.id)}
                      className="ml-2"
                    >
                      {showAPIKey === apiKey.id ? "Hide" : "Show"}
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => copyToClipboard(apiKey.key)}
                      className="ml-2"
                    >
                      <Copy className="h-4 w-4" />
                    </Button>
                  </div>
                  <div className="flex space-x-4 text-sm text-muted-foreground">
                    <div>
                      <span className="font-medium">Created:</span> {formatDate(apiKey.created)}
                    </div>
                    <div>
                      <span className="font-medium">Last Used:</span> {formatDate(apiKey.lastUsed)}
                    </div>
                    {apiKey.expiry && (
                      <div>
                        <span className="font-medium">Expires:</span> {formatDate(apiKey.expiry)}
                      </div>
                    )}
                  </div>
                </div>
              ))}
              {apiKeys.length === 0 && (
                <div className="text-center py-8 text-muted-foreground">
                  No API keys created yet. Click "Create API Key" to get started.
                </div>
              )}
            </div>
          </TabsContent>

          <TabsContent value="services">
            <div className="space-y-6">
              {/* Email Integration */}
              <div className="border rounded-lg p-4">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h4 className="font-medium text-lg">Email Integration</h4>
                    <p className="text-sm text-muted-foreground">
                      Configure email notifications and client communications
                    </p>
                  </div>
                  <Badge
                    variant={connectedServices.email.connected ? "secondary" : "outline"}
                  >
                    {connectedServices.email.connected ? "Connected" : "Disconnected"}
                  </Badge>
                </div>

                {connectedServices.email.connected ? (
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm font-medium">Provider</p>
                        <p>{connectedServices.email.provider}</p>
                      </div>
                      <div>
                        <p className="text-sm font-medium">SMTP Server</p>
                        <p>{connectedServices.email.details.smtpServer}</p>
                      </div>
                      <div>
                        <p className="text-sm font-medium">Username</p>
                        <p>{connectedServices.email.details.username}</p>
                      </div>
                      <div>
                        <p className="text-sm font-medium">From Email</p>
                        <p>{connectedServices.email.details.fromEmail}</p>
                      </div>
                      <div>
                        <p className="text-sm font-medium">Last Sync</p>
                        <p>{formatDate(connectedServices.email.lastSync)}</p>
                      </div>
                    </div>
                    <div className="flex space-x-2">
                      <Dialog open={isEditingEmail} onOpenChange={setIsEditingEmail}>
                        <DialogTrigger asChild>
                          <Button variant="outline" size="sm">
                            <Edit className="mr-2 h-4 w-4" />
                            Edit
                          </Button>
                        </DialogTrigger>
                        <DialogContent>
                          <DialogHeader>
                            <DialogTitle>Edit Email Integration</DialogTitle>
                            <DialogDescription>
                              Update your email server configuration
                            </DialogDescription>
                          </DialogHeader>
                          <Form {...emailForm}>
                            <form onSubmit={emailForm.handleSubmit(onSubmitEmailIntegration)} className="space-y-4">
                              <FormField
                                control={emailForm.control}
                                name="smtpServer"
                                render={({ field }) => (
                                  <FormItem>
                                    <FormLabel>SMTP Server</FormLabel>
                                    <FormControl>
                                      <Input {...field} />
                                    </FormControl>
                                    <FormMessage />
                                  </FormItem>
                                )}
                              />
                              <FormField
                                control={emailForm.control}
                                name="smtpPort"
                                render={({ field }) => (
                                  <FormItem>
                                    <FormLabel>SMTP Port</FormLabel>
                                    <FormControl>
                                      <Input type="number" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                  </FormItem>
                                )}
                              />
                              <div className="grid grid-cols-2 gap-4">
                                <FormField
                                  control={emailForm.control}
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
                                  control={emailForm.control}
                                  name="password"
                                  render={({ field }) => (
                                    <FormItem>
                                      <FormLabel>Password</FormLabel>
                                      <FormControl>
                                        <Input type="password" {...field} />
                                      </FormControl>
                                      <FormMessage />
                                    </FormItem>
                                  )}
                                />
                              </div>
                              <div className="grid grid-cols-2 gap-4">
                                <FormField
                                  control={emailForm.control}
                                  name="fromEmail"
                                  render={({ field }) => (
                                    <FormItem>
                                      <FormLabel>From Email</FormLabel>
                                      <FormControl>
                                        <Input type="email" {...field} />
                                      </FormControl>
                                      <FormMessage />
                                    </FormItem>
                                  )}
                                />
                                <FormField
                                  control={emailForm.control}
                                  name="fromName"
                                  render={({ field }) => (
                                    <FormItem>
                                      <FormLabel>From Name</FormLabel>
                                      <FormControl>
                                        <Input {...field} />
                                      </FormControl>
                                      <FormMessage />
                                    </FormItem>
                                  )}
                                />
                              </div>
                              <DialogFooter>
                                <Button type="submit">Save Changes</Button>
                              </DialogFooter>
                            </form>
                          </Form>
                        </DialogContent>
                      </Dialog>
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => syncService("email")}
                      >
                        <RefreshCw className="mr-2 h-4 w-4" />
                        Sync Now
                      </Button>
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => disconnectService("email")}
                      >
                        Disconnect
                      </Button>
                    </div>
                  </div>
                ) : (
                  <Dialog open={isEditingEmail} onOpenChange={setIsEditingEmail}>
                    <DialogTrigger asChild>
                      <Button>
                        <Plus className="mr-2 h-4 w-4" />
                        Connect Email Service
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Connect Email Service</DialogTitle>
                        <DialogDescription>
                          Set up your email integration for notifications
                        </DialogDescription>
                      </DialogHeader>
                      <Form {...emailForm}>
                        <form onSubmit={emailForm.handleSubmit(onSubmitEmailIntegration)} className="space-y-4">
                          {/* Same form fields as the edit form */}
                          <FormField
                            control={emailForm.control}
                            name="smtpServer"
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
                            name="smtpPort"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>SMTP Port</FormLabel>
                                <FormControl>
                                  <Input type="number" placeholder="587" {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          <div className="grid grid-cols-2 gap-4">
                            <FormField
                              control={emailForm.control}
                              name="username"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>Username</FormLabel>
                                  <FormControl>
                                    <Input placeholder="username@example.com" {...field} />
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
                                    <Input type="password" {...field} />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                          </div>
                          <div className="grid grid-cols-2 gap-4">
                            <FormField
                              control={emailForm.control}
                              name="fromEmail"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>From Email</FormLabel>
                                  <FormControl>
                                    <Input type="email" placeholder="notifications@yourcompany.com" {...field} />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                            <FormField
                              control={emailForm.control}
                              name="fromName"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>From Name</FormLabel>
                                  <FormControl>
                                    <Input placeholder="Audit App Notifications" {...field} />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                          </div>
                          <DialogFooter>
                            <Button type="submit">Connect</Button>
                          </DialogFooter>
                        </form>
                      </Form>
                    </DialogContent>
                  </Dialog>
                )}
              </div>

              {/* Accounting Software Integration */}
              <div className="border rounded-lg p-4">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h4 className="font-medium text-lg">Accounting Software</h4>
                    <p className="text-sm text-muted-foreground">
                      Connect with accounting software for data synchronization
                    </p>
                  </div>
                  <Badge
                    variant={connectedServices.accounting.connected ? "secondary" : "outline"}
                  >
                    {connectedServices.accounting.connected ? "Connected" : "Disconnected"}
                  </Badge>
                </div>

                {connectedServices.accounting.connected ? (
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm font-medium">Provider</p>
                        <p>{connectedServices.accounting.provider}</p>
                      </div>
                      <div>
                        <p className="text-sm font-medium">Auto-Sync</p>
                        <p>{connectedServices.accounting.details.autoSync ? "Enabled" : "Disabled"}</p>
                      </div>
                      <div>
                        <p className="text-sm font-medium">Sync Interval</p>
                        <p>{connectedServices.accounting.details.syncInterval} hours</p>
                      </div>
                      <div>
                        <p className="text-sm font-medium">Last Sync</p>
                        <p>{formatDate(connectedServices.accounting.lastSync)}</p>
                      </div>
                    </div>
                    <div className="flex space-x-2">
                      <Dialog open={isEditingAccounting} onOpenChange={setIsEditingAccounting}>
                        <DialogTrigger asChild>
                          <Button variant="outline" size="sm">
                            <Edit className="mr-2 h-4 w-4" />
                            Edit
                          </Button>
                        </DialogTrigger>
                        <DialogContent>
                          <DialogHeader>
                            <DialogTitle>Edit Accounting Integration</DialogTitle>
                            <DialogDescription>
                              Update your accounting software integration
                            </DialogDescription>
                          </DialogHeader>
                          <Form {...accountingForm}>
                            <form onSubmit={accountingForm.handleSubmit(onSubmitAccountingIntegration)} className="space-y-4">
                              {/* Form fields for accounting integration */}
                              <FormField
                                control={accountingForm.control}
                                name="provider"
                                render={({ field }) => (
                                  <FormItem>
                                    <FormLabel>Provider</FormLabel>
                                    <FormControl>
                                      <Input {...field} />
                                    </FormControl>
                                    <FormMessage />
                                  </FormItem>
                                )}
                              />
                              <div className="grid grid-cols-2 gap-4">
                                <FormField
                                  control={accountingForm.control}
                                  name="apiKey"
                                  render={({ field }) => (
                                    <FormItem>
                                      <FormLabel>API Key</FormLabel>
                                      <FormControl>
                                        <Input {...field} />
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
                                      <FormLabel>API Secret (Optional)</FormLabel>
                                      <FormControl>
                                        <Input type="password" {...field} />
                                      </FormControl>
                                      <FormMessage />
                                    </FormItem>
                                  )}
                                />
                              </div>
                              <div className="grid grid-cols-2 gap-4">
                                <FormField
                                  control={accountingForm.control}
                                  name="tokenUrl"
                                  render={({ field }) => (
                                    <FormItem>
                                      <FormLabel>Token URL (Optional)</FormLabel>
                                      <FormControl>
                                        <Input {...field} />
                                      </FormControl>
                                      <FormMessage />
                                    </FormItem>
                                  )}
                                />
                                <FormField
                                  control={accountingForm.control}
                                  name="callbackUrl"
                                  render={({ field }) => (
                                    <FormItem>
                                      <FormLabel>Callback URL (Optional)</FormLabel>
                                      <FormControl>
                                        <Input {...field} />
                                      </FormControl>
                                      <FormMessage />
                                    </FormItem>
                                  )}
                                />
                              </div>
                              <div className="grid grid-cols-2 gap-4">
                                <FormField
                                  control={accountingForm.control}
                                  name="autoSync"
                                  render={({ field }) => (
                                    <FormItem className="flex flex-row items-center justify-between">
                                      <div className="space-y-0.5">
                                        <FormLabel>Auto-Sync</FormLabel>
                                        <FormDescription>
                                          Automatically sync data
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
                                  control={accountingForm.control}
                                  name="syncInterval"
                                  render={({ field }) => (
                                    <FormItem>
                                      <FormLabel>Sync Interval (hours)</FormLabel>
                                      <FormControl>
                                        <Input type="number" {...field} />
                                      </FormControl>
                                      <FormMessage />
                                    </FormItem>
                                  )}
                                />
                              </div>
                              <DialogFooter>
                                <Button type="submit">Save Changes</Button>
                              </DialogFooter>
                            </form>
                          </Form>
                        </DialogContent>
                      </Dialog>
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => syncService("accounting")}
                      >
                        <RefreshCw className="mr-2 h-4 w-4" />
                        Sync Now
                      </Button>
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => disconnectService("accounting")}
                      >
                        Disconnect
                      </Button>
                    </div>
                  </div>
                ) : (
                  <Dialog open={isEditingAccounting} onOpenChange={setIsEditingAccounting}>
                    <DialogTrigger asChild>
                      <Button>
                        <Plus className="mr-2 h-4 w-4" />
                        Connect Accounting Software
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Connect Accounting Software</DialogTitle>
                        <DialogDescription>
                          Set up integration with your accounting software
                        </DialogDescription>
                      </DialogHeader>
                      <Form {...accountingForm}>
                        <form onSubmit={accountingForm.handleSubmit(onSubmitAccountingIntegration)} className="space-y-4">
                          {/* Same form fields as the edit form */}
                          <FormField
                            control={accountingForm.control}
                            name="provider"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Provider</FormLabel>
                                <FormControl>
                                  <Input placeholder="QuickBooks, Xero, etc." {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          {/* Same other fields as edit form */}
                          <div className="grid grid-cols-2 gap-4">
                            <FormField
                              control={accountingForm.control}
                              name="apiKey"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>API Key</FormLabel>
                                  <FormControl>
                                    <Input placeholder="Your API key" {...field} />
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
                                  <FormLabel>API Secret (Optional)</FormLabel>
                                  <FormControl>
                                    <Input type="password" placeholder="Your API secret" {...field} />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                          </div>
                          <div className="grid grid-cols-2 gap-4">
                            <FormField
                              control={accountingForm.control}
                              name="tokenUrl"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>Token URL (Optional)</FormLabel>
                                  <FormControl>
                                    <Input placeholder="https://api.example.com/token" {...field} />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                            <FormField
                              control={accountingForm.control}
                              name="callbackUrl"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>Callback URL (Optional)</FormLabel>
                                  <FormControl>
                                    <Input placeholder="https://yourapp.com/callback" {...field} />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                          </div>
                          <div className="grid grid-cols-2 gap-4">
                            <FormField
                              control={accountingForm.control}
                              name="autoSync"
                              render={({ field }) => (
                                <FormItem className="flex flex-row items-center justify-between">
                                  <div className="space-y-0.5">
                                    <FormLabel>Auto-Sync</FormLabel>
                                    <FormDescription>
                                      Automatically sync data
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
                              control={accountingForm.control}
                              name="syncInterval"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>Sync Interval (hours)</FormLabel>
                                  <FormControl>
                                    <Input type="number" placeholder="24" {...field} />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                          </div>
                          <DialogFooter>
                            <Button type="submit">Connect</Button>
                          </DialogFooter>
                        </form>
                      </Form>
                    </DialogContent>
                  </Dialog>
                )}
              </div>

              {/* Calendar Integration */}
              <div className="border rounded-lg p-4">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h4 className="font-medium text-lg">Calendar Integration</h4>
                    <p className="text-sm text-muted-foreground">
                      Sync deadlines and appointments with your calendar
                    </p>
                  </div>
                  <Badge
                    variant={connectedServices.calendar.connected ? "secondary" : "outline"}
                  >
                    {connectedServices.calendar.connected ? "Connected" : "Disconnected"}
                  </Badge>
                </div>

                {connectedServices.calendar.connected ? (
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm font-medium">Provider</p>
                        <p>{connectedServices.calendar.provider}</p>
                      </div>
                      <div>
                        <p className="text-sm font-medium">Auto-Sync</p>
                        <p>{connectedServices.calendar.details.autoSync ? "Enabled" : "Disabled"}</p>
                      </div>
                      <div>
                        <p className="text-sm font-medium">Default Calendar</p>
                        <p>{connectedServices.calendar.details.defaultCalendar || "None"}</p>
                      </div>
                      <div>
                        <p className="text-sm font-medium">Last Sync</p>
                        <p>{formatDate(connectedServices.calendar.lastSync)}</p>
                      </div>
                    </div>
                    <div className="flex space-x-2">
                      <Dialog open={isEditingCalendar} onOpenChange={setIsEditingCalendar}>
                        <DialogTrigger asChild>
                          <Button variant="outline" size="sm">
                            <Edit className="mr-2 h-4 w-4" />
                            Edit
                          </Button>
                        </DialogTrigger>
                        <DialogContent>
                          <DialogHeader>
                            <DialogTitle>Edit Calendar Integration</DialogTitle>
                            <DialogDescription>
                              Update your calendar integration settings
                            </DialogDescription>
                          </DialogHeader>
                          <Form {...calendarForm}>
                            <form onSubmit={calendarForm.handleSubmit(onSubmitCalendarIntegration)} className="space-y-4">
                              {/* Form fields for calendar integration */}
                              <FormField
                                control={calendarForm.control}
                                name="provider"
                                render={({ field }) => (
                                  <FormItem>
                                    <FormLabel>Provider</FormLabel>
                                    <FormControl>
                                      <Input {...field} />
                                    </FormControl>
                                    <FormMessage />
                                  </FormItem>
                                )}
                              />
                              <div className="grid grid-cols-2 gap-4">
                                <FormField
                                  control={calendarForm.control}
                                  name="clientId"
                                  render={({ field }) => (
                                    <FormItem>
                                      <FormLabel>Client ID</FormLabel>
                                      <FormControl>
                                        <Input {...field} />
                                      </FormControl>
                                      <FormMessage />
                                    </FormItem>
                                  )}
                                />
                                <FormField
                                  control={calendarForm.control}
                                  name="clientSecret"
                                  render={({ field }) => (
                                    <FormItem>
                                      <FormLabel>Client Secret</FormLabel>
                                      <FormControl>
                                        <Input type="password" {...field} />
                                      </FormControl>
                                      <FormMessage />
                                    </FormItem>
                                  )}
                                />
                              </div>
                              <FormField
                                control={calendarForm.control}
                                name="redirectUri"
                                render={({ field }) => (
                                  <FormItem>
                                    <FormLabel>Redirect URI</FormLabel>
                                    <FormControl>
                                      <Input {...field} />
                                    </FormControl>
                                    <FormMessage />
                                  </FormItem>
                                )}
                              />
                              <FormField
                                control={calendarForm.control}
                                name="scope"
                                render={({ field }) => (
                                  <FormItem>
                                    <FormLabel>Scope</FormLabel>
                                    <FormControl>
                                      <Input {...field} />
                                    </FormControl>
                                    <FormMessage />
                                  </FormItem>
                                )}
                              />
                              <div className="grid grid-cols-2 gap-4">
                                <FormField
                                  control={calendarForm.control}
                                  name="autoSync"
                                  render={({ field }) => (
                                    <FormItem className="flex flex-row items-center justify-between">
                                      <div className="space-y-0.5">
                                        <FormLabel>Auto-Sync</FormLabel>
                                        <FormDescription>
                                          Automatically sync calendar events
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
                                  control={calendarForm.control}
                                  name="defaultCalendar"
                                  render={({ field }) => (
                                    <FormItem>
                                      <FormLabel>Default Calendar (Optional)</FormLabel>
                                      <FormControl>
                                        <Input {...field} />
                                      </FormControl>
                                      <FormMessage />
                                    </FormItem>
                                  )}
                                />
                              </div>
                              <DialogFooter>
                                <Button type="submit">Save Changes</Button>
                              </DialogFooter>
                            </form>
                          </Form>
                        </DialogContent>
                      </Dialog>
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => syncService("calendar")}
                      >
                        <RefreshCw className="mr-2 h-4 w-4" />
                        Sync Now
                      </Button>
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => disconnectService("calendar")}
                      >
                        Disconnect
                      </Button>
                    </div>
                  </div>
                ) : (
                  <Dialog open={isEditingCalendar} onOpenChange={setIsEditingCalendar}>
                    <DialogTrigger asChild>
                      <Button>
                        <Plus className="mr-2 h-4 w-4" />
                        Connect Calendar
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Connect Calendar</DialogTitle>
                        <DialogDescription>
                          Set up calendar integration for deadlines and appointments
                        </DialogDescription>
                      </DialogHeader>
                      <Form {...calendarForm}>
                        <form onSubmit={calendarForm.handleSubmit(onSubmitCalendarIntegration)} className="space-y-4">
                          {/* Same form fields as the edit form */}
                          <FormField
                            control={calendarForm.control}
                            name="provider"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Provider</FormLabel>
                                <FormControl>
                                  <Input placeholder="Google Calendar, Outlook, etc." {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          <div className="grid grid-cols-2 gap-4">
                            <FormField
                              control={calendarForm.control}
                              name="clientId"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>Client ID</FormLabel>
                                  <FormControl>
                                    <Input placeholder="Your OAuth client ID" {...field} />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                            <FormField
                              control={calendarForm.control}
                              name="clientSecret"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>Client Secret</FormLabel>
                                  <FormControl>
                                    <Input type="password" placeholder="Your client secret" {...field} />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                          </div>
                          <FormField
                            control={calendarForm.control}
                            name="redirectUri"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Redirect URI</FormLabel>
                                <FormControl>
                                  <Input placeholder="https://yourapp.com/auth/callback" {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          <FormField
                            control={calendarForm.control}
                            name="scope"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Scope</FormLabel>
                                <FormControl>
                                  <Input placeholder="https://www.googleapis.com/auth/calendar" {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          <div className="grid grid-cols-2 gap-4">
                            <FormField
                              control={calendarForm.control}
                              name="autoSync"
                              render={({ field }) => (
                                <FormItem className="flex flex-row items-center justify-between">
                                  <div className="space-y-0.5">
                                    <FormLabel>Auto-Sync</FormLabel>
                                    <FormDescription>
                                      Automatically sync calendar events
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
                              control={calendarForm.control}
                              name="defaultCalendar"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>Default Calendar (Optional)</FormLabel>
                                  <FormControl>
                                    <Input placeholder="Audit Deadlines" {...field} />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                          </div>
                          <DialogFooter>
                            <Button type="submit">Connect</Button>
                          </DialogFooter>
                        </form>
                      </Form>
                    </DialogContent>
                  </Dialog>
                )}
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button variant="outline">Reset All Integrations</Button>
        <Button>Save Changes</Button>
      </CardFooter>
    </Card>
  );
};

export default IntegrationManagement;
