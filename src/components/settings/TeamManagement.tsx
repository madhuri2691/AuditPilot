
// Fix the component to use proper badge variants
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
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Check, Edit, MoreHorizontal, Plus, Trash, UserPlus, X } from "lucide-react";
import { toast } from "@/hooks/use-toast";

// Mock data for team members
const mockTeamMembers = [
  {
    id: "1",
    name: "John Doe",
    email: "john.doe@example.com",
    role: "Admin",
    status: "active",
  },
  {
    id: "2",
    name: "Jane Smith",
    email: "jane.smith@example.com",
    role: "Manager",
    status: "active",
  },
  {
    id: "3",
    name: "Mike Johnson",
    email: "mike.johnson@example.com",
    role: "Staff",
    status: "inactive",
  },
  {
    id: "4",
    name: "Sarah Williams",
    email: "sarah.williams@example.com",
    role: "Manager",
    status: "active",
  },
  {
    id: "5",
    name: "David Brown",
    email: "david.brown@example.com",
    role: "Staff",
    status: "active",
  },
];

// Mock data for permissions
const permissionCategories = [
  {
    category: "Client Management",
    permissions: [
      { id: "client_view", name: "View Clients", description: "Can view client information" },
      { id: "client_create", name: "Create Clients", description: "Can create new clients" },
      { id: "client_edit", name: "Edit Clients", description: "Can edit client information" },
      { id: "client_delete", name: "Delete Clients", description: "Can delete clients" },
    ],
  },
  {
    category: "Task Management",
    permissions: [
      { id: "task_view", name: "View Tasks", description: "Can view all tasks" },
      { id: "task_create", name: "Create Tasks", description: "Can create new tasks" },
      { id: "task_edit", name: "Edit Tasks", description: "Can edit task details" },
      { id: "task_delete", name: "Delete Tasks", description: "Can delete tasks" },
      { id: "task_assign", name: "Assign Tasks", description: "Can assign tasks to team members" },
    ],
  },
  {
    category: "Document Management",
    permissions: [
      { id: "document_view", name: "View Documents", description: "Can view all documents" },
      { id: "document_create", name: "Create Documents", description: "Can create new documents" },
      { id: "document_edit", name: "Edit Documents", description: "Can edit documents" },
      { id: "document_delete", name: "Delete Documents", description: "Can delete documents" },
      { id: "document_share", name: "Share Documents", description: "Can share documents with clients" },
    ],
  },
  {
    category: "Reporting",
    permissions: [
      { id: "report_view", name: "View Reports", description: "Can view all reports" },
      { id: "report_create", name: "Create Reports", description: "Can create new reports" },
      { id: "report_export", name: "Export Reports", description: "Can export reports" },
    ],
  },
  {
    category: "Settings",
    permissions: [
      { id: "settings_view", name: "View Settings", description: "Can view application settings" },
      { id: "settings_edit", name: "Edit Settings", description: "Can edit application settings" },
      { id: "user_manage", name: "Manage Users", description: "Can manage users and roles" },
    ],
  },
];

// Predefined role templates
const roleTemplates = {
  Admin: permissionCategories.flatMap(category => category.permissions.map(p => p.id)),
  Manager: [
    "client_view", "client_create", "client_edit",
    "task_view", "task_create", "task_edit", "task_assign",
    "document_view", "document_create", "document_edit", "document_share",
    "report_view", "report_create", "report_export",
    "settings_view",
  ],
  Staff: [
    "client_view",
    "task_view", "task_create", "task_edit",
    "document_view", "document_create", "document_edit",
    "report_view",
  ],
};

const TeamManagement = () => {
  const [teamMembers, setTeamMembers] = useState(mockTeamMembers);
  const [isInviteDialogOpen, setIsInviteDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isPermissionsDialogOpen, setIsPermissionsDialogOpen] = useState(false);
  const [currentMember, setCurrentMember] = useState<any>(null);
  const [selectedRole, setSelectedRole] = useState("");
  const [selectedPermissions, setSelectedPermissions] = useState<string[]>([]);

  // New team member form state
  const [newMemberEmail, setNewMemberEmail] = useState("");
  const [newMemberName, setNewMemberName] = useState("");
  const [newMemberRole, setNewMemberRole] = useState("Staff");

  const handleInvite = () => {
    if (!newMemberEmail || !newMemberName || !newMemberRole) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields.",
        variant: "destructive",
      });
      return;
    }

    const newMember = {
      id: `${teamMembers.length + 1}`,
      name: newMemberName,
      email: newMemberEmail,
      role: newMemberRole,
      status: "active",
    };

    setTeamMembers([...teamMembers, newMember]);
    setNewMemberEmail("");
    setNewMemberName("");
    setNewMemberRole("Staff");
    setIsInviteDialogOpen(false);

    toast({
      title: "Invitation Sent",
      description: `Invitation sent to ${newMemberEmail}`,
    });
  };

  const handleEditMember = (member: any) => {
    setCurrentMember(member);
    setSelectedRole(member.role);
    setIsEditDialogOpen(true);
  };

  const handleUpdateMember = () => {
    const updatedMembers = teamMembers.map(member => 
      member.id === currentMember.id ? { ...member, role: selectedRole } : member
    );
    setTeamMembers(updatedMembers);
    setIsEditDialogOpen(false);
    
    toast({
      title: "Member Updated",
      description: `${currentMember.name}'s role updated to ${selectedRole}`,
    });
  };

  const handleViewPermissions = (member: any) => {
    setCurrentMember(member);
    // Set permissions based on role
    setSelectedPermissions(roleTemplates[member.role as keyof typeof roleTemplates] || []);
    setIsPermissionsDialogOpen(true);
  };

  const handleRemoveMember = (memberId: string) => {
    setTeamMembers(teamMembers.filter(member => member.id !== memberId));
    
    toast({
      title: "Member Removed",
      description: "Team member has been removed successfully.",
    });
  };

  const togglePermission = (permissionId: string) => {
    setSelectedPermissions(prevPermissions => {
      if (prevPermissions.includes(permissionId)) {
        return prevPermissions.filter(id => id !== permissionId);
      } else {
        return [...prevPermissions, permissionId];
      }
    });
  };

  const saveCustomPermissions = () => {
    // In a real app, this would save custom permissions to the backend
    toast({
      title: "Permissions Updated",
      description: `Custom permissions saved for ${currentMember.name}`,
    });
    setIsPermissionsDialogOpen(false);
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Team Management</CardTitle>
        <CardDescription>
          Manage your team members, roles, and permissions
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="mb-4 flex justify-between items-center">
          <h3 className="text-lg font-medium">Team Members</h3>
          <Dialog open={isInviteDialogOpen} onOpenChange={setIsInviteDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <UserPlus className="mr-2 h-4 w-4" />
                Invite Team Member
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Invite Team Member</DialogTitle>
                <DialogDescription>
                  Send an invitation to join your audit team.
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="name" className="text-right">
                    Name
                  </Label>
                  <Input
                    id="name"
                    value={newMemberName}
                    onChange={(e) => setNewMemberName(e.target.value)}
                    className="col-span-3"
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="email" className="text-right">
                    Email
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    value={newMemberEmail}
                    onChange={(e) => setNewMemberEmail(e.target.value)}
                    className="col-span-3"
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="role" className="text-right">
                    Role
                  </Label>
                  <Select
                    value={newMemberRole}
                    onValueChange={setNewMemberRole}
                  >
                    <SelectTrigger className="col-span-3">
                      <SelectValue placeholder="Select a role" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Admin">Admin</SelectItem>
                      <SelectItem value="Manager">Manager</SelectItem>
                      <SelectItem value="Staff">Staff</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsInviteDialogOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={handleInvite}>Send Invitation</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>

        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Role</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {teamMembers.map((member) => (
              <TableRow key={member.id}>
                <TableCell className="font-medium">{member.name}</TableCell>
                <TableCell>{member.email}</TableCell>
                <TableCell>{member.role}</TableCell>
                <TableCell>
                  <Badge 
                    variant={member.status === "active" ? "secondary" : "outline"}
                  >
                    {member.status === "active" ? "Active" : "Inactive"}
                  </Badge>
                </TableCell>
                <TableCell className="text-right">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" className="h-8 w-8 p-0">
                        <span className="sr-only">Open menu</span>
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => handleEditMember(member)}>
                        <Edit className="mr-2 h-4 w-4" />
                        Edit Role
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => handleViewPermissions(member)}>
                        <Check className="mr-2 h-4 w-4" />
                        Permissions
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => handleRemoveMember(member.id)}>
                        <Trash className="mr-2 h-4 w-4" />
                        Remove
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>

        {/* Edit Role Dialog */}
        <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Edit Role</DialogTitle>
              <DialogDescription>
                Update role for {currentMember?.name}
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="edit-role" className="text-right">
                  Role
                </Label>
                <Select
                  value={selectedRole}
                  onValueChange={setSelectedRole}
                >
                  <SelectTrigger className="col-span-3">
                    <SelectValue placeholder="Select a role" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Admin">Admin</SelectItem>
                    <SelectItem value="Manager">Manager</SelectItem>
                    <SelectItem value="Staff">Staff</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleUpdateMember}>Update Role</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Permissions Dialog */}
        <Dialog open={isPermissionsDialogOpen} onOpenChange={setIsPermissionsDialogOpen}>
          <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Permissions for {currentMember?.name}</DialogTitle>
              <DialogDescription>
                View and modify permissions for this team member
              </DialogDescription>
            </DialogHeader>
            <div className="py-4 space-y-6">
              {permissionCategories.map((category) => (
                <div key={category.category} className="space-y-2">
                  <h4 className="font-medium text-md">{category.category}</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                    {category.permissions.map((permission) => (
                      <div
                        key={permission.id}
                        className="flex items-start space-x-2 border p-2 rounded-md"
                      >
                        <input
                          type="checkbox"
                          id={permission.id}
                          checked={selectedPermissions.includes(permission.id)}
                          onChange={() => togglePermission(permission.id)}
                          className="mt-1"
                        />
                        <div>
                          <Label htmlFor={permission.id}>{permission.name}</Label>
                          <p className="text-sm text-muted-foreground">
                            {permission.description}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsPermissionsDialogOpen(false)}>
                Cancel
              </Button>
              <Button onClick={saveCustomPermissions}>Save Permissions</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button variant="outline">Reset Defaults</Button>
        <Button>Save All Changes</Button>
      </CardFooter>
    </Card>
  );
};

export default TeamManagement;
