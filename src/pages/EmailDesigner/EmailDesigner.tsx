/* eslint-disable @typescript-eslint/ban-ts-comment */
import { useEffect, useRef, useState } from "react";
import grapesjs from "grapesjs";
import type { Editor } from "grapesjs";
import "grapesjs/dist/css/grapes.min.css";
import mjmlPlugin from "grapesjs-mjml";
import pluginExport from "grapesjs-plugin-export";
import { db } from "@/utils/pockatbase";
import { useNavigate, useParams } from "react-router-dom";
import {
  ArrowLeft,
  Code,
  Eye,
  EyeOff,
  Layers,
  LayoutTemplate,
  Monitor,
  Paintbrush,
  Redo2,
  Save,
  Search,
  SlidersHorizontal,
  Smartphone,
  Sparkles,
  Tablet,
  Undo2,
} from "lucide-react";
import { toast } from "sonner";

const DEFAULT_MJML_TEMPLATE = `
  <mjml>
    <mj-body>
      <mj-section>
        <mj-column>
          <mj-text>Start building your email here</mj-text>
        </mj-column>
      </mj-section>
    </mj-body>
  </mjml>
`;

const ensureDropReadyCanvas = (editor: Editor) => {
  const wrapper = editor.getWrapper();

  if (!wrapper) {
    editor.setComponents(DEFAULT_MJML_TEMPLATE);
    return;
  }

  const hasMjmlBody = wrapper.find("mj-body").length > 0;
  const hasMjmlColumn = wrapper.find("mj-column").length > 0;

  if (!hasMjmlBody || !hasMjmlColumn) {
    editor.setComponents(DEFAULT_MJML_TEMPLATE);
    return;
  }

  wrapper.find("mj-column").forEach((column) => {
    column.set("droppable", true);
  });
};

export const Designer = () => {
  const editorRef = useRef<Editor | null>(null);
  const templateNameRef = useRef("Untitled Email");
  const { templateId } = useParams();
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState("blocks");
  const [device, setDeviceState] = useState("Desktop");
  const [isPreviewMode, setIsPreviewMode] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [lastSavedAt, setLastSavedAt] = useState("");
  const [blockSearch, setBlockSearch] = useState("");
  const [templateName, setTemplateName] = useState("Untitled Email");

  useEffect(() => {
    templateNameRef.current = templateName || "Untitled Email";
  }, [templateName]);

  useEffect(() => {
    if (editorRef.current) return;

    const editor = grapesjs.init({
      container: "#gjs",
      fromElement: false,
      height: "100%",
      width: "100%",
      plugins: [mjmlPlugin, pluginExport],
      pluginsOpts: {
        "grapesjs-mjml": {
          resetCss: true,
        },
      },
      storageManager: {
        type: "pocketbase",
        options: {
          pocketbase: {},
        },
        autosave: true,
        autoload: false,
        stepsBeforeSave: 1,
      },
      blockManager: {
        appendTo: "#blocks",
      },
      styleManager: {
        appendTo: "#styles",
      },
      layerManager: {
        appendTo: "#layers",
      },
      traitManager: {
        appendTo: "#traits",
      },
      panels: {
        defaults: [],
      },
    });

    editor.on("storage:start:store", () => {
      setIsSaving(true);
    });

    editor.on("storage:end:store", () => {
      setIsSaving(false);
      setLastSavedAt(
        new Date().toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        }),
      );
    });

    editor.on("storage:error:store", () => {
      setIsSaving(false);
    });

    editor.StorageManager.add("pocketbase", {
      async load() {
        try {
          if (!templateId) return {};
          const record = await db
            .collection("email_designs")
            .getOne(templateId);
          if (record?.name) {
            setTemplateName(record.name);
          }
          return record?.data || {};
        } catch (err) {
          console.error("PB load error", err);
          return {};
        }
      },
      async store(data) {
        try {
          if (!templateId) return;

          let record: any;
          try {
            record = await db.collection("email_designs").getOne(templateId);
          } catch {
            record = null;
          }

          if (record) {
            await db.collection("email_designs").update(record.id, {
              data,
              name: templateNameRef.current,
            });
          } else {
            await db.collection("email_designs").create({
              user: db.authStore.record?.id,
              name: templateNameRef.current,
              data,
            });
          }
        } catch (err) {
          console.error("PB store error", err);
          const message =
            (
              err as {
                response?: { data?: { error?: string }; error?: string };
              }
            )?.response?.data?.error ||
            (
              err as {
                response?: { data?: { error?: string }; error?: string };
              }
            )?.response?.error ||
            "Unable to save design. Upgrade to Pro if your free limit is reached.";
          toast.error(message);
          throw err;
        }
      },
    });

    editor.load(() => {
      ensureDropReadyCanvas(editor);
    });

    editor.on("project:load", () => {
      ensureDropReadyCanvas(editor);
    });

    editorRef.current = editor;

    return () => {
      editor.destroy();
      editorRef.current = null;
    };
  }, [templateId]);

  useEffect(() => {
    if (!editorRef.current || activeTab !== "blocks") {
      return;
    }

    const blocks = Array.from(document.querySelectorAll("#blocks .gjs-block"));
    const search = blockSearch.trim().toLowerCase();

    blocks.forEach((block) => {
      const text = (block.textContent || "").toLowerCase();
      (block as HTMLElement).style.display =
        !search || text.includes(search) ? "" : "none";
    });
  }, [blockSearch, activeTab]);

  const setDevice = (nextDevice: string) => {
    if (!editorRef.current) return;
    editorRef.current.setDevice(nextDevice);
    setDeviceState(nextDevice);
  };

  const undo = () => editorRef.current?.UndoManager.undo();
  const redo = () => editorRef.current?.UndoManager.redo();

  const save = async () => {
    if (!editorRef.current) return;
    setIsSaving(true);
    try {
      await editorRef.current.store();
    } finally {
      setIsSaving(false);
    }
  };

  const exportHtml = () => editorRef.current?.runCommand("gjs-export-zip");

  const tabs = [
    { id: "blocks", label: "Blocks", icon: LayoutTemplate },
    { id: "styles", label: "Styles", icon: Paintbrush },
    { id: "traits", label: "Traits", icon: SlidersHorizontal },
    { id: "layers", label: "Layers", icon: Layers },
  ];

  return (
    <div className="w-full h-screen flex flex-col bg-[#111111] text-gray-200 font-sans overflow-hidden selection:bg-indigo-500/30 font-inter">
      <header className="h-[60px] bg-[#1a1a1a] border-b border-white/5 flex items-center justify-between px-6 shrink-0 z-10">
        {/* Left Section: Back & Title */}
        <div className="flex items-center gap-6 min-w-0 flex-1">
          <button
            onClick={() => navigate("/designs")}
            className="group flex flex-col justify-center items-start outline-none"
          >
            <div className="flex items-center gap-2 text-[13px] text-gray-400 group-hover:text-white transition-colors tracking-wide font-medium">
              <span className="p-1 rounded bg-white/5 group-hover:bg-white/10 transition-colors">
                <ArrowLeft className="w-3.5 h-3.5" />
              </span>
              <span>Back to Designs</span>
            </div>
          </button>

          <div className="h-6 w-px bg-white/10" />

          <div className="flex items-center gap-3 min-w-0 group">
            <div className="flex justify-center flex-col outline-none w-full max-w-sm">
              <div className="flex items-center gap-2">
                <LayoutTemplate className="w-4 h-4 text-indigo-400 opacity-80" />
                <input
                  value={templateName}
                  onChange={(event) => setTemplateName(event.target.value)}
                  className="text-[15px] font-medium text-gray-100 bg-transparent outline-none border-b border-transparent focus:border-indigo-500 hover:border-white/20 px-1 py-0.5 min-w-0 transition-colors placeholder:text-gray-600 w-full"
                  placeholder="Untitled Email"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Center Section: Viewport Controls */}
        <div className="flex items-center justify-center flex-1">
          <div className="flex items-center gap-0.5 bg-black/40 p-1 rounded-lg border border-white/5 shadow-inner">
            {[
              { id: "Desktop", icon: Monitor, label: "Desktop View" },
              { id: "Tablet", icon: Tablet, label: "Tablet View" },
              { id: "Mobile portrait", icon: Smartphone, label: "Mobile View" },
            ].map(({ id, icon: Icon, label }) => (
              <button
                key={id}
                onClick={() => setDevice(id)}
                title={label}
                className={`p-1.5 rounded-md transition-all duration-200 ${
                  device === id
                    ? "bg-indigo-600 text-white shadow-sm"
                    : "text-gray-400 hover:text-gray-100 hover:bg-white/10"
                }`}
              >
                <Icon className="w-[18px] h-[18px]" strokeWidth={2} />
              </button>
            ))}

            <div className="mx-2 h-4 w-px bg-white/10" />

            <button
              onClick={undo}
              className="p-1.5 text-gray-400 hover:text-white hover:bg-white/10 rounded-md transition-all"
              title="Undo (Cmd+Z)"
            >
              <Undo2 className="w-4 h-4" />
            </button>
            <button
              onClick={redo}
              className="p-1.5 text-gray-400 hover:text-white hover:bg-white/10 rounded-md transition-all"
              title="Redo (Cmd+Shift+Z)"
            >
              <Redo2 className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Right Section: Actions */}
        <div className="flex items-center justify-end gap-3 flex-1">
          <div className="flex items-center gap-0.5 bg-black/40 p-1 rounded-lg border border-white/5 shadow-inner">
            <button
              onClick={() => setIsPreviewMode((prev) => !prev)}
              className={`flex gap-1.5 items-center px-3 py-1.5 text-[13px] font-medium tracking-wide rounded-md transition-all ${
                isPreviewMode
                  ? "bg-emerald-500/10 text-emerald-400"
                  : "text-gray-400 hover:text-white hover:bg-white/10"
              }`}
            >
              {isPreviewMode ? (
                <EyeOff className="w-4 h-4" />
              ) : (
                <Eye className="w-4 h-4" />
              )}
              {isPreviewMode ? "Design" : "Preview"}
            </button>
            <button
              onClick={exportHtml}
              className="flex gap-1.5 items-center px-3 py-1.5 text-[13px] font-medium tracking-wide text-gray-400 hover:text-white hover:bg-white/10 rounded-md transition-all"
            >
              <Code className="w-4 h-4" />
              Export
            </button>
          </div>

          <button
            onClick={save}
            disabled={isSaving}
            className="group relative flex gap-2 items-center px-4 py-2 text-[13px] font-medium tracking-wide text-white bg-indigo-600 hover:bg-indigo-500 active:bg-indigo-700 disabled:opacity-60 disabled:cursor-not-allowed rounded-lg shadow-[0_0_15px_rgba(79,70,229,0.2)] transition-all overflow-hidden"
          >
            <div className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-[100%] group-hover:translate-x-[100%] transition-transform duration-700" />
            <Save className={`w-4 h-4 ${isSaving ? "animate-pulse" : ""}`} />
            <span>{isSaving ? "Saving..." : "Save Changes"}</span>
          </button>
        </div>
      </header>

      <div className="flex-1 flex overflow-hidden relative">
        {/* Sidebar */}
        {!isPreviewMode && (
          <div className="w-[320px] bg-[#1a1a1a] border-r border-white/5 flex flex-col shrink-0 z-10 shadow-[4px_0_24px_rgba(0,0,0,0.5)]">
            <div className="flex p-2 gap-1 bg-black/20 border-b border-white/5">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                const isActive = activeTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex-1 py-2 flex flex-col items-center gap-1.5 text-[11px] font-medium tracking-wider uppercase rounded-md transition-all ${
                      isActive
                        ? "bg-white/10 text-indigo-400 shadow-sm"
                        : "text-gray-500 hover:text-gray-300 hover:bg-white/5"
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    {tab.label}
                  </button>
                );
              })}
            </div>

            {activeTab === "blocks" && (
              <div className="p-3 border-b border-white/5 bg-black/10">
                <div className="relative group">
                  <Search className="w-4 h-4 text-gray-500 absolute left-3 top-1/2 -translate-y-1/2 group-focus-within:text-indigo-400 transition-colors" />
                  <input
                    value={blockSearch}
                    onChange={(event) => setBlockSearch(event.target.value)}
                    placeholder="Search components..."
                    className="w-full pl-9 pr-3 py-2 rounded-lg border border-white/10 bg-black/40 text-sm text-gray-200 outline-none focus:border-indigo-500 focus:bg-black/60 transition-all placeholder:text-gray-600 shadow-inner"
                  />
                </div>
              </div>
            )}

            <div className="flex-1 overflow-y-auto style-scroll bg-[#151515]">
              <div
                id="blocks"
                className={
                  activeTab === "blocks" ? "block p-2 text-white" : "hidden"
                }
              />
              <div
                id="styles"
                className={
                  activeTab === "styles" ? "block text-white" : "hidden"
                }
              />
              <div
                id="traits"
                className={
                  activeTab === "traits" ? "block text-white" : "hidden"
                }
              />
              <div
                id="layers"
                className={
                  activeTab === "layers" ? "block text-white" : "hidden"
                }
              />
            </div>

            {/* Sidebar Footer */}
            <div className="p-3 bg-black/20 border-t border-white/5 flex items-center justify-between text-[11px] text-gray-500 font-medium tracking-wider uppercase">
              <span className="flex items-center gap-1">
                <Sparkles className="w-3 h-3 text-indigo-400" />
                Build Mode
              </span>
              <span>{lastSavedAt ? `Saved ${lastSavedAt}` : "Not saved"}</span>
            </div>
          </div>
        )}

        {/* Canvas Area */}
        <div className="flex-1 bg-[#0a0a0a] relative overflow-hidden flex flex-col">
          {/* subtle grid background */}
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              backgroundImage:
                "radial-gradient(circle at 1px 1px, rgba(255,255,255,0.05) 1px, transparent 0)",
              backgroundSize: "24px 24px",
            }}
          />

          {/* Header Info Banner inside canvas */}
          {!isPreviewMode && (
            <div className="absolute top-4 left-1/2 -translate-x-1/2 px-4 py-1.5 bg-black/60 backdrop-blur-md border border-white/10 rounded-full text-[11px] font-medium tracking-wide text-gray-400 flex items-center gap-2 z-10 shadow-xl">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              Editing in {device}
            </div>
          )}

          <div className="flex-1 p-0 relative h-full flex justify-center w-full items-start overflow-hidden">
            <div id="gjs" className="h-full w-full" style={{ zIndex: 1 }} />
          </div>
        </div>
      </div>
    </div>
  );
};
