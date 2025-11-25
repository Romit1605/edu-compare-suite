import { useState, useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { Navbar } from "@/components/Navbar";
import { CourseCard } from "@/components/CourseCard";
import { RankedResults } from "@/components/RankedResults";
import { SearchFilters } from "@/components/SearchFilters";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, AlertCircle } from "lucide-react";
import { toast } from "sonner";

interface Course {
  id: string;
  title: string;
  platform: string;
  category: string;
  instructor: string;
  rating: number;
  price: string | number;
  image?: string;
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
    category: "",
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
      // Fetch ranked results
      const rankingResponse = await fetch(
        `http://localhost:8080/api/courses/ranking?keyword=${encodeURIComponent(searchQuery)}`
      );
      if (rankingResponse.ok) {
        const rankingData = await rankingResponse.json();
        setRankedCourses(rankingData.rankedCourses || []);
      }

      // Fetch main search results
      const searchResponse = await fetch(
        `http://localhost:8080/api/courses/search?keyword=${encodeURIComponent(searchQuery)}`
      );
      if (searchResponse.ok) {
        const searchData = await searchResponse.json();
        setCourses(searchData.courses || []);
        
        if (searchData.courses.length === 0) {
          // Fetch spell check suggestions
          const spellCheckResponse = await fetch(
            `http://localhost:8080/api/courses/spellcheck?word=${encodeURIComponent(searchQuery)}`
          );
          if (spellCheckResponse.ok) {
            const spellData = await spellCheckResponse.json();
            setSuggestions(spellData.suggestions || []);
          }
        }
      }
    } catch (error) {
      console.error("Error fetching results:", error);
      // Mock data fallback
      setCourses([
        {
          id: "1",
          title: "Complete Python Bootcamp",
          platform: "Udemy",
          category: "Programming",
          instructor: "John Doe",
          rating: 4.5,
          price: 49.99,
        },
        {
          id: "2",
          title: "Machine Learning A-Z",
          platform: "Coursera",
          category: "Data Science",
          instructor: "Jane Smith",
          rating: 4.8,
          price: "FREE",
        },
      ]);
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
    if (filters.category && course.category !== filters.category) {
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
            ) : filteredCourses.length > 0 ? (
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
                {suggestions.length > 0 && (
                  <div className="mt-6">
                    <p className="text-muted-foreground mb-3">Did you mean:</p>
                    <div className="flex flex-wrap justify-center gap-2">
                      {suggestions.map((suggestion, index) => (
                        <Button
                          key={index}
                          variant="outline"
                          onClick={() => handleSuggestionClick(suggestion)}
                        >
                          {suggestion}
                        </Button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SearchResults;
