import { Navbar } from "@/components/Navbar";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import {
  Globe,
  FileText,
  Check,
  Lightbulb,
  BarChart3,
  TrendingUp,
  Trophy,
  Zap,
  CheckCircle2,
  Search,
} from "lucide-react";

const About = () => {
  const navigate = useNavigate();

  const features = [
    {
      id: 1,
      icon: Globe,
      title: "Web Crawler",
      description:
        "Automatically crawls 5 education platforms (Coursera, Udacity, Harvard, Khan Academy, Codecademy) to gather comprehensive course data.",
      color: "text-blue-500",
      bgColor: "bg-blue-500/10",
    },
    {
      id: 2,
      icon: FileText,
      title: "HTML Parser",
      description:
        "Extracts structured data from web pages, converting raw HTML into organized course information with titles, descriptions, and metadata.",
      color: "text-green-500",
      bgColor: "bg-green-500/10",
    },
    {
      id: 3,
      icon: Check,
      title: "Spell Checking",
      description:
        "Suggests corrections for typos using advanced algorithms. Get intelligent suggestions when no courses match your search.",
      color: "text-purple-500",
      bgColor: "bg-purple-500/10",
    },
    {
      id: 4,
      icon: Lightbulb,
      title: "Word Completion",
      description:
        "Auto-suggests course titles and keywords as you type, making search faster and more intuitive with predictive text completion.",
      color: "text-yellow-500",
      bgColor: "bg-yellow-500/10",
    },
    {
      id: 5,
      icon: BarChart3,
      title: "Frequency Count",
      description:
        "Analyze word occurrences in courses. Find out how many times specific keywords appear in course descriptions and content.",
      color: "text-pink-500",
      bgColor: "bg-pink-500/10",
    },
    {
      id: 6,
      icon: TrendingUp,
      title: "Search Frequency",
      description:
        "Track trending searches and popular keywords. Visualize what users are searching for most with dynamic charts and statistics.",
      color: "text-orange-500",
      bgColor: "bg-orange-500/10",
    },
    {
      id: 7,
      icon: Trophy,
      title: "Page Ranking",
      description:
        "Smart relevance scoring algorithm that ranks courses based on keyword matches, occurrences, and content quality for better results.",
      color: "text-red-500",
      bgColor: "bg-red-500/10",
    },
    {
      id: 8,
      icon: Zap,
      title: "Inverted Indexing",
      description:
        "Lightning-fast search powered by inverted index data structure. Find courses instantly across thousands of records.",
      color: "text-cyan-500",
      bgColor: "bg-cyan-500/10",
    },
    {
      id: 9,
      icon: CheckCircle2,
      title: "Data Validation",
      description:
        "Quality checks using regular expressions. Validates URLs, emails, and prices to ensure data integrity across the platform.",
      color: "text-teal-500",
      bgColor: "bg-teal-500/10",
    },
    {
      id: 10,
      icon: Search,
      title: "Pattern Finding",
      description:
        "Find emails, URLs, and other patterns in course data using regex. Powerful pattern matching for data analysis and extraction.",
      color: "text-indigo-500",
      bgColor: "bg-indigo-500/10",

    },
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <div className="container mx-auto px-4 py-12">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-5xl font-bold mb-4 bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              About EduCompare
            </h1>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              A sophisticated education course search platform demonstrating 10 advanced data
              structure and algorithm features
            </p>
          </div>

          {/* Features Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature, index) => (
              <Card
                key={feature.id}
                className="p-6 hover:shadow-lg transition-all duration-300 group cursor-pointer animate-fade-in"
                style={{ animationDelay: `${index * 50}ms` }}
              >
                <div className={`w-14 h-14 ${feature.bgColor} rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                  <feature.icon className={`w-7 h-7 ${feature.color}`} />
                </div>

                <div className="flex items-start gap-2 mb-2">
                  <span className="font-bold text-2xl text-muted-foreground">
                    {feature.id.toString().padStart(2, "0")}
                  </span>
                  <div>
                    <h3 className="font-bold text-xl mb-2 group-hover:text-primary transition-colors">
                      {feature.title}
                    </h3>
                    <p className="text-muted-foreground leading-relaxed">
                      {feature.description}
                    </p>
                  </div>
                </div>
              </Card>
            ))}
          </div>

          {/* Tech Stack */}
          <Card className="p-8 mt-12 bg-gradient-to-br from-primary/5 to-secondary/5">
            <h2 className="text-3xl font-bold mb-6 text-center">Powered By</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
              <div>
                <div className="text-2xl mb-2">⚛️</div>
                <div className="font-semibold">React</div>
              </div>
              <div>
                <div className="text-2xl mb-2">🎨</div>
                <div className="font-semibold">TailwindCSS</div>
              </div>
              <div>
                <div className="text-2xl mb-2">📊</div>
                <div className="font-semibold">Data Structures</div>
              </div>
              <div>
                <div className="text-2xl mb-2">🔍</div>
                <div className="font-semibold">Algorithms</div>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default About;
