import { useState } from "react";
import { API_BASE_URL } from "@/config";
import { useNavigate } from "react-router-dom";
import { Search, TrendingUp, Users, BookOpen, Star, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Navbar } from "@/components/Navbar";
import { Badge } from "@/components/ui/badge";

const Index = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [autocompleteResults, setAutocompleteResults] = useState<string[]>([]);
  const [showAutocomplete, setShowAutocomplete] = useState(false);

  const platforms = [
    { name: "Coursera", logo: "🎓", color: "bg-blue-500" },
    { name: "Udemy", logo: "🎯", color: "bg-purple-500" },
    { name: "Harvard", logo: "🏛️", color: "bg-red-500" },
    { name: "Khan Academy", logo: "📚", color: "bg-green-500" },
    { name: "Class Central", logo: "🌐", color: "bg-orange-500" },
  ];

  const trendingSearches = [
    "Python Programming",
    "Machine Learning",
    "Web Development",
    "Data Science",
    "JavaScript",
    "AI Fundamentals",
  ];

  const stats = [
    { label: "Courses", value: "10,000+", icon: BookOpen },
    { label: "Students", value: "500K+", icon: Users },
    { label: "Platforms", value: "5", icon: Star },
    { label: "Categories", value: "50+", icon: Sparkles },
  ];

  const handleSearch = (query: string = searchQuery) => {
    if (query.trim()) {
      navigate(`/search?q=${encodeURIComponent(query)}`);
    }
  };

  const handleInputChange = async (value: string) => {
    setSearchQuery(value);
    if (value.length > 2) {
      // Simulate autocomplete API call
      try {
        const response = await fetch(
          `${API_BASE_URL}/courses/autocomplete?prefix=${encodeURIComponent(value)}`
        );
        if (response.ok) {
          const data = await response.json();
          setAutocompleteResults(data.suggestions || []);
          setShowAutocomplete(true);
        }
      } catch (error) {
        console.error("Autocomplete API error:", error);
        // Fallback mock data
        setAutocompleteResults([
          `${value} basics`,
          `${value} advanced`,
          `${value} tutorial`,
        ]);
        setShowAutocomplete(true);
      }
    } else {
      setShowAutocomplete(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-hero py-20 md:py-32">
        <div className="absolute inset-0 bg-grid-pattern opacity-10"></div>
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-4xl mx-auto text-center animate-fade-in">
            <h1 className="text-4xl md:text-6xl font-bold text-white mb-6">
              Find Your Perfect Course
            </h1>
            <p className="text-xl md:text-2xl text-white/90 mb-8">
              Compare courses from top education platforms in one place
            </p>

            {/* Search Bar */}
            <div className="max-w-2xl mx-auto relative">
              <div className="relative">
                <Input
                  type="text"
                  placeholder="Search for courses... (e.g., Python, Data Science)"
                  value={searchQuery}
                  onChange={(e) => handleInputChange(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                  onFocus={() => searchQuery.length > 2 && setShowAutocomplete(true)}
                  onBlur={() => setTimeout(() => setShowAutocomplete(false), 200)}
                  className="h-14 pl-12 pr-4 text-lg rounded-xl shadow-lg border-2 border-white/20"
                />
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              </div>
              <Button
                onClick={() => handleSearch()}
                size="lg"
                className="mt-4 w-full md:w-auto bg-white text-primary hover:bg-white/90"
              >
                Search Courses
              </Button>

              {/* Autocomplete Dropdown */}
              {showAutocomplete && autocompleteResults.length > 0 && (
                <Card className="absolute top-full mt-2 w-full bg-card shadow-lg z-50 animate-slide-up">
                  <div className="p-2">
                    {autocompleteResults.slice(0, 5).map((suggestion, index) => (
                      <button
                        key={index}
                        onClick={() => {
                          setSearchQuery(suggestion);
                          handleSearch(suggestion);
                        }}
                        className="w-full text-left px-4 py-2 hover:bg-muted rounded-md transition-colors"
                      >
                        <Search className="w-4 h-4 inline mr-2 text-muted-foreground" />
                        {suggestion}
                      </button>
                    ))}
                  </div>
                </Card>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-12 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {stats.map((stat, index) => (
              <Card
                key={index}
                className="p-6 text-center hover:shadow-md transition-shadow animate-scale-in"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <stat.icon className="w-8 h-8 mx-auto mb-3 text-primary" />
                <div className="text-3xl font-bold text-foreground mb-1">{stat.value}</div>
                <div className="text-sm text-muted-foreground">{stat.label}</div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Platform Badges */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-10">Search Across Top Platforms</h2>
          <div className="flex flex-wrap justify-center gap-4">
            {platforms.map((platform, index) => (
              <Badge
                key={index}
                variant="secondary"
                className={`${platform.color} text-white text-lg px-6 py-3 hover:scale-105 transition-transform cursor-pointer`}
              >
                <span className="mr-2">{platform.logo}</span>
                {platform.name}
              </Badge>
            ))}
          </div>
        </div>
      </section>

      {/* Trending Searches */}
      <section className="py-16 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-center gap-2 mb-8">
            <TrendingUp className="w-6 h-6 text-primary" />
            <h2 className="text-3xl font-bold">Trending Searches</h2>
          </div>
          <div className="flex flex-wrap justify-center gap-3">
            {trendingSearches.map((search, index) => (
              <button
                key={index}
                onClick={() => handleSearch(search)}
                className="px-6 py-2 bg-card hover:bg-primary hover:text-primary-foreground rounded-full transition-colors shadow-sm border border-border"
              >
                {search}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 bg-foreground text-background">
        <div className="container mx-auto px-4 text-center">
          <div className="flex items-center justify-center gap-2 mb-4">
            <div className="w-8 h-8 rounded-lg bg-gradient-primary flex items-center justify-center">
              <span className="text-white font-bold text-xl">E</span>
            </div>
            <span className="text-2xl font-bold">EduCompare</span>
          </div>
          <p className="text-background/70">
            Powered by 10 advanced data structure features
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
