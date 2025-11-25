import { useState } from "react";
import { Navbar } from "@/components/Navbar";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search, Mail, Link2, Phone, DollarSign, Calendar } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface PatternResult {
  courseId: string;
  title: string;
  platform: string;
  matches: string[];
}

const PatternFinder = () => {
  const [patternType, setPatternType] = useState("");
  const [results, setResults] = useState<PatternResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [totalCount, setTotalCount] = useState(0);
  const [stats, setStats] = useState<Record<string, number>>({});

  const patterns = [
    { value: "email", label: "Email Addresses", icon: Mail },
    { value: "url", label: "URLs/Links", icon: Link2 },
    { value: "phone", label: "Phone Numbers", icon: Phone },
    { value: "price", label: "Price Patterns", icon: DollarSign },
    { value: "date", label: "Dates", icon: Calendar },
  ];

  const handleFindPattern = async () => {
    if (!patternType) return;

    setLoading(true);
    try {
      const response = await fetch(
        `http://localhost:8080/api/courses/patterns?type=${patternType}`
      );
      if (response.ok) {
        const data = await response.json();
        setResults(data.results || []);
        setTotalCount(data.totalCount || 0);
        setStats(data.stats || {});
      }
    } catch (error) {
      // Mock data
      const mockResults: PatternResult[] = [
        {
          courseId: "1",
          title: "Complete Python Programming Course",
          platform: "Udemy",
          matches: ["support@example.com", "info@pythoncourse.com"],
        },
        {
          courseId: "2",
          title: "Web Development Bootcamp",
          platform: "Coursera",
          matches: ["https://example.com", "https://webdev.io"],
        },
      ];
      setResults(mockResults);
      setTotalCount(234);
      setStats({ email: 112, url: 89, phone: 23, price: 67, date: 43 });
    } finally {
      setLoading(false);
    }
  };

  const selectedPattern = patterns.find((p) => p.value === patternType);

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <div className="container mx-auto px-4 py-12">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center gap-3 mb-2">
            <Search className="w-10 h-10 text-primary" />
            <h1 className="text-4xl font-bold">Pattern Finder</h1>
          </div>
          <p className="text-muted-foreground mb-8">
            Find emails, URLs, and other patterns in course content
          </p>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left Side - Search */}
            <div className="lg:col-span-1">
              <Card className="p-6 sticky top-24">
                <h3 className="font-bold text-lg mb-4">Select Pattern Type</h3>
                <Select value={patternType} onValueChange={setPatternType}>
                  <SelectTrigger className="h-12">
                    <SelectValue placeholder="Choose pattern..." />
                  </SelectTrigger>
                  <SelectContent>
                    {patterns.map((pattern) => (
                      <SelectItem key={pattern.value} value={pattern.value}>
                        <div className="flex items-center gap-2">
                          <pattern.icon className="w-4 h-4" />
                          {pattern.label}
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <Button
                  onClick={handleFindPattern}
                  size="lg"
                  className="w-full mt-4"
                  disabled={!patternType || loading}
                >
                  {loading ? "Searching..." : "Find Pattern"}
                </Button>

                {/* Statistics */}
                {Object.keys(stats).length > 0 && (
                  <div className="mt-8">
                    <h4 className="font-semibold mb-3">Pattern Distribution</h4>
                    <div className="space-y-2">
                      {patterns.map((pattern) => (
                        <div key={pattern.value} className="flex justify-between items-center">
                          <div className="flex items-center gap-2">
                            <pattern.icon className="w-4 h-4 text-muted-foreground" />
                            <span className="text-sm">{pattern.label}</span>
                          </div>
                          <Badge variant="secondary">
                            {stats[pattern.value] || 0}
                          </Badge>
                        </div>
                      ))}
                    </div>

                    {stats.email && (
                      <div className="mt-4 p-3 bg-primary/10 rounded-lg">
                        <p className="text-sm font-medium">
                          Most common: Email addresses ({((stats.email / totalCount) * 100).toFixed(0)}%)
                        </p>
                      </div>
                    )}
                  </div>
                )}
              </Card>
            </div>

            {/* Right Side - Results */}
            <div className="lg:col-span-2">
              {loading ? (
                <div className="text-center py-12">
                  <div className="animate-spin w-12 h-12 border-4 border-primary border-t-transparent rounded-full mx-auto"></div>
                  <p className="mt-4 text-muted-foreground">Finding patterns...</p>
                </div>
              ) : results.length > 0 ? (
                <>
                  <div className="mb-6 flex items-center gap-3">
                    {selectedPattern && <selectedPattern.icon className="w-6 h-6 text-primary" />}
                    <h2 className="text-2xl font-bold">
                      Found {totalCount} courses with {selectedPattern?.label.toLowerCase()}
                    </h2>
                  </div>

                  <div className="space-y-4">
                    {results.map((result) => (
                      <Card key={result.courseId} className="p-6 hover:shadow-lg transition-shadow">
                        <div className="flex justify-between items-start mb-3">
                          <div>
                            <h3 className="font-bold text-lg mb-1">{result.title}</h3>
                            <Badge variant="secondary">{result.platform}</Badge>
                          </div>
                          <Badge className="bg-primary">{result.matches.length} found</Badge>
                        </div>

                        <div className="space-y-2">
                          {result.matches.map((match, index) => (
                            <div
                              key={index}
                              className="p-2 bg-yellow-100 dark:bg-yellow-900/20 rounded text-sm font-mono"
                            >
                              {match}
                            </div>
                          ))}
                        </div>
                      </Card>
                    ))}
                  </div>

                  {/* Pagination placeholder */}
                  <div className="mt-8 flex justify-center gap-2">
                    <Button variant="outline" disabled>Previous</Button>
                    <Button variant="outline">1</Button>
                    <Button variant="outline">2</Button>
                    <Button variant="outline">3</Button>
                    <Button variant="outline">Next</Button>
                  </div>
                </>
              ) : (
                <Card className="p-12 text-center">
                  <Search className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-xl font-semibold mb-2">No Pattern Selected</h3>
                  <p className="text-muted-foreground">
                    Select a pattern type and click "Find Pattern" to search
                  </p>
                </Card>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PatternFinder;
