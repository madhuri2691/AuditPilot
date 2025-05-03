
import React from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";

const clientSchema = z.object({
  name: z.string().min(2, "Client name is required"),
  industry: z.string().min(2, "Industry is required"),
  contactPerson: z.string().min(2, "Contact person is required"),
  email: z.string().email("Invalid email address"),
  phone: z.string().min(6, "Phone number is required"),
  address: z.string().min(2, "Address is required"),
  constitution: z.string().min(2, "Constitution is required"),
  auditFee: z.string().min(1, "Audit fee is required"),
  fiscalYearEnd: z.string().min(2, "Fiscal year end is required"),
  engagementType: z.string().min(2, "Engagement type is required"),
  auditStartDate: z.string().min(2, "Start date is required"),
  auditCompletionDate: z.string().min(2, "Completion date is required"),
  assignmentStaff: z.string().min(2, "Assignment staff is required"),
  auditPartner: z.string().min(2, "Audit partner is required"),
  risk: z.enum(["High", "Medium", "Low"]),
  status: z.enum(["Active", "Completed", "On Hold"]),
});

type ClientFormValues = z.infer<typeof clientSchema>;

interface AddClientFormProps {
  onSubmit: (data: ClientFormValues) => void;
  onCancel: () => void;
}

export function AddClientForm({ onSubmit, onCancel }: AddClientFormProps) {
  const form = useForm<ClientFormValues>({
    resolver: zodResolver(clientSchema),
    defaultValues: {
      name: "",
      industry: "",
      contactPerson: "",
      email: "",
      phone: "",
      address: "",
      constitution: "",
      auditFee: "",
      fiscalYearEnd: "",
      engagementType: "",
      auditStartDate: "",
      auditCompletionDate: "",
      assignmentStaff: "",
      auditPartner: "",
      risk: "Medium",
      status: "Active",
    },
  });

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Client Name</FormLabel>
                <FormControl>
                  <Input placeholder="ABC Corporation" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="engagementType"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Engagement Type</FormLabel>
                <FormControl>
                  <Input placeholder="Audit" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="industry"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Industry</FormLabel>
                <FormControl>
                  <Input placeholder="Manufacturing" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="fiscalYearEnd"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Fiscal Year End</FormLabel>
                <FormControl>
                  <Input placeholder="Dec 31" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="contactPerson"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Contact Person</FormLabel>
                <FormControl>
                  <Input placeholder="John Smith" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input type="email" placeholder="contact@example.com" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="phone"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Phone Number</FormLabel>
                <FormControl>
                  <Input placeholder="+1 (555) 123-4567" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="constitution"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Constitution</FormLabel>
                <FormControl>
                  <Input placeholder="LLC" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="auditFee"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Audit Fee</FormLabel>
                <FormControl>
                  <Input placeholder="10,000" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="auditStartDate"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Audit Start Date</FormLabel>
                <FormControl>
                  <Input type="date" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="auditCompletionDate"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Target Completion Date</FormLabel>
                <FormControl>
                  <Input type="date" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="assignmentStaff"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Assignment Staff</FormLabel>
                <FormControl>
                  <Input placeholder="Jane Doe" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="auditPartner"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Audit Partner</FormLabel>
                <FormControl>
                  <Input placeholder="Robert Johnson" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="risk"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Risk Level</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select risk level" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="Low">Low</SelectItem>
                    <SelectItem value="Medium">Medium</SelectItem>
                    <SelectItem value="High">High</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="status"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Status</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="Active">Active</SelectItem>
                    <SelectItem value="On Hold">On Hold</SelectItem>
                    <SelectItem value="Completed">Completed</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="address"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Address</FormLabel>
              <FormControl>
                <Textarea placeholder="123 Main St, City, State, ZIP" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex justify-end space-x-2">
          <Button variant="outline" type="button" onClick={onCancel}>
            Cancel
          </Button>
          <Button type="submit">Save Client</Button>
        </div>
      </form>
    </Form>
  );
}
