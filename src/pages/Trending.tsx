import { useState, useEffect } from "react";
import { API_BASE_URL } from "@/config";
import { Navbar } from "@/components/Navbar";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { TrendingUp, Search, RefreshCw } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Progress } from "@/components/ui/progress";

interface TrendingSearch {
  keyword: string;
  searchCount: number;
  lastSearched: string;
}

const Trending = () => {
  const navigate = useNavigate();
  const [trendingSearches, setTrendingSearches] = useState<TrendingSearch[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchTrendingSearches();
  }, []);

  const fetchTrendingSearches = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${API_BASE_URL}/courses/search-frequency`);
      if (response.ok) {
        const data = await response.json();
        setTrendingSearches(data.trendingSearches || []);
      } else {
        // Backend does not expose this endpoint currently; use mock fallback
        setTrendingSearches([
          { keyword: "Python Programming", searchCount: 1250, lastSearched: "2 hours ago" },
          { keyword: "Machine Learning", searchCount: 980, lastSearched: "3 hours ago" },
          { keyword: "Web Development", searchCount: 845, lastSearched: "5 hours ago" },
          { keyword: "Data Science", searchCount: 720, lastSearched: "1 hour ago" },
          { keyword: "JavaScript", searchCount: 690, lastSearched: "4 hours ago" },
          { keyword: "React", searchCount: 580, lastSearched: "6 hours ago" },
          { keyword: "AI Fundamentals", searchCount: 540, lastSearched: "7 hours ago" },
          { keyword: "Cloud Computing", searchCount: 480, lastSearched: "8 hours ago" },
        ]);
      }
    } catch (error) {
      // Mock data fallback
      setTrendingSearches([
        { keyword: "Python Programming", searchCount: 1250, lastSearched: "2 hours ago" },
        { keyword: "Machine Learning", searchCount: 980, lastSearched: "3 hours ago" },
        { keyword: "Web Development", searchCount: 845, lastSearched: "5 hours ago" },
        { keyword: "Data Science", searchCount: 720, lastSearched: "1 hour ago" },
        { keyword: "JavaScript", searchCount: 690, lastSearched: "4 hours ago" },
        { keyword: "React", searchCount: 580, lastSearched: "6 hours ago" },
        { keyword: "AI Fundamentals", searchCount: 540, lastSearched: "7 hours ago" },
        { keyword: "Cloud Computing", searchCount: 480, lastSearched: "8 hours ago" },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleSearchClick = (keyword: string) => {
    navigate(`/search?q=${encodeURIComponent(keyword)}`);
  };

  const maxCount = Math.max(...trendingSearches.map((s) => s.searchCount));

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <div className="container mx-auto px-4 py-12">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-3">
              <TrendingUp className="w-10 h-10 text-primary" />
              <div>
                <h1 className="text-4xl font-bold">Trending Searches</h1>
                <p className="text-muted-foreground">Most popular searches right now</p>
              </div>
            </div>
            <Button onClick={fetchTrendingSearches} disabled={loading} variant="outline">
              <RefreshCw className={`w-4 h-4 mr-2 ${loading ? "animate-spin" : ""}`} />
              Refresh
            </Button>
          </div>

          {/* Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
            {trendingSearches.slice(0, 6).map((search, index) => (
              <Card
                key={index}
                className="p-6 hover:shadow-lg transition-all cursor-pointer group animate-fade-in"
                onClick={() => handleSearchClick(search.keyword)}
                style={{ animationDelay: `${index * 50}ms` }}
              >
                <div className="flex items-start justify-between mb-4">
                  <h3 className="text-xl font-bold group-hover:text-primary transition-colors">
                    {search.keyword}
                  </h3>
                  <Search className="w-5 h-5 text-muted-foreground group-hover:text-primary transition-colors" />
                </div>

                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <TrendingUp className="w-4 h-4 text-primary" />
                    <span className="text-2xl font-bold">{search.searchCount}</span>
                    <span className="text-sm text-muted-foreground">searches</span>
                  </div>

                  <Progress
                    value={(search.searchCount / maxCount) * 100}
                    className="h-2"
                  />

                  <p className="text-sm text-muted-foreground">
                    Last searched: {search.lastSearched}
                  </p>
                </div>
              </Card>
            ))}
          </div>

          {/* Bar Chart */}
          <Card className="p-8">
            <h2 className="text-2xl font-bold mb-6">Top 20 Keywords</h2>
            <div className="space-y-4">
              {trendingSearches.slice(0, 20).map((search, index) => (
                <div
                  key={index}
                  className="flex items-center gap-4 hover:bg-muted/50 p-2 rounded-lg transition-colors cursor-pointer"
                  onClick={() => handleSearchClick(search.keyword)}
                >
                  <div className="w-32 text-sm font-medium truncate">
                    {search.keyword}
                  </div>
                  <div className="flex-1">
                    <div className="relative h-8 bg-muted rounded-lg overflow-hidden">
                      <div
                        className="absolute inset-y-0 left-0 bg-gradient-primary flex items-center justify-end pr-3 transition-all duration-500"
                        style={{
                          width: `${(search.searchCount / maxCount) * 100}%`,
                        }}
                      >
                        <span className="text-sm font-bold text-white">
                          {search.searchCount}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Trending;
