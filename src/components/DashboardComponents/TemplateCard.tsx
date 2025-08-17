import React from "react";
import { motion } from "framer-motion";
import {
  MoreVertical,
  Edit,
  Trash2,
  Share2,
  Copy,
  Download,
  Eye,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import type { Actions, Template } from "@/types/types";
import { getFilePreview } from "@/utils";

interface TemplateCardProps {
  template: Template;
  onAction: (action: Actions, templateId: string) => void;
}

export const TemplateCard: React.FC<TemplateCardProps> = ({
  template,
  onAction,
}) => {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  const getInitials = (name: string) => {
    const nameArray = name.split("");
    return (nameArray[0] + nameArray[1]).toUpperCase();
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -4 }}
      transition={{ duration: 0.2 }}
    >
      <Card className="group overflow-hidden py-0 pb-4 dark:bg-gray-800/80 backdrop-blur-sm border-0 shadow-md hover:shadow-xl transition-all duration-300">
        <div className="relative">
          {/* Thumbnail */}
          <div className="aspect-video bg-gradient-to-br from-blue-100 to-purple-100 dark:from-blue-900 dark:to-purple-900 relative overflow-hidden">
            {template.thumbnail ? (
              <img
                src={getFilePreview({
                  collectionName: "templates",
                  fileName: template.thumbnail,
                  recordId: template.id,
                })}
                alt={template?.name || "Template"}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <Eye className="w-8 h-8 text-blue-500" />
              </div>
            )}

            {/* Overlay with actions */}
            <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
              <Button
                variant="secondary"
                size="sm"
                className="bg-white/90 hover:bg-white text-gray-900"
                onClick={() => onAction("edit", template.id)}
              >
                <Eye className="w-4 h-4 mr-2" />
                Preview
              </Button>
            </div>

            {/* Action Menu */}
            <div className="absolute top-2 right-2">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="secondary"
                    size="sm"
                    className="h-8 w-8 p-0 bg-white/90 hover:bg-white opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                  >
                    <MoreVertical className="w-4 h-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-48">
                  <DropdownMenuItem
                    onClick={() => onAction("edit", template.id)}
                  >
                    <Edit className="w-4 h-4 mr-2" />
                    Edit Template
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() => onAction("copy", template.id)}
                  >
                    <Copy className="w-4 h-4 mr-2" />
                    Duplicate
                  </DropdownMenuItem>
                  {template.publicLink ? (
                    <DropdownMenuItem
                      onClick={() => onAction("share", template.id)}
                    >
                      <Share2 className="w-4 h-4 mr-2" />
                      Copy Public Link
                    </DropdownMenuItem>
                  ) : (
                    <DropdownMenuItem
                      onClick={() =>
                        onAction("create_public_link", template.id)
                      }
                    >
                      <Share2 className="w-4 h-4 mr-2" />
                      Create Public Link
                    </DropdownMenuItem>
                  )}
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    onClick={() => onAction("delete", template.id)}
                    className="text-red-600 focus:text-red-600"
                  >
                    <Trash2 className="w-4 h-4 mr-2" />
                    Delete
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>

          <CardContent className="p-4">
            {/* Template Name */}
            <h3 className="font-semibold text-gray-900 dark:text-white mb-2 truncate">
              {template?.name || "Untitled Template"}
            </h3>

            {/* Stats */}
            <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400 mb-3">
              <div className="flex items-center space-x-3">
                <span className="flex items-center">
                  <Edit className="w-3 h-3 mr-1" />
                  {template.numberOfEdit}
                </span>
                <span className="flex items-center">
                  <Download className="w-3 h-3 mr-1" />
                  {template.numberOfExport}
                </span>
                <span className="flex items-center">
                  <Copy className="w-3 h-3 mr-1" />
                  {template.numberOfCopy}
                </span>
              </div>
            </div>

            {/* User and Date */}
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <div className="flex flex-col">
                  <p className="text-[12px] font-bold">Created By</p>
                  <div className="flex items-center gap-1">
                    <Avatar className="h-6 w-6 border border-indigo-500">
                      <AvatarImage src={template.expand?.user?.avatar} />
                      <AvatarFallback className="text-xs">
                        {template.expand?.user?.name
                          ? getInitials(template.expand.user.name)
                          : "U"}
                      </AvatarFallback>
                    </Avatar>
                    <span className="text-xs text-gray-600 dark:text-gray-300 truncate">
                      {template.expand?.user?.name.split(" ")[0] ||
                        "Unknown User"}
                    </span>
                  </div>
                </div>
              </div>
              <span className="text-xs text-gray-500 dark:text-gray-400">
                {formatDate(template.updated)}
              </span>
            </div>
          </CardContent>
        </div>
      </Card>
    </motion.div>
  );
};
