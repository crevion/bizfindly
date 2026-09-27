"use client";

import { useEffect, useState } from "react";
import { EditorContent, useEditor, useEditorState } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { descriptionHtml, richTextClass } from "@/lib/richText";

export default function DescriptionEditor({
  value,
  disabled,
}: {
  value: string;
  disabled: boolean;
}) {
  const [html, setHtml] = useState(value);
  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: { levels: [2, 3] },
        link: false,
        code: false,
        codeBlock: false,
        horizontalRule: false,
      }),
    ],
    content: descriptionHtml(value),
    immediatelyRender: false,
    editable: !disabled,
    editorProps: {
      attributes: {
        class: `min-h-40 p-3 outline-none ${richTextClass}`,
        role: "textbox",
        "aria-label": "Description",
        "aria-multiline": "true",
      },
    },
    onUpdate: ({ editor }) => setHtml(editor.isEmpty ? "" : editor.getHTML()),
  });
  const active = useEditorState({
    editor,
    selector: ({ editor }) => ({
      bold: editor?.isActive("bold"),
      italic: editor?.isActive("italic"),
      heading: editor?.isActive("heading", { level: 2 }),
      bullet: editor?.isActive("bulletList"),
      ordered: editor?.isActive("orderedList"),
    }),
  });
  useEffect(() => {
    editor?.setEditable(!disabled);
  }, [editor, disabled]);
  return (
    <div>
      <p className="mb-1 text-sm font-medium">Description</p>
      <input type="hidden" name="description" value={html} />
      <div className="border-border bg-background overflow-hidden rounded-xl border">
        <div
          className="border-border flex flex-wrap gap-1 border-b p-2"
          role="toolbar"
          aria-label="Description formatting"
        >
          {[
            {
              label: "Bold",
              active: active?.bold,
              run: () => editor?.chain().focus().toggleBold().run(),
            },
            {
              label: "Italic",
              active: active?.italic,
              run: () => editor?.chain().focus().toggleItalic().run(),
            },
            {
              label: "Heading",
              active: active?.heading,
              run: () => editor?.chain().focus().toggleHeading({ level: 2 }).run(),
            },
            {
              label: "Bullets",
              active: active?.bullet,
              run: () => editor?.chain().focus().toggleBulletList().run(),
            },
            {
              label: "Numbered list",
              active: active?.ordered,
              run: () => editor?.chain().focus().toggleOrderedList().run(),
            },
            { label: "Undo", run: () => editor?.chain().focus().undo().run() },
            { label: "Redo", run: () => editor?.chain().focus().redo().run() },
          ].map((action) => (
            <button
              type="button"
              key={action.label}
              disabled={disabled || !editor}
              aria-pressed={action.active}
              onClick={action.run}
              className={`rounded px-2 py-1 text-xs font-semibold disabled:opacity-40 ${action.active ? "bg-foreground text-background" : "hover:bg-muted"}`}
            >
              {action.label}
            </button>
          ))}
        </div>
        <EditorContent editor={editor} />
      </div>
    </div>
  );
}
