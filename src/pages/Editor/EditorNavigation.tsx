import React, { useState, useEffect, useCallback } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { AnimatePresence, motion } from "framer-motion";
import {
  Copy,
  Share2,
  Trash2,
  MoreVertical,
  Link as LinkIcon,
  Check,
  ExternalLink,
  X,
  RefreshCw,
  CheckCircle,
} from "lucide-react";
import { debounce } from "lodash";

interface EditorNavigationProps {
  templateName?: string;
  isEditing?: boolean;
  publicLink?: string;
  saving: boolean;
  savingSuccess: boolean;
  onNameChange?: (name: string) => void;
  onDuplicate?: () => void;
  onShare?: () => void;
  onDelete?: () => void;
  onCreatePublicLink?: () => void;
  reset: () => void;
  setTemplateName: (name: string) => void;
}

export const EditorNavigation: React.FC<EditorNavigationProps> = ({
  templateName,
  isEditing = false,
  publicLink,
  saving,
  savingSuccess,
  setTemplateName,
  onNameChange,
  onDuplicate,
  onShare,
  onDelete,
  onCreatePublicLink,
  reset,
}) => {
  //   const [name, setName] = useState(templateName);
  const [copied, setCopied] = useState(false);

  // Debounced name change handler
  const debouncedNameChange = useCallback(
    debounce((name: string) => {
      onNameChange?.(name);
    }, 1500),
    []
  );

  const handleCopyLink = async () => {
    if (publicLink) {
      try {
        await navigator.clipboard.writeText(publicLink);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      } catch (error) {
        console.error("Failed to copy link:", error);
      }
    }
  };

  const handleShareAction = () => {
    if (publicLink) {
      onShare?.();
    } else {
      onCreatePublicLink?.();
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm border-b border-gray-200 dark:border-gray-700 px-6 py-4"
    >
      <div className="flex items-center gap-2 text-sm text-muted-foreground">
        <AnimatePresence mode="wait">
          {saving && (
            <motion.div
              key="saving"
              initial={{ opacity: 0, x: 10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -10 }}
              className="flex items-center gap-1"
            >
              <RefreshCw className="w-3 h-3 animate-spin" />
              <span>Saving...</span>
            </motion.div>
          )}
          {savingSuccess && (
            <motion.div
              key="saved"
              initial={{ opacity: 0, x: 10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -10 }}
              className="flex items-center gap-1 text-green-600"
            >
              <CheckCircle className="w-3 h-3" />
              <span>Saved</span>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
      <div className="flex items-center justify-between">
        {/* Left Section - Template Name */}
        <div className="flex items-center space-x-4 flex-1 max-w-md">
          <div className="relative flex-1">
            <Input
              value={templateName}
              onChange={(e) => {
                setTemplateName(e.target.value);
                debouncedNameChange(e.target.value);
              }}
              placeholder="Template name..."
              className="text-xl font-semibold bg-transparent border-0 focus:ring-0 focus:border-0 px-0 placeholder:text-gray-400 dark:placeholder:text-gray-500"
            />
            <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-blue-500 to-purple-500 opacity-0 transition-opacity duration-200 focus-within:opacity-100" />
          </div>

          {isEditing && (
            <Badge
              variant="secondary"
              className="bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300"
            >
              Editing
            </Badge>
          )}
        </div>

        {/* Right Section - Actions */}
        <div className="flex items-center space-x-2">
          {/* Duplicate Button */}
          <Button
            variant="outline"
            size="sm"
            onClick={onDuplicate}
            className="hidden sm:flex items-center space-x-2 hover:bg-gray-50 dark:hover:bg-gray-800"
          >
            <Copy className="w-4 h-4" />
            <span>Duplicate</span>
          </Button>

          {/* Share/Create Public Link Button */}
          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={handleShareAction}
              className="hidden sm:flex items-center space-x-2 hover:bg-gray-50 dark:hover:bg-gray-800"
            >
              {publicLink ? (
                <>
                  <Share2 className="w-4 h-4" />
                  <span>Share</span>
                </>
              ) : (
                <>
                  <LinkIcon className="w-4 h-4" />
                  <span>Create Link</span>
                </>
              )}
            </Button>

            {/* Copy Link Button (only if public link exists) */}
            {publicLink && (
              <Button
                variant="ghost"
                size="sm"
                onClick={handleCopyLink}
                className="hidden sm:flex items-center space-x-2 hover:bg-gray-50 dark:hover:bg-gray-800"
              >
                {copied ? (
                  <>
                    <Check className="w-4 h-4 text-green-500" />
                    <span className="text-green-500">Copied!</span>
                  </>
                ) : (
                  <>
                    <ExternalLink className="w-4 h-4" />
                    <span>Copy Link</span>
                  </>
                )}
              </Button>
            )}
          </div>

          {/* Delete Button (only if editing) */}
          {isEditing && (
            <Button
              variant="outline"
              size="sm"
              onClick={onDelete}
              className="hidden sm:flex items-center space-x-2 text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20 border-red-200 dark:border-red-800"
            >
              <Trash2 className="w-4 h-4" />
              <span>Delete</span>
            </Button>
          )}

          <Button
            onClick={reset}
            variant="outline"
            size="sm"
            className="hidden sm:flex  items-center gap-1 w-auto grow"
          >
            <X className="w-4 h-4" />
            Reset
          </Button>
          {/* Mobile Menu */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="sm"
                className="sm:hidden h-8 w-8 p-0"
              >
                <MoreVertical className="w-4 h-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48">
              <DropdownMenuItem onClick={onDuplicate}>
                <Copy className="w-4 h-4 mr-2" />
                Duplicate Template
              </DropdownMenuItem>

              <DropdownMenuItem onClick={handleShareAction}>
                {publicLink ? (
                  <>
                    <Share2 className="w-4 h-4 mr-2" />
                    Share Public Link
                  </>
                ) : (
                  <>
                    <LinkIcon className="w-4 h-4 mr-2" />
                    Create Public Link
                  </>
                )}
              </DropdownMenuItem>
              <DropdownMenuItem onClick={reset}>
                <X className="w-4 h-4 mr-2" />
                Reset
              </DropdownMenuItem>
              {publicLink && (
                <DropdownMenuItem onClick={handleCopyLink}>
                  <ExternalLink className="w-4 h-4 mr-2" />
                  {copied ? "Copied!" : "Copy Link"}
                </DropdownMenuItem>
              )}

              {isEditing && (
                <>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    onClick={onDelete}
                    className="text-red-600 focus:text-red-600"
                  >
                    <Trash2 className="w-4 h-4 mr-2" />
                    Delete Template
                  </DropdownMenuItem>
                </>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* Public Link Display (if exists) */}
      {publicLink && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          className="mt-3 pt-3 border-t border-gray-200 dark:border-gray-700"
        >
          <div className="flex items-center justify-between bg-gray-50 dark:bg-gray-800 rounded-lg px-3 py-2">
            <div className="flex items-center space-x-2 flex-1 min-w-0">
              <LinkIcon className="w-4 h-4 text-gray-500 flex-shrink-0" />
              <span className="text-sm text-gray-600 dark:text-gray-300 truncate">
                {publicLink}
              </span>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleCopyLink}
              className="ml-2 flex-shrink-0"
            >
              {copied ? (
                <Check className="w-4 h-4 text-green-500" />
              ) : (
                <Copy className="w-4 h-4" />
              )}
            </Button>
          </div>
        </motion.div>
      )}
    </motion.div>
  );
};
