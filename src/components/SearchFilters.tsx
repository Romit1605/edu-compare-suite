import { Card } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface Filters {
  platforms: string[];
  category: string;
  price: string;
  rating: string;
}

interface SearchFiltersProps {
  filters: Filters;
  onFiltersChange: (filters: Filters) => void;
}

export const SearchFilters = ({ filters, onFiltersChange }: SearchFiltersProps) => {
  const platforms = ["Coursera", "Udacity", "Harvard", "Khan Academy", "Codecademy"];
  const categories = [
    "Programming",
    "Data Science",
    "Business",
    "Design",
    "Marketing",
    "Personal Development",
  ];

  const handlePlatformToggle = (platform: string) => {
    const newPlatforms = filters.platforms.includes(platform)
      ? filters.platforms.filter((p) => p !== platform)
      : [...filters.platforms, platform];
    onFiltersChange({ ...filters, platforms: newPlatforms });
  };

  const clearFilters = () => {
    onFiltersChange({
      platforms: [],
      category: "all",
      price: "all",
      rating: "all",
    });
  };

  return (
    <Card className="p-6 h-fit sticky top-24 w-full md:w-64 flex-shrink-0">
      <div className="flex items-center justify-between mb-6">
        <h3 className="font-bold text-lg">Filters</h3>
        <Button variant="ghost" size="sm" onClick={clearFilters}>
          Clear
        </Button>
      </div>

      <div className="space-y-6">
        {/* Platforms */}
        <div>
          <h4 className="font-semibold mb-3">Platforms</h4>
          <div className="space-y-2">
            {platforms.map((platform) => (
              <div key={platform} className="flex items-center gap-2">
                <Checkbox
                  id={platform}
                  checked={filters.platforms.includes(platform)}
                  onCheckedChange={() => handlePlatformToggle(platform)}
                />
                <Label htmlFor={platform} className="cursor-pointer text-sm">
                  {platform}
                </Label>
              </div>
            ))}
          </div>
        </div>

        {/* Category */}
        <div>
          <h4 className="font-semibold mb-3">Category</h4>
          <Select
            value={filters.category}
            onValueChange={(value) => onFiltersChange({ ...filters, category: value })}
          >
            <SelectTrigger>
              <SelectValue placeholder="All Categories" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>
              {categories.map((category) => (
                <SelectItem key={category} value={category}>
                  {category}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Price */}
        <div>
          <h4 className="font-semibold mb-3">Price</h4>
          <Select
            value={filters.price}
            onValueChange={(value) => onFiltersChange({ ...filters, price: value })}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All</SelectItem>
              <SelectItem value="free">Free</SelectItem>
              <SelectItem value="paid">Paid</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Rating */}
        <div>
          <h4 className="font-semibold mb-3">Rating</h4>
          <Select
            value={filters.rating}
            onValueChange={(value) => onFiltersChange({ ...filters, rating: value })}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All</SelectItem>
              <SelectItem value="4+">4+ Stars</SelectItem>
              <SelectItem value="3+">3+ Stars</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
    </Card>
  );
};
