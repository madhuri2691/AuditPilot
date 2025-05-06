
import React, { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Mail, Plus, Users } from "lucide-react";

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
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "@/hooks/use-toast";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

const inviteUserSchema = z.object({
  email: z.string().email({
    message: "Please enter a valid email address.",
  }),
  role: z.enum(["admin", "manager", "staff"]),
  name: z.string().min(2, {
    message: "Name must be at least 2 characters.",
  }),
});

const rolePermissionSchema = z.object({
  role: z.enum(["admin", "manager", "staff"]),
  permissions: z.object({
    viewClients: z.boolean().default(true),
    createClients: z.boolean().default(false),
    editClients: z.boolean().default(false),
    deleteClients: z.boolean().default(false),
    viewTasks: z.boolean().default(true),
    createTasks: z.boolean().default(false),
    editTasks: z.boolean().default(false),
    deleteTasks: z.boolean().default(false),
    viewDocuments: z.boolean().default(true),
    createDocuments: z.boolean().default(false),
    editDocuments: z.boolean().default(false),
    deleteDocuments: z.boolean().default(false),
    viewReports: z.boolean().default(true),
    createReports: z.boolean().default(false),
    manageSettings: z.boolean().default(false),
    manageUsers: z.boolean().default(false),
  }),
});

// Sample team data
const teamMembers = [
  {
    id: 1,
    name: "John Doe",
    email: "john@example.com",
    role: "admin",
    status: "active",
    lastActive: "2023-05-01T12:00:00Z",
  },
  {
    id: 2,
    name: "Jane Smith",
    email: "jane@example.com",
    role: "manager",
    status: "active",
    lastActive: "2023-05-01T10:30:00Z",
  },
  {
    id: 3,
    name: "Robert Johnson",
    email: "robert@example.com",
    role: "staff",
    status: "active",
    lastActive: "2023-05-01T09:15:00Z",
  },
  {
    id: 4,
    name: "Emily Davis",
    email: "emily@example.com",
    role: "staff",
    status: "pending",
    lastActive: null,
  },
];

const TeamManagement = () => {
  const [activeTab, setActiveTab] = useState("members");
  const [isInviteDialogOpen, setIsInviteDialogOpen] = useState(false);
  
  const inviteForm = useForm<z.infer<typeof inviteUserSchema>>({
    resolver: zodResolver(inviteUserSchema),
    defaultValues: {
      email: "",
      role: "staff",
      name: "",
    },
  });
  
  const adminRoleForm = useForm<z.infer<typeof rolePermissionSchema>>({
    resolver: zodResolver(rolePermissionSchema),
    defaultValues: {
      role: "admin",
      permissions: {
        viewClients: true,
        createClients: true,
        editClients: true,
        deleteClients: true,
        viewTasks: true,
        createTasks: true,
        editTasks: true,
        deleteTasks: true,
        viewDocuments: true,
        createDocuments: true,
        editDocuments: true,
        deleteDocuments: true,
        viewReports: true,
        createReports: true,
        manageSettings: true,
        manageUsers: true,
      },
    },
  });
  
  const managerRoleForm = useForm<z.infer<typeof rolePermissionSchema>>({
    resolver: zodResolver(rolePermissionSchema),
    defaultValues: {
      role: "manager",
      permissions: {
        viewClients: true,
        createClients: true,
        editClients: true,
        deleteClients: false,
        viewTasks: true,
        createTasks: true,
        editTasks: true,
        deleteTasks: true,
        viewDocuments: true,
        createDocuments: true,
        editDocuments: true,
        deleteDocuments: false,
        viewReports: true,
        createReports: true,
        manageSettings: false,
        manageUsers: false,
      },
    },
  });
  
  const staffRoleForm = useForm<z.infer<typeof rolePermissionSchema>>({
    resolver: zodResolver(rolePermissionSchema),
    defaultValues: {
      role: "staff",
      permissions: {
        viewClients: true,
        createClients: false,
        editClients: false,
        deleteClients: false,
        viewTasks: true,
        createTasks: false,
        editTasks: true,
        deleteTasks: false,
        viewDocuments: true,
        createDocuments: true,
        editDocuments: false,
        deleteDocuments: false,
        viewReports: true,
        createReports: false,
        manageSettings: false,
        manageUsers: false,
      },
    },
  });

  const onInviteSubmit = (values: z.infer<typeof inviteUserSchema>) => {
    toast({
      title: "Invitation sent",
      description: `Invitation sent to ${values.email} for the ${values.role} role.`,
    });
    
    setIsInviteDialogOpen(false);
    inviteForm.reset();
  };

  const onAdminRoleSubmit = (values: z.infer<typeof rolePermissionSchema>) => {
    toast({
      title: "Admin role updated",
      description: "Admin role permissions have been updated.",
    });
  };
  
  const onManagerRoleSubmit = (values: z.infer<typeof rolePermissionSchema>) => {
    toast({
      title: "Manager role updated",
      description: "Manager role permissions have been updated.",
    });
  };
  
  const onStaffRoleSubmit = (values: z.infer<typeof rolePermissionSchema>) => {
    toast({
      title: "Staff role updated",
      description: "Staff role permissions have been updated.",
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">Team Management</h2>
          <p className="text-muted-foreground">
            Manage team members, roles, and permissions
          </p>
        </div>
        
        <Dialog open={isInviteDialogOpen} onOpenChange={setIsInviteDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" /> Invite Team Member
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Invite Team Member</DialogTitle>
              <DialogDescription>
                Send an invitation email to add a new team member.
              </DialogDescription>
            </DialogHeader>
            
            <Form {...inviteForm}>
              <form onSubmit={inviteForm.handleSubmit(onInviteSubmit)} className="space-y-4">
                <FormField
                  control={inviteForm.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Name</FormLabel>
                      <FormControl>
                        <Input placeholder="John Doe" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={inviteForm.control}
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
                
                <FormField
                  control={inviteForm.control}
                  name="role"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Role</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select a role" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="admin">Admin</SelectItem>
                          <SelectItem value="manager">Manager</SelectItem>
                          <SelectItem value="staff">Staff</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormDescription>
                        The role determines what permissions the user will have.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <DialogFooter>
                  <Button type="submit">Send Invitation</Button>
                </DialogFooter>
              </form>
            </Form>
          </DialogContent>
        </Dialog>
      </div>
      
      <Separator />
      
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="members">Team Members</TabsTrigger>
          <TabsTrigger value="roles">Role Permissions</TabsTrigger>
        </TabsList>
        
        {/* Team Members Tab */}
        <TabsContent value="members">
          <Card>
            <CardHeader>
              <CardTitle>Team Members</CardTitle>
              <CardDescription>
                View and manage all team members and their roles
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[250px]">Name</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Role</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Last Active</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {teamMembers.map((member) => (
                    <TableRow key={member.id}>
                      <TableCell className="font-medium">
                        <div className="flex items-center gap-2">
                          <Avatar className="h-8 w-8">
                            <AvatarFallback>
                              {member.name.charAt(0)}
                            </AvatarFallback>
                          </Avatar>
                          {member.name}
                        </div>
                      </TableCell>
                      <TableCell>{member.email}</TableCell>
                      <TableCell>
                        <Badge 
                          variant={
                            member.role === "admin" 
                              ? "default" 
                              : member.role === "manager"
                                ? "secondary"
                                : "outline"
                          }
                        >
                          {member.role}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge 
                          variant={member.status === "active" ? "success" : "warning"}
                          className={
                            member.status === "active" 
                              ? "bg-green-100 text-green-800 hover:bg-green-100" 
                              : "bg-yellow-100 text-yellow-800 hover:bg-yellow-100"
                          }
                        >
                          {member.status}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        {member.lastActive 
                          ? new Date(member.lastActive).toLocaleDateString() 
                          : "Never"}
                      </TableCell>
                      <TableCell className="text-right">
                        <Button variant="ghost" size="sm">
                          Edit
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
        
        {/* Role Permissions Tab */}
        <TabsContent value="roles">
          <Tabs defaultValue="admin" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="admin">Admin</TabsTrigger>
              <TabsTrigger value="manager">Manager</TabsTrigger>
              <TabsTrigger value="staff">Staff</TabsTrigger>
            </TabsList>
            
            <TabsContent value="admin">
              <Card>
                <CardHeader>
                  <CardTitle>Admin Role Permissions</CardTitle>
                  <CardDescription>
                    Configure permissions for the Admin role
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Form {...adminRoleForm}>
                    <form onSubmit={adminRoleForm.handleSubmit(onAdminRoleSubmit)} className="space-y-6">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-4">
                          <h3 className="text-lg font-medium">Client Permissions</h3>
                          <div className="space-y-2">
                            <FormField
                              control={adminRoleForm.control}
                              name="permissions.viewClients"
                              render={({ field }) => (
                                <FormItem className="flex items-center justify-between rounded-lg border p-3">
                                  <FormLabel className="text-base">View Clients</FormLabel>
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
                              control={adminRoleForm.control}
                              name="permissions.createClients"
                              render={({ field }) => (
                                <FormItem className="flex items-center justify-between rounded-lg border p-3">
                                  <FormLabel className="text-base">Create Clients</FormLabel>
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
                              control={adminRoleForm.control}
                              name="permissions.editClients"
                              render={({ field }) => (
                                <FormItem className="flex items-center justify-between rounded-lg border p-3">
                                  <FormLabel className="text-base">Edit Clients</FormLabel>
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
                              control={adminRoleForm.control}
                              name="permissions.deleteClients"
                              render={({ field }) => (
                                <FormItem className="flex items-center justify-between rounded-lg border p-3">
                                  <FormLabel className="text-base">Delete Clients</FormLabel>
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
                          
                          <h3 className="text-lg font-medium mt-6">Document Permissions</h3>
                          <div className="space-y-2">
                            <FormField
                              control={adminRoleForm.control}
                              name="permissions.viewDocuments"
                              render={({ field }) => (
                                <FormItem className="flex items-center justify-between rounded-lg border p-3">
                                  <FormLabel className="text-base">View Documents</FormLabel>
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
                              control={adminRoleForm.control}
                              name="permissions.createDocuments"
                              render={({ field }) => (
                                <FormItem className="flex items-center justify-between rounded-lg border p-3">
                                  <FormLabel className="text-base">Create Documents</FormLabel>
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
                              control={adminRoleForm.control}
                              name="permissions.editDocuments"
                              render={({ field }) => (
                                <FormItem className="flex items-center justify-between rounded-lg border p-3">
                                  <FormLabel className="text-base">Edit Documents</FormLabel>
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
                              control={adminRoleForm.control}
                              name="permissions.deleteDocuments"
                              render={({ field }) => (
                                <FormItem className="flex items-center justify-between rounded-lg border p-3">
                                  <FormLabel className="text-base">Delete Documents</FormLabel>
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
                        
                        <div className="space-y-4">
                          <h3 className="text-lg font-medium">Task Permissions</h3>
                          <div className="space-y-2">
                            <FormField
                              control={adminRoleForm.control}
                              name="permissions.viewTasks"
                              render={({ field }) => (
                                <FormItem className="flex items-center justify-between rounded-lg border p-3">
                                  <FormLabel className="text-base">View Tasks</FormLabel>
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
                              control={adminRoleForm.control}
                              name="permissions.createTasks"
                              render={({ field }) => (
                                <FormItem className="flex items-center justify-between rounded-lg border p-3">
                                  <FormLabel className="text-base">Create Tasks</FormLabel>
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
                              control={adminRoleForm.control}
                              name="permissions.editTasks"
                              render={({ field }) => (
                                <FormItem className="flex items-center justify-between rounded-lg border p-3">
                                  <FormLabel className="text-base">Edit Tasks</FormLabel>
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
                              control={adminRoleForm.control}
                              name="permissions.deleteTasks"
                              render={({ field }) => (
                                <FormItem className="flex items-center justify-between rounded-lg border p-3">
                                  <FormLabel className="text-base">Delete Tasks</FormLabel>
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
                          
                          <h3 className="text-lg font-medium mt-6">Advanced Permissions</h3>
                          <div className="space-y-2">
                            <FormField
                              control={adminRoleForm.control}
                              name="permissions.manageSettings"
                              render={({ field }) => (
                                <FormItem className="flex items-center justify-between rounded-lg border p-3">
                                  <FormLabel className="text-base">Manage Settings</FormLabel>
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
                              control={adminRoleForm.control}
                              name="permissions.manageUsers"
                              render={({ field }) => (
                                <FormItem className="flex items-center justify-between rounded-lg border p-3">
                                  <FormLabel className="text-base">Manage Users</FormLabel>
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
                              control={adminRoleForm.control}
                              name="permissions.viewReports"
                              render={({ field }) => (
                                <FormItem className="flex items-center justify-between rounded-lg border p-3">
                                  <FormLabel className="text-base">View Reports</FormLabel>
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
                              control={adminRoleForm.control}
                              name="permissions.createReports"
                              render={({ field }) => (
                                <FormItem className="flex items-center justify-between rounded-lg border p-3">
                                  <FormLabel className="text-base">Create Reports</FormLabel>
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
                      </div>
                      
                      <Button type="submit">Save Admin Permissions</Button>
                    </form>
                  </Form>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="manager">
              <Card>
                <CardHeader>
                  <CardTitle>Manager Role Permissions</CardTitle>
                  <CardDescription>
                    Configure permissions for the Manager role
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Form {...managerRoleForm}>
                    <form onSubmit={managerRoleForm.handleSubmit(onManagerRoleSubmit)} className="space-y-6">
                      {/* Similar structure to admin role form */}
                      <Button type="submit">Save Manager Permissions</Button>
                    </form>
                  </Form>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="staff">
              <Card>
                <CardHeader>
                  <CardTitle>Staff Role Permissions</CardTitle>
                  <CardDescription>
                    Configure permissions for the Staff role
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Form {...staffRoleForm}>
                    <form onSubmit={staffRoleForm.handleSubmit(onStaffRoleSubmit)} className="space-y-6">
                      {/* Similar structure to admin role form */}
                      <Button type="submit">Save Staff Permissions</Button>
                    </form>
                  </Form>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default TeamManagement;
