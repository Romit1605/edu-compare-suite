import { useState, useEffect } from "react";
import { API_BASE_URL } from "@/config";
import { useSearchParams, useNavigate } from "react-router-dom";
import { Navbar } from "@/components/Navbar";
import { CourseCard } from "@/components/CourseCard";
import { RankedResults } from "@/components/RankedResults";
import { SearchFilters } from "@/components/SearchFilters";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, AlertCircle } from "lucide-react";

interface Course {
  id: string;
  title: string;
  platform: string;
  category: string;
  instructor: string;
  rating: number;
  price: string | number;
  image?: string;
  url?: string;
}

interface RankedCourse {
  courseId: string;
  title: string;
  platform: string;
  rankScore: number;
  occurrences: number;
  rank: number;
}

const SearchResults = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const query = searchParams.get("q") || "";

  const [searchQuery, setSearchQuery] = useState(query);
  const [courses, setCourses] = useState<Course[]>([]);
  const [rankedCourses, setRankedCourses] = useState<RankedCourse[]>([]);
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [filters, setFilters] = useState({
    platforms: [] as string[],
    category: "all",
    price: "all",
    rating: "all",
  });

  useEffect(() => {
    if (query) {
      fetchResults(query);
    }
  }, [query]);

  const fetchResults = async (searchQuery: string) => {
    setLoading(true);
    try {
      // 1. Search API (POST)
      const searchResponse = await fetch(`${API_BASE_URL}/search`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ search: searchQuery }),
      });

      if (searchResponse.ok) {
        const searchData = await searchResponse.json();
        // Map backend Course to frontend Course interface
        const mappedCourses = (searchData.courses_found || []).map((c: any, index: number) => ({
          id: index.toString(),
          title: c.title,
          platform: c.university || c.type || "Unknown",
          category: c.category || "General",
          instructor: c.university || "Unknown",
          rating: 4.5,
          price: "Free",
          image: c.imageUrl,
          url: c.url
        }));
        setCourses(mappedCourses);
      }

      // 2. Spell Check API (POST)
      const spellCheckResponse = await fetch(`${API_BASE_URL}/spellcheck`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ word: searchQuery }),
      });

      if (spellCheckResponse.ok) {
        const spellData = await spellCheckResponse.json();
        if (!spellData.speltCorrectly && spellData.correctedWord) {
          setSuggestions([spellData.correctedWord]);
        } else {
          setSuggestions([]);
        }
      }

      setRankedCourses([]);

    } catch (error) {
      console.error("Error fetching results:", error);
      setCourses([]);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = () => {
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery)}`);
    }
  };

  const handleSuggestionClick = (suggestion: string) => {
    setSearchQuery(suggestion);
    navigate(`/search?q=${encodeURIComponent(suggestion)}`);
  };

  const filteredCourses = courses.filter((course) => {
    if (filters.platforms.length > 0 && !filters.platforms.includes(course.platform)) {
      return false;
    }
    if (filters.category && filters.category !== "all" && course.category !== filters.category) {
      return false;
    }
    if (filters.price === "free" && course.price !== "FREE") {
      return false;
    }
    if (filters.price === "paid" && course.price === "FREE") {
      return false;
    }
    if (filters.rating === "4+" && course.rating < 4) {
      return false;
    }
    if (filters.rating === "3+" && course.rating < 3) {
      return false;
    }
    return true;
  });

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <div className="container mx-auto px-4 py-8">
        {/* Search Bar */}
        <div className="max-w-2xl mx-auto mb-8">
          <div className="flex gap-2">
            <Input
              type="text"
              placeholder="Search for courses..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSearch()}
              className="h-12"
            />
            <Button onClick={handleSearch} size="lg">
              <Search className="w-5 h-5" />
            </Button>
          </div>
        </div>

        {/* Ranked Results */}
        {rankedCourses.length > 0 && (
          <RankedResults keyword={query} courses={rankedCourses} />
        )}

        <div className="flex flex-col md:flex-row gap-8 mt-8">
          {/* Filters Sidebar */}
          <SearchFilters filters={filters} onFiltersChange={setFilters} />

          {/* Main Content */}
          <div className="flex-1">
            {loading ? (
              <div className="text-center py-12">
                <div className="animate-spin w-12 h-12 border-4 border-primary border-t-transparent rounded-full mx-auto"></div>
                <p className="mt-4 text-muted-foreground">Searching courses...</p>
              </div>
            ) : (
              <>
                {suggestions.length > 0 && (
                  <div className="mb-6 p-4 bg-muted/50 rounded-lg border border-border">
                    <p className="text-muted-foreground mb-2 flex items-center gap-2">
                      <AlertCircle className="w-4 h-4" />
                      Did you mean:
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {suggestions.map((suggestion, index) => (
                        <Button
                          key={index}
                          variant="outline"
                          size="sm"
                          onClick={() => handleSuggestionClick(suggestion)}
                          className="bg-background hover:bg-accent"
                        >
                          {suggestion}
                        </Button>
                      ))}
                    </div>
                  </div>
                )}

                {filteredCourses.length > 0 ? (
                  <>
                    <h2 className="text-2xl font-bold mb-6">
                      {filteredCourses.length} results found for "{query}"
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {filteredCourses.map((course) => (
                        <CourseCard key={course.id} course={course} />
                      ))}
                    </div>
                  </>
                ) : (
                  <div className="text-center py-12">
                    <AlertCircle className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                    <h3 className="text-2xl font-semibold mb-4">
                      No courses found for "{query}"
                    </h3>
                    <p className="text-muted-foreground">
                      Try checking your spelling or using different keywords.
                    </p>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SearchResults;
