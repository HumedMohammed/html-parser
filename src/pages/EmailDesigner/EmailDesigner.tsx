// Designer.tsx
import React, { useEffect, useRef, useState } from "react";
import grapesjs, { Editor } from "grapesjs";
import "grapesjs/dist/css/grapes.min.css";
import { db } from "@/utils/pockatbase"; // keep your pocketbase db util
import { useParams, useNavigate } from "react-router-dom";
import {
  Save,
  Download,
  Eye,
  Smartphone,
  Monitor,
  Tablet,
  Undo,
  Redo,
  Settings,
  Code,
  Square,
  List,
  ChevronLeft,
  Image as ImageIcon,
  Type,
  Columns,
  Mail,
  Link as LinkIcon,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

/**
 * Stripo-like GrapesJS email designer
 * - Fully functional: undo/redo, device switch, preview, export, save/load
 * - Collapsible block groups (Sections, Content, Layout)
 * - Layers / Traits / Styles panels wired to grapesjs
 *
 * Notes:
 * - This is "Stripo-like" UI and functionality, not the proprietary Stripo product.
 * - If you need to use any grapesjs plugins (e.g. grapesjs-preset-newsletter), install and integrate accordingly.
 */

export const Designer: React.FC = () => {
  const editorRef = useRef<Editor | null>(null);
  const { templateId } = useParams<{ templateId?: string }>();
  const navigate = useNavigate();

  const [templateName, setTemplateName] = useState("Untitled Email");
  const [activeDevice, setActiveDevice] = useState<
    "Desktop" | "Tablet" | "Mobile"
  >("Desktop");
  const [isSaving, setIsSaving] = useState(false);
  const [blockGroupsOpen, setBlockGroupsOpen] = useState({
    Sections: true,
    Content: true,
    Layout: false,
  });

  // Block definitions (kept in state so we can render groups in left sidebar)
  const blocks = useRef([
    {
      id: "header",
      label: "Header",
      category: "Sections",
      icon: '<svg class="w-5 h-5" viewBox="0 0 24 24"><rect x="2" y="4" width="20" height="6" rx="1"/></svg>',
      content: `<table width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color: #f8fafc;">
          <tr><td align="center" style="padding:40px 20px;">
            <table width="600" cellpadding="0" cellspacing="0" border="0">
              <tr><td style="font-family: Arial, sans-serif; font-size:24px; font-weight:700; color:#0f172a;">Your Logo</td></tr>
            </table>
          </td></tr>
        </table>`,
    },
    {
      id: "hero",
      label: "Hero",
      category: "Sections",
      icon: '<svg class="w-5 h-5" viewBox="0 0 24 24"><rect x="2" y="6" width="20" height="12" rx="1"/></svg>',
      content: `<table width="100%" cellpadding="0" cellspacing="0" border="0" style="background: linear-gradient(90deg,#9fe6d8,#58c8c8);">
          <tr><td align="center" style="padding:60px 20px;">
            <table width="600" cellpadding="0" cellspacing="0" border="0">
              <tr><td style="font-family: Arial, sans-serif; font-size:32px; font-weight:700; color:#fff; text-align:center;">Welcome</td></tr>
              <tr><td style="font-family: Arial, sans-serif; font-size:16px; color:#eef; text-align:center; padding-top:10px;">Stay updated with our news</td></tr>
            </table>
          </td></tr>
        </table>`,
    },
    {
      id: "text-block",
      label: "Text",
      category: "Content",
      icon: '<svg class="w-5 h-5" viewBox="0 0 24 24"><path d="M4 6h16v2H4zM4 11h16v2H4zM4 16h10v2H4z"/></svg>',
      content: `<table width="100%" cellpadding="0" cellspacing="0" border="0"><tr><td align="center" style="padding:20px;"><table width="600" cellpadding="0" cellspacing="0"><tr><td style="font-family: Arial, sans-serif; font-size:16px; color:#0f172a; line-height:1.6; padding:20px;">Lorem ipsum dolor sit amet, consectetur adipiscing elit.</td></tr></table></td></tr></table>`,
    },
    {
      id: "button",
      label: "Button",
      category: "Content",
      icon: '<svg class="w-5 h-5" viewBox="0 0 24 24"><rect x="3" y="8" width="18" height="8" rx="3"/></svg>',
      content: `<table width="100%" cellpadding="0" cellspacing="0" border="0"><tr><td align="center" style="padding:20px;"><table cellpadding="0" cellspacing="0"><tr><td align="center" style="background-color:#0891b2; border-radius:6px;"><a href="#" style="display:inline-block; padding:12px 28px; font-family:Arial, sans-serif; font-weight:600; color:#fff; text-decoration:none;">Call to action</a></td></tr></table></td></tr></table>`,
    },
    {
      id: "image-block",
      label: "Image",
      category: "Content",
      icon: '<svg class="w-5 h-5" viewBox="0 0 24 24"><rect x="2" y="3" width="20" height="14" rx="2"/><circle cx="8" cy="8" r="2"/></svg>',
      content: `<table width="100%" cellpadding="0" cellspacing="0" border="0"><tr><td align="center" style="padding:20px;"><img src="https://via.placeholder.com/600x300" alt="Image" style="max-width:100%;height:auto;display:block;" /></td></tr></table>`,
    },
    {
      id: "2-columns",
      label: "2 Columns",
      category: "Layout",
      icon: '<svg class="w-5 h-5" viewBox="0 0 24 24"><rect x="3" y="3" width="8" height="18" rx="1"/><rect x="13" y="3" width="8" height="18" rx="1"/></svg>',
      content: `<table width="100%" cellpadding="0" cellspacing="0" border="0"><tr><td align="center" style="padding:20px;"><table width="600" cellpadding="0" cellspacing="0"><tr><td width="50%" style="padding:8px;vertical-align:top;"><div style="background:#f8fafc;padding:20px;border-radius:6px;">Column 1</div></td><td width="50%" style="padding:8px;vertical-align:top;"><div style="background:#f8fafc;padding:20px;border-radius:6px;">Column 2</div></td></tr></table></td></tr></table>`,
    },
    {
      id: "divider",
      label: "Divider",
      category: "Content",
      icon: '<svg class="w-5 h-5" viewBox="0 0 24 24"><rect x="2" y="11" width="20" height="2"/></svg>',
      content: `<table width="100%" cellpadding="0" cellspacing="0" border="0"><tr><td align="center" style="padding:20px;"><table width="600" cellpadding="0" cellspacing="0"><tr><td style="border-top:2px solid #e6eef0;"></td></tr></table></td></tr></table>`,
    },
    {
      id: "footer",
      label: "Footer",
      category: "Sections",
      icon: '<svg class="w-5 h-5" viewBox="0 0 24 24"><rect x="2" y="16" width="20" height="6" rx="1"/></svg>',
      content: `<table width="100%" cellpadding="0" cellspacing="0" border="0" style="background:#0f172a;"><tr><td align="center" style="padding:30px 20px;"><table width="600"><tr><td style="font-family:Arial,sans-serif;font-size:13px;color:#9ca3af;text-align:center;">© ${new Date().getFullYear()} Company. All rights reserved.</td></tr></table></td></tr></table>`,
    },
  ] as Array<any>);

  // Initialize grapesjs
  useEffect(() => {
    if (editorRef.current) return;

    const editor = grapesjs.init({
      container: "#gjs",
      fromElement: false,
      height: "calc(100vh - 64px)",
      width: "100%",
      storageManager: false,
      blockManager: { appendTo: "#blocks" },
      styleManager: { appendTo: "#styles-container" },
      layerManager: { appendTo: "#layers-container" },
      traitManager: { appendTo: "#trait-container" },
      selectorManager: { appendTo: "#styles-container" },
      deviceManager: {
        devices: [
          { name: "Desktop", width: "" },
          { name: "Tablet", width: "768px", widthMedia: "992px" },
          { name: "Mobile", width: "375px", widthMedia: "480px" },
        ],
      },
      canvas: {
        styles: [
          "https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=Roboto:wght@300;400;500;700&display=swap",
        ],
      },
      // Optional: configure panels / commands here or later
    });

    // Add default blocks to block manager
    blocks.current.forEach((b) => editor.BlockManager.add(b.id, { ...b }));

    // Add default template if new
    if (!templateId || templateId === "new") {
      editor.setComponents(`
      <table width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color:#f3f4f6;">
        <tr><td align="center" style="padding:20px;">
          <table width="600" cellpadding="0" cellspacing="0" border="0" style="background:#ffffff;border-radius:8px;overflow:hidden;">
            <tr><td><!-- content --></td></tr>
          </table>
        </td></tr>
      </table>
      `);
    } else {
      // load template later in effect below (so editor exists)
    }

    // Panels: add toolbar commands
    editor.Panels.addButton("options", [
      {
        id: "visibility",
        active: false,
        className: "fa fa-eye",
        command: "preview-command",
        attributes: { title: "Preview" },
      },
    ]);

    // Custom commands
    editor.Commands.add("preview-command", {
      run(editorCmd) {
        const html = editorCmd.getHtml();
        const css = editorCmd.getCss();
        const preview = window.open("", "_blank");
        if (preview) {
          preview.document.write(
            `<!doctype html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><style>${css}</style></head><body>${html}</body></html>`
          );
          preview.document.close();
        }
      },
    });

    editorRef.current = editor;

    // Cleanup
    return () => {
      editor.destroy();
      editorRef.current = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Load template when templateId provided
  useEffect(() => {
    if (!editorRef.current) return;
    if (!templateId || templateId === "new") return;

    const loadTemplate = async (id: string) => {
      try {
        const template = await db.collection("email_templates").getOne(id);
        if (template) {
          setTemplateName(template.name || "Untitled Email");
          editorRef.current!.setComponents(template.html || "");
          if (template.css) editorRef.current!.setStyle(template.css);
        }
      } catch (error) {
        console.error("Error loading template:", error);
      }
    };
    loadTemplate(templateId);
  }, [templateId]);

  // Handlers
  const handleSave = async () => {
    if (!editorRef.current) return;
    setIsSaving(true);
    try {
      const html = editorRef.current.getHtml();
      const css = editorRef.current.getCss();
      const data = {
        name: templateName,
        html,
        css,
        updated: new Date().toISOString(),
      };

      if (templateId && templateId !== "new") {
        await db.collection("email_templates").update(templateId, data);
      } else {
        const newTemplate = await db.collection("email_templates").create({
          ...data,
          created: new Date().toISOString(),
        });
        navigate(`/dashboard/email-designer/${newTemplate.id}`, {
          replace: true,
        });
      }
    } catch (err) {
      console.error("Save error", err);
    } finally {
      setIsSaving(false);
    }
  };

  const handleExport = () => {
    if (!editorRef.current) return;
    const html = editorRef.current.getHtml();
    const css = editorRef.current.getCss();
    const fullHtml = `<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>${templateName}</title><style>${css}</style></head><body>${html}</body></html>`;
    const blob = new Blob([fullHtml], { type: "text/html" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${templateName.replace(/\s+/g, "-").toLowerCase()}.html`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handlePreview = () => {
    if (!editorRef.current) return;
    const html = editorRef.current.getHtml();
    const css = editorRef.current.getCss();
    const preview = window.open("", "_blank");
    if (preview) {
      preview.document.write(
        `<!doctype html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>${templateName}</title><style>${css}</style></head><body>${html}</body></html>`
      );
      preview.document.close();
    }
  };

  const handleDeviceChange = (device: "Desktop" | "Tablet" | "Mobile") => {
    if (!editorRef.current) return;
    setActiveDevice(device);
    editorRef.current.setDevice(device);
  };

  const handleUndo = () => {
    if (editorRef.current) editorRef.current.UndoManager.undo();
  };
  const handleRedo = () => {
    if (editorRef.current) editorRef.current.UndoManager.redo();
  };

  // Add block via click (allows our React sidebar to drag/drop optional)
  const handleAddBlock = (blockId: string) => {
    if (!editorRef.current) return;
    const block = blocks.current.find((b) => b.id === blockId);
    if (!block) return;
    // Append block to canvas
    editorRef.current.addComponents(block.content);
    // Optionally select last added component
    const comps = editorRef.current.getComponents();
    // simple selection: select first child
    try {
      const wrapper = editorRef.current.getWrapper();
      const last = wrapper.find(`[data-gjs-type]`).slice(-1)[0];
      if (last) editorRef.current.select(last);
    } catch {}
  };

  // Render left sidebar groups and blocks (collapsible)
  const groupNames = ["Sections", "Content", "Layout"];

  return (
    <div className="h-screen flex flex-col bg-gradient-to-br from-teal-50 to-cyan-50 text-gray-800">
      {/* Top toolbar (teal gradient like Stripo) */}
      <div className="px-6 py-3 bg-gradient-to-r from-teal-400 via-cyan-500 to-sky-500 flex items-center justify-between shadow-md">
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate("/dashboard/email-templates")}
            className="text-white hover:bg-white/10 gap-1"
          >
            <ChevronLeft className="w-4 h-4" />
            Back
          </Button>

          <Input
            value={templateName}
            onChange={(e) => setTemplateName(e.target.value)}
            className="w-72 h-9 rounded-md bg-white/20 text-white placeholder-white/70 border-none focus-visible:ring-0"
            placeholder="Template name"
          />
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={handleUndo}
            className="text-white hover:bg-white/10"
          >
            <Undo className="w-4 h-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleRedo}
            className="text-white hover:bg-white/10"
          >
            <Redo className="w-4 h-4" />
          </Button>

          <div className="h-6 w-px bg-white/30 mx-2" />

          <Button
            variant="ghost"
            size="sm"
            onClick={() => handleDeviceChange("Desktop")}
            className={`${
              activeDevice === "Desktop" ? "bg-white/20" : "hover:bg-white/10"
            } text-white`}
          >
            <Monitor className="w-4 h-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => handleDeviceChange("Tablet")}
            className={`${
              activeDevice === "Tablet" ? "bg-white/20" : "hover:bg-white/10"
            } text-white`}
          >
            <Tablet className="w-4 h-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => handleDeviceChange("Mobile")}
            className={`${
              activeDevice === "Mobile" ? "bg-white/20" : "hover:bg-white/10"
            } text-white`}
          >
            <Smartphone className="w-4 h-4" />
          </Button>

          <div className="h-6 w-px bg-white/30 mx-2" />

          <Button
            variant="ghost"
            size="sm"
            onClick={handlePreview}
            className="text-white hover:bg-white/10 gap-1"
          >
            <Eye className="w-4 h-4" />
            Preview
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleExport}
            className="text-white hover:bg-white/10 gap-1"
          >
            <Download className="w-4 h-4" />
            Export
          </Button>
          <Button
            size="sm"
            onClick={handleSave}
            disabled={isSaving}
            className="bg-white text-teal-600 hover:bg-white/90 font-semibold shadow-sm"
          >
            <Save className="w-4 h-4 mr-1" />
            {isSaving ? "Saving..." : "Save"}
          </Button>
        </div>
      </div>

      {/* Main area */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left Sidebar: Blocks (collapsible groups) */}
        <aside className="w-72 bg-white/90 backdrop-blur-md border-r border-gray-200 p-4 overflow-y-auto">
          <div>
            <h3 className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
              <Square className="w-4 h-4 text-teal-500" /> Blocks
            </h3>

            {groupNames.map((g) => (
              <div key={g} className="mb-3">
                <button
                  onClick={() =>
                    setBlockGroupsOpen((prev) => ({
                      ...prev,
                      [g]: !prev[g as keyof typeof prev],
                    }))
                  }
                  className="w-full flex items-center justify-between px-2 py-2 rounded-md hover:bg-gray-50"
                >
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium text-gray-700">
                      {g}
                    </span>
                    <span className="text-xs text-gray-400">
                      ({blocks.current.filter((b) => b.category === g).length})
                    </span>
                  </div>
                  <div className="text-gray-500">
                    {blockGroupsOpen[g as keyof typeof blockGroupsOpen]
                      ? "−"
                      : "+"}
                  </div>
                </button>

                {blockGroupsOpen[g as keyof typeof blockGroupsOpen] && (
                  <div className="mt-2 grid gap-2">
                    {blocks.current
                      .filter((b) => b.category === g)
                      .map((b) => (
                        <div
                          key={b.id}
                          className="flex items-center justify-between gap-2 p-2 rounded-md hover:bg-gray-50 cursor-pointer"
                          title={b.label}
                          onDoubleClick={() => handleAddBlock(b.id)}
                        >
                          <div className="flex items-center gap-2">
                            <div dangerouslySetInnerHTML={{ __html: b.icon }} />
                            <div>
                              <div className="text-sm font-medium text-gray-800">
                                {b.label}
                              </div>
                              <div className="text-xs text-gray-400">
                                {b.id}
                              </div>
                            </div>
                          </div>
                          <div>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleAddBlock(b.id)}
                            >
                              Add
                            </Button>
                          </div>
                        </div>
                      ))}
                    {blocks.current.filter((b) => b.category === g).length ===
                      0 && (
                      <div className="text-sm text-gray-400 px-2">
                        No blocks
                      </div>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        </aside>

        {/* Canvas */}
        <main className="flex-1 bg-gray-100 p-4 overflow-auto">
          <div id="gjs" className="h-full bg-white rounded-md shadow-inner" />
        </main>

        {/* Right Sidebar: Layers / Traits / Styles */}
        <aside className="w-80 bg-white/90 backdrop-blur-md border-l border-gray-200 p-4 overflow-y-auto">
          <div className="mb-6">
            <h3 className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
              <List className="w-4 h-4 text-teal-500" /> Layers
            </h3>
            <div
              id="layers-container"
              className="border border-gray-200 rounded-md min-h-[120px]"
            />
          </div>

          <div className="mb-6">
            <h3 className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
              <Settings className="w-4 h-4 text-teal-500" /> Settings
            </h3>
            <div
              id="trait-container"
              className="border border-gray-200 rounded-md min-h-[120px] p-2"
            />
          </div>

          <div>
            <h3 className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
              <Code className="w-4 h-4 text-teal-500" /> Styles
            </h3>
            <div
              id="styles-container"
              className="border border-gray-200 rounded-md min-h-[200px] p-2"
            />
          </div>
        </aside>
      </div>
    </div>
  );
};

export default Designer;
