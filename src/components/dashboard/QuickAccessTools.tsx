
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { 
  BarChart, 
  FileText, 
  Search, 
  CheckSquare, 
  Users,
  ArrowRight,
  DollarSign,
  CalendarClock,
  ClipboardCheck
} from "lucide-react";

interface Tool {
  name: string;
  icon: string;
  path: string;
  description: string;
}

interface QuickAccessToolsProps {
  tools: Tool[];
}

export function QuickAccessTools({ tools }: QuickAccessToolsProps) {
  // Function to render the icon based on the icon name
  const renderIcon = (iconName: string) => {
    switch (iconName) {
      case "FileText": return <FileText size={24} />;
      case "BarChart": return <BarChart size={24} />;
      case "Search": return <Search size={24} />;
      case "CheckSquare": return <CheckSquare size={24} />;
      case "Users": return <Users size={24} />;
      case "DollarSign": return <DollarSign size={24} />;
      case "CalendarClock": return <CalendarClock size={24} />;
      case "ClipboardCheck": return <ClipboardCheck size={24} />;
      default: return <FileText size={24} />;
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Quick Access Tools</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {tools.map((tool, index) => (
            <Link 
              key={index} 
              to={tool.path}
              className="no-underline"
            >
              <div className="border rounded-lg p-4 hover:bg-muted transition-colors flex items-start space-x-4">
                <div className="p-2 bg-primary/10 rounded-lg text-primary">
                  {renderIcon(tool.icon)}
                </div>
                <div className="flex-1">
                  <h3 className="font-medium">{tool.name}</h3>
                  <p className="text-sm text-muted-foreground mb-2">{tool.description}</p>
                  <Button variant="link" className="p-0 h-auto flex items-center text-primary">
                    Open <ArrowRight size={14} className="ml-1" />
                  </Button>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
