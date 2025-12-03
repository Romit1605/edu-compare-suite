import { useState, useEffect } from "react";
import { flushSync } from "react-dom";
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
import { set } from "date-fns";
import { Card } from "@/components/ui/card";

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
  const [currpageRes, setCurrpageRes] = useState<number>(1);
  const [courses, setCourses] = useState<CourseType[]>([]);
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [autocompleteResults, setAutocompleteResults] = useState<string[]>([]);
  const [showAutocomplete, setShowAutocomplete] = useState(false);
  const [blockAutocomplete, setBlockAutocomplete] = useState(false);

  const searchWord = useAppSelector((state) => state.search.query);
  const dispatch = useAppDispatch();

  const getAutoCompleteResults = async () => {
    console.log("calling get autocomplete res.....");
    try {
      const respone = await axios.post(
        "http://localhost:8080/api/autocomplete",
        {
          word: searchWord,
        }
      );
      console.log("res", respone.data.completions);
      setAutocompleteResults(respone.data.completions);
    } catch (error) {
      console.error("Error fetching autocomplete results:", error);
    } finally {
      setShowAutocomplete(true);
    }
  };

  useEffect(() => {
    if (blockAutocomplete) return;
    if (searchWord.length === 0) {
      setShowAutocomplete(false);
      getAllCourses();
    } else if (searchWord.length >= 2) {
      getAutoCompleteResults();
    }
  }, [searchWord, blockAutocomplete]);

  const setSearchQuery = (value: string) => {
    dispatch(setQuery(value));
  };

  const fetchResults = async (searchQuery: string) => {
    console.log("fetch results called");
    setLoading(true);
    setShowAutocomplete(false);
    setAutocompleteResults([]);
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
      if (!spellCheckRes.data.speltCorrectly) {
        setShowCorrectionAlert(true);
        setSuggestions([spellCheckRes.data.correctedWord]);
      } else {
        setShowCorrectionAlert(false);
        setSuggestions([]);

        //call search and frequency update only if spelling is correct
        const searchRes = await axios.post("http://localhost:8080/api/search", {
          search: searchQuery,
        });
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

  const handleSearch = (searchVal: string) => {
    setShowAutocomplete(false);
    setSearchQuery(searchVal);
    setAutocompleteResults([]);
    fetchResults(searchVal);
  };

  const handleSuggestion = (suggestion: string) => {
    setBlockAutocomplete(true);
    setSearchQuery(suggestion);
    fetchResults(suggestion);
  };

  const handleNextPageClick = () => {
    // Implement pagination logic here
    console.log("Next page clicked");
    setCurrpageRes(currpageRes + 1);
    getAllCourses(currpageRes + 1);
  };

  const handlePrevPageClick = () => {
    // Implement pagination logic here
    console.log("Prev page clicked");
    setCurrpageRes(currpageRes - 1);
    getAllCourses(currpageRes - 1);
  };

  const getAllCourses = async (pageNumber = 1) => {
    try {
      const res = await axios.get("http://localhost:8080/api/courses", {
        params: { page: pageNumber, size: 12 },
      });
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
              onChange={(e) => {
                setBlockAutocomplete(false);
                setSearchQuery(e.target.value);
              }}
              onKeyDown={(e) => e.key === "Enter" && handleSearch(searchWord)}
              className="h-12"
            />
            <Button onClick={() => handleSearch(searchWord)} size="lg">
              <Search className="w-5 h-5" />
            </Button>
          </div>
        </div>

        <div className="flex flex-col md:flex-row gap-8 mt-8">
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
                {showAutocomplete && (
                  <Card className="top-full mt-2 w-full bg-card shadow-lg z-50 animate-slide-up">
                    <div className="p-2">
                      {autocompleteResults.map((suggestion, index) => (
                        <button
                          key={index}
                          onClick={() => {
                            console.log("autoselct clicked");
                            setBlockAutocomplete(true);
                            // setShowAutocomplete(false);
                            handleSearch(suggestion);
                          }}
                          className="w-full text-left px-4 py-2 hover:bg-muted rounded-md transition-colors"
                        >
                          {suggestion}
                        </button>
                      ))}
                    </div>
                  </Card>
                )}
                {showCorrectionAlert && suggestions.length > 0 && (
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
                          onClick={() => {
                            handleSuggestion(suggestion);
                          }}
                          className="bg-background hover:bg-accent"
                        >
                          {suggestion}
                        </Button>
                      ))}
                    </div>
                  </div>
                )}

                {courses.length > 0 && searchWord.length > 0 && !showCorrectionAlert ? (
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
                  !showAutocomplete &&
                  !showCorrectionAlert &&
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

        {searchWord.length == 0 && (
          <div className="flex flex-row flex-end gap-5 mt-8">
            {currpageRes > 1 && (
              <div>
                <Button onClick={handlePrevPageClick}>Prev</Button>
              </div>
            )}
            <div>
              <Button onClick={handleNextPageClick}>Next</Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SearchResults;
