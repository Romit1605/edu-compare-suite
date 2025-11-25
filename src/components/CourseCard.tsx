import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Heart, Star } from "lucide-react";
import { useState } from "react";
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

interface CourseCardProps {
  course: Course;
  onClick?: () => void;
}

export const CourseCard = ({ course, onClick }: CourseCardProps) => {
  const [isFavorite, setIsFavorite] = useState(false);

  const platformColors: Record<string, string> = {
    Coursera: "bg-blue-500",
    Udemy: "bg-purple-500",
    Harvard: "bg-red-500",
    "Khan Academy": "bg-green-500",
    "Class Central": "bg-orange-500",
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
        {course.image ? (
          <img
            src={course.image}
            alt={course.title}
            className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
          />
        ) : (
          <div className="w-full h-48 bg-gradient-secondary flex items-center justify-center">
            <span className="text-6xl">📚</span>
          </div>
        )}
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
        <Badge
          className={`absolute top-3 left-3 ${
            platformColors[course.platform] || "bg-gray-500"
          } text-white`}
        >
          {course.platform}
        </Badge>
      </div>

      <div className="p-5">
        <Badge variant="secondary" className="mb-2">
          {course.category}
        </Badge>
        <h3 className="font-bold text-lg mb-2 line-clamp-2 group-hover:text-primary transition-colors">
          {course.title}
        </h3>
        <p className="text-sm text-muted-foreground mb-3">{course.instructor}</p>

        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-1">
            <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
            <span className="font-semibold">{course.rating.toFixed(1)}</span>
          </div>
          <span className="font-bold text-lg text-primary">
            {typeof course.price === "number" ? `$${course.price}` : course.price}
          </span>
        </div>

        <Button onClick={onClick} className="w-full" variant="outline">
          View Details
        </Button>
      </div>
    </Card>
  );
};
