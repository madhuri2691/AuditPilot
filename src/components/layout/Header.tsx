
import { useState } from "react";
import { Link } from "react-router-dom";
import { Bell, User, LogOut } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/context/AuthContext";

export const Header = () => {
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);
  const { user, signOut } = useAuth();
  
  // Get initials for avatar
  const getInitials = () => {
    if (!user) return "AU";
    const name = user.user_metadata?.name || "Audit User";
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .substring(0, 2);
  };

  const handleLogout = async () => {
    try {
      await signOut();
    } catch (error) {
      console.error("Error logging out:", error);
    }
  };

  return (
    <header className="border-b p-4 bg-white flex justify-between items-center sticky top-0 z-10">
      <div className="flex items-center">
        <Link to="/" className="text-xl font-bold text-audit-primary">
          Audit Task Master
        </Link>
      </div>
      <div className="flex items-center gap-4">
        <Sheet open={isNotificationOpen} onOpenChange={setIsNotificationOpen}>
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon" className="relative">
              <Bell size={20} />
              <Badge className="absolute -top-1 -right-1 px-1.5 py-0.5 text-xs">
                3
              </Badge>
            </Button>
          </SheetTrigger>
          <SheetContent>
            <SheetHeader>
              <SheetTitle>Notifications</SheetTitle>
            </SheetHeader>
            <div className="py-4 space-y-4">
              <div className="border-l-4 border-blue-500 pl-4 py-2 bg-blue-50 rounded-r">
                <div className="font-medium">Task deadline approaching</div>
                <div className="text-sm text-muted-foreground">
                  ABC Corp tax audit due in 3 days
                </div>
              </div>
              <div className="border-l-4 border-green-500 pl-4 py-2 bg-green-50 rounded-r">
                <div className="font-medium">Document updated</div>
                <div className="text-sm text-muted-foreground">
                  New version of engagement letter uploaded
                </div>
              </div>
              <div className="border-l-4 border-amber-500 pl-4 py-2 bg-amber-50 rounded-r">
                <div className="font-medium">New client assigned</div>
                <div className="text-sm text-muted-foreground">
                  You have been assigned to XYZ Industries
                </div>
              </div>
            </div>
          </SheetContent>
        </Sheet>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="rounded-full">
              <Avatar className="h-8 w-8">
                <AvatarImage src="" />
                <AvatarFallback>{getInitials()}</AvatarFallback>
              </Avatar>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>My Account</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild>
              <Link to="/settings" className="flex items-center gap-2 cursor-pointer">
                <User size={14} />
                <span>Profile Settings</span>
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem onClick={handleLogout} className="flex items-center gap-2 cursor-pointer text-red-500">
              <LogOut size={14} />
              <span>Logout</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
};
