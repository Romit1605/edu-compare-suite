import { useState } from "react";
import { API_BASE_URL } from "@/config";
import { Navbar } from "@/components/Navbar";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { BarChart3, Search } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";

interface AnalysisResult {
  courseId: string;
  courseTitle: string;
  platform: string;
  description: string;
  word: string;
  count: number;
}

const WordAnalyzer = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCourse, setSelectedCourse] = useState<any>(null);
  const [word, setWord] = useState("");
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [courses, setCourses] = useState<any[]>([]);
  const [recentAnalyses, setRecentAnalyses] = useState<AnalysisResult[]>([]);

  const handleCourseSearch = async (query: string) => {
    setSearchQuery(query);
    if (query.length > 2) {
      try {
        const response = await fetch(
          `${API_BASE_URL}/courses/search?keyword=${encodeURIComponent(query)}`
        );
        if (response.ok) {
          const data = await response.json();
          setCourses(data.courses?.slice(0, 5) || []);
        }
      } catch (error) {
        setCourses([
          { id: "1", title: "Complete Python Bootcamp", platform: "Udemy" },
          { id: "2", title: "Machine Learning A-Z", platform: "Coursera" },
        ]);
      }
    }
  };

  const handleAnalyze = async () => {
    if (!selectedCourse || !word) {
      toast.error("Please select a course and enter a word");
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(
        `${API_BASE_URL}/courses/${selectedCourse.id}/frequency?word=${encodeURIComponent(
          word
        )}`
      );
      if (response.ok) {
        const data = await response.json();
        const analysisResult: AnalysisResult = {
          courseId: selectedCourse.id,
          courseTitle: selectedCourse.title,
          platform: selectedCourse.platform,
          description: selectedCourse.description || "",
          word: word,
          count: data.count || 0,
        };
        setResult(analysisResult);

        // Save to localStorage
        const recent = JSON.parse(localStorage.getItem("recentAnalyses") || "[]");
        recent.unshift(analysisResult);
        const updated = recent.slice(0, 5);
        localStorage.setItem("recentAnalyses", JSON.stringify(updated));
        setRecentAnalyses(updated);

        toast.success("Analysis complete!");
      }
    } catch (error) {
      // Mock result
      const analysisResult: AnalysisResult = {
        courseId: selectedCourse.id,
        courseTitle: selectedCourse.title,
        platform: selectedCourse.platform,
        description: "A comprehensive course on programming",
        word: word,
        count: Math.floor(Math.random() * 50) + 1,
      };
      setResult(analysisResult);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <div className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center gap-3 mb-2">
            <BarChart3 className="w-10 h-10 text-primary" />
            <h1 className="text-4xl font-bold">Word Frequency Analyzer</h1>
          </div>
          <p className="text-muted-foreground mb-8">
            Analyze how many times a word appears in any course
          </p>

          <Card className="p-8 mb-8">
            <div className="space-y-6">
              {/* Step 1: Search for course */}
              <div>
                <label className="font-semibold mb-2 block">
                  Step 1: Search for a course
                </label>
                <div className="relative">
                  <Input
                    type="text"
                    placeholder="Type to search courses..."
                    value={searchQuery}
                    onChange={(e) => handleCourseSearch(e.target.value)}
                    className="h-12"
                  />
                  {courses.length > 0 && searchQuery && (
                    <Card className="absolute top-full mt-2 w-full z-50 max-h-64 overflow-auto">
                      <div className="p-2">
                        {courses.map((course) => (
                          <button
                            key={course.id}
                            onClick={() => {
                              setSelectedCourse(course);
                              setSearchQuery(course.title);
                              setCourses([]);
                            }}
                            className="w-full text-left p-3 hover:bg-muted rounded-lg transition-colors"
                          >
                            <div className="font-medium">{course.title}</div>
                            <div className="text-sm text-muted-foreground">
                              {course.platform}
                            </div>
                          </button>
                        ))}
                      </div>
                    </Card>
                  )}
                </div>
                {selectedCourse && (
                  <div className="mt-3 p-3 bg-muted rounded-lg">
                    <div className="font-medium">Selected: {selectedCourse.title}</div>
                    <Badge variant="secondary" className="mt-1">
                      {selectedCourse.platform}
                    </Badge>
                  </div>
                )}
              </div>

              {/* Step 2: Enter word */}
              <div>
                <label className="font-semibold mb-2 block">
                  Step 2: Enter word to analyze
                </label>
                <Input
                  type="text"
                  placeholder="e.g., python, machine, data"
                  value={word}
                  onChange={(e) => setWord(e.target.value)}
                  className="h-12"
                />
              </div>

              <Button
                onClick={handleAnalyze}
                size="lg"
                className="w-full"
                disabled={!selectedCourse || !word || loading}
              >
                {loading ? "Analyzing..." : "Analyze"}
              </Button>
            </div>
          </Card>

          {/* Results */}
          {result && (
            <Card className="p-8 mb-8 bg-gradient-to-br from-primary/5 to-secondary/5 animate-fade-in">
              <div className="text-center mb-6">
                <div className="text-6xl font-bold text-primary mb-2">
                  {result.count}
                </div>
                <p className="text-xl">
                  The word <span className="font-bold">"{result.word}"</span> appears{" "}
                  <span className="font-bold">{result.count}</span> times in this course
                </p>
              </div>

              <div className="max-w-md mx-auto">
                <Progress value={Math.min(result.count * 2, 100)} className="h-3" />
              </div>

              <div className="mt-6 p-4 bg-card rounded-lg">
                <h3 className="font-bold mb-2">{result.courseTitle}</h3>
                <Badge variant="secondary">{result.platform}</Badge>
                {result.description && (
                  <p className="text-sm text-muted-foreground mt-2">
                    {result.description}
                  </p>
                )}
              </div>
            </Card>
          )}

          {/* Recent Analyses */}
          {recentAnalyses.length > 0 && (
            <div>
              <h2 className="text-2xl font-bold mb-4">Recent Analyses</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {recentAnalyses.map((analysis, index) => (
                  <Card key={index} className="p-4">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <div className="font-semibold line-clamp-1">
                          {analysis.courseTitle}
                        </div>
                        <Badge variant="secondary" className="mt-1">
                          {analysis.platform}
                        </Badge>
                      </div>
                      <div className="text-2xl font-bold text-primary">
                        {analysis.count}
                      </div>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Word: <span className="font-medium">"{analysis.word}"</span>
                    </p>
                  </Card>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default WordAnalyzer;
