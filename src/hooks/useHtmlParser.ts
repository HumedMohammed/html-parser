/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  useDuplicateTemplateMutation,
  useSaveTemplateMutation,
} from "@/pages/Editor/services";
import type { Template, TextNode } from "@/types/types";
import { db } from "@/utils/pockatbase";
import { debounce } from "lodash";
import { useCallback, useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

type Props = {
  template: Partial<Template> | undefined;
  staticInput?: string;
};

type UpdateValue = {
  [key in keyof Template]: any;
};
export const useHtmlParser = ({ template, staticInput }: Props) => {
  const skipSaveOrDup = Boolean(staticInput);
  const [htmlInput, setHtmlInput] = useState("");

  const [templateName, setTemplateName] = useState("Untitled");
  const [htmlDoc, setHtmlDoc] = useState<Document | null>(null);
  const [exportDoc, setExportDoc] = useState<Document | null>(null); // Add this for export purposes
  const [texts, setTexts] = useState<TextNode[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [activeTextId, setActiveTextId] = useState<string | null>(null);
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const [duplicate, { isLoading: duplicating }] =
    useDuplicateTemplateMutation();
  const [saveTemplate, { isLoading: saving, isSuccess: savingSuccess }] =
    useSaveTemplateMutation();

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
          // Check if the text node is a direct child of body or has no proper parent
          const needsWrapper =
            parentElement.tagName.toLowerCase() === "body" ||
            parentElement.tagName.toLowerCase() === "html";

          let targetElement = parentElement;
          let exportTargetElement = exportParentElement;

          if (needsWrapper) {
            // Create a wrapper span only if the text node doesn't have a proper parent
            const wrapper = doc.createElement("span");
            const exportWrapper = exportDocCopy.createElement("span");

            wrapper.style.display = "contents"; // This makes the span invisible but keeps the text flow
            exportWrapper.style.display = "contents";

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

            targetElement = wrapper;
            exportTargetElement = exportWrapper;
          }

          // Set the data attribute on the target element (either the existing parent or the new wrapper)
          targetElement.setAttribute("data-text-id", id);
          exportTargetElement.setAttribute("data-text-id", id);

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
          const textIndex = siblings.findIndex((node) =>
            needsWrapper ? node === targetElement : node === textNode
          );
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
      setTimeout(() => {
        setSuccess("");
      }, 5000);

      // New template
      if (!template?.id && db.authStore.record?.id) {
        const valueToUpdate: Partial<Template> = {
          values: { texts: foundTexts },
          template: {
            original: htmlString,
            value: htmlString,
          },
          description: "",
          name: templateName,
          user: db.authStore.record?.id as string,
          thumbnail: "",
        };

        if (!skipSaveOrDup) {
          saveTemplate(valueToUpdate).then((res) => {
            if (res.data) {
              // searchParam.set("templateId", res?.data?.id);
              // setSearchParam(searchParam);
              navigate(`/template/editor/${res?.data?.id}`);
            }
          });
        }
      }
    } catch (err) {
      console.log(err);
      setError("Failed to parse HTML. Please check your HTML syntax.");
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (staticInput) {
      setHtmlInput(staticInput);
      parseHtml(staticInput);
    }
  }, [staticInput]);
  useEffect(() => {
    if (template?.template) {
      setHtmlInput(template?.template?.value as string);
      setTemplateName(template?.name as string);
      parseHtml(template?.template?.value as string);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [template]);
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
            console.log("========>", wrapper.nodeName);
            const parentElement =
              wrapper.nodeName == "#text" ? wrapper.parentElement : wrapper;

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

              parentElement.style.outline = "2px solid rgba(59, 130, 246, 0.8)";
              parentElement.style.outlineOffset = "2px";

              setTimeout(() => {
                parentElement.style.outline = originalOutline;
                parentElement.style.borderRadius = originalBorderRadius;
                parentElement.style.outlineOffset = originalOutlineOffset;
              }, 2500);
            }
          }
        }
      }, 100);
    }
  };
  // Handle text change
  const handleTextChange = useCallback(
    (id: string, newValue: string) => {
      // Update texts state immediately (no debounce for UI responsiveness)
      const newTexts = texts.map((t) =>
        t.id === id ? { ...t, value: newValue } : t
      );
      setTexts(newTexts);

      // Update the export document immediately
      if (exportDoc) {
        const exportWrapper = exportDoc.querySelector(`[data-text-id="${id}"]`);
        if (exportWrapper && exportWrapper.firstChild) {
          exportWrapper.firstChild.nodeValue = newValue;
        }
      }

      // Update the iframe content immediately
      if (iframeRef.current && iframeRef.current.contentDocument) {
        const iframeWrapper = iframeRef.current.contentDocument.querySelector(
          `[data-text-id="${id}"]`
        );
        if (iframeWrapper && iframeWrapper.firstChild) {
          iframeWrapper.firstChild.nodeValue = newValue;
        }
      }

      setActiveTextId(id);
    },
    [exportDoc, texts]
  );

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

  const navigate = useNavigate();
  const handleCreateNew = () => {
    setHtmlDoc(null);
    setTexts([]);
    setActiveTextId(null);
    setIsLoading(false);
    setSuccess("");
    setError("");
    setHtmlInput("");
    setTemplateName("Untitled");
    navigate("/template/editor");
    setExportDoc(null);
    setActiveTextId(null);
    setError("");
    setIsLoading(false);
  };

  const updateTemplate = async (valueToUpdate: Partial<UpdateValue>) => {
    if (template?.user && !skipSaveOrDup) {
      saveTemplate({ ...template, ...valueToUpdate });
    }
  };

  const htmlStringToCopy = () => {
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
      return htmlString;
    } else {
      toast("No Export Data", {
        description: "Something went wrong!",
      });
      return "";
    }
  };

  useEffect(() => {
    // Only save if template exists
    const debounceSave = debounce((value: string) => {
      if (exportDoc && db.authStore.record?.id) {
        updateTemplate({
          template: {
            ...(template?.template ?? {}),
            value,
            original: template?.template?.original,
          },
        });
      }
    }, 500);
    const templateValue = `<!DOCTYPE html>
                            <html>
                              <head>
                                <meta charset="UTF-8">
                                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                                <style>
                                  ${getDocumentStyles()}
                                </style>
                              </head>
                              <body>
                                ${exportDoc?.body.innerHTML}
                              </body>
                            </html>`;
    debounceSave(templateValue);

    // Cleanup function to cancel pending debounced calls
    return () => {
      debounceSave.cancel();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    exportDoc?.body.innerHTML,
    // eslint-disable-next-line react-hooks/exhaustive-deps
    JSON.stringify(template),
    db.authStore.record?.id,
  ]);

  const handleImageChange = useCallback(() => {
    // Force a re-render and save by updating the dependency
    if (exportDoc && db.authStore.record?.id) {
      const templateValue = `<!DOCTYPE html>
                            <html>
                              <head>
                                <meta charset="UTF-8">
                                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                                <style>
                                  ${getDocumentStyles()}
                                </style>
                              </head>
                              <body>
                                ${exportDoc.body.innerHTML}
                              </body>
                            </html>`;

      updateTemplate({
        template: {
          ...(template?.template ?? {}),
          value: templateValue,
          original: template?.template?.original,
        },
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [exportDoc, template, db.authStore.record?.id]);

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
    duplicating,
    saving,
    templateName,
    savingSuccess,
    exportDoc,
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
    handleCreateNew,
    updateTemplate,
    setTemplateName,
    htmlStringToCopy,
    duplicate,
    navigate,
    handleImageChange,
  };
};
