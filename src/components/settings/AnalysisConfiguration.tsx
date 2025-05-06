
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
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "@/hooks/use-toast";
import { Slider } from "@/components/ui/slider";

const varianceThresholdsSchema = z.object({
  incomeVariancePercent: z.number().min(0).max(100),
  expenseVariancePercent: z.number().min(0).max(100),
  assetVariancePercent: z.number().min(0).max(100),
  liabilityVariancePercent: z.number().min(0).max(100),
  enableAutoFlags: z.boolean().default(true),
  flagHighRiskAccounts: z.boolean().default(true),
  analysisYearCount: z.string().default("3"),
});

const samplingConfigSchema = z.object({
  defaultSamplingMethod: z.enum(["random", "stratified", "monetary", "systematic"]).default("stratified"),
  purchaseCoveragePercent: z.number().min(0).max(100),
  salesCoveragePercent: z.number().min(0).max(100),
  expenseCoveragePercent: z.number().min(0).max(100),
  minimumSampleSize: z.string().default("30"),
  highValueThreshold: z.string().default("100000"),
  riskFactorMultiplier: z.string().default("1.5"),
});

const riskParametersSchema = z.object({
  enableRiskBasedSampling: z.boolean().default(true),
  highRiskAccounts: z.string().default("cash,inventory,receivables"),
  lowRiskAccounts: z.string().default("fixed assets,prepaid expenses"),
  clientRiskImpact: z.boolean().default(true),
  accountRiskImpact: z.boolean().default(true),
  historyRiskImpact: z.boolean().default(true),
  defaultRiskLevel: z.enum(["low", "medium", "high"]).default("medium"),
});

const AnalysisConfiguration = () => {
  const [activeTab, setActiveTab] = React.useState("variance");
  
  const varianceForm = useForm<z.infer<typeof varianceThresholdsSchema>>({
    resolver: zodResolver(varianceThresholdsSchema),
    defaultValues: {
      incomeVariancePercent: 10,
      expenseVariancePercent: 15,
      assetVariancePercent: 10,
      liabilityVariancePercent: 10,
      enableAutoFlags: true,
      flagHighRiskAccounts: true,
      analysisYearCount: "3",
    },
  });
  
  const samplingForm = useForm<z.infer<typeof samplingConfigSchema>>({
    resolver: zodResolver(samplingConfigSchema),
    defaultValues: {
      defaultSamplingMethod: "stratified",
      purchaseCoveragePercent: 60,
      salesCoveragePercent: 50,
      expenseCoveragePercent: 40,
      minimumSampleSize: "30",
      highValueThreshold: "100000",
      riskFactorMultiplier: "1.5",
    },
  });
  
  const riskForm = useForm<z.infer<typeof riskParametersSchema>>({
    resolver: zodResolver(riskParametersSchema),
    defaultValues: {
      enableRiskBasedSampling: true,
      highRiskAccounts: "cash,inventory,receivables",
      lowRiskAccounts: "fixed assets,prepaid expenses",
      clientRiskImpact: true,
      accountRiskImpact: true,
      historyRiskImpact: true,
      defaultRiskLevel: "medium",
    },
  });
  
  const onVarianceSubmit = (values: z.infer<typeof varianceThresholdsSchema>) => {
    toast({
      title: "Variance thresholds updated",
      description: "Your variance analysis settings have been saved.",
    });
  };
  
  const onSamplingSubmit = (values: z.infer<typeof samplingConfigSchema>) => {
    toast({
      title: "Sampling configuration updated",
      description: "Your sampling settings have been saved.",
    });
  };
  
  const onRiskSubmit = (values: z.infer<typeof riskParametersSchema>) => {
    toast({
      title: "Risk parameters updated",
      description: "Your risk assessment settings have been saved.",
    });
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold">Analysis & Sampling Configuration</h2>
        <p className="text-muted-foreground">
          Configure parameters for financial analysis and audit sampling
        </p>
      </div>
      
      <Separator />
      
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="variance">Variance Thresholds</TabsTrigger>
          <TabsTrigger value="sampling">Sampling Configuration</TabsTrigger>
          <TabsTrigger value="risk">Risk Assessment</TabsTrigger>
        </TabsList>
        
        {/* Variance Thresholds Tab */}
        <TabsContent value="variance">
          <Card>
            <CardHeader>
              <CardTitle>Variance Analysis Settings</CardTitle>
              <CardDescription>
                Configure thresholds for financial statement variance analysis
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Form {...varianceForm}>
                <form onSubmit={varianceForm.handleSubmit(onVarianceSubmit)} className="space-y-6">
                  <h3 className="text-lg font-medium">Variance Thresholds</h3>
                  <div className="space-y-4">
                    <FormField
                      control={varianceForm.control}
                      name="incomeVariancePercent"
                      render={({ field }) => (
                        <FormItem>
                          <div className="flex justify-between">
                            <FormLabel>Income Variance Threshold (%)</FormLabel>
                            <span className="text-sm font-medium">{field.value}%</span>
                          </div>
                          <FormControl>
                            <Slider
                              min={1}
                              max={50}
                              step={1}
                              defaultValue={[field.value]}
                              onValueChange={([value]) => field.onChange(value)}
                              aria-label="Income variance threshold"
                            />
                          </FormControl>
                          <FormDescription>
                            Percentage difference that triggers a variance flag for income accounts
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={varianceForm.control}
                      name="expenseVariancePercent"
                      render={({ field }) => (
                        <FormItem>
                          <div className="flex justify-between">
                            <FormLabel>Expense Variance Threshold (%)</FormLabel>
                            <span className="text-sm font-medium">{field.value}%</span>
                          </div>
                          <FormControl>
                            <Slider
                              min={1}
                              max={50}
                              step={1}
                              defaultValue={[field.value]}
                              onValueChange={([value]) => field.onChange(value)}
                              aria-label="Expense variance threshold"
                            />
                          </FormControl>
                          <FormDescription>
                            Percentage difference that triggers a variance flag for expense accounts
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={varianceForm.control}
                      name="assetVariancePercent"
                      render={({ field }) => (
                        <FormItem>
                          <div className="flex justify-between">
                            <FormLabel>Asset Variance Threshold (%)</FormLabel>
                            <span className="text-sm font-medium">{field.value}%</span>
                          </div>
                          <FormControl>
                            <Slider
                              min={1}
                              max={50}
                              step={1}
                              defaultValue={[field.value]}
                              onValueChange={([value]) => field.onChange(value)}
                              aria-label="Asset variance threshold"
                            />
                          </FormControl>
                          <FormDescription>
                            Percentage difference that triggers a variance flag for asset accounts
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={varianceForm.control}
                      name="liabilityVariancePercent"
                      render={({ field }) => (
                        <FormItem>
                          <div className="flex justify-between">
                            <FormLabel>Liability Variance Threshold (%)</FormLabel>
                            <span className="text-sm font-medium">{field.value}%</span>
                          </div>
                          <FormControl>
                            <Slider
                              min={1}
                              max={50}
                              step={1}
                              defaultValue={[field.value]}
                              onValueChange={([value]) => field.onChange(value)}
                              aria-label="Liability variance threshold"
                            />
                          </FormControl>
                          <FormDescription>
                            Percentage difference that triggers a variance flag for liability accounts
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  
                  <Separator />
                  
                  <h3 className="text-lg font-medium">Analysis Options</h3>
                  <div className="space-y-4">
                    <FormField
                      control={varianceForm.control}
                      name="enableAutoFlags"
                      render={({ field }) => (
                        <FormItem className="flex items-center justify-between rounded-lg border p-3">
                          <div>
                            <FormLabel className="text-base">Enable Automatic Flagging</FormLabel>
                            <FormDescription>
                              Automatically flag accounts that exceed variance thresholds
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
                      control={varianceForm.control}
                      name="flagHighRiskAccounts"
                      render={({ field }) => (
                        <FormItem className="flex items-center justify-between rounded-lg border p-3">
                          <div>
                            <FormLabel className="text-base">Flag High Risk Accounts</FormLabel>
                            <FormDescription>
                              Always flag high-risk accounts regardless of variance
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
                      control={varianceForm.control}
                      name="analysisYearCount"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Analysis Year Range</FormLabel>
                          <Select
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select number of years" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="2">2 Years</SelectItem>
                              <SelectItem value="3">3 Years</SelectItem>
                              <SelectItem value="4">4 Years</SelectItem>
                              <SelectItem value="5">5 Years</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormDescription>
                            Number of years to include in trend analysis
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  
                  <Button type="submit">Save Variance Settings</Button>
                </form>
              </Form>
            </CardContent>
          </Card>
        </TabsContent>
        
        {/* Sampling Configuration Tab */}
        <TabsContent value="sampling">
          <Card>
            <CardHeader>
              <CardTitle>Sampling Method Preferences</CardTitle>
              <CardDescription>
                Configure default sampling methods and coverage percentages
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Form {...samplingForm}>
                <form onSubmit={samplingForm.handleSubmit(onSamplingSubmit)} className="space-y-6">
                  <FormField
                    control={samplingForm.control}
                    name="defaultSamplingMethod"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Default Sampling Method</FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select sampling method" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="random">Random Sampling</SelectItem>
                            <SelectItem value="stratified">Stratified Sampling</SelectItem>
                            <SelectItem value="monetary">Monetary Unit Sampling</SelectItem>
                            <SelectItem value="systematic">Systematic Sampling</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormDescription>
                          The default method used for transaction sampling
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <h3 className="text-lg font-medium">Coverage Percentages</h3>
                  <div className="space-y-4">
                    <FormField
                      control={samplingForm.control}
                      name="purchaseCoveragePercent"
                      render={({ field }) => (
                        <FormItem>
                          <div className="flex justify-between">
                            <FormLabel>Purchase Sampling Coverage (%)</FormLabel>
                            <span className="text-sm font-medium">{field.value}%</span>
                          </div>
                          <FormControl>
                            <Slider
                              min={10}
                              max={100}
                              step={5}
                              defaultValue={[field.value]}
                              onValueChange={([value]) => field.onChange(value)}
                              aria-label="Purchase coverage percentage"
                            />
                          </FormControl>
                          <FormDescription>
                            Target percentage of total purchase value to cover in sampling
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={samplingForm.control}
                      name="salesCoveragePercent"
                      render={({ field }) => (
                        <FormItem>
                          <div className="flex justify-between">
                            <FormLabel>Sales Sampling Coverage (%)</FormLabel>
                            <span className="text-sm font-medium">{field.value}%</span>
                          </div>
                          <FormControl>
                            <Slider
                              min={10}
                              max={100}
                              step={5}
                              defaultValue={[field.value]}
                              onValueChange={([value]) => field.onChange(value)}
                              aria-label="Sales coverage percentage"
                            />
                          </FormControl>
                          <FormDescription>
                            Target percentage of total sales value to cover in sampling
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={samplingForm.control}
                      name="expenseCoveragePercent"
                      render={({ field }) => (
                        <FormItem>
                          <div className="flex justify-between">
                            <FormLabel>Expense Sampling Coverage (%)</FormLabel>
                            <span className="text-sm font-medium">{field.value}%</span>
                          </div>
                          <FormControl>
                            <Slider
                              min={10}
                              max={100}
                              step={5}
                              defaultValue={[field.value]}
                              onValueChange={([value]) => field.onChange(value)}
                              aria-label="Expense coverage percentage"
                            />
                          </FormControl>
                          <FormDescription>
                            Target percentage of total expense value to cover in sampling
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  
                  <Separator />
                  
                  <h3 className="text-lg font-medium">Advanced Sampling Options</h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <FormField
                      control={samplingForm.control}
                      name="minimumSampleSize"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Minimum Sample Size</FormLabel>
                          <FormControl>
                            <Input type="number" {...field} />
                          </FormControl>
                          <FormDescription>
                            Minimum number of samples regardless of population size
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={samplingForm.control}
                      name="highValueThreshold"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>High Value Threshold</FormLabel>
                          <FormControl>
                            <Input type="number" {...field} />
                          </FormControl>
                          <FormDescription>
                            Amount above which items are always included in sample
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={samplingForm.control}
                      name="riskFactorMultiplier"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Risk Factor Multiplier</FormLabel>
                          <FormControl>
                            <Input type="number" step="0.1" {...field} />
                          </FormControl>
                          <FormDescription>
                            Multiplier for sample size in high-risk areas
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  
                  <Button type="submit">Save Sampling Settings</Button>
                </form>
              </Form>
            </CardContent>
          </Card>
        </TabsContent>
        
        {/* Risk Assessment Tab */}
        <TabsContent value="risk">
          <Card>
            <CardHeader>
              <CardTitle>Risk Assessment Parameters</CardTitle>
              <CardDescription>
                Configure risk assessment settings for sampling and analysis
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Form {...riskForm}>
                <form onSubmit={riskForm.handleSubmit(onRiskSubmit)} className="space-y-6">
                  <FormField
                    control={riskForm.control}
                    name="enableRiskBasedSampling"
                    render={({ field }) => (
                      <FormItem className="flex items-center justify-between rounded-lg border p-4">
                        <div>
                          <FormLabel className="text-base">Enable Risk-Based Sampling</FormLabel>
                          <FormDescription>
                            Adjust sample sizes based on assessed risk levels
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
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <FormField
                      control={riskForm.control}
                      name="highRiskAccounts"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>High Risk Account Types</FormLabel>
                          <FormControl>
                            <Input placeholder="cash,inventory,receivables" {...field} />
                          </FormControl>
                          <FormDescription>
                            Comma-separated list of high-risk account categories
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={riskForm.control}
                      name="lowRiskAccounts"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Low Risk Account Types</FormLabel>
                          <FormControl>
                            <Input placeholder="fixed assets,prepaid expenses" {...field} />
                          </FormControl>
                          <FormDescription>
                            Comma-separated list of low-risk account categories
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  
                  <Separator />
                  
                  <h3 className="text-lg font-medium">Risk Assessment Factors</h3>
                  <div className="space-y-4">
                    <FormField
                      control={riskForm.control}
                      name="clientRiskImpact"
                      render={({ field }) => (
                        <FormItem className="flex items-center justify-between rounded-lg border p-3">
                          <div>
                            <FormLabel className="text-base">Client Risk Profile Impact</FormLabel>
                            <FormDescription>
                              Consider client risk level in sampling parameters
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
                      control={riskForm.control}
                      name="accountRiskImpact"
                      render={({ field }) => (
                        <FormItem className="flex items-center justify-between rounded-lg border p-3">
                          <div>
                            <FormLabel className="text-base">Account Type Risk Impact</FormLabel>
                            <FormDescription>
                              Consider account type risk level in sampling parameters
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
                      control={riskForm.control}
                      name="historyRiskImpact"
                      render={({ field }) => (
                        <FormItem className="flex items-center justify-between rounded-lg border p-3">
                          <div>
                            <FormLabel className="text-base">Historical Issues Impact</FormLabel>
                            <FormDescription>
                              Consider past audit issues in risk assessment
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
                  
                  <FormField
                    control={riskForm.control}
                    name="defaultRiskLevel"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Default Risk Level</FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select default risk" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="low">Low Risk</SelectItem>
                            <SelectItem value="medium">Medium Risk</SelectItem>
                            <SelectItem value="high">High Risk</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormDescription>
                          Default risk level applied when no specific risk is defined
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <Button type="submit">Save Risk Parameters</Button>
                </form>
              </Form>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AnalysisConfiguration;
