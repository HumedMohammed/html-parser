/* eslint-disable @typescript-eslint/ban-ts-comment */
import { useEffect, useRef } from "react";
import grapesjs, { Editor } from "grapesjs";
import "grapesjs/dist/css/grapes.min.css";
import mjmlPlugin from "grapesjs-mjml";
import { db } from "@/utils/pockatbase";
import { useParams } from "react-router-dom";

export const Designer = () => {
  const editorRef = useRef<Editor | null>(null);
  const { templateId } = useParams();

  useEffect(() => {
    if (!editorRef.current) {
      const editor = grapesjs.init({
        container: "#gjs",
        fromElement: false,
        height: "100vh",
        width: "100%",
        plugins: [mjmlPlugin],
        pluginsOpts: {
          // @ts-ignore
          [mjmlPlugin]: {},
        },
        storageManager: {
          type: "pocketbase",
          autosave: true, // save on changes
          autoload: true, // load project on init
          stepsBeforeSave: 1, // save after each change
        },
      });

      // 🔥 Register custom PocketBase storage
      editor.StorageManager.add("pocketbase", {
        async load() {
          try {
            // Example: load the first template of the logged-in user
            const record = await db
              .collection("email_designs")
              .getOne(templateId || "");
            try {
              console.log(record.data);
              return record?.data || {}; // pass data back to GrapesJS
            } catch (error) {
              console.log(error);
            }
          } catch (err) {
            console.error("PB load error", err);
          }
        },

        async store(data) {
          try {
            let record;
            if (templateId) {
              try {
                record = await db
                  .collection("email_designs")
                  .getOne(templateId);
              } catch {
                record = null;
              }
            }
            if (record) {
              await db.collection("email_designs").update(record.id, { data });
            } else {
              await db.collection("email_designs").create({
                user: db.authStore.record?.id,
                name: "My First Template",
                data,
              });
            }
          } catch (err) {
            console.error("PB store error", err);
          }
        },
      });

      editorRef.current = editor;
    }
  }, []);

  return (
    <div className="w-full h-screen flex flex-col">
      <div id="gjs" className="flex-1"></div>
    </div>
  );
};
