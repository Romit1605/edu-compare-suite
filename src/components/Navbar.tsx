import { NavLink } from "@/components/NavLink";
import { Button } from "@/components/ui/button";
import { Menu, Search, TrendingUp, Wrench, Star, Info, Heart } from "lucide-react";
import { useState } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";

export const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);

  const NavLinks = () => (
    <>
      <NavLink
        to="/"
        className="text-foreground hover:text-primary transition-colors px-3 py-2 rounded-md"
        activeClassName="text-primary font-semibold"
      >
        Home
      </NavLink>
      <NavLink
        to="/search"
        className="text-foreground hover:text-primary transition-colors px-3 py-2 rounded-md flex items-center gap-1"
        activeClassName="text-primary font-semibold"
      >
        <Search className="w-4 h-4" />
        Search
      </NavLink>
      <NavLink
        to="/trending"
        className="text-foreground hover:text-primary transition-colors px-3 py-2 rounded-md flex items-center gap-1"
        activeClassName="text-primary font-semibold"
      >
        <TrendingUp className="w-4 h-4" />
        Trending
      </NavLink>

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="flex items-center gap-1">
            <Wrench className="w-4 h-4" />
            Tools
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="bg-popover z-50">
          <DropdownMenuItem asChild>
            <NavLink to="/analyzer" className="cursor-pointer">
              Word Analyzer
            </NavLink>
          </DropdownMenuItem>
          <DropdownMenuItem asChild>
            <NavLink to="/patterns" className="cursor-pointer">
              Pattern Finder
            </NavLink>
          </DropdownMenuItem>
          <DropdownMenuItem asChild>
            <NavLink to="/validation" className="cursor-pointer">
              Data Validation
            </NavLink>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <NavLink
        to="/favorites"
        className="text-foreground hover:text-primary transition-colors px-3 py-2 rounded-md flex items-center gap-1"
        activeClassName="text-primary font-semibold"
      >
        <Heart className="w-4 h-4" />
        Favorites
      </NavLink>
      <NavLink
        to="/about"
        className="text-foreground hover:text-primary transition-colors px-3 py-2 rounded-md flex items-center gap-1"
        activeClassName="text-primary font-semibold"
      >
        <Info className="w-4 h-4" />
        About
      </NavLink>
    </>
  );

  return (
    <nav className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          <NavLink to="/" className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-primary flex items-center justify-center">
              <span className="text-white font-bold text-xl">E</span>
            </div>
            <span className="text-xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              EduCompare
            </span>
          </NavLink>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-1">
            <NavLinks />
          </div>

          {/* Mobile Navigation */}
          <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger asChild className="md:hidden">
              <Button variant="ghost" size="icon">
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-64">
              <div className="flex flex-col gap-2 mt-8">
                <NavLinks />
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </nav>
  );
};
