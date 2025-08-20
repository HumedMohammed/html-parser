import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Clock, Link as LinkIcon, Copy, Check } from "lucide-react";
import { LoadingCircle } from "@/components/icons";
import { toast } from "sonner";

interface PublicLinkModalProps {
  isOpen: boolean;
  onClose: () => void;
  onGenerate: (expireTime: string) => Promise<string | undefined>; // Now returns the generated link
  isLoading: boolean;
}

const EXPIRATION_OPTIONS = [
  { value: "1h", label: "1 Hour" },
  { value: "24h", label: "24 Hours" },
  { value: "7d", label: "7 Days" },
  { value: "30d", label: "30 Days" },
  { value: "90d", label: "90 Days" },
  { value: "never", label: "Never Expires" },
];

export const PublicLinkModal: React.FC<PublicLinkModalProps> = ({
  isOpen,
  onClose,
  onGenerate,
  isLoading,
}) => {
  const [selectedExpiration, setSelectedExpiration] = useState("7d");
  const [generatedLink, setGeneratedLink] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const handleGenerate = async () => {
    try {
      const link = await onGenerate(selectedExpiration);
      if (link) {
        setGeneratedLink(link);
      } else {
        toast("Failed to generate public link. Please try again.", {
          className: "bg-red-500 text-white",
          description: "Please try again later.",
        });
      }
    } catch (error) {
      console.error("Failed to generate link:", error);
    }
  };

  const handleCopy = async () => {
    if (generatedLink) {
      try {
        await navigator.clipboard.writeText(generatedLink);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      } catch (error) {
        console.error("Failed to copy link:", error);
      }
    }
  };

  const handleClose = () => {
    setGeneratedLink(null);
    setCopied(false);
    onClose();
  };

  const handleCreateAnother = () => {
    setGeneratedLink(null);
    setCopied(false);
  };

  return (
    <Dialog open={isOpen} defaultOpen={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <LinkIcon className="w-5 h-5" />
            {generatedLink ? "Public Link Generated" : "Create Public Link"}
          </DialogTitle>
          <DialogDescription>
            {generatedLink
              ? "Your public link has been generated successfully. Copy and share it with others."
              : "Generate a public link to share this template. You can set an expiration time for security."}
          </DialogDescription>
        </DialogHeader>

        {!generatedLink ? (
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="expiration" className="flex items-center gap-2">
                <Clock className="w-4 h-4" />
                Link Expiration
              </Label>
              <Select
                value={selectedExpiration}
                onValueChange={setSelectedExpiration}
                disabled={isLoading}
              >
                <SelectTrigger id="expiration">
                  <SelectValue placeholder="Select expiration time" />
                </SelectTrigger>
                <SelectContent>
                  {EXPIRATION_OPTIONS.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="text-sm text-muted-foreground bg-blue-50 dark:bg-blue-900/20 p-3 rounded-lg">
              <p className="font-medium mb-1">Public Link Format:</p>
              <code className="text-xs bg-white dark:bg-gray-800 px-2 py-1 rounded">
                http://localhost:5173/public/[template-id]
              </code>
            </div>
          </div>
        ) : (
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label className="flex items-center gap-2">
                <LinkIcon className="w-4 h-4" />
                Generated Link
              </Label>
              <div className="flex items-center gap-2 p-3 bg-green-50 dark:bg-green-900/20 rounded-lg border">
                <code className="flex-1 text-sm bg-white dark:bg-gray-800 px-2 py-1 rounded break-all">
                  {generatedLink}
                </code>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={handleCopy}
                  className="shrink-0"
                >
                  {copied ? (
                    <>
                      <Check className="w-4 h-4 mr-1" />
                      Copied
                    </>
                  ) : (
                    <>
                      <Copy className="w-4 h-4 mr-1" />
                      Copy
                    </>
                  )}
                </Button>
              </div>
            </div>

            <div className="text-sm text-muted-foreground bg-blue-50 dark:bg-blue-900/20 p-3 rounded-lg">
              <p className="font-medium mb-1">Link Details:</p>
              <p>
                Expires:{" "}
                {
                  EXPIRATION_OPTIONS.find(
                    (opt) => opt.value === selectedExpiration
                  )?.label
                }
              </p>
            </div>
          </div>
        )}

        <DialogFooter>
          {!generatedLink ? (
            <>
              <Button
                variant="outline"
                onClick={handleClose}
                disabled={isLoading}
              >
                Cancel
              </Button>
              <Button
                onClick={handleGenerate}
                disabled={isLoading || !selectedExpiration}
                className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
              >
                {isLoading ? (
                  <>
                    <LoadingCircle />
                    Generating...
                  </>
                ) : (
                  <>
                    <LinkIcon className="w-4 h-4 mr-2" />
                    Generate Link
                  </>
                )}
              </Button>
            </>
          ) : (
            <>
              <Button variant="outline" onClick={handleCreateAnother}>
                Create Another
              </Button>
              <Button onClick={handleClose}>Done</Button>
            </>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
