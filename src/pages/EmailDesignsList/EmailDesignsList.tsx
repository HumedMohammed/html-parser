/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence, type Variants } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Search,
  Plus,
  MoreVertical,
  Eye,
  Edit,
  Copy,
  Trash2,
  Mail,
  Calendar,
  Filter,
  Grid3X3,
  List,
  ArrowLeft,
  Image as ImageIcon,
  FileText,
  Star,
  StarOff,
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { db } from "@/utils/pockatbase";
import { LoadingCircle } from "@/components/icons";
import { toast } from "sonner";

interface EmailDesign {
  id: string;
  name: string;
  data: any;
  created: string;
  updated: string;
  user: string;
  thumbnail?: string;
  isFavorite?: boolean;
  tags?: string[];
}

export const EmailDesignsList = () => {
  const [designs, setDesigns] = useState<EmailDesign[]>([]);
  const [filteredDesigns, setFilteredDesigns] = useState<EmailDesign[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [selectedFilter, setSelectedFilter] = useState<"all" | "favorites">(
    "all"
  );
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const navigate = useNavigate();

  // Load designs from PocketBase
  useEffect(() => {
    loadDesigns();
  }, []);

  // Filter designs based on search and filter
  useEffect(() => {
    let filtered = designs;

    if (searchQuery) {
      filtered = filtered.filter((design) =>
        design.name.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    if (selectedFilter === "favorites") {
      filtered = filtered.filter((design) => design.isFavorite);
    }

    setFilteredDesigns(filtered);
  }, [designs, searchQuery, selectedFilter]);

  const loadDesigns = useCallback(async () => {
    try {
      if (db.authStore.record?.id) {
        setLoading(true);
        const records = await db.collection("email_designs").getFullList({
          filter: `user="${db.authStore.record?.id}"`,
          sort: "-updated",
          requestKey: null,
        });

        const designsWithThumbnails = records.map((record) => ({
          id: record.id,
          name: record.name || "Untitled Design",
          data: record.data,
          created: record.created,
          updated: record.updated,
          user: record.user,
          thumbnail: extractThumbnail(record.data),
          isFavorite: record.isFavorite || false,
          tags: record.tags || [],
        }));

        setDesigns(designsWithThumbnails);
      }
    } catch (error) {
      console.error("Failed to load designs:", error);
      toast.error("Failed to load email designs");
    } finally {
      setLoading(false);
    }
  }, []);

  // Extract first image from email design data for thumbnail
  const extractThumbnail = (data: any): string | undefined => {
    try {
      if (!data || !data.assets) return undefined;

      // Look for images in assets
      const images = Object.values(data.assets).filter(
        (asset: any) => asset.type === "image" && asset.src
      );

      return images.length > 0 ? (images[0] as any).src : undefined;
    } catch {
      return undefined;
    }
  };

  const handleDelete = async (id: string) => {
    try {
      setDeletingId(id);
      await db.collection("email_designs").delete(id);
      setDesigns(designs.filter((design) => design.id !== id));
      toast.success("Design deleted successfully");
    } catch (error) {
      console.error("Failed to delete design:", error);
      toast.error("Failed to delete design");
    } finally {
      setDeletingId(null);
    }
  };

  const handleDuplicate = async (design: EmailDesign) => {
    try {
      const newDesign = await db.collection("email_designs").create({
        user: db.authStore.record?.id,
        name: `${design.name} (Copy)`,
        data: design.data,
      });

      const designWithThumbnail = {
        id: newDesign.id,
        name: newDesign.name,
        data: newDesign.data,
        created: newDesign.created,
        updated: newDesign.updated,
        user: newDesign.user,
        thumbnail: extractThumbnail(newDesign.data),
        isFavorite: false,
        tags: [],
      };

      setDesigns([designWithThumbnail, ...designs]);
      toast.success("Design duplicated successfully");
    } catch (error) {
      console.error("Failed to duplicate design:", error);
      toast.error("Failed to duplicate design");
    }
  };

  const toggleFavorite = async (id: string) => {
    try {
      const design = designs.find((d) => d.id === id);
      if (!design) return;

      //   const updated = await db.collection("email_designs").update(id, {
      //     isFavorite: !design.isFavorite,
      //   });

      setDesigns(
        designs.map((d) =>
          d.id === id ? { ...d, isFavorite: !d.isFavorite } : d
        )
      );
    } catch (error) {
      console.error("Failed to toggle favorite:", error);
      toast.error("Failed to update favorite");
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
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
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
        ease: "easeOut",
      },
    },
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 dark:from-gray-900 dark:via-slate-900 dark:to-indigo-950 flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <LoadingCircle className="w-8 h-8" />
          <p className="text-gray-600 dark:text-gray-300">
            Loading your designs...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 dark:from-gray-900 dark:via-slate-900 dark:to-indigo-950">
      <motion.div
        initial="hidden"
        animate="visible"
        variants={containerVariants}
        className="container mx-auto px-4 py-8"
      >
        {/* Header */}
        <motion.div variants={itemVariants} className="mb-8">
          <div className="flex items-center gap-4 mb-6">
            <Link to="/tools">
              <Button variant="ghost" size="sm">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Tools
              </Button>
            </Link>
          </div>

          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
            <div>
              <h1 className="text-4xl font-bold text-gray-900 dark:text-gray-100 mb-2">
                Email Designs
              </h1>
              <p className="text-gray-600 dark:text-gray-300">
                Manage your email templates and designs
              </p>
            </div>

            <Button
              onClick={() => {
                db.collection("email_designs")
                  .create({
                    user: db.authStore.record?.id,
                    name: "New Design",
                    data: {
                      // Add initial email design data here
                    },
                  })
                  .then((res) => {
                    navigate(`/designer/${res.id}`);
                  });
              }}
              className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold px-6 py-3"
            >
              <Plus className="w-5 h-5 mr-2" />
              Create New Design
            </Button>
          </div>
        </motion.div>

        {/* Filters and Search */}
        <motion.div
          variants={itemVariants}
          className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-xl border border-gray-200 dark:border-gray-700 p-6 mb-8"
        >
          <div className="flex flex-col lg:flex-row gap-4 lg:items-center lg:justify-between">
            <div className="flex flex-col sm:flex-row gap-4 flex-1">
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  placeholder="Search designs..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" className="flex items-center gap-2">
                    <Filter className="w-4 h-4" />
                    {selectedFilter === "all" ? "All Designs" : "Favorites"}
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  <DropdownMenuItem onClick={() => setSelectedFilter("all")}>
                    All Designs
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() => setSelectedFilter("favorites")}
                  >
                    Favorites Only
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>

            <div className="flex items-center gap-2">
              <Button
                variant={viewMode === "grid" ? "default" : "outline"}
                size="sm"
                onClick={() => setViewMode("grid")}
              >
                <Grid3X3 className="w-4 h-4" />
              </Button>
              <Button
                variant={viewMode === "list" ? "default" : "outline"}
                size="sm"
                onClick={() => setViewMode("list")}
              >
                <List className="w-4 h-4" />
              </Button>
            </div>
          </div>

          {filteredDesigns.length > 0 && (
            <div className="mt-4 text-sm text-gray-600 dark:text-gray-300">
              {filteredDesigns.length} design
              {filteredDesigns.length !== 1 ? "s" : ""} found
            </div>
          )}
        </motion.div>

        {/* Designs Grid/List */}
        <AnimatePresence mode="wait">
          {filteredDesigns.length === 0 ? (
            <motion.div
              key="empty"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="text-center py-16"
            >
              <div className="w-24 h-24 mx-auto mb-6 bg-gradient-to-br from-blue-100 to-purple-100 dark:from-blue-900/20 dark:to-purple-900/20 rounded-full flex items-center justify-center">
                <Mail className="w-12 h-12 text-blue-600 dark:text-blue-400" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-2">
                {searchQuery || selectedFilter === "favorites"
                  ? "No designs found"
                  : "No designs yet"}
              </h3>
              <p className="text-gray-600 dark:text-gray-300 mb-6 max-w-md mx-auto">
                {searchQuery || selectedFilter === "favorites"
                  ? "Try adjusting your search or filter criteria"
                  : "Create your first email design to get started"}
              </p>
              <Button
                onClick={() => navigate("/designer")}
                className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white"
              >
                <Plus className="w-4 h-4 mr-2" />
                Create Your First Design
              </Button>
            </motion.div>
          ) : (
            <motion.div
              key="designs"
              variants={containerVariants}
              className={
                viewMode === "grid"
                  ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
                  : "space-y-4"
              }
            >
              {filteredDesigns.map((design) => (
                <motion.div key={design.id} variants={itemVariants}>
                  {viewMode === "grid" ? (
                    <Card className="group overflow-hidden border-0 shadow-lg hover:shadow-xl transition-all duration-300 bg-white dark:bg-gray-800 hover:-translate-y-1">
                      <CardContent className="p-0">
                        {/* Thumbnail */}
                        <div className="relative aspect-[4/3] bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-700 dark:to-gray-800 overflow-hidden">
                          {design.thumbnail ? (
                            <img
                              src={design.thumbnail}
                              alt={design.name}
                              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center">
                              <div className="text-center">
                                <ImageIcon className="w-12 h-12 text-gray-400 dark:text-gray-500 mx-auto mb-2" />
                                <p className="text-sm text-gray-500 dark:text-gray-400">
                                  No Preview
                                </p>
                              </div>
                            </div>
                          )}

                          {/* Favorite Button */}
                          <button
                            onClick={(e) => {
                              e.preventDefault();
                              e.stopPropagation();
                              toggleFavorite(design.id);
                            }}
                            className="absolute top-3 right-3 p-2 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-200 hover:bg-white dark:hover:bg-gray-700"
                          >
                            {design.isFavorite ? (
                              <Star className="w-4 h-4 text-yellow-500 fill-current" />
                            ) : (
                              <StarOff className="w-4 h-4 text-gray-600 dark:text-gray-300" />
                            )}
                          </button>
                        </div>

                        {/* Content */}
                        <div className="p-4">
                          <div className="flex items-start justify-between mb-2">
                            <h3 className="font-semibold text-gray-900 dark:text-gray-100 truncate flex-1 mr-2">
                              {design.name}
                            </h3>
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  className="h-8 w-8 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
                                >
                                  <MoreVertical className="w-4 h-4" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuItem asChild>
                                  <Link to={`/designer/${design.id}`}>
                                    <Edit className="w-4 h-4 mr-2" />
                                    Edit
                                  </Link>
                                </DropdownMenuItem>
                                <DropdownMenuItem asChild>
                                  <Link
                                    to={`/designer/${design.id}?mode=preview`}
                                  >
                                    <Eye className="w-4 h-4 mr-2" />
                                    Preview
                                  </Link>
                                </DropdownMenuItem>
                                <DropdownMenuItem
                                  onClick={() => handleDuplicate(design)}
                                >
                                  <Copy className="w-4 h-4 mr-2" />
                                  Duplicate
                                </DropdownMenuItem>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem
                                  onClick={() => handleDelete(design.id)}
                                  className="text-red-600 dark:text-red-400"
                                  disabled={deletingId === design.id}
                                >
                                  <Trash2 className="w-4 h-4 mr-2" />
                                  {deletingId === design.id
                                    ? "Deleting..."
                                    : "Delete"}
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </div>

                          <div className="flex items-center justify-between text-sm text-gray-500 dark:text-gray-400">
                            <div className="flex items-center gap-1">
                              <Calendar className="w-3 h-3" />
                              {formatDate(design.updated)}
                            </div>
                            {design.tags && design.tags.length > 0 && (
                              <div className="flex gap-1">
                                {design.tags.slice(0, 2).map((tag, index) => (
                                  <Badge
                                    key={index}
                                    variant="secondary"
                                    className="text-xs"
                                  >
                                    {tag}
                                  </Badge>
                                ))}
                                {design.tags.length > 2 && (
                                  <Badge
                                    variant="secondary"
                                    className="text-xs"
                                  >
                                    +{design.tags.length - 2}
                                  </Badge>
                                )}
                              </div>
                            )}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ) : (
                    // List View
                    <Card className="group overflow-hidden border-0 shadow-md hover:shadow-lg transition-all duration-300 bg-white dark:bg-gray-800">
                      <CardContent className="p-4">
                        <div className="flex items-center gap-4">
                          {/* Thumbnail */}
                          <div className="w-16 h-12 bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-700 dark:to-gray-800 rounded-lg overflow-hidden flex-shrink-0">
                            {design.thumbnail ? (
                              <img
                                src={design.thumbnail}
                                alt={design.name}
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center">
                                <FileText className="w-6 h-6 text-gray-400 dark:text-gray-500" />
                              </div>
                            )}
                          </div>

                          {/* Content */}
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-1">
                              <h3 className="font-semibold text-gray-900 dark:text-gray-100 truncate">
                                {design.name}
                              </h3>
                              {design.isFavorite && (
                                <Star className="w-4 h-4 text-yellow-500 fill-current flex-shrink-0" />
                              )}
                            </div>
                            <div className="flex items-center gap-4 text-sm text-gray-500 dark:text-gray-400">
                              <div className="flex items-center gap-1">
                                <Calendar className="w-3 h-3" />
                                {formatDate(design.updated)}
                              </div>
                              {design.tags && design.tags.length > 0 && (
                                <div className="flex gap-1">
                                  {design.tags.slice(0, 3).map((tag, index) => (
                                    <Badge
                                      key={index}
                                      variant="secondary"
                                      className="text-xs"
                                    >
                                      {tag}
                                    </Badge>
                                  ))}
                                  {design.tags.length > 3 && (
                                    <Badge
                                      variant="secondary"
                                      className="text-xs"
                                    >
                                      +{design.tags.length - 3}
                                    </Badge>
                                  )}
                                </div>
                              )}
                            </div>
                          </div>

                          {/* Actions */}
                          <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => toggleFavorite(design.id)}
                              className="h-8 w-8 p-0"
                            >
                              {design.isFavorite ? (
                                <Star className="w-4 h-4 text-yellow-500 fill-current" />
                              ) : (
                                <StarOff className="w-4 h-4 text-gray-600 dark:text-gray-300" />
                              )}
                            </Button>
                            <Button variant="ghost" size="sm" asChild>
                              <Link to={`/designer/${design.id}?mode=preview`}>
                                <Eye className="w-4 h-4" />
                              </Link>
                            </Button>
                            <Button variant="ghost" size="sm" asChild>
                              <Link to={`/designer/${design.id}`}>
                                <Edit className="w-4 h-4" />
                              </Link>
                            </Button>
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  className="h-8 w-8 p-0"
                                >
                                  <MoreVertical className="w-4 h-4" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuItem
                                  onClick={() => handleDuplicate(design)}
                                >
                                  <Copy className="w-4 h-4 mr-2" />
                                  Duplicate
                                </DropdownMenuItem>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem
                                  onClick={() => handleDelete(design.id)}
                                  className="text-red-600 dark:text-red-400"
                                  disabled={deletingId === design.id}
                                >
                                  <Trash2 className="w-4 h-4 mr-2" />
                                  {deletingId === design.id
                                    ? "Deleting..."
                                    : "Delete"}
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  )}
                </motion.div>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
};
