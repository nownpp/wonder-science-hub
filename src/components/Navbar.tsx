import { motion } from "framer-motion";
import { Link, useLocation } from "react-router-dom";
import { Home, Play, Atom, LayoutDashboard, Menu, X, GraduationCap, Info, Shield, FileText, Bell, User } from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";
import atomIcon from "@/assets/atom-icon.png";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import NotificationsList from "@/components/NotificationsList";

const navItems = [
  { path: "/", label: "الرئيسية", icon: Home },
  { path: "/videos", label: "الفيديوهات", icon: Play },
  { path: "/simulations", label: "المحاكاة", icon: Atom },
   { path: "/files", label: "الملفات", icon: FileText },
];

const Navbar = () => {
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const { user } = useAuth();
  const [userGrade, setUserGrade] = useState<string | null>(null);

  useEffect(() => {
    if (user) {
      fetchUserGrade();
      fetchUnreadCount();
    }
  }, [user]);

  const fetchUserGrade = async () => {
    if (!user) return;
    const { data } = await supabase
      .from('profiles')
      .select('grade')
      .eq('id', user.id)
      .single();
    if (data) {
      setUserGrade(data.grade);
    }
  };

  const fetchUnreadCount = async () => {
    const { count } = await supabase
      .from('notifications')
      .select('*', { count: 'exact', head: true })
      .or('expires_at.is.null,expires_at.gt.' + new Date().toISOString());
    setUnreadCount(count || 0);
  };

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
            
            {/* User area with notifications & avatar */}
            {user && (
              <div className="flex items-center gap-1">
                <Popover open={notificationsOpen} onOpenChange={setNotificationsOpen}>
                  <PopoverTrigger asChild>
                    <Button variant="ghost" size="icon" className="relative">
                      <Bell className="w-5 h-5" />
                      {unreadCount > 0 && (
                        <span className="absolute -top-1 -right-1 bg-destructive text-destructive-foreground text-xs rounded-full w-5 h-5 flex items-center justify-center">
                          {unreadCount > 9 ? '9+' : unreadCount}
                        </span>
                      )}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-80 p-0 max-h-96 overflow-auto" align="end">
                    <div className="p-3 border-b">
                      <h3 className="font-semibold text-foreground">الإشعارات</h3>
                    </div>
                    <NotificationsList 
                      userGrade={userGrade || undefined} 
                      userId={user?.id} 
                      compact={true}
                    />
                  </PopoverContent>
                </Popover>
                <Link to="/profile-settings">
                  <Button variant="ghost" size="icon" className="rounded-full">
                    <Avatar className="w-8 h-8">
                      <AvatarFallback className="bg-primary/10 text-primary text-sm">
                        <User className="w-4 h-4" />
                      </AvatarFallback>
                    </Avatar>
                  </Button>
                </Link>
              </div>
            )}

            {/* Student Login Button */}
            {!user && (
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
            )}
            
            {/* Teacher Login Button */}
            {!user && (
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
            )}
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
              {!user && (
                <Link to="/student-auth" onClick={() => setIsOpen(false)}>
                  <Button
                    variant="outline"
                    className="w-full justify-start gap-2 border-primary text-primary"
                  >
                    <GraduationCap className="w-4 h-4" />
                    دخول الطلاب
                  </Button>
                </Link>
              )}
              
              {/* Teacher Login Button - Mobile */}
              {!user && (
                <Link to="/auth" onClick={() => setIsOpen(false)}>
                  <Button
                    variant="default"
                    className="w-full justify-start gap-2"
                  >
                    <LayoutDashboard className="w-4 h-4" />
                    دخول المعلمين
                  </Button>
                </Link>
              )}

              {/* Notifications - Mobile */}
              {user && (
                <Button
                  variant="ghost"
                  className="w-full justify-start gap-2"
                  onClick={() => {
                    setNotificationsOpen(true);
                    setIsOpen(false);
                  }}
                >
                  <Bell className="w-4 h-4" />
                  الإشعارات
                  {unreadCount > 0 && (
                    <span className="bg-destructive text-destructive-foreground text-xs rounded-full px-2 py-0.5">
                      {unreadCount}
                    </span>
                  )}
                </Button>
              )}
            </div>
          </motion.div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
