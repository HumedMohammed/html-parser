import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { signOut } from "firebase/auth";
import { auth } from "@/utils/firebase";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu";
import {
  Menu,
  X,
  Sparkles,
  User,
  Settings,
  LogOut,
  ChevronDown,
  Bell,
  Search,
  Moon,
  Sun,
  Palette,
  Mail,
  LayoutDashboard,
  Home,
  FileText,
  Zap,
  Users,
  HelpCircle,
  Bookmark,
} from "lucide-react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuLabel,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { useAuthState } from "react-firebase-hooks/auth";
import { cn } from "@/lib/utils";

// Tools from your project
const tools = [
  {
    title: "HTML Content Editor",
    description: "Edit HTML content with live preview and real-time updates",
    href: "/content-templates",
    icon: <Palette className="h-4 w-4" />,
    color: "from-emerald-500 to-cyan-500",
    badge: "Popular",
    stats: "15.3K+ users",
  },
  {
    title: "Email Designer",
    description: "Create stunning responsive email templates",
    href: "/designs",
    icon: <Mail className="h-4 w-4" />,
    color: "from-blue-500 to-purple-500",
    badge: "New",
    stats: "12.5K+ users",
  },
];

const mainNavigation = [
  {
    title: "Home",
    href: "/",
    icon: <Home className="h-4 w-4" />,
  },
  {
    title: "Dashboard",
    href: "/dashboard",
    icon: <LayoutDashboard className="h-4 w-4" />,
  },
  {
    title: "Tools",
    href: "/tools",
    icon: <Zap className="h-4 w-4" />,
    hasDropdown: true,
  },
];

const resources = [
  {
    title: "Documentation",
    description: "Learn how to use our tools effectively",
    href: "/docs",
    icon: <FileText className="h-4 w-4" />,
  },
  {
    title: "Templates",
    description: "Browse our template gallery",
    href: "/templates",
    icon: <Bookmark className="h-4 w-4" />,
  },
  {
    title: "Community",
    description: "Connect with other creators",
    href: "/community",
    icon: <Users className="h-4 w-4" />,
  },
  {
    title: "Help Center",
    description: "Get support and find answers",
    href: "/help",
    icon: <HelpCircle className="h-4 w-4" />,
  },
];

export const EnhancedNavbar: React.FC = () => {
  const [user] = useAuthState(auth);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [notifications] = useState(3); // Mock notification count
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleSignOut = async () => {
    try {
      await signOut(auth);
      navigate("/");
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
    document.documentElement.classList.toggle("dark");
  };

  const isActivePath = (path: string) => {
    return (
      location.pathname === path || location.pathname.startsWith(path + "/")
    );
  };

  return (
    <>
      <motion.nav
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        className={cn(
          "fixed top-0 left-0 right-0 z-50 transition-all duration-300",
          isScrolled
            ? "bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl border-b border-gray-200/50 dark:border-gray-700/50 shadow-lg"
            : "bg-transparent"
        )}
      >
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <motion.div
              whileHover={{ scale: 1.05 }}
              className="flex items-center space-x-3"
            >
              <Link to="/" className="flex items-center space-x-3">
                <div className="relative">
                  <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl flex items-center justify-center">
                    <Sparkles className="w-6 h-6 text-white" />
                  </div>
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{
                      duration: 8,
                      repeat: Infinity,
                      ease: "linear",
                    }}
                    className="absolute -top-1 -right-1 w-4 h-4 bg-gradient-to-r from-emerald-400 to-cyan-400 rounded-full"
                  />
                </div>
                <div className="hidden sm:block">
                  <h1 className="text-xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 dark:from-white dark:to-gray-300 bg-clip-text text-transparent">
                    HTML-X
                  </h1>
                  <p className="text-xs text-gray-500 dark:text-gray-400 -mt-1">
                    Creative Studio
                  </p>
                </div>
              </Link>
            </motion.div>

            {/* Desktop Navigation */}
            <div className="hidden lg:flex items-center space-x-8">
              <NavigationMenu>
                <NavigationMenuList className="space-x-2">
                  {mainNavigation.map(({ href, icon, title, hasDropdown }) => (
                    <NavigationMenuItem key={title}>
                      {hasDropdown ? (
                        <>
                          <NavigationMenuTrigger
                            className={cn(
                              "bg-transparent group inline-flex h-10 w-max items-center justify-center rounded-md px-4 py-2 text-sm font-medium transition-colors hover:bg-gray-100 dark:hover:bg-gray-800 focus:bg-gray-100 dark:focus:bg-gray-800 focus:outline-none disabled:pointer-events-none disabled:opacity-50",
                              isActivePath(href) &&
                                "bg-gray-100 dark:bg-gray-800"
                            )}
                          >
                            {icon}
                            <span className="ml-2">{title}</span>
                          </NavigationMenuTrigger>
                          <NavigationMenuContent>
                            <div className="grid gap-3 p-6 w-[600px] grid-cols-2">
                              <div className="space-y-3">
                                <h4 className="text-sm font-medium leading-none text-gray-900 dark:text-white flex items-center">
                                  <Zap className="w-4 h-4 mr-2 text-blue-500" />
                                  Design Tools
                                </h4>
                                {tools.map((tool) => (
                                  <NavigationMenuLink key={tool.title} asChild>
                                    <Link
                                      to={tool.href}
                                      className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-gray-100 dark:hover:bg-gray-800 focus:bg-gray-100 dark:focus:bg-gray-800 group"
                                    >
                                      <div className="flex items-center justify-between">
                                        <div className="flex items-center space-x-2">
                                          <div
                                            className={`p-1.5 rounded-lg bg-gradient-to-r ${tool.color}`}
                                          >
                                            {React.cloneElement(tool.icon, {
                                              className: "h-3 w-3 text-white",
                                            })}
                                          </div>
                                          <div className="text-sm font-medium leading-none text-gray-900 dark:text-white">
                                            {tool.title}
                                          </div>
                                        </div>
                                        {tool.badge && (
                                          <Badge
                                            variant="secondary"
                                            className="text-xs"
                                          >
                                            {tool.badge}
                                          </Badge>
                                        )}
                                      </div>
                                      <p className="line-clamp-2 text-xs leading-snug text-gray-600 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-gray-200">
                                        {tool.description}
                                      </p>
                                      <div className="flex items-center text-xs text-gray-500 dark:text-gray-400">
                                        <Users className="w-3 h-3 mr-1" />
                                        {tool.stats}
                                      </div>
                                    </Link>
                                  </NavigationMenuLink>
                                ))}
                              </div>
                              <div className="space-y-3">
                                <h4 className="text-sm font-medium leading-none text-gray-900 dark:text-white flex items-center">
                                  <FileText className="w-4 h-4 mr-2 text-emerald-500" />
                                  Resources
                                </h4>
                                {resources.map((resource) => (
                                  <>
                                    <Link
                                      key={resource.title}
                                      to={resource.href}
                                      className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-gray-100 dark:hover:bg-gray-800 focus:bg-gray-100 dark:focus:bg-gray-800"
                                    >
                                      <div className="flex items-center space-x-2">
                                        {resource.icon}
                                        <div className="text-sm font-medium leading-none text-gray-900 dark:text-white">
                                          {resource.title}
                                        </div>
                                      </div>
                                      <p className="line-clamp-2 text-xs leading-snug text-gray-600 dark:text-gray-400">
                                        {resource.description}
                                      </p>
                                    </Link>
                                  </>
                                ))}
                              </div>
                            </div>
                          </NavigationMenuContent>
                        </>
                      ) : (
                        <>
                          <Link
                            to={href}
                            className={cn(
                              "group inline-flex h-10 w-max items-center justify-center rounded-md px-4 py-2 text-sm font-medium transition-colors hover:bg-gray-100 dark:hover:bg-gray-800 focus:bg-gray-100 dark:focus:bg-gray-800 focus:outline-none",
                              isActivePath(href) &&
                                "bg-gray-100 dark:bg-gray-800"
                            )}
                          >
                            {icon}
                            <span className="ml-2">{title}</span>
                          </Link>
                        </>
                      )}
                    </NavigationMenuItem>
                  ))}
                </NavigationMenuList>
              </NavigationMenu>
            </div>

            {/* Search Bar */}
            <div className="hidden md:flex items-center flex-1 max-w-md mx-8">
              <div className="relative w-full">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  type="text"
                  placeholder="Search templates, tools..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 pr-4 py-2 w-full bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700 focus:bg-white dark:focus:bg-gray-700 transition-colors"
                />
                {searchQuery && (
                  <motion.button
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    onClick={() => setSearchQuery("")}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    <X className="w-4 h-4" />
                  </motion.button>
                )}
              </div>
            </div>

            {/* Right Side Actions */}
            <div className="flex items-center space-x-4">
              {/* Dark Mode Toggle */}
              <Button
                variant="ghost"
                size="sm"
                onClick={toggleDarkMode}
                className="hidden sm:flex w-9 h-9 p-0"
              >
                <motion.div
                  initial={false}
                  animate={{ rotate: isDarkMode ? 180 : 0 }}
                  transition={{ duration: 0.3 }}
                >
                  {isDarkMode ? (
                    <Sun className="h-4 w-4" />
                  ) : (
                    <Moon className="h-4 w-4" />
                  )}
                </motion.div>
              </Button>

              {/* Notifications */}
              {user && (
                <Button
                  variant="ghost"
                  size="sm"
                  className="relative w-9 h-9 p-0"
                >
                  <Bell className="h-4 w-4" />
                  {notifications > 0 && (
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center"
                    >
                      {notifications}
                    </motion.div>
                  )}
                </Button>
              )}

              {/* User Menu or Auth Buttons */}
              {user ? (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="ghost"
                      className="relative h-9 w-9 rounded-full"
                    >
                      <Avatar className="h-9 w-9">
                        <AvatarImage
                          src={user.photoURL || ""}
                          alt={user.displayName || ""}
                        />
                        <AvatarFallback>
                          {user.displayName?.charAt(0) ||
                            user.email?.charAt(0) ||
                            "U"}
                        </AvatarFallback>
                      </Avatar>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="w-56" align="end" forceMount>
                    <DropdownMenuLabel className="font-normal">
                      <div className="flex flex-col space-y-1">
                        <p className="text-sm font-medium leading-none">
                          {user.displayName || "User"}
                        </p>
                        <p className="text-xs leading-none text-muted-foreground">
                          {user.email}
                        </p>
                      </div>
                    </DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem asChild>
                      <Link to="/dashboard" className="flex items-center">
                        <LayoutDashboard className="mr-2 h-4 w-4" />
                        Dashboard
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link to="/profile" className="flex items-center">
                        <User className="mr-2 h-4 w-4" />
                        Profile
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link to="/settings" className="flex items-center">
                        <Settings className="mr-2 h-4 w-4" />
                        Settings
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={handleSignOut}>
                      <LogOut className="mr-2 h-4 w-4" />
                      Sign out
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              ) : (
                <div className="flex items-center space-x-2">
                  <Button variant="ghost" size="sm" asChild>
                    <Link to="/auth">Sign In</Link>
                  </Button>
                  <Button size="sm" asChild>
                    <Link to="/auth">Get Started</Link>
                  </Button>
                </div>
              )}

              {/* Mobile Menu Toggle */}
              <Button
                variant="ghost"
                size="sm"
                className="lg:hidden w-9 h-9 p-0"
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              >
                <motion.div
                  initial={false}
                  animate={{ rotate: isMobileMenuOpen ? 180 : 0 }}
                  transition={{ duration: 0.3 }}
                >
                  {isMobileMenuOpen ? (
                    <X className="h-4 w-4" />
                  ) : (
                    <Menu className="h-4 w-4" />
                  )}
                </motion.div>
              </Button>
            </div>
          </div>
        </div>
      </motion.nav>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="fixed top-16 left-0 right-0 z-40 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700 lg:hidden"
          >
            <div className="container mx-auto px-4 py-6">
              {/* Mobile Search */}
              <div className="mb-6">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <Input
                    type="text"
                    placeholder="Search templates, tools..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10 pr-4 py-2 w-full"
                  />
                </div>
              </div>

              {/* Mobile Navigation */}
              <div className="space-y-4">
                {mainNavigation.map((item) => (
                  <div key={item.title}>
                    <Link
                      to={item.href}
                      className={cn(
                        "flex items-center space-x-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors",
                        isActivePath(item.href)
                          ? "bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white"
                          : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-50 dark:hover:bg-gray-800"
                      )}
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      {item.icon}
                      <span>{item.title}</span>
                    </Link>

                    {item.hasDropdown && (
                      <div className="ml-6 mt-2 space-y-2">
                        <div className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                          Tools
                        </div>
                        {tools.map((tool) => (
                          <Link
                            key={tool.title}
                            to={tool.href}
                            className="flex items-center space-x-3 px-3 py-2 rounded-lg text-sm transition-colors text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-50 dark:hover:bg-gray-800"
                            onClick={() => setIsMobileMenuOpen(false)}
                          >
                            <div
                              className={`p-1 rounded bg-gradient-to-r ${tool.color}`}
                            >
                              {React.cloneElement(tool.icon, {
                                className: "h-3 w-3 text-white",
                              })}
                            </div>
                            <span>{tool.title}</span>
                            {tool.badge && (
                              <Badge variant="secondary" className="text-xs">
                                {tool.badge}
                              </Badge>
                            )}
                          </Link>
                        ))}

                        <div className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider mt-4">
                          Resources
                        </div>
                        {resources.map((resource) => (
                          <Link
                            key={resource.title}
                            to={resource.href}
                            className="flex items-center space-x-3 px-3 py-2 rounded-lg text-sm transition-colors text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-50 dark:hover:bg-gray-800"
                            onClick={() => setIsMobileMenuOpen(false)}
                          >
                            {resource.icon}
                            <span>{resource.title}</span>
                          </Link>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>

              {/* Mobile Dark Mode Toggle */}
              <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
                <Button
                  variant="ghost"
                  onClick={toggleDarkMode}
                  className="w-full justify-start"
                >
                  <motion.div
                    initial={false}
                    animate={{ rotate: isDarkMode ? 180 : 0 }}
                    transition={{ duration: 0.3 }}
                    className="mr-3"
                  >
                    {isDarkMode ? (
                      <Sun className="h-4 w-4" />
                    ) : (
                      <Moon className="h-4 w-4" />
                    )}
                  </motion.div>
                  {isDarkMode ? "Light Mode" : "Dark Mode"}
                </Button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};
