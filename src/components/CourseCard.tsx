import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Heart, Star } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { CourseType } from "@/Types";

interface CourseCardProps {
  course: CourseType;
  onClick?: () => void;
}

export const CourseCard = ({ course, onClick }: CourseCardProps) => {
  const [isFavorite, setIsFavorite] = useState(false);

  const platformColors: Record<string, string> = {
    Coursera: "bg-blue-500",
    Udacity: "bg-purple-500",
    Harvard: "bg-red-500",
    KhanAcademy: "bg-green-500",
    Codecademy: "bg-orange-500",
  };

  const handleFavorite = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsFavorite(!isFavorite);

    const favorites = JSON.parse(localStorage.getItem("favorites") || "[]");
    if (!isFavorite) {
      favorites.push(course.id);
      toast.success("Added to favorites");
    } else {
      const index = favorites.indexOf(course.id);
      if (index > -1) favorites.splice(index, 1);
      toast.info("Removed from favorites");
    }
    localStorage.setItem("favorites", JSON.stringify(favorites));
  };

  return (
    <Card className="overflow-hidden hover:shadow-lg transition-all duration-300 group cursor-pointer">
      <div className="relative">
        <button
          onClick={handleFavorite}
          className="absolute top-3 right-3 p-2 bg-card rounded-full hover:scale-110 transition-transform shadow-md"
        >
          <Heart
            className={`w-5 h-5 ${
              isFavorite ? "fill-red-500 text-red-500" : "text-muted-foreground"
            }`}
          />
        </button>
      </div>

      <div className="p-5">
        <Badge variant="secondary" className="mb-2">
          {course.category}
        </Badge>
        <h3 className="font-bold text-lg mb-2 line-clamp-2 group-hover:text-primary transition-colors">
          {course.courseName}
        </h3>
        <div className="text-sm text-muted-foreground mb-3 flex flex-row gap-2">
          <p>Instructor: </p>
          <p>{course.instructor}</p>
        </div>
        <div className="text-sm text-muted-foreground mb-3 flex flex-row gap-2">
          <p>Instructor Bio: </p>
          <p>{course.instructorBio}</p>
        </div>
        <div className="text-sm text-muted-foreground mb-3 flex flex-row gap-2">
          <p>Institution: </p>
          <p style={{fontWeight: 600}}>{course.institution}</p>
        </div>
        <div className="text-sm text-muted-foreground mb-3 flex flex-row gap-2">
          <p>Institution Rating: </p>
          <p>{course.institutionRating}</p>
        </div>
        <div className="text-sm text-muted-foreground mb-3 flex flex-row gap-2">
          <p>Accredition: </p>
          <p>{course.accreditation}</p>
        </div>
        <div className="text-sm text-muted-foreground mb-3 flex flex-row gap-2">
          <p>Career Outcomes: </p>
          <p>{course.careerOutcomes}</p>
        </div>
        <div className="text-sm text-muted-foreground mb-3 flex flex-row gap-2">
          <p>Certificaitons: </p>
          <p>{course.certifications}</p>
        </div>
        <div className="text-sm text-muted-foreground mb-3 flex flex-row gap-2">
          <p>Course Format: </p>
          <p>{course.courseFormat}</p>
        </div>
        <div className="text-sm text-muted-foreground mb-3 flex flex-row gap-2">
          <p>Completion Rate: </p>
          <p>{course.completionRate}</p>
        </div>
        <div className="text-sm text-muted-foreground mb-3 flex flex-row gap-2">
          <p>Course Format: </p>
          <p>{course.courseFormat}</p>
        </div>
        <div className="text-sm text-muted-foreground mb-3 flex flex-row gap-2">
          <p>Difficulty Level: </p>
          <p>{course.difficultyLevel}</p>
        </div>
        <div className="text-sm text-muted-foreground mb-3 flex flex-row gap-2">
          <p>Duration: </p>
          <p>{course.duration}</p>
        </div>
        <div className="text-sm text-muted-foreground mb-3 flex flex-row gap-2">
          <p>Start Date: </p>
          <p>{course.startDate}</p>
        </div>
        <div className="text-sm text-muted-foreground mb-3 flex flex-row gap-2">
          <p>End Date: </p>
          <p>{course.endDate}</p>
        </div>
        <div className="text-sm text-muted-foreground mb-3 flex flex-row gap-2">
          <p> Enrollement Count: </p>
          <p>{course.enrollmentCount}</p>
        </div>
        <div className="text-sm text-muted-foreground mb-3 flex flex-row gap-2">
          <p> Language: </p>
          <p>{course.language}</p>
        </div>
        <div className="text-sm text-muted-foreground mb-3 flex flex-row gap-2">
          <p>Number Of Assignments: </p>
          <p>{course.numberOfAssignments}</p>
        </div>
        <div className="text-sm text-muted-foreground mb-3 flex flex-row gap-2">
          <p>Number Of Lectures: </p>
          <p>{course.numberOfLectures}</p>
        </div>
        <div className="text-sm text-muted-foreground mb-3 flex flex-row gap-2">
          <p>Number Of Quizzes: </p>
          <p>{course.numberOfQuizzes}</p>
        </div>
        <div className="text-sm text-muted-foreground mb-3 flex flex-row gap-2">
          <p>Partner Companies: </p>
          <p>{course.partnerCompanies}</p>
        </div>
        <div className="text-sm text-muted-foreground mb-3 flex flex-row gap-2">
          <p>PreRequisites: </p>
          <p>{course.prerequisites}</p>
        </div>
        <div className="text-sm text-muted-foreground mb-3 flex flex-row gap-2">
          <p>Pricing Type: </p>
          <p>{course.pricingType}</p>
        </div>
        <div className="text-sm text-muted-foreground mb-3 flex flex-row gap-2">
          <p>Review Count: </p>
          <p>{course.reviewCount}</p>
        </div>
        <div className="text-sm text-muted-foreground mb-3 flex flex-row gap-2">
          <p>Review Summary: </p>
          <p>{course.reviewSummary}</p>
        </div>
        <div className="text-sm text-muted-foreground mb-3 flex flex-row gap-2">
          <p>Skills Gained: </p>
          <p>{course.skillsGained}</p>
        </div>
        <div className="text-sm text-muted-foreground mb-3 flex flex-row gap-2">
          <p>Special Features: </p>
          <p>{course.specialFeatures}</p>
        </div>
        <div className="text-sm text-muted-foreground mb-3 flex flex-row gap-2">
          <p>Subjects: </p>
          <p>{course.subjects}</p>
        </div>
        <div className="text-sm text-muted-foreground mb-3 flex flex-row gap-2">
          <p>Subtitles: </p>
          <p>{course.subtitlesAvailable}</p>
        </div>
        <div className="text-sm text-muted-foreground mb-3 flex flex-row gap-2">
          <p>Weekly Study Hours: </p>
          <p>{course.weeklyStudyHours}</p>
        </div>
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-1">
            <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
            <span className="font-semibold">{course.rating}</span>
          </div>
          <span className="font-bold text-lg text-primary">
            {typeof course.priceDetails === "number"
              ? `$${course.priceDetails}`
              : course.priceDetails}
          </span>
        </div>

        <Button onClick={onClick} className="w-full" variant="outline">
          View Details
        </Button>
        <Badge
          className={`absolute top-3 left-3 ${
            platformColors[course.sourceWebsite] || "bg-gray-500"
          } text-white`}
        >
          {course.sourceWebsite}
        </Badge>
      </div>
    </Card>
  );
};
