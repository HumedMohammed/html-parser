import React, { useState } from "react";
import { motion, AnimatePresence, type Variants } from "framer-motion";
import { Link, useNavigate } from "react-router-dom";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Mail,
  Palette,
  Star,
  Sparkles,
  Crown,
  Users,
  TrendingUp,
  ChevronRight,
} from "lucide-react";
import { useAuth } from "@/hooks/useAuth";

interface Tool {
  id: string;
  title: string;
  description: string;
  longDescription: string;
  icon: React.ReactNode;
  gradient: string;
  route: string;
  badge?: string;
  features: string[];
  stats: {
    users: string;
    rating: number;
    projects: string;
  };
  isNew?: boolean;
  isPopular?: boolean;
  isPremium?: boolean;
}

const tools: Tool[] = [
  {
    id: "content-editor",
    isPopular: true,
    badge: "Popular",
    title: "HTML Content Editor",
    description: "Edit HTML content with live preview and real-time updates",
    longDescription:
      "Transform your HTML templates with our intuitive content editor. Edit text, swap images, adjust colors and backgrounds - all without touching the code. Perfect for quick content updates and template customization.",
    icon: <Palette className="w-8 h-8" />,
    gradient: "from-emerald-500 via-teal-500 to-cyan-500",
    route: "/content-templates",
    features: [
      "Live Text Editing",
      "Media Replacement",
      "Color Customization",
      "Background Styling",
      "Real-time Preview",
    ],
    stats: {
      users: "15.3K+",
      rating: 4.9,
      projects: "62K+",
    },
  },
  {
    id: "email",
    title: "Email Designer",
    description: "Create stunning responsive email templates",
    longDescription:
      "Design professional email campaigns with our drag-and-drop MJML editor. Perfect for newsletters, marketing campaigns, and transactional emails.",
    icon: <Mail className="w-8 h-8" />,
    gradient: "from-blue-500 via-purple-500 to-pink-500",
    route: "/designs",
    badge: "New",
    isPopular: false,
    features: [
      "MJML Framework",
      "Responsive Design",
      "Live Preview",
      "Template Library",
      "Export Options",
    ],
    stats: {
      users: "12.5K+",
      rating: 4.6,
      projects: "45K+",
    },
  },
  //   {
  //     id: "web",
  //     title: "Web Designer",
  //     description: "Build modern websites with visual editor",
  //     longDescription:
  //       "Create responsive websites and landing pages with our powerful visual editor. No coding required, just drag, drop, and customize.",
  //     icon: <Globe className="w-8 h-8" />,
  //     gradient: "from-emerald-500 via-teal-500 to-cyan-500",
  //     route: "/web-designer",
  //     badge: "New",
  //     isNew: true,
  //     features: [
  //       "Visual Editor",
  //       "Component Library",
  //       "Mobile Responsive",
  //       "SEO Optimized",
  //       "Fast Loading",
  //     ],
  //     stats: {
  //       users: "8.2K+",
  //       rating: 4.8,
  //       projects: "28K+",
  //     },
  //   },
  //   {
  //     id: "mobile",
  //     title: "Mobile App Designer",
  //     description: "Design beautiful mobile app interfaces",
  //     longDescription:
  //       "Create stunning mobile app prototypes and designs with our intuitive interface builder. Perfect for iOS and Android apps.",
  //     icon: <Smartphone className="w-8 h-8" />,
  //     gradient: "from-orange-500 via-red-500 to-pink-500",
  //     route: "/mobile-designer",
  //     badge: "Premium",
  //     isPremium: true,
  //     features: [
  //       "Native Components",
  //       "Interactive Prototypes",
  //       "Device Preview",
  //       "Animation Support",
  //       "Export to Code",
  //     ],
  //     stats: {
  //       users: "5.8K+",
  //       rating: 4.7,
  //       projects: "18K+",
  //     },
  //   },
];

export const ToolsSelection: React.FC = () => {
  const [selectedTool, setSelectedTool] = useState<string | null>(null);
  const [hoveredTool, setHoveredTool] = useState<string | null>(null);
  const { user } = useAuth();
  const navigate = useNavigate();

  const handleToolSelect = (tool: Tool) => {
    setSelectedTool(tool.id);
    setTimeout(() => {
      navigate(tool.route);
    }, 800);
  };

  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        duration: 0.6,
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants: Variants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, ease: "easeOut" },
    },
  };

  const cardVariants: Variants = {
    hidden: { opacity: 0, scale: 0.9 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: { duration: 0.5, ease: "easeOut" },
    },
    hover: {
      scale: 1.02,
      y: -5,
      transition: { duration: 0.3, ease: "easeOut" },
    },
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
      {/* Background Elements */}
      <div className="absolute inset-0 overflow-hidden" />

      <div className="relative z-10 container mx-auto px-4 py-12">
        <div className="flex justify-end mb-6">
          <Badge variant="outline" className="mr-3">
            Plan: {(user?.plan || "free").toUpperCase()}
          </Badge>
          {user?.plan !== "pro" && (
            <Button asChild size="sm" variant="outline">
              <Link to="/pricing">Upgrade</Link>
            </Button>
          )}
        </div>
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="text-center mb-16"
        >
          <motion.div variants={itemVariants} className="mb-6">
            <div className="inline-flex items-center space-x-2 bg-white dark:bg-slate-900 rounded-full px-4 py-2 border border-slate-200 dark:border-slate-800">
              <Sparkles className="w-4 h-4 text-slate-700 dark:text-slate-300" />
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Choose Your Creative Tool
              </span>
            </div>
          </motion.div>

          <motion.h1
            variants={itemVariants}
            className="text-5xl md:text-6xl font-semibold text-slate-900 dark:text-slate-100 mb-6"
          >
            Design Studio
          </motion.h1>

          <motion.p
            variants={itemVariants}
            className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto leading-relaxed"
          >
            Unleash your creativity with our powerful suite of design tools for
            html email templates. we've got everything you need to bring your
            ideas to life.
          </motion.p>

          <motion.div
            variants={itemVariants}
            className="flex justify-center space-x-6 mt-8"
          >
            <div className="flex items-center space-x-2 text-gray-600 dark:text-gray-400">
              <Users className="w-5 h-5" />
              <span className="text-sm">50K+ Creators</span>
            </div>
            <div className="flex items-center space-x-2 text-gray-600 dark:text-gray-400">
              <TrendingUp className="w-5 h-5" />
              <span className="text-sm">1M+ Projects</span>
            </div>
            <div className="flex items-center space-x-2 text-gray-600 dark:text-gray-400">
              <Star className="w-5 h-5 fill-amber-400 text-amber-400" />
              <span className="text-sm">4.8 Rating</span>
            </div>
          </motion.div>
        </motion.div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-6xl mx-auto"
        >
          {tools.map((tool) => (
            <motion.div
              key={tool.id}
              variants={cardVariants}
              whileHover="hover"
              onHoverStart={() => setHoveredTool(tool.id)}
              onHoverEnd={() => setHoveredTool(null)}
              className="group cursor-pointer"
              onClick={() => handleToolSelect(tool)}
            >
              <Card className="h-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden relative">
                {/* Gradient Background */}
                <div className="absolute inset-0 opacity-0" />

                {/* Badge */}
                {tool.badge && (
                  <div className="absolute top-4 right-4 z-10">
                    <Badge
                      variant={
                        tool.isNew
                          ? "default"
                          : tool.isPopular
                            ? "secondary"
                            : "outline"
                      }
                      className={`
                        ${tool.isNew ? "bg-emerald-500 text-white" : ""}
                        ${tool.isPopular ? "bg-blue-500 text-white" : ""}
                        ${
                          tool.isPremium
                            ? "bg-gradient-to-r from-yellow-400 to-orange-500 text-white"
                            : ""
                        }
                      `}
                    >
                      {tool.isPremium && <Crown className="w-3 h-3 mr-1" />}
                      {tool.badge}
                    </Badge>
                  </div>
                )}

                <CardHeader className="pb-4">
                  <div className="flex items-start justify-between">
                    <motion.div
                      animate={{
                        scale: hoveredTool === tool.id ? 1.1 : 1,
                        rotate: hoveredTool === tool.id ? 5 : 0,
                      }}
                      transition={{ duration: 0.3 }}
                      className="p-3 rounded-2xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 mb-4"
                    >
                      {tool.icon}
                    </motion.div>
                  </div>

                  <CardTitle className="text-2xl font-semibold text-slate-900 dark:text-slate-100 transition-all duration-300">
                    {tool.title}
                  </CardTitle>

                  <CardDescription className="text-gray-600 dark:text-gray-300 text-base">
                    {tool.description}
                  </CardDescription>
                </CardHeader>

                <CardContent className="space-y-6">
                  <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed">
                    {tool.longDescription}
                  </p>

                  {/* Features */}
                  <div className="space-y-2">
                    <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                      Key Features:
                    </h4>
                    <div className="grid grid-cols-1 gap-1">
                      {tool.features.slice(0, 3).map((feature, idx) => (
                        <div
                          key={idx}
                          className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-400"
                        >
                          <div className="w-1.5 h-1.5 bg-slate-500 rounded-full" />
                          <span>{feature}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Stats */}
                  <div className="flex items-center justify-between pt-4 border-t border-gray-200 dark:border-gray-700">
                    <div className="flex items-center space-x-4 text-xs text-gray-500 dark:text-gray-400">
                      <div className="flex items-center space-x-1">
                        <Users className="w-3 h-3" />
                        <span>{tool.stats.users}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                        <span>{tool.stats.rating}</span>
                      </div>
                    </div>

                    <motion.div
                      animate={{
                        x: hoveredTool === tool.id ? 5 : 0,
                      }}
                      transition={{ duration: 0.3 }}
                      className="flex items-center space-x-1 text-slate-700 dark:text-slate-300 font-medium text-sm"
                    >
                      <span>Get Started</span>
                      <ChevronRight className="w-4 h-4" />
                    </motion.div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </motion.div>
      </div>

      {/* Loading Overlay */}
      <AnimatePresence>
        {selectedTool && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm z-50 flex items-center justify-center"
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="text-center"
            >
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                className="w-16 h-16 border-4 border-blue-200 border-t-blue-600 rounded-full mx-auto mb-4"
              />
              <p className="text-lg font-medium text-gray-700 dark:text-gray-300">
                Loading {tools.find((t) => t.id === selectedTool)?.title}...
              </p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
