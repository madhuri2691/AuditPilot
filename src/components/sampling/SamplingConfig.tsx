
import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Slider } from "@/components/ui/slider";
import { Separator } from "@/components/ui/separator";
import { TransactionItem, SamplingModuleType, SamplingMethod } from "./SamplingTool";
import { toast } from "sonner";

interface SamplingConfigProps {
  data: TransactionItem[];
  moduleType: SamplingModuleType;
  onSamplingComplete: (samples: TransactionItem[]) => void;
  onReset: () => void;
}

export function SamplingConfig({ 
  data, 
  moduleType, 
  onSamplingComplete, 
  onReset 
}: SamplingConfigProps) {
  const [samplingMethod, setSamplingMethod] = useState<SamplingMethod>("stratified");
  const [sampleSize, setSampleSize] = useState(20); // Default 20%
  const [isGenerating, setIsGenerating] = useState(false);
  
  // Stratified sampling thresholds
  const [highThreshold, setHighThreshold] = useState(50000);
  const [mediumThreshold, setMediumThreshold] = useState(10000);
  
  // Related party settings
  const [relatedParties, setRelatedParties] = useState("");
  const [includeAllRelatedParty, setIncludeAllRelatedParty] = useState(true);
  
  // Generate samples based on selected method
  const generateSamples = () => {
    setIsGenerating(true);
    
    // Simulate processing time
    setTimeout(() => {
      try {
        let selectedSamples: TransactionItem[] = [];
        
        // Create a copy of data for processing
        const processData = [...data];
        
        switch (samplingMethod) {
          case "systematic":
            selectedSamples = generateSystematicSample(processData, sampleSize);
            break;
          case "stratified":
            selectedSamples = generateStratifiedSample(processData, highThreshold, mediumThreshold);
            break;
          case "random":
            selectedSamples = generateRandomSample(processData, sampleSize);
            break;
          case "risk-based":
            selectedSamples = generateRiskBasedSample(processData, sampleSize);
            break;
        }
        
        // Handle related party transactions if any are specified
        if (relatedParties.trim()) {
          const relatedPartyList = relatedParties.split(',').map(party => party.trim().toLowerCase());
          
          // Function to check if a transaction involves a related party
          const isRelatedParty = (item: TransactionItem) => {
            const vendor = item.vendor?.toLowerCase() || '';
            const customer = item.customer?.toLowerCase() || '';
            const description = item.description.toLowerCase();
            
            return relatedPartyList.some(party => 
              vendor.includes(party) || 
              customer.includes(party) || 
              description.includes(party)
            );
          };
          
          // Find related party transactions
          const relatedPartyTransactions = processData.filter(isRelatedParty);
          
          // Include all related party transactions if option is selected
          if (includeAllRelatedParty && relatedPartyTransactions.length > 0) {
            // Add related party transactions not already in the sample
            const existingIds = new Set(selectedSamples.map(item => item.id));
            const additionalRelatedParties = relatedPartyTransactions.filter(
              item => !existingIds.has(item.id)
            );
            
            selectedSamples = [...selectedSamples, ...additionalRelatedParties];
          }
        }
        
        // Ensure unique samples (in case of overlap)
        const uniqueSamples = Array.from(
          new Map(selectedSamples.map(item => [item.id, item])).values()
        );
        
        // Sort samples by date
        uniqueSamples.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
        
        onSamplingComplete(uniqueSamples);
        
      } catch (error) {
        console.error("Error generating samples:", error);
        toast.error("Failed to generate samples");
      } finally {
        setIsGenerating(false);
      }
    }, 1000);
  };
  
  // Systematic sampling method
  const generateSystematicSample = (data: TransactionItem[], percentage: number) => {
    const totalCount = data.length;
    const sampleCount = Math.max(1, Math.ceil(totalCount * (percentage / 100)));
    const interval = Math.floor(totalCount / sampleCount);
    
    const samples: TransactionItem[] = [];
    let currentIndex = Math.floor(Math.random() * interval); // Random start
    
    while (samples.length < sampleCount && currentIndex < totalCount) {
      samples.push(data[currentIndex]);
      currentIndex += interval;
    }
    
    return samples;
  };
  
  // Stratified sampling method
  const generateStratifiedSample = (data: TransactionItem[], highThreshold: number, mediumThreshold: number) => {
    // Group transactions by strata
    const highValueItems = data.filter(item => item.amount >= highThreshold);
    const mediumValueItems = data.filter(
      item => item.amount >= mediumThreshold && item.amount < highThreshold
    );
    const lowValueItems = data.filter(item => item.amount < mediumThreshold);
    
    // Sample 100% of high value, 50% of medium value, 10% of low value
    const highValueSamples = highValueItems;
    const mediumValueSamples = generateRandomSample(mediumValueItems, 50);
    const lowValueSamples = generateRandomSample(lowValueItems, 10);
    
    return [...highValueSamples, ...mediumValueSamples, ...lowValueSamples];
  };
  
  // Random sampling method
  const generateRandomSample = (data: TransactionItem[], percentage: number) => {
    const totalCount = data.length;
    const sampleCount = Math.max(1, Math.ceil(totalCount * (percentage / 100)));
    
    // Shuffle the array (Fisher-Yates algorithm)
    const shuffled = [...data];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    
    return shuffled.slice(0, sampleCount);
  };
  
  // Risk-based sampling method
  const generateRiskBasedSample = (data: TransactionItem[], basePercentage: number) => {
    // Sort by amount (descending) for risk assessment
    const sortedData = [...data].sort((a, b) => b.amount - a.amount);
    
    // Take a higher percentage from top transactions
    const highRiskCount = Math.ceil(data.length * 0.2); // Top 20%
    const highRiskSamples = sortedData.slice(0, highRiskCount);
    
    // Take random samples from the rest
    const lowRiskData = sortedData.slice(highRiskCount);
    const lowRiskSamples = generateRandomSample(
      lowRiskData, 
      Math.max(5, basePercentage - 10) // Lower percentage for low risk items
    );
    
    return [...highRiskSamples, ...lowRiskSamples];
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-medium">Sampling Configuration</h3>
        <div>
          <Button variant="outline" onClick={onReset} className="mr-2">
            Back to Upload
          </Button>
        </div>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardContent className="pt-6">
            <div className="space-y-6">
              <div>
                <Label className="text-base">Sampling Method</Label>
                <RadioGroup 
                  value={samplingMethod}
                  onValueChange={(value) => setSamplingMethod(value as SamplingMethod)}
                  className="mt-2"
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="systematic" id="systematic" />
                    <Label htmlFor="systematic">Systematic Sampling</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="stratified" id="stratified" />
                    <Label htmlFor="stratified">Stratified Sampling</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="random" id="random" />
                    <Label htmlFor="random">Random Sampling</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="risk-based" id="risk-based" />
                    <Label htmlFor="risk-based">Risk-Based Sampling</Label>
                  </div>
                </RadioGroup>
              </div>
              
              {samplingMethod !== "stratified" && (
                <div className="space-y-2">
                  <Label>Sample Size ({sampleSize}%)</Label>
                  <div className="flex items-center gap-4">
                    <Slider 
                      min={1} 
                      max={100} 
                      step={1}
                      value={[sampleSize]}
                      onValueChange={(values) => setSampleSize(values[0])}
                      className="flex-1"
                    />
                    <Input 
                      type="number"
                      min={1}
                      max={100}
                      value={sampleSize}
                      onChange={(e) => setSampleSize(Number(e.target.value))}
                      className="w-16"
                    />
                  </div>
                </div>
              )}
              
              {samplingMethod === "stratified" && (
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label>High Value Threshold (₹{highThreshold.toLocaleString()}) - 100% sampled</Label>
                    <div className="flex items-center gap-4">
                      <Slider 
                        min={mediumThreshold + 1000} 
                        max={1000000} 
                        step={1000}
                        value={[highThreshold]}
                        onValueChange={(values) => setHighThreshold(values[0])}
                        className="flex-1"
                      />
                      <Input 
                        type="number"
                        min={mediumThreshold + 1000}
                        step={1000}
                        value={highThreshold}
                        onChange={(e) => setHighThreshold(Number(e.target.value))}
                        className="w-28"
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label>Medium Value Threshold (₹{mediumThreshold.toLocaleString()}) - 50% sampled</Label>
                    <div className="flex items-center gap-4">
                      <Slider 
                        min={1000} 
                        max={highThreshold - 1000} 
                        step={1000}
                        value={[mediumThreshold]}
                        onValueChange={(values) => setMediumThreshold(values[0])}
                        className="flex-1"
                      />
                      <Input 
                        type="number"
                        min={1000}
                        max={highThreshold - 1000}
                        step={1000}
                        value={mediumThreshold}
                        onChange={(e) => setMediumThreshold(Number(e.target.value))}
                        className="w-28"
                      />
                    </div>
                  </div>
                  
                  <p className="text-sm text-muted-foreground">
                    Transactions below ₹{mediumThreshold.toLocaleString()} will be sampled at 10%
                  </p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="pt-6">
            <div className="space-y-6">
              <div>
                <Label className="text-base">Related Party Considerations</Label>
                <div className="mt-2 space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="related-parties">Related Party Names (comma-separated)</Label>
                    <Input 
                      id="related-parties"
                      placeholder="E.g., ABC Enterprises, XYZ Limited"
                      value={relatedParties}
                      onChange={(e) => setRelatedParties(e.target.value)}
                    />
                    <p className="text-xs text-muted-foreground">
                      Enter names of related parties to identify transactions with them.
                    </p>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <input
                      type="checkbox" 
                      id="include-all-related" 
                      checked={includeAllRelatedParty}
                      onChange={(e) => setIncludeAllRelatedParty(e.target.checked)}
                      className="h-4 w-4 rounded border-gray-300"
                    />
                    <Label htmlFor="include-all-related">Include all related party transactions</Label>
                  </div>
                </div>
              </div>
              
              <Separator />
              
              <div>
                <Label className="text-base">Population Statistics</Label>
                <div className="mt-2 space-y-2">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Total Transactions:</span>
                    <span className="font-medium">{data.length}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Total Value:</span>
                    <span className="font-medium">
                      {new Intl.NumberFormat('en-IN', { 
                        style: 'currency', 
                        currency: 'INR',
                        maximumFractionDigits: 0
                      }).format(data.reduce((sum, item) => sum + item.amount, 0))}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Date Range:</span>
                    <span className="font-medium">
                      {data.length > 0 ? (
                        `${new Date(data.reduce((min, item) => 
                          new Date(item.date) < new Date(min.date) ? item : min
                        ).date).toLocaleDateString()} to ${new Date(data.reduce((max, item) => 
                          new Date(item.date) > new Date(max.date) ? item : max
                        ).date).toLocaleDateString()}`
                      ) : 'N/A'}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
      
      <div className="flex justify-end">
        <Button 
          onClick={generateSamples} 
          disabled={isGenerating}
        >
          {isGenerating ? "Generating Samples..." : "Generate Samples"}
        </Button>
      </div>
    </div>
  );
}
