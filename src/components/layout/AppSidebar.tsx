import { 
  Sidebar, 
  SidebarContent, 
  SidebarTrigger, 
  SidebarHeader,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton
} from "@/components/ui/sidebar";
import { 
  Home, 
  Users, 
  FileText, 
  Calendar, 
  Settings, 
  CheckSquare, 
  Database, 
  Search,
  DollarSign
} from "lucide-react";
import { Link } from "react-router-dom";

const menuItems = [
  {
    title: "Dashboard",
    icon: Home,
    path: "/"
  },
  {
    title: "Clients",
    icon: Users,
    path: "/clients"
  },
  {
    title: "Tasks",
    icon: CheckSquare,
    path: "/tasks"
  },
  {
    title: "Documents",
    icon: FileText,
    path: "/documents"
  },
  {
    title: "Calendar",
    icon: Calendar,
    path: "/calendar"
  },
  {
    title: "Financial Analysis",
    icon: Database,
    path: "/financial-analysis"
  },
  {
    title: "Sampling Tools",
    icon: Search,
    path: "/sampling"
  },
  {
    title: "Bill Tracking",
    icon: DollarSign,
    path: "/bill-tracking"
  },
  {
    title: "Settings",
    icon: Settings,
    path: "/settings"
  }
];

export function AppSidebar() {
  return (
    <Sidebar collapsible="icon">
      <SidebarHeader className="p-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold text-audit-primary">Audit Task Master</h2>
          <SidebarTrigger />
        </div>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Main Navigation</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {menuItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <Link to={item.path} className="flex items-center gap-2">
                      <item.icon size={20} />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter className="p-4">
        <div className="text-sm text-muted-foreground">
          Audit Task Master v1.0
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}
