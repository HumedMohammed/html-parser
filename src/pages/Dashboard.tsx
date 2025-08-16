import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Grid3X3, List, Search, Filter, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { db } from "@/utils/pockatbase";
import { TemplateCard } from "@/components/DashboardComponents/TemplateCard";
import { TemplateTable } from "@/components/DashboardComponents/TemplateTable";
import { FilterPanel } from "@/components/DashboardComponents/FilterPanel";
import { Link, useNavigate, useNavigation } from "react-router-dom";
import type { Template } from "@/types/types";

interface FilterState {
  search: string;
  sortBy: string;
  sortOrder: "asc" | "desc";
  dateRange: string;
  user: string;
}

export const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const [templates, setTemplates] = useState<Template[]>([]);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState<"grid" | "table">("grid");
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState<FilterState>({
    search: "",
    sortBy: "updated",
    sortOrder: "desc",
    dateRange: "all",
    user: "all",
  });

  useEffect(() => {
    fetchTemplates();
  }, [filters]);

  const fetchTemplates = async () => {
    try {
      setLoading(true);
      let query = db.collection("templates").getList<Template>(1, 50, {
        expand: "user",
        sort: `${filters.sortOrder === "desc" ? "-" : ""}${filters.sortBy}`,
      });

      if (filters.search) {
        query = db.collection("templates").getList<Template>(1, 50, {
          expand: "user",
          filter: `template.name ~ "${filters.search}"`,
          sort: `${filters.sortOrder === "desc" ? "-" : ""}${filters.sortBy}`,
        });
      }

      const result = await query;
      setTemplates(result.items);
    } catch (error) {
      console.error("Failed to fetch templates:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleTemplateAction = async (action: string, templateId: string) => {
    switch (action) {
      case "edit":
        // Navigate to edit page
        console.log("Edit template:", templateId);
        navigate(`/editor?templateId=${templateId}`);
        break;
      case "delete":
        await handleDeleteTemplate(templateId);
        break;
      case "copy":
        await handleCopyTemplate(templateId);
        break;
      case "share":
        await handleGeneratePublicUrl(templateId);
        break;
    }
  };

  const handleDeleteTemplate = async (templateId: string) => {
    try {
      await db.collection("templates").delete(templateId);
      setTemplates(templates.filter((t) => t.id !== templateId));
    } catch (error) {
      console.error("Failed to delete template:", error);
    }
  };

  const handleCopyTemplate = async (templateId: string) => {
    try {
      const template = templates.find((t) => t.id === templateId);
      if (template) {
        const newTemplate = {
          ...template.template,
          name: `${template.template.name} (Copy)`,
        };

        await db.collection("templates").create({
          template: newTemplate,
          values: template.values,
          thumbnail: template.thumbnail,
          user: db.authStore.model?.id,
        });

        fetchTemplates();
      }
    } catch (error) {
      console.error("Failed to copy template:", error);
    }
  };

  const handleGeneratePublicUrl = async (templateId: string) => {
    // Generate public URL logic
    const publicUrl = `${window.location.origin}/template/${templateId}`;
    navigator.clipboard.writeText(publicUrl);
    // Show toast notification
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 dark:from-gray-900 dark:via-slate-900 dark:to-indigo-900">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-8"
        >
          <div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-2">
              My Templates
            </h1>
            <p className="text-gray-600 dark:text-gray-300">
              Manage and organize your creative templates
            </p>
          </div>
          <div className="flex items-center space-x-4 mt-4 lg:mt-0">
            <Link to="/editor">
              <Button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white">
                <Plus className="w-4 h-4 mr-2" />
                New Template
              </Button>
            </Link>
          </div>
        </motion.div>

        {/* Controls */}
        <motion.div
          variants={itemVariants}
          initial="hidden"
          animate="visible"
          className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-6 space-y-4 lg:space-y-0"
        >
          <div className="flex items-center space-x-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                placeholder="Search templates..."
                value={filters.search}
                onChange={(e) =>
                  setFilters({ ...filters, search: e.target.value })
                }
                className="pl-10 w-64"
              />
            </div>
            <Button
              variant="outline"
              onClick={() => setShowFilters(!showFilters)}
              className={showFilters ? "bg-blue-50 border-blue-200" : ""}
            >
              <Filter className="w-4 h-4 mr-2" />
              Filters
            </Button>
          </div>

          <div className="flex items-center space-x-4">
            <Select
              value={filters.sortBy}
              onValueChange={(value) =>
                setFilters({ ...filters, sortBy: value })
              }
            >
              <SelectTrigger className="w-40">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="updated">Last Updated</SelectItem>
                <SelectItem value="created">Date Created</SelectItem>
                <SelectItem value="numberOfEdit">Most Edited</SelectItem>
                <SelectItem value="numberOfExport">Most Exported</SelectItem>
              </SelectContent>
            </Select>

            <div className="flex items-center border rounded-lg p-1 bg-white dark:bg-gray-800">
              <Button
                variant={viewMode === "grid" ? "default" : "ghost"}
                size="sm"
                onClick={() => setViewMode("grid")}
                className="h-8 w-8 p-0"
              >
                <Grid3X3 className="w-4 h-4" />
              </Button>
              <Button
                variant={viewMode === "table" ? "default" : "ghost"}
                size="sm"
                onClick={() => setViewMode("table")}
                className="h-8 w-8 p-0"
              >
                <List className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </motion.div>

        {/* Filter Panel */}
        <AnimatePresence>
          {showFilters && (
            <FilterPanel
              filters={filters}
              onFiltersChange={setFilters}
              onClose={() => setShowFilters(false)}
            />
          )}
        </AnimatePresence>

        {/* Content */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {[...Array(8)].map((_, i) => (
                <div
                  key={i}
                  className="h-64 bg-white dark:bg-gray-800 rounded-xl animate-pulse"
                />
              ))}
            </div>
          ) : viewMode === "grid" ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {templates.map((template) => (
                <TemplateCard
                  key={template.id}
                  template={template}
                  onAction={handleTemplateAction}
                />
              ))}
            </div>
          ) : (
            <TemplateTable
              templates={templates}
              onAction={handleTemplateAction}
            />
          )}

          {!loading && templates.length === 0 && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center py-16"
            >
              <div className="w-24 h-24 mx-auto mb-6 bg-gradient-to-r from-blue-100 to-purple-100 dark:from-blue-900 dark:to-purple-900 rounded-full flex items-center justify-center">
                <Grid3X3 className="w-12 h-12 text-blue-500" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                No templates found
              </h3>
              <p className="text-gray-600 dark:text-gray-300 mb-6">
                Edit your first template to get started
              </p>
              <Link to="/editor">
                <Button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white">
                  <Plus className="w-4 h-4 mr-2" />
                  Start Editing
                </Button>
              </Link>
            </motion.div>
          )}
        </motion.div>
      </div>
    </div>
  );
};
