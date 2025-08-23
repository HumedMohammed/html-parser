import { useCallback, useEffect, useState } from "react";
import { toast } from "sonner";

export interface ImageNode {
  id: string;
  src: string;
  alt: string;
  element: HTMLElement;
  label: string;
  width?: string;
  height?: string;
  className?: string;
  type:
    | "img"
    | "background"
    | "backgroundImage"
    | "listStyle"
    | "content"
    | "mask"
    | "border";
  property?: string; // CSS property name for style-based images
  originalValue?: string; // Original CSS value for restoration
}

interface UseImageEditorProps {
  htmlDoc: Document | null;
  exportDoc: Document | null;
  onImageChange?: (imageId: string, newSrc: string) => void;
  iframeRef: React.RefObject<HTMLIFrameElement | null>;
}

export const useImageEditor = ({
  htmlDoc,
  exportDoc,
  iframeRef,
  onImageChange,
}: UseImageEditorProps) => {
  const [images, setImages] = useState<ImageNode[]>([]);
  const [activeImageId, setActiveImageId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // Extract URL from CSS value
  const extractUrlFromCssValue = (cssValue: string): string | null => {
    const urlMatch = cssValue.match(/url\(['"]?([^'")\s]+)['"]?\)/);
    return urlMatch ? urlMatch[1] : null;
  };

  // Create CSS value with new URL
  const createCssValueWithNewUrl = (
    originalValue: string,
    newUrl: string
  ): string => {
    return originalValue.replace(
      /url\(['"]?[^'")\s]+['"]?\)/,
      `url("${newUrl}")`
    );
  };

  // Extract images from HTML document
  const extractImages = useCallback(() => {
    if (!htmlDoc || !exportDoc) return;

    setIsLoading(true);
    const foundImages: ImageNode[] = [];
    let imageCounter = 0;

    // 1. Extract <img> elements
    const imgElements = htmlDoc.querySelectorAll("img");
    const exportImgElements = exportDoc.querySelectorAll("img");

    imgElements.forEach((img, index) => {
      const exportImg = exportImgElements[index];
      if (!exportImg) return;

      const id = `image-${imageCounter++}`;

      // Set data attribute for identification
      img.setAttribute("data-image-id", id);
      exportImg.setAttribute("data-image-id", id);

      // Generate meaningful label
      const alt = img.alt || "";
      const className = img.className || "";
      const src = img.src || "";

      let label = `IMG ${index + 1}`;
      if (alt) {
        label += ` - "${alt}"`;
      } else if (className) {
        label += ` - .${className.split(" ")[0]}`;
      } else if (src) {
        const filename = src.split("/").pop()?.split("?")[0] || "";
        if (filename) {
          label += ` - ${filename}`;
        }
      }

      foundImages.push({
        id,
        src: img.src,
        alt: img.alt || "",
        element: img,
        label,
        width: img.style.width || img.getAttribute("width") || "",
        height: img.style.height || img.getAttribute("height") || "",
        className: img.className || "",
        type: "img",
      });
    });

    // 2. Extract CSS background images from all elements
    const allElements = htmlDoc.querySelectorAll("*");
    const exportAllElements = exportDoc.querySelectorAll("*");

    allElements.forEach((element, index) => {
      const exportElement = exportAllElements[index];
      if (!exportElement) return;

      const computedStyle = window.getComputedStyle(element);
      const elementStyle = (element as HTMLElement).style;

      // CSS properties that can contain images
      const imageProperties = [
        "background",
        "backgroundImage",
        "listStyleImage",
        "content",
        "maskImage",
        "borderImage",
        "borderImageSource",
      ];

      imageProperties.forEach((property) => {
        let cssValue = "";

        // Check inline styles first
        if (elementStyle.getPropertyValue(property)) {
          cssValue = elementStyle.getPropertyValue(property);
        } else if (computedStyle.getPropertyValue(property)) {
          cssValue = computedStyle.getPropertyValue(property);
        }

        if (cssValue && cssValue !== "none" && cssValue.includes("url(")) {
          const imageUrl = extractUrlFromCssValue(cssValue);
          if (imageUrl && !imageUrl.startsWith("data:")) {
            const id = `image-${imageCounter++}`;

            // Set data attribute for identification
            element.setAttribute(`data-image-id-${property}`, id);
            exportElement.setAttribute(`data-image-id-${property}`, id);

            // Generate meaningful label
            const tagName = element.tagName.toLowerCase();
            const className = element.className || "";

            let label = `${tagName.toUpperCase()}`;
            if (className) {
              label += `.${className.split(" ")[0]}`;
            }
            label += ` - ${property}`;

            const filename = imageUrl.split("/").pop()?.split("?")[0] || "";
            if (filename) {
              label += ` - ${filename}`;
            }

            // Determine the specific type based on property
            let imageType: ImageNode["type"] = "background";
            if (property === "backgroundImage") imageType = "backgroundImage";
            else if (property === "listStyleImage") imageType = "listStyle";
            else if (property === "content") imageType = "content";
            else if (property === "maskImage") imageType = "mask";
            else if (property.includes("border")) imageType = "border";

            foundImages.push({
              id,
              src: imageUrl,
              alt:
                element.getAttribute("alt") ||
                element.getAttribute("title") ||
                "",
              element: element as HTMLElement,
              label,
              width: elementStyle.width || element.getAttribute("width") || "",
              height:
                elementStyle.height || element.getAttribute("height") || "",
              className: element.className || "",
              type: imageType,
              property,
              originalValue: cssValue,
            });
          }
        }
      });
    });

    // 3. Extract images from <style> tags and external stylesheets
    const styleTags = htmlDoc.querySelectorAll("style");
    const exportStyleTags = exportDoc.querySelectorAll("style");

    styleTags.forEach((styleTag, styleIndex) => {
      const exportStyleTag = exportStyleTags[styleIndex];
      if (!exportStyleTag) return;

      const cssText = styleTag.textContent || "";
      const urlMatches = cssText.matchAll(/url\(['"]?([^'")\s]+)['"]?\)/g);

      for (const match of urlMatches) {
        const imageUrl = match[1];
        if (imageUrl && !imageUrl.startsWith("data:")) {
          const id = `image-${imageCounter++}`;

          // Set data attribute for identification
          styleTag.setAttribute(`data-style-image-${id}`, "true");
          exportStyleTag.setAttribute(`data-style-image-${id}`, "true");

          const filename = imageUrl.split("/").pop()?.split("?")[0] || "";
          const label = `STYLE ${styleIndex + 1} - ${filename || imageUrl}`;

          foundImages.push({
            id,
            src: imageUrl,
            alt: "",
            element: styleTag as HTMLElement,
            label,
            type: "background",
            property: "stylesheet",
            originalValue: match[0],
          });
        }
      }
    });

    setImages(foundImages);
    setIsLoading(false);

    if (foundImages.length > 0) {
      toast.success(
        `Found ${foundImages.length} images (including CSS backgrounds)`
      );
    }
  }, [htmlDoc, exportDoc]);

  // Update image source
  const updateImageSrc = useCallback(
    (imageId: string, newSrc: string) => {
      if (!htmlDoc || !exportDoc) return;

      try {
        const imageNode = images.find((img) => img.id === imageId);
        if (!imageNode) return;

        if (imageNode.type === "img") {
          // Handle <img> elements
          const imgElement = iframeRef.current?.contentDocument?.querySelector(
            `[data-image-id="${imageId}"]`
          ) as HTMLImageElement;
          const exportImgElement = exportDoc.querySelector(
            `[data-image-id="${imageId}"]`
          ) as HTMLImageElement;

          if (imgElement) {
            imgElement.src = newSrc;
          }
          if (exportImgElement) {
            exportImgElement.src = newSrc;
            console.log(exportImgElement);
          }
        } else if (imageNode.property === "stylesheet") {
          // Handle images in <style> tags
          const styleElement = htmlDoc.querySelector(
            `[data-style-image-${imageId}]`
          ) as HTMLStyleElement;
          const exportStyleElement = exportDoc.querySelector(
            `[data-style-image-${imageId}]`
          ) as HTMLStyleElement;

          if (styleElement && exportStyleElement && imageNode.originalValue) {
            const newCssValue = createCssValueWithNewUrl(
              imageNode.originalValue,
              newSrc
            );
            const oldCssText = styleElement.textContent || "";
            const newCssText = oldCssText.replace(
              imageNode.originalValue,
              newCssValue
            );

            styleElement.textContent = newCssText;
            exportStyleElement.textContent = newCssText;
          }
        } else {
          // Handle CSS properties
          const element = htmlDoc.querySelector(
            `[data-image-id-${imageNode.property}="${imageId}"]`
          ) as HTMLElement;
          const exportElement = exportDoc.querySelector(
            `[data-image-id-${imageNode.property}="${imageId}"]`
          ) as HTMLElement;

          if (
            element &&
            exportElement &&
            imageNode.property &&
            imageNode.originalValue
          ) {
            const newCssValue = createCssValueWithNewUrl(
              imageNode.originalValue,
              newSrc
            );

            element.style.setProperty(imageNode.property, newCssValue);
            exportElement.style.setProperty(imageNode.property, newCssValue);
          }
        }

        // Update local state
        setImages((prev) =>
          prev.map((img) =>
            img.id === imageId ? { ...img, src: newSrc } : img
          )
        );

        // Trigger callback
        onImageChange?.(imageId, newSrc);

        toast.success("Image updated successfully");
      } catch (error) {
        console.error("Failed to update image:", error);
        toast.error("Failed to update image");
      }
    },
    [htmlDoc, exportDoc, onImageChange, images]
  );

  // Update image alt text (only for <img> elements)
  const updateImageAlt = useCallback(
    (imageId: string, newAlt: string) => {
      if (!htmlDoc || !exportDoc) return;

      try {
        const imageNode = images.find((img) => img.id === imageId);
        if (!imageNode || imageNode.type !== "img") {
          toast.info("Alt text can only be updated for <img> elements");
          return;
        }

        const imgElement = htmlDoc.querySelector(
          `[data-image-id="${imageId}"]`
        ) as HTMLImageElement;
        const exportImgElement = exportDoc.querySelector(
          `[data-image-id="${imageId}"]`
        ) as HTMLImageElement;

        if (imgElement && exportImgElement) {
          imgElement.alt = newAlt;
          exportImgElement.alt = newAlt;

          setImages((prev) =>
            prev.map((img) =>
              img.id === imageId ? { ...img, alt: newAlt } : img
            )
          );

          toast.success("Alt text updated");
        }
      } catch (error) {
        console.error("Failed to update alt text:", error);
        toast.error("Failed to update alt text");
      }
    },
    [htmlDoc, exportDoc, images]
  );

  // Highlight image in preview
  const highlightImageInPreview = useCallback(
    (imageId: string, iframeRef: React.RefObject<HTMLIFrameElement | null>) => {
      if (!iframeRef.current?.contentDocument) return;

      const imageNode = images.find((img) => img.id === imageId);
      if (!imageNode) return;

      let targetElement: HTMLElement | null = null;

      if (imageNode.type === "img") {
        targetElement = iframeRef.current.contentDocument.querySelector(
          `[data-image-id="${imageId}"]`
        ) as HTMLElement;
      } else if (imageNode.property === "stylesheet") {
        targetElement = iframeRef.current.contentDocument.querySelector(
          `[data-style-image-${imageId}]`
        ) as HTMLElement;
      } else {
        targetElement = iframeRef.current.contentDocument.querySelector(
          `[data-image-id-${imageNode.property}="${imageId}"]`
        ) as HTMLElement;
      }

      if (targetElement) {
        // Scroll to element
        targetElement.scrollIntoView({
          behavior: "smooth",
          block: "center",
          inline: "nearest",
        });

        // Highlight temporarily
        const originalOutline = targetElement.style.outline;
        const originalBoxShadow = targetElement.style.boxShadow;

        targetElement.style.outline = "3px solid #3b82f6";
        targetElement.style.boxShadow = "0 0 0 6px rgba(59, 130, 246, 0.2)";

        setTimeout(() => {
          targetElement.style.outline = originalOutline;
          targetElement.style.boxShadow = originalBoxShadow;
        }, 2000);
      }
    },
    [images]
  );

  // Handle image focus
  const handleImageFocus = useCallback(
    (
      imageId: string,
      iframeRef?: React.RefObject<HTMLIFrameElement | null>
    ) => {
      setActiveImageId(imageId);
      if (iframeRef) {
        highlightImageInPreview(imageId, iframeRef);
      }
    },
    [highlightImageInPreview]
  );

  // Extract images when documents change
  useEffect(() => {
    if (htmlDoc && exportDoc) {
      extractImages();
    }
  }, [extractImages]);

  return {
    images,
    activeImageId,
    isLoading,
    updateImageSrc,
    updateImageAlt,
    handleImageFocus,
    highlightImageInPreview,
    extractImages,
  };
};
