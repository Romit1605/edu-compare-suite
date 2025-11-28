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
import axios from "axios";
import { CourseType } from "@/Types";
import { get } from "http";
import { useAppDispatch, useAppSelector } from "@/hooks/hooks";
import { setQuery } from "@/reducers/searchSlice";

export type SearchResponse = {
  courses_found: CourseType[];
  statusCode: number;
  message: string;
};

interface SpellCheckResponse {
  correctedWord: string;
  speltCorrectly: boolean;
  statusCode: number;
  message: string;
}

const SearchResults = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  // const query = searchParams.get("q") || "";
  const [allCourses, setAllCourses] = useState<CourseType[]>([]);

  const [showCorrectionAlert, setShowCorrectionAlert] = useState(false);
  const [correctionSuggestion, setCorrectionSuggestion] = useState("");
  // const [searchQuery, setSearchQuery] = useState(query);
  const [courses, setCourses] = useState<CourseType[]>([]);
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);

  const searchWord = useAppSelector((state) => state.search.query);
  const dispatch = useAppDispatch();

  useEffect(() => {
    if (searchWord.length) {
      fetchResults(searchWord);
    } else {
      getAllCourses();
    }
  }, [searchWord]);

  useEffect(() => {
    console.log(allCourses.length);
    // console.log(query.length);
    console.log(courses.length);
    console.log("search query", searchWord);
    if (searchWord.length === 0) {
    }
  });

  const fetchResults = async (searchQuery: string) => {
    setLoading(true);
    try {
      // Spell check first
      // search for course
      // update frequency

      const spellCheckRes: { data: SpellCheckResponse } = await axios.post(
        "http://localhost:8080/api/spellcheck",
        {
          word: searchQuery,
        }
      );

      console.log(spellCheckRes);
      if (!spellCheckRes.data.speltCorrectly) {
        setShowCorrectionAlert(true);
        setCorrectionSuggestion(spellCheckRes.data.correctedWord);
        setSuggestions([spellCheckRes.data.correctedWord]);
      } else {
        setShowCorrectionAlert(false);
        setCorrectionSuggestion("");
        setSuggestions([]);

        //call search and frequency update only if spelling is correct
        const searchRes = await axios.post("http://localhost:8080/api/search", {
          search: searchQuery,
        });
        console.log("search res", searchRes);
        setCourses(searchRes.data.courses_found);

        const frequencyRes = await axios.post(
          "http://localhost:8080/api/freq",
          {
            word: searchQuery,
          }
        );
        console.log("frequency res", frequencyRes);
      }
    } catch (error) {
      console.error("Error fetching results:", error);
      setCourses([]);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = () => {
    if (searchWord.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchWord)}`);
    }
  };

  const handleSuggestionClick = (suggestion: string) => {
    dispatch(setQuery(suggestion));
    navigate(`/search?q=${encodeURIComponent(suggestion)}`);
  };

  // const filteredCourses = courses.filter((course) => {
  //   if (
  //     filters.platforms.length > 0 &&
  //     !filters.platforms.includes(course.platform)
  //   ) {
  //     return false;
  //   }
  //   if (
  //     filters.category &&
  //     filters.category !== "all" &&
  //     course.category !== filters.category
  //   ) {
  //     return false;
  //   }
  //   if (filters.price === "free" && course.price !== "FREE") {
  //     return false;
  //   }
  //   if (filters.price === "paid" && course.price === "FREE") {
  //     return false;
  //   }
  //   if (filters.rating === "4+" && course.rating < 4) {
  //     return false;
  //   }
  //   if (filters.rating === "3+" && course.rating < 3) {
  //     return false;
  //   }
  //   return true;
  // });

  const getAllCourses = async () => {
    try {
      const res = await axios.get("http://localhost:8080/api/courses");
      console.log("courses:", res);
      setAllCourses(res.data.courses);
    } catch (error) {
      console.error("Error fetching all courses:", error);
    }
  };

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
              value={searchWord}
              onChange={(e) => dispatch(setQuery(e.target.value))}
              onKeyDown={(e) => e.key === "Enter" && handleSearch()}
              className="h-12"
            />
            <Button onClick={handleSearch} size="lg">
              <Search className="w-5 h-5" />
            </Button>
          </div>
        </div>

        <div className="flex flex-col md:flex-row gap-8 mt-8">
          {/* Filters Sidebar */}
          {/* <SearchFilters filters={filters} onFiltersChange={setFilters} /> */}

          {/* Main Content */}
          <div className="flex-1">
            {loading ? (
              <div className="text-center py-12">
                <div className="animate-spin w-12 h-12 border-4 border-primary border-t-transparent rounded-full mx-auto"></div>
                <p className="mt-4 text-muted-foreground">
                  Searching courses...
                </p>
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

                {courses.length > 0 ? (
                  <>
                    <h2 className="text-2xl font-bold mb-6">
                      {courses.length} results found for "{searchWord}"
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {courses.map((course) => (
                        <CourseCard
                          key={course.id}
                          course={course}
                          onClick={() => {
                            window.open(course.courseURL, "_blank");
                          }}
                        />
                      ))}
                    </div>
                  </>
                ) : (
                  allCourses.length > 0 &&
                  searchWord.length === 0 && (
                    <>
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {allCourses.map((course) => (
                          <CourseCard
                            key={course.id}
                            course={course}
                            onClick={() => {
                              window.open(course.courseURL, "_blank");
                            }}
                          />
                        ))}
                      </div>
                    </>
                  )
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
