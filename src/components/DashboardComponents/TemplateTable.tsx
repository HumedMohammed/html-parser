import React from "react";
import { motion } from "framer-motion";
import { MoreVertical, Edit, Trash2, Share2, Copy, Eye } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card } from "@/components/ui/card";
import type { Template } from "@/types/types";
import { getFilePreview } from "@/utils";

interface TemplateTableProps {
  templates: Template[];
  onAction: (action: string, templateId: string) => void;
}

export const TemplateTable: React.FC<TemplateTableProps> = ({
  templates,
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
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase();
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <Card className="overflow-hidden bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border-0 shadow-lg">
        <Table>
          <TableHeader>
            <TableRow className="border-gray-200 dark:border-gray-700">
              <TableHead className="w-16"></TableHead>
              <TableHead className="font-semibold">Template</TableHead>
              <TableHead className="font-semibold">Creator</TableHead>
              <TableHead className="font-semibold text-center">Edits</TableHead>
              <TableHead className="font-semibold text-center">
                Exports
              </TableHead>
              <TableHead className="font-semibold text-center">
                Copies
              </TableHead>
              <TableHead className="font-semibold">Last Updated</TableHead>
              <TableHead className="w-16"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {templates.map((template) => (
              <TableRow
                key={template.id}
                className="border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
              >
                <TableCell>
                  <div className="w-12 h-8 rounded bg-gradient-to-br from-blue-100 to-purple-100 dark:from-blue-900 dark:to-purple-900 flex items-center justify-center overflow-hidden">
                    {template.thumbnail ? (
                      <img
                        src={getFilePreview({
                          collectionName: "templates",
                          fileName: template.thumbnail,
                          recordId: template.id,
                        })}
                        alt={template.template?.name || "Template"}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <Eye className="w-4 h-4 text-blue-500" />
                    )}
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex flex-col">
                    <span className="font-medium text-gray-900 dark:text-white">
                      {template.template?.name || "Untitled Template"}
                    </span>
                    <span className="text-xs text-gray-500 dark:text-gray-400">
                      Created {formatDate(template.created)}
                    </span>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex items-center space-x-2">
                    <Avatar className="h-6 w-6">
                      <AvatarImage src={template.expand?.user?.avatar} />
                      <AvatarFallback className="text-xs">
                        {template.expand?.user?.name
                          ? getInitials(template.expand.user.name)
                          : "U"}
                      </AvatarFallback>
                    </Avatar>
                    <span className="text-sm text-gray-600 dark:text-gray-300">
                      {template.expand?.user?.name || "Unknown User"}
                    </span>
                  </div>
                </TableCell>
                <TableCell className="text-center">
                  <span className="text-sm font-medium">
                    {template.numberOfEdit}
                  </span>
                </TableCell>
                <TableCell className="text-center">
                  <span className="text-sm font-medium">
                    {template.numberOfExport}
                  </span>
                </TableCell>
                <TableCell className="text-center">
                  <span className="text-sm font-medium">
                    {template.numberOfCopy}
                  </span>
                </TableCell>
                <TableCell>
                  <span className="text-sm text-gray-600 dark:text-gray-300">
                    {formatDate(template.updated)}
                  </span>
                </TableCell>
                <TableCell>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
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
                      <DropdownMenuItem
                        onClick={() => onAction("share", template.id)}
                      >
                        <Share2 className="w-4 h-4 mr-2" />
                        Share Public Link
                      </DropdownMenuItem>
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
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Card>
    </motion.div>
  );
};
