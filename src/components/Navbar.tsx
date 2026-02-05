import { motion } from "framer-motion";
import { Link, useLocation } from "react-router-dom";
 import { Home, Play, Atom, LayoutDashboard, Menu, X, GraduationCap, Info, Shield, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import atomIcon from "@/assets/atom-icon.png";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const navItems = [
  { path: "/", label: "الرئيسية", icon: Home },
  { path: "/videos", label: "الفيديوهات", icon: Play },
  { path: "/simulations", label: "المحاكاة", icon: Atom },
   { path: "/files", label: "الملفات", icon: FileText },
];

const Navbar = () => {
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="sticky top-0 z-50 bg-card/95 backdrop-blur-md border-b border-border">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo with Dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="flex items-center gap-2 cursor-pointer focus:outline-none">
                <motion.img
                  src={atomIcon}
                  alt="Logo"
                  className="w-10 h-10 rounded-full"
                  whileHover={{ rotate: 360 }}
                  transition={{ duration: 0.5 }}
                />
                <span className="text-xl font-bold text-primary hidden sm:block">
                  علوم ممتعة
                </span>
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start" className="w-48">
              <Link to="/">
                <DropdownMenuItem className="cursor-pointer gap-2">
                  <Home className="w-4 h-4" />
                  الرئيسية
                </DropdownMenuItem>
              </Link>
              <Link to="/about-us">
                <DropdownMenuItem className="cursor-pointer gap-2">
                  <Info className="w-4 h-4" />
                  من نحن
                </DropdownMenuItem>
              </Link>
              <Link to="/privacy-policy">
                <DropdownMenuItem className="cursor-pointer gap-2">
                  <Shield className="w-4 h-4" />
                  سياسة الخصوصية
                </DropdownMenuItem>
              </Link>
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-2">
            {navItems.map((item) => (
              <Link key={item.path} to={item.path}>
                <Button
                  variant={location.pathname === item.path ? "default" : "ghost"}
                  size="sm"
                  className="gap-2"
                >
                  <item.icon className="w-4 h-4" />
                  {item.label}
                </Button>
              </Link>
            ))}
            
            {/* Student Login Button */}
            <Link to="/student-auth">
              <Button
                variant="outline"
                size="sm"
                className="gap-2 border-primary text-primary hover:bg-primary hover:text-primary-foreground"
              >
                <GraduationCap className="w-4 h-4" />
                دخول الطلاب
              </Button>
            </Link>
            
            {/* Teacher Login Button */}
            <Link to="/auth">
              <Button
                variant="default"
                size="sm"
                className="gap-2"
              >
                <LayoutDashboard className="w-4 h-4" />
                دخول المعلمين
              </Button>
            </Link>
          </div>

          {/* Mobile menu button */}
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden"
            onClick={() => setIsOpen(!isOpen)}
          >
            {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </Button>
        </div>

        {/* Mobile Navigation */}
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden pb-4"
          >
            <div className="flex flex-col gap-2">
              {navItems.map((item) => (
                <Link key={item.path} to={item.path} onClick={() => setIsOpen(false)}>
                  <Button
                    variant={location.pathname === item.path ? "default" : "ghost"}
                    className="w-full justify-start gap-2"
                  >
                    <item.icon className="w-4 h-4" />
                    {item.label}
                  </Button>
                </Link>
              ))}
              
              {/* Student Login Button - Mobile */}
              <Link to="/student-auth" onClick={() => setIsOpen(false)}>
                <Button
                  variant="outline"
                  className="w-full justify-start gap-2 border-primary text-primary"
                >
                  <GraduationCap className="w-4 h-4" />
                  دخول الطلاب
                </Button>
              </Link>
              
              {/* Teacher Login Button - Mobile */}
              <Link to="/auth" onClick={() => setIsOpen(false)}>
                <Button
                  variant="default"
                  className="w-full justify-start gap-2"
                >
                  <LayoutDashboard className="w-4 h-4" />
                  دخول المعلمين
                </Button>
              </Link>
            </div>
          </motion.div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
