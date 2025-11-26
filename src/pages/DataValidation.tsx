import { useState, useEffect } from "react";
import { API_BASE_URL } from "@/config";
import { Navbar } from "@/components/Navbar";
import { Card } from "@/components/ui/card";
import { CheckCircle2, XCircle, Code } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";

interface ValidationStats {
  validUrls: number;
  invalidUrls: number;
  validEmails: number;
  invalidEmails: number;
  validPrices: number;
  invalidPrices: number;
  totalRecords: number;
}

interface InvalidEntry {
  id: string;
  type: string;
  value: string;
  reason: string;
}

const DataValidation = () => {
  const [stats, setStats] = useState<ValidationStats>({
    validUrls: 0,
    invalidUrls: 0,
    validEmails: 0,
    invalidEmails: 0,
    validPrices: 0,
    invalidPrices: 0,
    totalRecords: 0,
  });
  const [invalidEntries, setInvalidEntries] = useState<InvalidEntry[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchValidationStats();
  }, []);

  const fetchValidationStats = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${API_BASE_URL}/validation/stats`);
      if (response.ok) {
        const data = await response.json();
        setStats(data.stats || {});
        setInvalidEntries(data.invalidEntries || []);
      }
    } catch (error) {
      // Mock data
      setStats({
        validUrls: 1245,
        invalidUrls: 12,
        validEmails: 980,
        invalidEmails: 5,
        validPrices: 1100,
        invalidPrices: 8,
        totalRecords: 1257,
      });
      setInvalidEntries([
        { id: "1", type: "URL", value: "htp://invalid-url", reason: "Invalid protocol" },
        { id: "2", type: "Email", value: "notanemail", reason: "Missing @ symbol" },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const validationRules = [
    {
      name: "URL Validation",
      pattern: "^https?://[^\\s]+$",
      description: "Validates HTTP/HTTPS URLs",
    },
    {
      name: "Email Validation",
      pattern: "^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}$",
      description: "Validates email addresses",
    },
    {
      name: "Price Validation",
      pattern: "^\\$?\\d+(\\.\\d{2})?$",
      description: "Validates price formats",
    },
  ];

  const calculatePercentage = (valid: number, invalid: number) => {
    const total = valid + invalid;
    return total > 0 ? (valid / total) * 100 : 0;
  };

  const overallQuality =
    (calculatePercentage(stats.validUrls, stats.invalidUrls) +
      calculatePercentage(stats.validEmails, stats.invalidEmails) +
      calculatePercentage(stats.validPrices, stats.invalidPrices)) /
    3;

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="container mx-auto px-4 py-12">
          <div className="text-center py-12">
            <div className="animate-spin w-12 h-12 border-4 border-primary border-t-transparent rounded-full mx-auto"></div>
            <p className="mt-4 text-muted-foreground">Loading validation data...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <div className="container mx-auto px-4 py-12">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center gap-3 mb-2">
            <CheckCircle2 className="w-10 h-10 text-success" />
            <h1 className="text-4xl font-bold">Data Validation Report</h1>
          </div>
          <p className="text-muted-foreground mb-8">
            Quality checks using regular expressions
          </p>

          {/* Statistics Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
            {/* URLs */}
            <Card className="p-6 animate-fade-in">
              <h3 className="font-bold text-lg mb-4">URLs Validation</h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="flex items-center gap-2 text-success">
                    <CheckCircle2 className="w-5 h-5" />
                    Valid
                  </span>
                  <span className="font-bold">{stats.validUrls}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="flex items-center gap-2 text-destructive">
                    <XCircle className="w-5 h-5" />
                    Invalid
                  </span>
                  <span className="font-bold">{stats.invalidUrls}</span>
                </div>
                <Progress
                  value={calculatePercentage(stats.validUrls, stats.invalidUrls)}
                  className="h-2 mt-2"
                />
                <p className="text-sm text-muted-foreground text-center">
                  {calculatePercentage(stats.validUrls, stats.invalidUrls).toFixed(1)}% valid
                </p>
              </div>
            </Card>

            {/* Emails */}
            <Card className="p-6 animate-fade-in" style={{ animationDelay: "100ms" }}>
              <h3 className="font-bold text-lg mb-4">Email Validation</h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="flex items-center gap-2 text-success">
                    <CheckCircle2 className="w-5 h-5" />
                    Valid
                  </span>
                  <span className="font-bold">{stats.validEmails}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="flex items-center gap-2 text-destructive">
                    <XCircle className="w-5 h-5" />
                    Invalid
                  </span>
                  <span className="font-bold">{stats.invalidEmails}</span>
                </div>
                <Progress
                  value={calculatePercentage(stats.validEmails, stats.invalidEmails)}
                  className="h-2 mt-2"
                />
                <p className="text-sm text-muted-foreground text-center">
                  {calculatePercentage(stats.validEmails, stats.invalidEmails).toFixed(1)}% valid
                </p>
              </div>
            </Card>

            {/* Prices */}
            <Card className="p-6 animate-fade-in" style={{ animationDelay: "200ms" }}>
              <h3 className="font-bold text-lg mb-4">Price Format</h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="flex items-center gap-2 text-success">
                    <CheckCircle2 className="w-5 h-5" />
                    Valid
                  </span>
                  <span className="font-bold">{stats.validPrices}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="flex items-center gap-2 text-destructive">
                    <XCircle className="w-5 h-5" />
                    Invalid
                  </span>
                  <span className="font-bold">{stats.invalidPrices}</span>
                </div>
                <Progress
                  value={calculatePercentage(stats.validPrices, stats.invalidPrices)}
                  className="h-2 mt-2"
                />
                <p className="text-sm text-muted-foreground text-center">
                  {calculatePercentage(stats.validPrices, stats.invalidPrices).toFixed(1)}% valid
                </p>
              </div>
            </Card>

            {/* Overall */}
            <Card className="p-6 bg-gradient-to-br from-primary/10 to-secondary/10 animate-fade-in" style={{ animationDelay: "300ms" }}>
              <h3 className="font-bold text-lg mb-4">Overall Quality</h3>
              <div className="text-center">
                <div className="text-5xl font-bold text-primary mb-2">
                  {overallQuality.toFixed(1)}%
                </div>
                <Progress value={overallQuality} className="h-3 mb-2" />
                <p className="text-sm text-muted-foreground">
                  Total records: {stats.totalRecords}
                </p>
              </div>
            </Card>
          </div>

          {/* Validation Rules */}
          <Card className="p-8 mb-8">
            <div className="flex items-center gap-2 mb-6">
              <Code className="w-6 h-6 text-primary" />
              <h2 className="text-2xl font-bold">Validation Rules</h2>
            </div>
            <div className="space-y-4">
              {validationRules.map((rule, index) => (
                <div
                  key={index}
                  className="p-4 bg-muted rounded-lg hover:bg-muted/70 transition-colors"
                >
                  <h4 className="font-semibold mb-2">{rule.name}</h4>
                  <code className="text-sm bg-card px-3 py-1 rounded">
                    {rule.pattern}
                  </code>
                  <p className="text-sm text-muted-foreground mt-2">{rule.description}</p>
                </div>
              ))}
            </div>
          </Card>

          {/* View Invalid Data */}
          <Dialog>
            <DialogTrigger asChild>
              <Button size="lg" variant="outline" className="w-full">
                View Invalid Data ({invalidEntries.length})
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl max-h-[80vh] overflow-auto">
              <DialogHeader>
                <DialogTitle>Invalid Data Entries</DialogTitle>
              </DialogHeader>
              <div className="space-y-3 mt-4">
                {invalidEntries.map((entry) => (
                  <Card key={entry.id} className="p-4">
                    <div className="flex items-start gap-3">
                      <XCircle className="w-5 h-5 text-destructive mt-1" />
                      <div className="flex-1">
                        <div className="font-semibold">{entry.type}</div>
                        <code className="text-sm bg-muted px-2 py-1 rounded">
                          {entry.value}
                        </code>
                        <p className="text-sm text-muted-foreground mt-1">
                          {entry.reason}
                        </p>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>
    </div>
  );
};

export default DataValidation;
