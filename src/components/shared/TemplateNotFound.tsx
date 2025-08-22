import React from "react";
import { motion, type Variants } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { FileX, ArrowLeft, Plus, Search } from "lucide-react";
import { Link } from "react-router-dom";

interface TemplateNotFoundProps {
  onGoBack?: () => void;
  onCreateNew?: () => void;
  onBrowseTemplates?: () => void;
  title?: string;
  description?: string;
}

export const TemplateNotFound: React.FC<TemplateNotFoundProps> = ({
  onGoBack,
  onCreateNew,
  onBrowseTemplates,
  title = "Template Not Found",
  description = "The template you're looking for doesn't exist or may have been deleted.",
}) => {
  const containerVariants: Variants = {
    hidden: { opacity: 0, scale: 0.95 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: {
        duration: 0.3,
        ease: "easeOut",
      },
    },
  };

  const iconVariants: Variants = {
    hidden: { scale: 0, rotate: -180 },
    visible: {
      scale: 1,
      rotate: 0,
      transition: {
        duration: 0.5,
        ease: "easeOut",
        delay: 0.1,
      },
    },
  };

  const buttonVariants: Variants = {
    hidden: { opacity: 0, y: 20 },
    visible: (i: number) => ({
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.3,
        delay: 0.3 + i * 0.1,
        ease: "easeOut",
      },
    }),
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 dark:from-gray-900 dark:via-slate-900 dark:to-indigo-950 flex items-center justify-center p-4">
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="w-full max-w-md"
      >
        <Card className="backdrop-blur-sm bg-white/90 dark:bg-gray-800/90 border-0 shadow-2xl">
          <CardContent className="p-8 text-center">
            {/* Icon */}
            <motion.div
              variants={iconVariants}
              initial="hidden"
              animate="visible"
              className="mb-6"
            >
              <div className="w-20 h-20 mx-auto bg-gradient-to-br from-red-100 to-orange-100 dark:from-red-900/30 dark:to-orange-900/30 rounded-full flex items-center justify-center">
                <FileX className="w-10 h-10 text-red-500 dark:text-red-400" />
              </div>
            </motion.div>

            {/* Title */}
            <motion.h1
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.3 }}
              className="text-2xl font-bold text-gray-900 dark:text-white mb-3"
            >
              {title}
            </motion.h1>

            {/* Description */}
            <motion.p
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.25, duration: 0.3 }}
              className="text-gray-600 dark:text-gray-300 mb-8 leading-relaxed"
            >
              {description}
            </motion.p>

            {/* Action Buttons */}
            <div className="space-y-3">
              {onGoBack && (
                <motion.div
                  variants={buttonVariants}
                  initial="hidden"
                  animate="visible"
                  custom={0}
                >
                  <Button
                    onClick={onGoBack}
                    variant="outline"
                    className="w-full flex items-center justify-center gap-2 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                  >
                    <ArrowLeft className="w-4 h-4" />
                    Go Back
                  </Button>
                </motion.div>
              )}

              {onCreateNew && (
                <motion.div
                  variants={buttonVariants}
                  initial="hidden"
                  animate="visible"
                  custom={1}
                >
                  <Button
                    onClick={onCreateNew}
                    className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white flex items-center justify-center gap-2 transition-all"
                  >
                    <Plus className="w-4 h-4" />
                    Create New Template
                  </Button>
                </motion.div>
              )}

              {onBrowseTemplates && (
                <motion.div
                  variants={buttonVariants}
                  initial="hidden"
                  animate="visible"
                  custom={2}
                >
                  <Button
                    onClick={onBrowseTemplates}
                    variant="ghost"
                    className="w-full flex items-center justify-center gap-2 text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors"
                  >
                    <Search className="w-4 h-4" />
                    Browse All Templates
                  </Button>
                </motion.div>
              )}
            </div>

            {/* Decorative Elements */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5, duration: 0.5 }}
              className="mt-8 pt-6 border-t border-gray-200 dark:border-gray-700"
            >
              <Link to="/content-templates">
                <Button>
                  <ArrowLeft />
                  Go back to dashboard
                </Button>
              </Link>
            </motion.div>
          </CardContent>
        </Card>

        {/* Background Decoration */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 0.1, scale: 1 }}
          transition={{ delay: 0.6, duration: 0.8 }}
          className="absolute inset-0 -z-10"
        >
          <div className="w-full h-full bg-gradient-to-br from-blue-400/20 to-purple-400/20 rounded-full blur-3xl transform -translate-y-12" />
        </motion.div>
      </motion.div>
    </div>
  );
};
