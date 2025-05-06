
import React, { useState } from "react";
import { MainLayout } from "@/components/layout/MainLayout";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  User,
  Users,
  Settings as SettingsIcon,
  FileText,
  Database,
  Shield,
  Link,
  Timer,
} from "lucide-react";

// Settings section components
import UserProfile from "@/components/settings/UserProfile";
import TeamManagement from "@/components/settings/TeamManagement";
import ClientPortalSettings from "@/components/settings/ClientPortalSettings";
import DocumentTemplates from "@/components/settings/DocumentTemplates";
import AnalysisConfiguration from "@/components/settings/AnalysisConfiguration";
import SecuritySettings from "@/components/settings/SecuritySettings";
import IntegrationManagement from "@/components/settings/IntegrationManagement";
import SystemPreferences from "@/components/settings/SystemPreferences";

const Settings = () => {
  const [activeTab, setActiveTab] = useState("user-profile");

  return (
    <MainLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold text-audit-primary">Settings</h1>
        </div>

        <div className="flex flex-col md:flex-row gap-6">
          {/* Settings Navigation Sidebar */}
          <Card className="w-full md:w-64 md:h-[calc(100vh-12rem)]">
            <CardHeader>
              <CardTitle>Settings</CardTitle>
              <CardDescription>Configure your application</CardDescription>
            </CardHeader>
            <CardContent className="p-0">
              <ScrollArea className="h-[calc(100vh-16rem)]">
                <Tabs
                  value={activeTab}
                  onValueChange={setActiveTab}
                  className="w-full"
                >
                  <TabsList className="flex flex-col h-auto items-start bg-transparent p-0">
                    <TabsTrigger
                      value="user-profile"
                      className="w-full justify-start text-left px-4 py-2 data-[state=active]:bg-muted"
                    >
                      <User className="mr-2 h-4 w-4" />
                      User Profile & Preferences
                    </TabsTrigger>
                    <TabsTrigger
                      value="team-management"
                      className="w-full justify-start text-left px-4 py-2 data-[state=active]:bg-muted"
                    >
                      <Users className="mr-2 h-4 w-4" />
                      Team Management
                    </TabsTrigger>
                    <TabsTrigger
                      value="client-portal"
                      className="w-full justify-start text-left px-4 py-2 data-[state=active]:bg-muted"
                    >
                      <SettingsIcon className="mr-2 h-4 w-4" />
                      Client Portal Settings
                    </TabsTrigger>
                    <TabsTrigger
                      value="document-templates"
                      className="w-full justify-start text-left px-4 py-2 data-[state=active]:bg-muted"
                    >
                      <FileText className="mr-2 h-4 w-4" />
                      Document Templates
                    </TabsTrigger>
                    <TabsTrigger
                      value="analysis-configuration"
                      className="w-full justify-start text-left px-4 py-2 data-[state=active]:bg-muted"
                    >
                      <Database className="mr-2 h-4 w-4" />
                      Analysis & Sampling Configuration
                    </TabsTrigger>
                    <TabsTrigger
                      value="security-settings"
                      className="w-full justify-start text-left px-4 py-2 data-[state=active]:bg-muted"
                    >
                      <Shield className="mr-2 h-4 w-4" />
                      Security Settings
                    </TabsTrigger>
                    <TabsTrigger
                      value="integration-management"
                      className="w-full justify-start text-left px-4 py-2 data-[state=active]:bg-muted"
                    >
                      <Link className="mr-2 h-4 w-4" />
                      Integration Management
                    </TabsTrigger>
                    <TabsTrigger
                      value="system-preferences"
                      className="w-full justify-start text-left px-4 py-2 data-[state=active]:bg-muted"
                    >
                      <Timer className="mr-2 h-4 w-4" />
                      System Preferences
                    </TabsTrigger>
                  </TabsList>
                </Tabs>
              </ScrollArea>
            </CardContent>
          </Card>

          {/* Settings Content Area */}
          <div className="flex-1 md:h-[calc(100vh-12rem)]">
            <Card className="h-full">
              <CardContent className="p-6">
                <ScrollArea className="h-[calc(100vh-14rem)]">
                  <Tabs value={activeTab} className="w-full">
                    <TabsContent value="user-profile" className="mt-0">
                      <UserProfile />
                    </TabsContent>
                    <TabsContent value="team-management" className="mt-0">
                      <TeamManagement />
                    </TabsContent>
                    <TabsContent value="client-portal" className="mt-0">
                      <ClientPortalSettings />
                    </TabsContent>
                    <TabsContent value="document-templates" className="mt-0">
                      <DocumentTemplates />
                    </TabsContent>
                    <TabsContent value="analysis-configuration" className="mt-0">
                      <AnalysisConfiguration />
                    </TabsContent>
                    <TabsContent value="security-settings" className="mt-0">
                      <SecuritySettings />
                    </TabsContent>
                    <TabsContent value="integration-management" className="mt-0">
                      <IntegrationManagement />
                    </TabsContent>
                    <TabsContent value="system-preferences" className="mt-0">
                      <SystemPreferences />
                    </TabsContent>
                  </Tabs>
                </ScrollArea>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default Settings;
