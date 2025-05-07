
import React from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { format } from "date-fns";

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
import { ScrollArea } from "@/components/ui/scroll-area";
import { Loader2, CalendarIcon } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { cn } from "@/lib/utils";

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
  isSubmitting?: boolean;
}

// Helper component for date inputs
const DatePickerField = ({ 
  form, 
  name, 
  label 
}: { 
  form: any, 
  name: "fiscalYearEnd" | "auditStartDate" | "auditCompletionDate", 
  label: string 
}) => {
  const [date, setDate] = React.useState<Date | undefined>();

  React.useEffect(() => {
    const value = form.getValues(name);
    if (value) {
      try {
        const parsedDate = new Date(value);
        if (!isNaN(parsedDate.getTime())) {
          setDate(parsedDate);
        }
      } catch (e) {
        console.error(`Failed to parse date for ${name}:`, value);
      }
    }
  }, [form, name]);

  return (
    <FormField
      control={form.control}
      name={name}
      render={({ field }) => (
        <FormItem>
          <FormLabel className="text-sm">{label}</FormLabel>
          <Popover>
            <PopoverTrigger asChild>
              <FormControl>
                <Button
                  variant={"outline"}
                  className={cn(
                    "w-full pl-3 text-left font-normal",
                    !field.value && "text-muted-foreground"
                  )}
                >
                  {field.value ? (
                    format(new Date(field.value), "PPP")
                  ) : (
                    <span>Select date</span>
                  )}
                  <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                </Button>
              </FormControl>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                mode="single"
                selected={date}
                onSelect={(selectedDate) => {
                  setDate(selectedDate);
                  if (selectedDate) {
                    // Format the date as ISO string (YYYY-MM-DD)
                    field.onChange(format(selectedDate, "yyyy-MM-dd"));
                  }
                }}
                initialFocus
                className={cn("p-3 pointer-events-auto")}
              />
            </PopoverContent>
          </Popover>
          <FormMessage className="text-xs" />
        </FormItem>
      )}
    />
  );
};

export function AddClientForm({ onSubmit, onCancel, isSubmitting = false }: AddClientFormProps) {
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

  const handleFormSubmit = async (data: ClientFormValues) => {
    try {
      console.log('Form data being submitted:', data);
      await onSubmit(data);
    } catch (error) {
      console.error("Error in form submission:", error);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleFormSubmit)} className="space-y-4">
        <ScrollArea className="h-[calc(65vh-120px)] pr-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-x-4 gap-y-2 pr-2">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm">Client Name</FormLabel>
                  <FormControl>
                    <Input placeholder="ABC Corporation" {...field} className="text-sm" />
                  </FormControl>
                  <FormMessage className="text-xs" />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="engagementType"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm">Engagement Type</FormLabel>
                  <FormControl>
                    <Input placeholder="Audit" {...field} className="text-sm" />
                  </FormControl>
                  <FormMessage className="text-xs" />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="industry"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm">Industry</FormLabel>
                  <FormControl>
                    <Input placeholder="Manufacturing" {...field} className="text-sm" />
                  </FormControl>
                  <FormMessage className="text-xs" />
                </FormItem>
              )}
            />

            {/* Replace the fiscalYearEnd input with DatePickerField */}
            <DatePickerField 
              form={form} 
              name="fiscalYearEnd" 
              label="Fiscal Year End" 
            />

            <FormField
              control={form.control}
              name="contactPerson"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm">Contact Person</FormLabel>
                  <FormControl>
                    <Input placeholder="John Smith" {...field} className="text-sm" />
                  </FormControl>
                  <FormMessage className="text-xs" />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm">Email</FormLabel>
                  <FormControl>
                    <Input type="email" placeholder="contact@example.com" {...field} className="text-sm" />
                  </FormControl>
                  <FormMessage className="text-xs" />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="phone"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm">Phone Number</FormLabel>
                  <FormControl>
                    <Input placeholder="+1 (555) 123-4567" {...field} className="text-sm" />
                  </FormControl>
                  <FormMessage className="text-xs" />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="constitution"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm">Constitution</FormLabel>
                  <FormControl>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger className="text-sm">
                          <SelectValue placeholder="Select type" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="corporate">Corporate</SelectItem>
                        <SelectItem value="partnership">Partnership</SelectItem>
                        <SelectItem value="proprietorship">Proprietorship</SelectItem>
                        <SelectItem value="trust">Trust</SelectItem>
                        <SelectItem value="llc">LLC</SelectItem>
                      </SelectContent>
                    </Select>
                  </FormControl>
                  <FormMessage className="text-xs" />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="auditFee"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm">Audit Fee</FormLabel>
                  <FormControl>
                    <Input placeholder="10,000" {...field} className="text-sm" />
                  </FormControl>
                  <FormMessage className="text-xs" />
                </FormItem>
              )}
            />

            {/* Replace the auditStartDate input with DatePickerField */}
            <DatePickerField 
              form={form} 
              name="auditStartDate" 
              label="Audit Start Date" 
            />

            {/* Replace the auditCompletionDate input with DatePickerField */}
            <DatePickerField 
              form={form} 
              name="auditCompletionDate" 
              label="Completion Date" 
            />

            <FormField
              control={form.control}
              name="assignmentStaff"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm">Assignment Staff</FormLabel>
                  <FormControl>
                    <Input placeholder="Jane Doe" {...field} className="text-sm" />
                  </FormControl>
                  <FormMessage className="text-xs" />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="auditPartner"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm">Audit Partner</FormLabel>
                  <FormControl>
                    <Input placeholder="Robert Johnson" {...field} className="text-sm" />
                  </FormControl>
                  <FormMessage className="text-xs" />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="risk"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm">Risk Level</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger className="text-sm">
                        <SelectValue placeholder="Select risk level" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="Low">Low</SelectItem>
                      <SelectItem value="Medium">Medium</SelectItem>
                      <SelectItem value="High">High</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage className="text-xs" />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="status"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm">Status</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger className="text-sm">
                        <SelectValue placeholder="Select status" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="Active">Active</SelectItem>
                      <SelectItem value="On Hold">On Hold</SelectItem>
                      <SelectItem value="Completed">Completed</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage className="text-xs" />
                </FormItem>
              )}
            />
          </div>

          <div className="mt-4">
            <FormField
              control={form.control}
              name="address"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm">Address</FormLabel>
                  <FormControl>
                    <Textarea placeholder="123 Main St, City, State, ZIP" {...field} className="resize-none text-sm" rows={3} />
                  </FormControl>
                  <FormMessage className="text-xs" />
                </FormItem>
              )}
            />
          </div>
        </ScrollArea>

        <div className="flex justify-end space-x-2 pt-2 border-t">
          <Button variant="outline" type="button" onClick={onCancel} size="sm" disabled={isSubmitting}>
            Cancel
          </Button>
          <Button type="submit" size="sm" disabled={isSubmitting}>
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Saving...
              </>
            ) : (
              "Save Client"
            )}
          </Button>
        </div>
      </form>
    </Form>
  );
}
