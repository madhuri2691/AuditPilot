
import React from "react";
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
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { toast } from "@/hooks/use-toast";

const securitySchema = z.object({
  sessionTimeoutMinutes: z.string().default("30"),
  enforceStrongPasswords: z.boolean().default(true),
  passwordExpiryDays: z.string().default("90"),
  allowMultipleSessions: z.boolean().default(false),
  twoFactorAuth: z.boolean().default(false),
  ipRestriction: z.boolean().default(false),
  allowedIPs: z.string().optional(),
  autoLogout: z.boolean().default(true),
  loginAttempts: z.string().default("5"),
  auditLogRetentionDays: z.string().default("365"),
  encryptSensitiveData: z.boolean().default(true),
  documentRetentionPeriod: z.string().default("7"),
  dataBackupFrequency: z.enum(["daily", "weekly", "monthly"]).default("daily"),
});

const SecuritySettings = () => {
  const form = useForm<z.infer<typeof securitySchema>>({
    resolver: zodResolver(securitySchema),
    defaultValues: {
      sessionTimeoutMinutes: "30",
      enforceStrongPasswords: true,
      passwordExpiryDays: "90",
      allowMultipleSessions: false,
      twoFactorAuth: false,
      ipRestriction: false,
      allowedIPs: "",
      autoLogout: true,
      loginAttempts: "5",
      auditLogRetentionDays: "365",
      encryptSensitiveData: true,
      documentRetentionPeriod: "7",
      dataBackupFrequency: "daily",
    },
  });
  
  const onSubmit = (values: z.infer<typeof securitySchema>) => {
    toast({
      title: "Security settings updated",
      description: "Your security and data retention settings have been saved.",
    });
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold">Security Settings</h2>
        <p className="text-muted-foreground">
          Configure application security, data retention, and audit logging
        </p>
      </div>
      
      <Separator />
      
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <Card>
            <CardHeader>
              <CardTitle>Authentication & Session Security</CardTitle>
              <CardDescription>
                Configure login security and session management settings
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField
                  control={form.control}
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
                        Automatically log users out after inactivity
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="loginAttempts"
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
                
                <FormField
                  control={form.control}
                  name="passwordExpiryDays"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Password Expiry (days)</FormLabel>
                      <FormControl>
                        <Input type="number" {...field} />
                      </FormControl>
                      <FormDescription>
                        Number of days before passwords must be changed (0 for never)
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              
              <div className="space-y-4">
                <FormField
                  control={form.control}
                  name="enforceStrongPasswords"
                  render={({ field }) => (
                    <FormItem className="flex items-center justify-between rounded-lg border p-3">
                      <div>
                        <FormLabel className="text-base">Enforce Strong Passwords</FormLabel>
                        <FormDescription>
                          Require complex passwords with mix of characters
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
                  control={form.control}
                  name="twoFactorAuth"
                  render={({ field }) => (
                    <FormItem className="flex items-center justify-between rounded-lg border p-3">
                      <div>
                        <FormLabel className="text-base">Two-Factor Authentication</FormLabel>
                        <FormDescription>
                          Require two-factor authentication for all users
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
                  control={form.control}
                  name="allowMultipleSessions"
                  render={({ field }) => (
                    <FormItem className="flex items-center justify-between rounded-lg border p-3">
                      <div>
                        <FormLabel className="text-base">Allow Multiple Sessions</FormLabel>
                        <FormDescription>
                          Permit users to be logged in from multiple devices simultaneously
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
                  control={form.control}
                  name="autoLogout"
                  render={({ field }) => (
                    <FormItem className="flex items-center justify-between rounded-lg border p-3">
                      <div>
                        <FormLabel className="text-base">Auto Logout on Inactivity</FormLabel>
                        <FormDescription>
                          Automatically log out users after period of inactivity
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
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Network & Access Restrictions</CardTitle>
              <CardDescription>
                Configure IP restrictions and access controls
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <FormField
                control={form.control}
                name="ipRestriction"
                render={({ field }) => (
                  <FormItem className="flex items-center justify-between rounded-lg border p-3">
                    <div>
                      <FormLabel className="text-base">IP Address Restriction</FormLabel>
                      <FormDescription>
                        Limit access to specific IP addresses or ranges
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
                control={form.control}
                name="allowedIPs"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Allowed IP Addresses</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Enter IP addresses, one per line (e.g., 192.168.1.1 or 10.0.0.0/24)"
                        disabled={!form.watch("ipRestriction")}
                        className="h-24"
                        {...field}
                      />
                    </FormControl>
                    <FormDescription>
                      Enter IP addresses or CIDR ranges, one per line
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Audit Trail & Data Retention</CardTitle>
              <CardDescription>
                Configure logging, data encryption, and retention policies
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField
                  control={form.control}
                  name="auditLogRetentionDays"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Audit Log Retention (days)</FormLabel>
                      <FormControl>
                        <Input type="number" {...field} />
                      </FormControl>
                      <FormDescription>
                        Number of days to retain user activity logs
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="documentRetentionPeriod"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Document Retention Period (years)</FormLabel>
                      <FormControl>
                        <Input type="number" {...field} />
                      </FormControl>
                      <FormDescription>
                        Years to retain documents before archiving
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="dataBackupFrequency"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Data Backup Frequency</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select backup frequency" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="daily">Daily</SelectItem>
                          <SelectItem value="weekly">Weekly</SelectItem>
                          <SelectItem value="monthly">Monthly</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormDescription>
                        How often to automatically backup application data
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              
              <FormField
                control={form.control}
                name="encryptSensitiveData"
                render={({ field }) => (
                  <FormItem className="flex items-center justify-between rounded-lg border p-3">
                    <div>
                      <FormLabel className="text-base">Encrypt Sensitive Data</FormLabel>
                      <FormDescription>
                        Enable encryption for sensitive client and financial data
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
            </CardContent>
          </Card>
          
          <Button type="submit" className="w-full md:w-auto">Save Security Settings</Button>
        </form>
      </Form>
    </div>
  );
};

export default SecuritySettings;
