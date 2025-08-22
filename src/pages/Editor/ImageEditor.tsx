import React, { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Image as ImageIcon,
  Upload,
  Link,
  Edit3,
  Eye,
  Sparkles,
  ExternalLink,
  FileImage,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useImageEditor, type ImageNode } from "@/hooks/useImageEditor";
import { toast } from "sonner";

interface ImageEditorProps {
  htmlDoc: Document | null;
  exportDoc: Document | null;
  iframeRef: React.RefObject<HTMLIFrameElement | null>;
  onImageChange?: (imageId: string, newSrc: string) => void;
}

export const ImageEditor: React.FC<ImageEditorProps> = ({
  htmlDoc,
  exportDoc,
  iframeRef,
  onImageChange,
}) => {
  const {
    images,
    activeImageId,
    updateImageSrc,
    updateImageAlt,
    handleImageFocus,
  } = useImageEditor({
    htmlDoc,
    exportDoc,
    onImageChange,
  });

  const [editingImage, setEditingImage] = useState<ImageNode | null>(null);
  const [newImageUrl, setNewImageUrl] = useState("");
  const [newAltText, setNewAltText] = useState("");

  const handleEditImage = (image: ImageNode) => {
    setEditingImage(image);
    setNewImageUrl(image.src);
    setNewAltText(image.alt);
  };

  const handleSaveImage = () => {
    if (!editingImage) return;

    if (newImageUrl !== editingImage.src) {
      updateImageSrc(editingImage.id, newImageUrl);
    }

    if (newAltText !== editingImage.alt) {
      updateImageAlt(editingImage.id, newAltText);
    }

    setEditingImage(null);
    setNewImageUrl("");
    setNewAltText("");
  };

  const handleImageUrlChange = (imageId: string, url: string) => {
    updateImageSrc(imageId, url);
  };

  const handleFileUpload = (imageId: string, file: File) => {
    // TODO: Implement file upload functionality
    // This is where you'll integrate with your file upload service
    console.log("File upload for image:", imageId, file);
    toast.info("File upload functionality coming soon!");
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };

  if (images.length === 0) {
    return (
      <Card className="backdrop-blur-sm bg-white/90 dark:bg-gray-800/90 border-0 shadow-md h-fit">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <ImageIcon className="w-5 h-5" />
            Image Elements
          </CardTitle>
          <CardDescription>
            No images found in your HTML content
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
              <ImageIcon className="w-8 h-8 text-muted-foreground" />
            </div>
            <p className="text-sm text-muted-foreground">
              Add some images to your HTML to start editing them
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="backdrop-blur-sm bg-white/90 dark:bg-gray-800/90 border-0 shadow-md h-fit">
      <CardHeader>
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
          <CardTitle className="flex items-center gap-2">
            <ImageIcon className="w-5 h-5" />
            Image Elements
          </CardTitle>
          <Badge variant="secondary" className="flex items-center gap-1">
            <Sparkles className="w-3 h-3" />
            {images.length} images
          </Badge>
        </div>
        <CardDescription>
          Edit images in your HTML content by changing URLs or uploading new
          files
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[400px] sm:h-[600px] pr-0 sm:pr-4">
          <div className="space-y-4 p-2">
            {images.map((image, index) => (
              <motion.div
                key={image.id}
                initial="hidden"
                animate="visible"
                variants={itemVariants}
                transition={{ delay: index * 0.05 }}
                className={cn(
                  "p-4 rounded-lg border bg-card hover:shadow-md transition-all duration-200",
                  activeImageId === image.id &&
                    "ring-2 ring-blue-500 ring-offset-2"
                )}
                onClick={() => handleImageFocus(image.id, iframeRef)}
              >
                <div className="space-y-4">
                  {/* Image Preview and Info */}
                  <div className="flex items-start gap-3">
                    <div className="relative group">
                      <img
                        src={image.src}
                        alt={image.alt}
                        className="w-16 h-16 object-cover rounded-lg border bg-muted"
                        onError={(e) => {
                          const target = e.target as HTMLImageElement;
                          target.src =
                            "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='64' height='64' viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Crect x='3' y='3' width='18' height='18' rx='2' ry='2'/%3E%3Ccircle cx='9' cy='9' r='2'/%3E%3Cpath d='m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21'/%3E%3C/svg%3E";
                        }}
                      />
                      <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg flex items-center justify-center">
                        <Eye className="w-4 h-4 text-white" />
                      </div>
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between flex-wrap gap-1 mb-2">
                        <Label className="text-sm font-medium text-muted-foreground truncate">
                          {image.label}
                        </Label>
                        <Badge variant="outline" className="text-xs">
                          #{image.id}
                        </Badge>
                      </div>

                      <div className="space-y-2">
                        <div className="text-xs text-muted-foreground">
                          <p className="truncate">URL: {image.src}</p>
                          {image.alt && <p>Alt: {image.alt}</p>}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex flex-wrap gap-2">
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button
                          variant="outline"
                          size="sm"
                          className="flex items-center gap-2"
                          onClick={() => handleEditImage(image)}
                        >
                          <Edit3 className="w-3 h-3" />
                          Edit
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="sm:max-w-md">
                        <DialogHeader>
                          <DialogTitle>Edit Image</DialogTitle>
                          <DialogDescription>
                            Update the image URL or alt text for this element
                          </DialogDescription>
                        </DialogHeader>
                        <div className="space-y-4">
                          {/* Current Image Preview */}
                          <div className="text-center">
                            <img
                              src={newImageUrl || image.src}
                              alt={image.alt}
                              className="w-32 h-32 object-cover rounded-lg border mx-auto"
                              onError={(e) => {
                                const target = e.target as HTMLImageElement;
                                target.src =
                                  "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='128' height='128' viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Crect x='3' y='3' width='18' height='18' rx='2' ry='2'/%3E%3Ccircle cx='9' cy='9' r='2'/%3E%3Cpath d='m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21'/%3E%3C/svg%3E";
                              }}
                            />
                          </div>

                          {/* Image URL Input */}
                          <div className="space-y-2">
                            <Label htmlFor="image-url">Image URL</Label>
                            <div className="flex gap-2">
                              <Input
                                id="image-url"
                                placeholder="https://example.com/image.jpg"
                                value={newImageUrl}
                                onChange={(e) => setNewImageUrl(e.target.value)}
                                className="flex-1"
                              />
                              <Button
                                variant="outline"
                                size="icon"
                                onClick={() => {
                                  if (newImageUrl) {
                                    window.open(newImageUrl, "_blank");
                                  }
                                }}
                                disabled={!newImageUrl}
                              >
                                <ExternalLink className="w-4 h-4" />
                              </Button>
                            </div>
                          </div>

                          {/* File Upload Section */}
                          <div className="space-y-2">
                            <Label>Upload New Image</Label>
                            <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-6 text-center">
                              <input
                                type="file"
                                accept="image/*"
                                onChange={(e) => {
                                  const file = e.target.files?.[0];
                                  if (file) {
                                    handleFileUpload(image.id, file);
                                  }
                                }}
                                className="hidden"
                                id={`file-upload-${image.id}`}
                              />
                              <label
                                htmlFor={`file-upload-${image.id}`}
                                className="cursor-pointer"
                              >
                                <div className="flex flex-col items-center gap-2">
                                  <div className="w-12 h-12 bg-muted rounded-full flex items-center justify-center">
                                    <Upload className="w-6 h-6 text-muted-foreground" />
                                  </div>
                                  <div>
                                    <p className="text-sm font-medium">
                                      Click to upload
                                    </p>
                                    <p className="text-xs text-muted-foreground">
                                      PNG, JPG, GIF up to 10MB
                                    </p>
                                  </div>
                                </div>
                              </label>
                            </div>
                            <p className="text-xs text-muted-foreground">
                              Note: File upload functionality is coming soon.
                              Use URL for now.
                            </p>
                          </div>

                          {/* Alt Text Input */}
                          <div className="space-y-2">
                            <Label htmlFor="alt-text">Alt Text</Label>
                            <Textarea
                              id="alt-text"
                              placeholder="Describe the image for accessibility"
                              value={newAltText}
                              onChange={(e) => setNewAltText(e.target.value)}
                              className="min-h-[80px]"
                            />
                          </div>

                          {/* Action Buttons */}
                          <div className="flex gap-2 pt-4">
                            <Button
                              variant="outline"
                              onClick={() => {
                                setEditingImage(null);
                                setNewImageUrl("");
                                setNewAltText("");
                              }}
                              className="flex-1"
                            >
                              Cancel
                            </Button>
                            <Button
                              onClick={handleSaveImage}
                              className="flex-1"
                              disabled={!newImageUrl.trim()}
                            >
                              Save Changes
                            </Button>
                          </div>
                        </div>
                      </DialogContent>
                    </Dialog>

                    {/* Quick URL Change */}
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button
                          variant="outline"
                          size="sm"
                          className="flex items-center gap-2"
                        >
                          <Link className="w-3 h-3" />
                          Quick URL
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="sm:max-w-md">
                        <DialogHeader>
                          <DialogTitle>Change Image URL</DialogTitle>
                          <DialogDescription>
                            Quickly update the image source URL
                          </DialogDescription>
                        </DialogHeader>
                        <div className="space-y-4">
                          <div className="space-y-2">
                            <Label htmlFor="quick-url">New Image URL</Label>
                            <Input
                              id="quick-url"
                              placeholder="https://example.com/new-image.jpg"
                              defaultValue={image.src}
                              onKeyDown={(e) => {
                                if (e.key === "Enter") {
                                  const input = e.target as HTMLInputElement;
                                  if (input.value.trim()) {
                                    handleImageUrlChange(
                                      image.id,
                                      input.value.trim()
                                    );
                                    // Close dialog
                                    const closeButton = document.querySelector(
                                      "[data-dialog-close]"
                                    ) as HTMLButtonElement;
                                    closeButton?.click();
                                  }
                                }
                              }}
                            />
                          </div>
                          <div className="flex gap-2">
                            <Button
                              variant="outline"
                              onClick={() => {
                                const input = document.getElementById(
                                  "quick-url"
                                ) as HTMLInputElement;
                                input.value = image.src;
                              }}
                              className="flex-1"
                            >
                              Reset
                            </Button>
                            <Button
                              onClick={() => {
                                const input = document.getElementById(
                                  "quick-url"
                                ) as HTMLInputElement;
                                if (input.value.trim()) {
                                  handleImageUrlChange(
                                    image.id,
                                    input.value.trim()
                                  );
                                }
                              }}
                              className="flex-1"
                            >
                              Update
                            </Button>
                          </div>
                        </div>
                      </DialogContent>
                    </Dialog>

                    {/* Upload Button */}
                    <Button
                      variant="outline"
                      size="sm"
                      className="flex items-center gap-2"
                      onClick={() => {
                        const input = document.getElementById(
                          `file-upload-direct-${image.id}`
                        ) as HTMLInputElement;
                        input?.click();
                      }}
                    >
                      <FileImage className="w-3 h-3" />
                      Upload
                    </Button>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          handleFileUpload(image.id, file);
                        }
                      }}
                      className="hidden"
                      id={`file-upload-direct-${image.id}`}
                    />
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
};
