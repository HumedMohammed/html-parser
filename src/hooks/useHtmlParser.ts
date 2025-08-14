import { useRef, useState } from "react";

interface TextNode {
  id: string;
  value: string;
  label?: string;
}
export const useHtmlParser = () => {
  const [htmlInput, setHtmlInput] = useState("");
  const [htmlDoc, setHtmlDoc] = useState<Document | null>(null);
  const [exportDoc, setExportDoc] = useState<Document | null>(null); // Add this for export purposes
  const [texts, setTexts] = useState<TextNode[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [activeTextId, setActiveTextId] = useState<string | null>(null);
  const iframeRef = useRef<HTMLIFrameElement>(null);
  // Parse HTML and extract text nodes
  const parseHtml = (htmlString: string) => {
    if (!htmlString.trim()) {
      setError("Please paste some HTML content");
      return;
    }

    setIsLoading(true);
    setError("");
    setSuccess("");

    try {
      const parser = new DOMParser();
      const doc = parser.parseFromString(htmlString, "text/html");
      const exportDocCopy = parser.parseFromString(htmlString, "text/html");

      let counter = 0;
      const foundTexts: TextNode[] = [];

      const walker = doc.createTreeWalker(doc.body, NodeFilter.SHOW_TEXT, {
        acceptNode: (node) => {
          const text = node.nodeValue?.trim();
          return text && text.length > 0
            ? NodeFilter.FILTER_ACCEPT
            : NodeFilter.FILTER_REJECT;
        },
      });

      const exportWalker = exportDocCopy.createTreeWalker(
        exportDocCopy.body,
        NodeFilter.SHOW_TEXT,
        {
          acceptNode: (node) => {
            const text = node.nodeValue?.trim();
            return text && text.length > 0
              ? NodeFilter.FILTER_ACCEPT
              : NodeFilter.FILTER_REJECT;
          },
        }
      );

      while (walker.nextNode() && exportWalker.nextNode()) {
        const id = `text-${counter++}`;
        const textNode = walker.currentNode as Text;
        const exportTextNode = exportWalker.currentNode as Text;
        const parentElement = textNode.parentElement;
        const exportParentElement = exportTextNode.parentElement;

        if (parentElement && exportParentElement) {
          // Create a wrapper span for the text node to make it identifiable
          const wrapper = doc.createElement("span");
          const exportWrapper = exportDocCopy.createElement("span");

          // Set attributes on the wrapper instead of parent
          wrapper.setAttribute("data-text-id", id);
          wrapper.style.display = "contents"; // This makes the span invisible but keeps the text flow
          exportWrapper.setAttribute("data-text-id", id);
          exportWrapper.style.display = "contents";

          // Store reference to the original text node in the wrapper
          wrapper.setAttribute("data-original-text", textNode.nodeValue || "");
          exportWrapper.setAttribute(
            "data-original-text",
            exportTextNode.nodeValue || ""
          );

          // Wrap the text node
          textNode.parentNode?.insertBefore(wrapper, textNode);
          textNode.parentNode?.removeChild(textNode);
          wrapper.appendChild(textNode);

          exportTextNode.parentNode?.insertBefore(
            exportWrapper,
            exportTextNode
          );
          exportTextNode.parentNode?.removeChild(exportTextNode);
          exportWrapper.appendChild(exportTextNode);

          // Generate a meaningful label
          const tagName = parentElement.tagName.toLowerCase();
          const className = parentElement.className;
          const textContent = textNode.nodeValue?.trim() || "";

          let label = `${tagName}`;
          if (className) {
            label += `.${className.split(" ")[0]}`;
          }

          // Add position info for mixed content
          const siblings = Array.from(parentElement.childNodes);
          const textIndex = siblings.findIndex((node) => node === wrapper);
          if (siblings.length > 1) {
            label += ` [${textIndex + 1}/${siblings.length}]`;
          }

          if (textContent.length > 30) {
            label += ` - "${textContent.substring(0, 30)}..."`;
          } else {
            label += ` - "${textContent}"`;
          }

          foundTexts.push({
            id,
            value: textNode.nodeValue || "",
            label,
          });
        }
      }

      setHtmlDoc(doc);
      setExportDoc(exportDocCopy);
      setTexts(foundTexts);
      setSuccess(`Successfully parsed ${foundTexts.length} text elements`);

      setTimeout(() => setIsLoading(false), 500);
    } catch (err) {
      console.log(err);
      setError("Failed to parse HTML. Please check your HTML syntax.");
      setIsLoading(false);
    }
  };
  // Get styles from the document head
  const getDocumentStyles = () => {
    if (!exportDoc) return "";

    const styles: string[] = [];

    // Get inline styles from <style> tags
    const styleTags = exportDoc.head.querySelectorAll("style");
    styleTags.forEach((styleTag) => {
      styles.push(styleTag.innerHTML);
    });

    // Get external stylesheets (convert to style tags for preview)
    const linkTags = exportDoc.head.querySelectorAll('link[rel="stylesheet"]');
    linkTags.forEach((linkTag) => {
      const href = linkTag.getAttribute("href");
      if (href) {
        // For external stylesheets, we'll add a comment indicating the link
        styles.push(`/* External stylesheet: ${href} */`);
      }
    });

    return styles?.join("\n");
  };

  const scrollToElementInPreview = (textId: string) => {
    if (iframeRef.current && iframeRef.current.contentWindow) {
      setTimeout(() => {
        const iframe = iframeRef.current;
        if (iframe && iframe.contentDocument) {
          const wrapper = iframe.contentDocument.querySelector(
            `[data-text-id="${textId}"]`
          ) as HTMLElement;

          if (wrapper) {
            // Get the parent element for highlighting since wrapper is invisible
            const parentElement = wrapper.parentElement as HTMLElement;

            if (parentElement) {
              const rect = parentElement.getBoundingClientRect();
              const isInView =
                rect.top >= 0 && rect.bottom <= iframe.clientHeight;

              if (!isInView) {
                parentElement.scrollIntoView({
                  behavior: "smooth",
                  block: "center",
                  inline: "nearest",
                });
              }

              // Highlight the parent element temporarily
              const originalOutline = parentElement.style.outline;
              const originalBorderRadius = parentElement.style.borderRadius;
              const originalOutlineOffset = parentElement.style.outlineOffset;

              parentElement.style.transition = "all 0.3s ease";
              parentElement.style.outline = "2px solid rgba(59, 130, 246, 0.7)";
              parentElement.style.borderRadius = "4px";
              parentElement.style.outlineOffset = "2px";

              setTimeout(() => {
                parentElement.style.outline = originalOutline;
                parentElement.style.borderRadius = originalBorderRadius;
                parentElement.style.outlineOffset = originalOutlineOffset;
              }, 2000);
            }
          }
        }
      }, 100);
    }
  };
  // Handle text change
  const handleTextChange = (id: string, newValue: string) => {
    const newTexts = texts.map((t) =>
      t.id === id ? { ...t, value: newValue } : t
    );
    setTexts(newTexts);

    // Update the export document
    if (exportDoc) {
      const exportWrapper = exportDoc.querySelector(`[data-text-id="${id}"]`);
      if (exportWrapper && exportWrapper.firstChild) {
        exportWrapper.firstChild.nodeValue = newValue;
      }
    }

    // Update the iframe content
    if (iframeRef.current && iframeRef.current.contentDocument) {
      const iframeWrapper = iframeRef.current.contentDocument.querySelector(
        `[data-text-id="${id}"]`
      );
      if (iframeWrapper && iframeWrapper.firstChild) {
        iframeWrapper.firstChild.nodeValue = newValue;
      }
    }

    setActiveTextId(id);
    scrollToElementInPreview(id);
  };

  // Handle paste from clipboard
  const handlePasteFromClipboard = async () => {
    try {
      const text = await navigator.clipboard.readText();
      setHtmlInput(text);
      parseHtml(text);
    } catch (err) {
      console.log(err);
      setError("Failed to read from clipboard. Please paste manually.");
    }
  };

  // Export modified HTML
  const exportHtml = () => {
    if (exportDoc) {
      const styles = getDocumentStyles();
      const htmlString = `<!DOCTYPE html>
              <html>
                <head>
                  <meta charset="UTF-8">
                  <meta name="viewport" content="width=device-width, initial-scale=1.0">
                  <style>
                    ${styles}
                  </style>
                </head>
                <body>
                  ${exportDoc.body.innerHTML}
                </body>
              </html>`;

      const blob = new Blob([htmlString], { type: "text/html" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "modified.html";
      a.click();
      URL.revokeObjectURL(url);
    }
  };

  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.4 },
    },
  };

  // Handle focus on text input
  const handleTextFocus = (id: string) => {
    setActiveTextId(id);
    scrollToElementInPreview(id);
  };

  return {
    containerVariants,
    itemVariants,
    activeTextId,
    texts,
    isLoading,
    error,
    success,
    iframeRef,
    htmlInput,
    htmlDoc,
    handleTextChange,
    handlePasteFromClipboard,
    exportHtml,
    handleTextFocus,
    setHtmlInput,
    setIsLoading,
    setError,
    setSuccess,
    setExportDoc,
    setTexts,
    setActiveTextId,
    parseHtml,
    setHtmlDoc,
    getDocumentStyles,
  };
};
