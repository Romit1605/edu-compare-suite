import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Trophy, Target } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { useState } from "react";
import { Button } from "@/components/ui/button";

interface RankedCourse {
  courseId: string;
  title: string;
  platform: string;
  rankScore: number;
  occurrences: number;
  rank: number;
}

interface RankedResultsProps {
  keyword: string;
  courses: RankedCourse[];
}

export const RankedResults = ({ keyword, courses }: RankedResultsProps) => {
  const [isExpanded, setIsExpanded] = useState(true);

  const topCourses = courses.slice(0, 5);

  const getRankBadgeColor = (rank: number) => {
    switch (rank) {
      case 1:
        return "bg-yellow-500";
      case 2:
        return "bg-gray-400";
      case 3:
        return "bg-orange-600";
      default:
        return "bg-primary";
    }
  };

  return (
    <Card className="bg-gradient-to-br from-purple-50 to-blue-50 dark:from-purple-950/20 dark:to-blue-950/20 border-2 border-primary/20 overflow-hidden animate-fade-in">
      <div className="p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <Trophy className="w-6 h-6 text-yellow-500" />
            <h2 className="text-2xl font-bold">
              Top Ranked Results for "{keyword}"
            </h2>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsExpanded(!isExpanded)}
          >
            {isExpanded ? "Collapse" : "Expand"}
          </Button>
        </div>

        {isExpanded && (
          <div className="space-y-4">
            {topCourses.map((course) => (
              <Card
                key={course.courseId}
                className="p-4 hover:shadow-md transition-all bg-card"
              >
                <div className="flex items-start gap-4">
                  <Badge
                    className={`${getRankBadgeColor(
                      course.rank
                    )} text-white text-lg px-3 py-1 flex-shrink-0`}
                  >
                    #{course.rank}
                  </Badge>

                  <div className="flex-1">
                    <div className="flex items-start justify-between gap-2 mb-2">
                      <div>
                        <h3 className="font-bold text-lg mb-1">{course.title}</h3>
                        <Badge variant="secondary">{course.platform}</Badge>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <div>
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-sm font-medium">Rank Score</span>
                          <span className="text-sm font-bold text-primary">
                            {course.rankScore.toFixed(1)}%
                          </span>
                        </div>
                        <Progress value={course.rankScore} className="h-2" />
                      </div>

                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Target className="w-4 h-4" />
                        <span>
                          Found <span className="font-semibold">{course.occurrences}</span>{" "}
                          times in content
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
    </Card>
  );
};
