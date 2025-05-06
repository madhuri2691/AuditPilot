
import React, { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";

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
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "@/hooks/use-toast";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";

const portalSettingsSchema = z.object({
  enableClientPortal: z.boolean().default(true),
  allowClientRegistration: z.boolean().default(false),
  requireAdminApproval: z.boolean().default(true),
  sessionTimeoutMinutes: z.string().default("30"),
  maxLoginAttempts: z.string().default("5"),
});

const documentSharingSchema = z.object({
  shareAuditReports: z.boolean().default(true),
  shareFinancialStatements: z.boolean().default(true),
  shareTaxDocuments: z.boolean().default(true),
  shareWorkingPapers: z.boolean().default(false),
  allowClientUpload: z.boolean().default(true),
  reviewBeforeSharing: z.boolean().default(true),
  notifyOnDocumentShare: z.boolean().default(true),
  defaultDocumentAccess: z.enum(["read", "download", "none"]).default("read"),
});

const clientPermissionSchema = z.object({
  viewAuditStatus: z.boolean().default(true),
  viewTaskProgress: z.boolean().default(true),
  viewBillingInfo: z.boolean().default(true),
  viewTeamMembers: z.boolean().default(true),
  requestDeadlineChanges: z.boolean().default(false),
  addComments: z.boolean().default(true),
  receiveSummaryEmails: z.boolean().default(true),
  emailFrequency: z.enum(["daily", "weekly", "monthly", "never"]).default("weekly"),
});

const ClientPortalSettings = () => {
  const [activeTab, setActiveTab] = useState("general");
  
  const portalForm = useForm<z.infer<typeof portalSettingsSchema>>({
    resolver: zodResolver(portalSettingsSchema),
    defaultValues: {
      enableClientPortal: true,
      allowClientRegistration: false,
      requireAdminApproval: true,
      sessionTimeoutMinutes: "30",
      maxLoginAttempts: "5",
    },
  });
  
  const documentForm = useForm<z.infer<typeof documentSharingSchema>>({
    resolver: zodResolver(documentSharingSchema),
    defaultValues: {
      shareAuditReports: true,
      shareFinancialStatements: true,
      shareTaxDocuments: true,
      shareWorkingPapers: false,
      allowClientUpload: true,
      reviewBeforeSharing: true,
      notifyOnDocumentShare: true,
      defaultDocumentAccess: "read",
    },
  });
  
  const permissionForm = useForm<z.infer<typeof clientPermissionSchema>>({
    resolver: zodResolver(clientPermissionSchema),
    defaultValues: {
      viewAuditStatus: true,
      viewTaskProgress: true,
      viewBillingInfo: true,
      viewTeamMembers: true,
      requestDeadlineChanges: false,
      addComments: true,
      receiveSummaryEmails: true,
      emailFrequency: "weekly",
    },
  });
  
  const onPortalSubmit = (values: z.infer<typeof portalSettingsSchema>) => {
    toast({
      title: "Portal settings updated",
      description: "Your client portal settings have been saved.",
    });
  };
  
  const onDocumentSubmit = (values: z.infer<typeof documentSharingSchema>) => {
    toast({
      title: "Document sharing settings updated",
      description: "Your document sharing preferences have been saved.",
    });
  };
  
  const onPermissionSubmit = (values: z.infer<typeof clientPermissionSchema>) => {
    toast({
      title: "Client permissions updated",
      description: "Your client permission settings have been saved.",
    });
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold">Client Portal Settings</h2>
        <p className="text-muted-foreground">
          Configure how clients interact with your portal and what they can access
        </p>
      </div>
      
      <Separator />
      
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="general">General Settings</TabsTrigger>
          <TabsTrigger value="documents">Document Sharing</TabsTrigger>
          <TabsTrigger value="permissions">Client Permissions</TabsTrigger>
        </TabsList>
        
        {/* General Settings Tab */}
        <TabsContent value="general">
          <Card>
            <CardHeader>
              <CardTitle>Portal Configuration</CardTitle>
              <CardDescription>
                Control basic client portal functionality and security settings
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Form {...portalForm}>
                <form onSubmit={portalForm.handleSubmit(onPortalSubmit)} className="space-y-6">
                  <h3 className="text-lg font-medium">Access Settings</h3>
                  <div className="space-y-4">
                    <FormField
                      control={portalForm.control}
                      name="enableClientPortal"
                      render={({ field }) => (
                        <FormItem className="flex items-center justify-between rounded-lg border p-4">
                          <div>
                            <FormLabel className="text-base">Enable Client Portal</FormLabel>
                            <FormDescription>
                              Allow clients to access their portal
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
                      control={portalForm.control}
                      name="allowClientRegistration"
                      render={({ field }) => (
                        <FormItem className="flex items-center justify-between rounded-lg border p-4">
                          <div>
                            <FormLabel className="text-base">Allow Self-Registration</FormLabel>
                            <FormDescription>
                              Let clients register themselves for portal access
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
                      control={portalForm.control}
                      name="requireAdminApproval"
                      render={({ field }) => (
                        <FormItem className="flex items-center justify-between rounded-lg border p-4">
                          <div>
                            <FormLabel className="text-base">Require Admin Approval</FormLabel>
                            <FormDescription>
                              Require administrator approval for new registrations
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
                  
                  <Separator />
                  
                  <h3 className="text-lg font-medium">Security Settings</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <FormField
                      control={portalForm.control}
                      name="sessionTimeoutMinutes"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Session Timeout (minutes)</FormLabel>
                          <Select
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select timeout duration" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="15">15 minutes</SelectItem>
                              <SelectItem value="30">30 minutes</SelectItem>
                              <SelectItem value="60">60 minutes</SelectItem>
                              <SelectItem value="120">120 minutes</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormDescription>
                            Automatically log clients out after inactivity
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={portalForm.control}
                      name="maxLoginAttempts"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Maximum Login Attempts</FormLabel>
                          <Select
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select maximum attempts" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="3">3 attempts</SelectItem>
                              <SelectItem value="5">5 attempts</SelectItem>
                              <SelectItem value="10">10 attempts</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormDescription>
                            Lock account after this many failed login attempts
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  
                  <Button type="submit">Save Portal Settings</Button>
                </form>
              </Form>
            </CardContent>
          </Card>
        </TabsContent>
        
        {/* Document Sharing Tab */}
        <TabsContent value="documents">
          <Card>
            <CardHeader>
              <CardTitle>Document Sharing Preferences</CardTitle>
              <CardDescription>
                Control what documents clients can access and how they interact with them
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Form {...documentForm}>
                <form onSubmit={documentForm.handleSubmit(onDocumentSubmit)} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <h3 className="text-lg font-medium">Document Types</h3>
                      <FormField
                        control={documentForm.control}
                        name="shareAuditReports"
                        render={({ field }) => (
                          <FormItem className="flex items-center justify-between rounded-lg border p-3">
                            <FormLabel className="text-base">Audit Reports</FormLabel>
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
                        control={documentForm.control}
                        name="shareFinancialStatements"
                        render={({ field }) => (
                          <FormItem className="flex items-center justify-between rounded-lg border p-3">
                            <FormLabel className="text-base">Financial Statements</FormLabel>
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
                        control={documentForm.control}
                        name="shareTaxDocuments"
                        render={({ field }) => (
                          <FormItem className="flex items-center justify-between rounded-lg border p-3">
                            <FormLabel className="text-base">Tax Documents</FormLabel>
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
                        control={documentForm.control}
                        name="shareWorkingPapers"
                        render={({ field }) => (
                          <FormItem className="flex items-center justify-between rounded-lg border p-3">
                            <FormLabel className="text-base">Working Papers</FormLabel>
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
                    
                    <div className="space-y-4">
                      <h3 className="text-lg font-medium">Sharing Options</h3>
                      <FormField
                        control={documentForm.control}
                        name="allowClientUpload"
                        render={({ field }) => (
                          <FormItem className="flex items-center justify-between rounded-lg border p-3">
                            <FormLabel className="text-base">Allow Client Uploads</FormLabel>
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
                        control={documentForm.control}
                        name="reviewBeforeSharing"
                        render={({ field }) => (
                          <FormItem className="flex items-center justify-between rounded-lg border p-3">
                            <FormLabel className="text-base">Review Before Sharing</FormLabel>
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
                        control={documentForm.control}
                        name="notifyOnDocumentShare"
                        render={({ field }) => (
                          <FormItem className="flex items-center justify-between rounded-lg border p-3">
                            <FormLabel className="text-base">Notify on Document Share</FormLabel>
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
                        control={documentForm.control}
                        name="defaultDocumentAccess"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Default Document Access</FormLabel>
                            <Select
                              onValueChange={field.onChange}
                              defaultValue={field.value}
                            >
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Select default access" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                <SelectItem value="read">View Only</SelectItem>
                                <SelectItem value="download">Download Allowed</SelectItem>
                                <SelectItem value="none">No Access (Manual Share)</SelectItem>
                              </SelectContent>
                            </Select>
                            <FormDescription>
                              Default access level for shared documents
                            </FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  </div>
                  
                  <Button type="submit">Save Document Settings</Button>
                </form>
              </Form>
            </CardContent>
          </Card>
        </TabsContent>
        
        {/* Client Permissions Tab */}
        <TabsContent value="permissions">
          <Card>
            <CardHeader>
              <CardTitle>Client Permissions</CardTitle>
              <CardDescription>
                Configure what information and capabilities clients have in their portal
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Form {...permissionForm}>
                <form onSubmit={permissionForm.handleSubmit(onPermissionSubmit)} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <h3 className="text-lg font-medium">View Permissions</h3>
                      <FormField
                        control={permissionForm.control}
                        name="viewAuditStatus"
                        render={({ field }) => (
                          <FormItem className="flex items-center justify-between rounded-lg border p-3">
                            <FormLabel className="text-base">View Audit Status</FormLabel>
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
                        control={permissionForm.control}
                        name="viewTaskProgress"
                        render={({ field }) => (
                          <FormItem className="flex items-center justify-between rounded-lg border p-3">
                            <FormLabel className="text-base">View Task Progress</FormLabel>
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
                        control={permissionForm.control}
                        name="viewBillingInfo"
                        render={({ field }) => (
                          <FormItem className="flex items-center justify-between rounded-lg border p-3">
                            <FormLabel className="text-base">View Billing Information</FormLabel>
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
                        control={permissionForm.control}
                        name="viewTeamMembers"
                        render={({ field }) => (
                          <FormItem className="flex items-center justify-between rounded-lg border p-3">
                            <FormLabel className="text-base">View Team Members</FormLabel>
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
                    
                    <div className="space-y-4">
                      <h3 className="text-lg font-medium">Interaction Permissions</h3>
                      <FormField
                        control={permissionForm.control}
                        name="requestDeadlineChanges"
                        render={({ field }) => (
                          <FormItem className="flex items-center justify-between rounded-lg border p-3">
                            <FormLabel className="text-base">Request Deadline Changes</FormLabel>
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
                        control={permissionForm.control}
                        name="addComments"
                        render={({ field }) => (
                          <FormItem className="flex items-center justify-between rounded-lg border p-3">
                            <FormLabel className="text-base">Add Comments</FormLabel>
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
                        control={permissionForm.control}
                        name="receiveSummaryEmails"
                        render={({ field }) => (
                          <FormItem className="flex items-center justify-between rounded-lg border p-3">
                            <FormLabel className="text-base">Receive Summary Emails</FormLabel>
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
                        control={permissionForm.control}
                        name="emailFrequency"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Email Frequency</FormLabel>
                            <Select
                              onValueChange={field.onChange}
                              defaultValue={field.value}
                            >
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Select email frequency" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                <SelectItem value="daily">Daily</SelectItem>
                                <SelectItem value="weekly">Weekly</SelectItem>
                                <SelectItem value="monthly">Monthly</SelectItem>
                                <SelectItem value="never">Never</SelectItem>
                              </SelectContent>
                            </Select>
                            <FormDescription>
                              How often clients receive update emails
                            </FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  </div>
                  
                  <Button type="submit">Save Permission Settings</Button>
                </form>
              </Form>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ClientPortalSettings;
