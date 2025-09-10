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
import { PublicLinkModal } from "@/components/PublicLinkModal";
import { Link, useNavigate } from "react-router-dom";
import type { Actions, FilterState, Template } from "@/types/types";
import { toast } from "sonner";
import { useDuplicateTemplateMutation } from "./Editor/services";
import { v4 } from "uuid";

export const Dashboard: React.FC = () => {
  const [templates, setTemplates] = useState<Template[]>([]);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState<"grid" | "table">("grid");
  const [showFilters, setShowFilters] = useState(false);
  const [showPublicLinkModal, setShowPublicLinkModal] = useState(false);
  const [selectedTemplateId, setSelectedTemplateId] = useState<string | null>(
    null
  );
  const [generatingPublicLink, setGeneratingPublicLink] = useState(false);
  const [duplicate, { isLoading: duplicating }] =
    useDuplicateTemplateMutation();
  const [filters, setFilters] = useState<FilterState>({
    search: "",
    sortBy: "updated",
    sortOrder: "desc",
    dateRange: "all",
    user: "all",
    creator: "all",
    maxEdits: null,
    minEdits: null,
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

  const handleTemplateAction = async (action: Actions, templateId: string) => {
    switch (action) {
      case "edit":
        console.log("Edit template:", templateId);
        navigate(`/template/editor/${templateId}`);
        break;
      case "delete":
        await handleDeleteTemplate(templateId);
        break;
      case "copy":
        await handleCopyTemplate(templateId);
        break;
      case "share":
        handleCopPublicLink(templateId);
        break;
      case "create_public_link":
        setSelectedTemplateId(templateId);
        setShowPublicLinkModal(true);
        break;
    }
  };

  const handleDeleteTemplate = async (templateId: string) => {
    try {
      await db.collection("templates").delete(templateId);
      setTemplates(templates.filter((t) => t.id !== templateId));
      toast("Template deleted successfully");
    } catch (error) {
      console.error("Failed to delete template:", error);
      toast("Failed to delete template", {
        className: "bg-red-500 text-white",
      });
    }
  };

  const handleCopyTemplate = async (templateId: string) => {
    try {
      const template = templates.find((t) => t.id === templateId);
      if (template) {
        await duplicate(template.id).then((res) => {
          if (res.data) {
            navigate(`/template/editor/${res.data.id}`);
            fetchTemplates();
          } else {
            toast("Failed to duplicate template", {
              className: "bg-red-500 text-white",
            });
          }
        });
      }
    } catch (error) {
      toast("Failed to duplicate template", {
        className: "bg-red-500 text-white",
      });
      console.error("Failed to copy template:", error);
    }
  };

  const calculateExpirationDate = (expireTime: string): Date | null => {
    if (expireTime === "never") return null;

    const now = new Date();
    const match = expireTime.match(/(\d+)([hdm])/);

    if (!match) return null;

    const [, amount, unit] = match;
    const value = parseInt(amount);

    switch (unit) {
      case "h":
        return new Date(now.getTime() + value * 60 * 60 * 1000);
      case "d":
        return new Date(now.getTime() + value * 24 * 60 * 60 * 1000);
      case "m":
        return new Date(now.getTime() + value * 30 * 24 * 60 * 60 * 1000);
      default:
        return null;
    }
  };

  const handleGeneratePublicUrl = async (expireTime: string) => {
    if (!selectedTemplateId) return;

    try {
      setGeneratingPublicLink(true);
      const token = v4();
      const publicLink = `${window.location.origin}/public/${selectedTemplateId}?token=${token}`;
      const expireDate = calculateExpirationDate(expireTime);

      // Update the template with public link and expiration
      await db.collection("templates").update(selectedTemplateId, {
        publicLink,
        expireTime: expireDate?.toISOString() || null,
        publicLinkToken: token,
      });

      // Update local state
      setTemplates(
        templates.map((template) =>
          template.id === selectedTemplateId
            ? {
                ...template,
                publicLink,
                expireTime: expireDate?.toISOString() || null,
              }
            : template
        )
      );

      toast("Public link generated successfully!", {
        description: "The link has been created and is ready to share.",
      });
      return publicLink;
    } catch (error) {
      console.error("Failed to generate public link:", error);
      toast("Failed to generate public link", {
        className: "bg-red-500 text-white",
        description: "Please try again later.",
      });
    } finally {
      setGeneratingPublicLink(false);
    }
  };

  const handleCopPublicLink = (templateId: string) => {
    const template = templates.find((t) => t.id === templateId);
    if (template?.publicLink) {
      navigator.clipboard.writeText(template.publicLink);
      toast("Link copied successfully");
    } else {
      toast("No public link available", {
        description: "Generate a public link first.",
        className: "bg-orange-500 text-white",
      });
    }
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
            <Link to="/template/editor">
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
          className="space-y-6"
        >
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            </div>
          ) : templates.length === 0 ? (
            <motion.div variants={itemVariants} className="text-center py-12">
              <div className="max-w-md mx-auto">
                <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center">
                  <Plus className="w-8 h-8 text-gray-400" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                  No templates found
                </h3>
                <p className="text-gray-600 dark:text-gray-300 mb-6">
                  {filters.search
                    ? "No templates match your search criteria."
                    : "Get started by creating your first template."}
                </p>
                <Link to="/template/editor">
                  <Button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white">
                    <Plus className="w-4 h-4 mr-2" />
                    Create Template
                  </Button>
                </Link>
              </div>
            </motion.div>
          ) : viewMode === "grid" ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {templates.map((template) => (
                <motion.div key={template.id} variants={itemVariants}>
                  <TemplateCard
                    template={template}
                    onAction={handleTemplateAction}
                    duplicating={duplicating}
                  />
                </motion.div>
              ))}
            </div>
          ) : (
            <motion.div variants={itemVariants}>
              <TemplateTable
                templates={templates}
                onAction={handleTemplateAction}
                duplicating={duplicating}
              />
            </motion.div>
          )}
        </motion.div>

        {/* Public Link Modal */}
        <PublicLinkModal
          isOpen={showPublicLinkModal}
          onClose={() => {
            setShowPublicLinkModal(false);
            setSelectedTemplateId(null);
          }}
          onGenerate={handleGeneratePublicUrl}
          isLoading={generatingPublicLink}
        />
      </div>
    </div>
  );
};
