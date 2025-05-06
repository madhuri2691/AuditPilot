
import React, { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { FilePlus, FileEdit, FileCheck, Trash2 } from "lucide-react";

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
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
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

const templateSchema = z.object({
  name: z.string().min(2, {
    message: "Template name must be at least 2 characters.",
  }),
  type: z.enum(["management_letter", "engagement_letter", "consent_letter", "audit_plan"]),
  entityType: z.enum(["corporate", "partnership", "trust", "proprietorship"]),
  content: z.string().min(10, {
    message: "Template content must be at least 10 characters.",
  }),
  defaultValues: z.string().optional(),
});

// Sample template data
const templateList = [
  {
    id: 1,
    name: "Standard Management Representation Letter",
    type: "management_letter",
    entityType: "corporate",
    createdAt: "2023-01-15",
    updatedAt: "2023-04-10",
  },
  {
    id: 2,
    name: "Partnership Engagement Letter",
    type: "engagement_letter",
    entityType: "partnership",
    createdAt: "2023-02-20",
    updatedAt: "2023-02-20",
  },
  {
    id: 3,
    name: "Corporate Audit Consent Letter",
    type: "consent_letter",
    entityType: "corporate",
    createdAt: "2023-03-05",
    updatedAt: "2023-05-12",
  },
  {
    id: 4,
    name: "Trust Audit Plan Template",
    type: "audit_plan",
    entityType: "trust",
    createdAt: "2023-03-15",
    updatedAt: "2023-03-15",
  },
];

const DocumentTemplates = () => {
  const [activeTab, setActiveTab] = useState("management_letter");
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [currentTemplate, setCurrentTemplate] = useState<any>(null);
  
  const form = useForm<z.infer<typeof templateSchema>>({
    resolver: zodResolver(templateSchema),
    defaultValues: {
      name: "",
      type: "management_letter",
      entityType: "corporate",
      content: "",
      defaultValues: "",
    },
  });
  
  const handleCreateTemplate = () => {
    setIsEditMode(false);
    form.reset({
      name: "",
      type: activeTab as any,
      entityType: "corporate",
      content: "",
      defaultValues: "",
    });
    setIsCreateDialogOpen(true);
  };
  
  const handleEditTemplate = (template: any) => {
    setIsEditMode(true);
    setCurrentTemplate(template);
    form.reset({
      name: template.name,
      type: template.type,
      entityType: template.entityType,
      content: "Template content goes here...", // This would be loaded from API
      defaultValues: "{ \"clientName\": \"\", \"fiscalYear\": \"\" }",
    });
    setIsCreateDialogOpen(true);
  };
  
  const onSubmit = (values: z.infer<typeof templateSchema>) => {
    if (isEditMode) {
      toast({
        title: "Template updated",
        description: `Template "${values.name}" has been updated.`,
      });
    } else {
      toast({
        title: "Template created",
        description: `New template "${values.name}" has been created.`,
      });
    }
    
    setIsCreateDialogOpen(false);
    form.reset();
  };
  
  const handleDeleteTemplate = (template: any) => {
    toast({
      title: "Template deleted",
      description: `Template "${template.name}" has been deleted.`,
    });
  };
  
  const getEntityTypeBadge = (entityType: string) => {
    switch (entityType) {
      case "corporate":
        return <Badge variant="default">Corporate</Badge>;
      case "partnership":
        return <Badge variant="secondary">Partnership</Badge>;
      case "trust":
        return <Badge variant="outline" className="bg-blue-100 text-blue-800 hover:bg-blue-100">Trust</Badge>;
      case "proprietorship":
        return <Badge variant="outline" className="bg-green-100 text-green-800 hover:bg-green-100">Proprietorship</Badge>;
      default:
        return <Badge variant="outline">{entityType}</Badge>;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">Document Templates</h2>
          <p className="text-muted-foreground">
            Manage and customize document templates for various audit requirements
          </p>
        </div>
        
        <Button onClick={handleCreateTemplate}>
          <FilePlus className="mr-2 h-4 w-4" /> Create Template
        </Button>
      </div>
      
      <Separator />
      
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="management_letter">Management Letters</TabsTrigger>
          <TabsTrigger value="engagement_letter">Engagement Letters</TabsTrigger>
          <TabsTrigger value="consent_letter">Consent Letters</TabsTrigger>
          <TabsTrigger value="audit_plan">Audit Plans</TabsTrigger>
        </TabsList>
        
        {/* Management Letters Tab */}
        <TabsContent value="management_letter">
          <Card>
            <CardHeader>
              <CardTitle>Management Representation Letters</CardTitle>
              <CardDescription>
                Templates for client management representation letters
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[300px]">Template Name</TableHead>
                    <TableHead>Entity Type</TableHead>
                    <TableHead>Created Date</TableHead>
                    <TableHead>Last Updated</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {templateList
                    .filter(template => template.type === "management_letter")
                    .map((template) => (
                      <TableRow key={template.id}>
                        <TableCell className="font-medium">{template.name}</TableCell>
                        <TableCell>{getEntityTypeBadge(template.entityType)}</TableCell>
                        <TableCell>{new Date(template.createdAt).toLocaleDateString()}</TableCell>
                        <TableCell>{new Date(template.updatedAt).toLocaleDateString()}</TableCell>
                        <TableCell className="text-right space-x-2">
                          <Button variant="ghost" size="sm" onClick={() => handleEditTemplate(template)}>
                            <FileEdit className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="sm" onClick={() => handleDeleteTemplate(template)}>
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
        
        {/* Engagement Letters Tab */}
        <TabsContent value="engagement_letter">
          <Card>
            <CardHeader>
              <CardTitle>Engagement Letters</CardTitle>
              <CardDescription>
                Templates for client engagement letters
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[300px]">Template Name</TableHead>
                    <TableHead>Entity Type</TableHead>
                    <TableHead>Created Date</TableHead>
                    <TableHead>Last Updated</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {templateList
                    .filter(template => template.type === "engagement_letter")
                    .map((template) => (
                      <TableRow key={template.id}>
                        <TableCell className="font-medium">{template.name}</TableCell>
                        <TableCell>{getEntityTypeBadge(template.entityType)}</TableCell>
                        <TableCell>{new Date(template.createdAt).toLocaleDateString()}</TableCell>
                        <TableCell>{new Date(template.updatedAt).toLocaleDateString()}</TableCell>
                        <TableCell className="text-right space-x-2">
                          <Button variant="ghost" size="sm" onClick={() => handleEditTemplate(template)}>
                            <FileEdit className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="sm" onClick={() => handleDeleteTemplate(template)}>
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
        
        {/* Consent Letters Tab */}
        <TabsContent value="consent_letter">
          <Card>
            <CardHeader>
              <CardTitle>Auditor's Consent Letters</CardTitle>
              <CardDescription>
                Templates for auditor's consent letters
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[300px]">Template Name</TableHead>
                    <TableHead>Entity Type</TableHead>
                    <TableHead>Created Date</TableHead>
                    <TableHead>Last Updated</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {templateList
                    .filter(template => template.type === "consent_letter")
                    .map((template) => (
                      <TableRow key={template.id}>
                        <TableCell className="font-medium">{template.name}</TableCell>
                        <TableCell>{getEntityTypeBadge(template.entityType)}</TableCell>
                        <TableCell>{new Date(template.createdAt).toLocaleDateString()}</TableCell>
                        <TableCell>{new Date(template.updatedAt).toLocaleDateString()}</TableCell>
                        <TableCell className="text-right space-x-2">
                          <Button variant="ghost" size="sm" onClick={() => handleEditTemplate(template)}>
                            <FileEdit className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="sm" onClick={() => handleDeleteTemplate(template)}>
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
        
        {/* Audit Plans Tab */}
        <TabsContent value="audit_plan">
          <Card>
            <CardHeader>
              <CardTitle>Audit Plans</CardTitle>
              <CardDescription>
                Templates for audit planning documents
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[300px]">Template Name</TableHead>
                    <TableHead>Entity Type</TableHead>
                    <TableHead>Created Date</TableHead>
                    <TableHead>Last Updated</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {templateList
                    .filter(template => template.type === "audit_plan")
                    .map((template) => (
                      <TableRow key={template.id}>
                        <TableCell className="font-medium">{template.name}</TableCell>
                        <TableCell>{getEntityTypeBadge(template.entityType)}</TableCell>
                        <TableCell>{new Date(template.createdAt).toLocaleDateString()}</TableCell>
                        <TableCell>{new Date(template.updatedAt).toLocaleDateString()}</TableCell>
                        <TableCell className="text-right space-x-2">
                          <Button variant="ghost" size="sm" onClick={() => handleEditTemplate(template)}>
                            <FileEdit className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="sm" onClick={() => handleDeleteTemplate(template)}>
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
      
      {/* Create/Edit Template Dialog */}
      <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
        <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{isEditMode ? "Edit Template" : "Create New Template"}</DialogTitle>
            <DialogDescription>
              {isEditMode 
                ? "Update template details and content" 
                : "Create a new document template for your audit workflow"}
            </DialogDescription>
          </DialogHeader>
          
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Template Name</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter template name" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="type"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Document Type</FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select document type" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="management_letter">Management Letter</SelectItem>
                            <SelectItem value="engagement_letter">Engagement Letter</SelectItem>
                            <SelectItem value="consent_letter">Consent Letter</SelectItem>
                            <SelectItem value="audit_plan">Audit Plan</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="entityType"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Entity Type</FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select entity type" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="corporate">Corporate</SelectItem>
                            <SelectItem value="partnership">Partnership</SelectItem>
                            <SelectItem value="trust">Trust</SelectItem>
                            <SelectItem value="proprietorship">Proprietorship</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>
              
              <FormField
                control={form.control}
                name="content"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Template Content</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Enter template content"
                        className="h-64 font-mono"
                        {...field}
                      />
                    </FormControl>
                    <FormDescription>
                      Use variables like {"{clientName}"}, {"{fiscalYear}"}, etc. for dynamic content
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="defaultValues"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Default Values (JSON)</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder='{ "clientName": "", "fiscalYear": "" }'
                        className="h-24 font-mono"
                        {...field}
                      />
                    </FormControl>
                    <FormDescription>
                      Specify default values for template variables in JSON format
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <DialogFooter>
                <Button type="submit">
                  <FileCheck className="mr-2 h-4 w-4" />
                  {isEditMode ? "Update Template" : "Save Template"}
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default DocumentTemplates;
