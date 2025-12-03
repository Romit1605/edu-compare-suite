import { useState, useEffect } from "react";
import { API_BASE_URL } from "@/config";
import { Navbar } from "@/components/Navbar";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { TrendingUp, Search, RefreshCw } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Progress } from "@/components/ui/progress";
import axios from "axios";
import { useAppDispatch, useAppSelector } from "@/hooks/hooks";
import { setQuery } from "@/reducers/searchSlice";

export interface FrequencyResponse {
  statusCode: number;
  message: string;
  frequencyMap: Array<Record<string, number>>;
}

interface TrendingItem {
  keyword: string;
  count: number;
}

const Trending = () => {
  const navigate = useNavigate();
   const searchWord = useAppSelector((state) => state.search.query);
  const dispatch = useAppDispatch();
  const [trendingSearches, setTrendingSearches] = useState<
    TrendingItem[]
  >([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchTrendingSearches();
  }, []);

  const fetchTrendingSearches = async () => {
    setLoading(true);
    try {
      const res = await axios.get<FrequencyResponse>(
        "http://localhost:8080/api/all-freq"
      );
      console.log("total freq res", res);
      const formatted = res.data.frequencyMap.flatMap((item) =>
      Object.entries(item).map(([keyword, count]) => ({
        keyword,
        count,
      }))
    );
      setTrendingSearches(formatted);
    } catch (error) {
      // Mock data fallback
      console.error("Total Frequency api failed");
    } finally {
      setLoading(false);
    }
  };

  const handleSearchClick = (keyword: string) => {
    dispatch(setQuery(keyword));
    navigate("/search");
  };

  const maxCount = Math.max(...trendingSearches.map((s) => s.count), 0);

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
                <p className="text-muted-foreground">
                  Most popular searches right now
                </p>
              </div>
            </div>
          </div>

          {/* Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
            {trendingSearches.slice(0, 6).map((item, index) => (
              <Card
                key={index}
                className="p-6 hover:shadow-lg transition-all cursor-pointer group animate-fade-in"
                onClick={() => handleSearchClick(item.keyword)}
                style={{ animationDelay: `${index * 50}ms` }}
              >
                <div className="flex items-start justify-between mb-4">
                  <h3 className="text-xl font-bold group-hover:text-primary transition-colors">
                    {item.keyword}
                  </h3>
                  <Search className="w-5 h-5 text-muted-foreground group-hover:text-primary transition-colors" />
                </div>

                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <TrendingUp className="w-4 h-4 text-primary" />
                    <span className="text-2xl font-bold">
                      {item.count}
                    </span>
                    <span className="text-sm text-muted-foreground">
                      searches
                    </span>
                  </div>

                  <Progress
                    value={(item.count / maxCount) * 100}
                    className="h-2"
                  />

                  <p className="text-sm text-muted-foreground">
                    Last searched: {searchWord}
                  </p>
                </div>
              </Card>
            ))}
          </div>

          {/* Bar Chart */}
          <Card className="p-8">
            <h2 className="text-2xl font-bold mb-6">Top 20 Keywords</h2>
            <div className="space-y-4">
              {
                trendingSearches.slice(0, 20).map((item, index) => (
                  <div key={index} className="flex items-center gap-4">
                    <span className="w-32 text-sm">{item.keyword}</span>
                    <div className="flex-1 bg-muted h-4 rounded overflow-hidden">
                      <div
                        className="bg-primary h-4 rounded"
                        style={{
                          width: `${(item.count / maxCount) * 100}%`,
                        }}
                      ></div>
                    </div>
                    <span className="w-12 text-sm text-right">
                      {item.count}
                    </span>
                  </div>
                ))
              }
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Trending;
