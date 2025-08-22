import React, { useRef } from "react";

import EmailEditor, {
  type EditorRef,
  type EmailEditorProps,
} from "react-email-editor";

export const Designer = () => {
  const emailEditorRef = useRef<EditorRef>(null);

  const exportHtml = () => {
    const unlayer = emailEditorRef.current?.editor;

    unlayer?.exportHtml((data) => {
      const { design, html } = data;
      console.log("exportHtml", html);
    });
  };

  const onReady: EmailEditorProps["onReady"] = (unlayer) => {
    // editor is ready
    // you can load your template here;
    // the design json can be obtained by calling
    // unlayer.loadDesign(callback) or unlayer.exportHtml(callback)
    // const templateJson = { DESIGN JSON GOES HERE };
    // unlayer.loadDesign(templateJson);
  };

  return (
    <div className="h-full">
      <div>
        <button onClick={exportHtml}>Export HTML</button>
      </div>

      <EmailEditor
        style={{
          height: "100vh",
        }}
        ref={emailEditorRef}
        onReady={onReady}
      />
    </div>
  );
};
