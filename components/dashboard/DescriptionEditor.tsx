"use client";

import { useEffect, useState } from "react";
import { EditorContent, useEditor, useEditorState } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { useMutation } from "@tanstack/react-query";
import { Sparkles } from "lucide-react";
import toast from "react-hot-toast";
import { dashboardApi } from "@/lib/backend/owner/dashboard";
import { descriptionHtml, richTextClass } from "@/lib/richText";

export default function DescriptionEditor({
  value,
  slug,
  disabled,
}: {
  value: string;
  slug: string;
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
  const generate = useMutation({
    mutationFn: () => dashboardApi.aiDescription({ slug }),
    onSuccess: ({ description }) => {
      if (!editor) return;
      editor.chain().focus().setContent(descriptionHtml(description)).run();
      setHtml(editor.isEmpty ? "" : editor.getHTML());
      toast.success("Description generated — Undo brings back your old text.");
    },
    onError: (error: Error) => toast.error(error.message),
  });
  const generating = generate.isPending;
  useEffect(() => {
    editor?.setEditable(!disabled && !generating);
  }, [editor, disabled, generating]);
  return (
    <div>
      <div className="mb-1 flex flex-wrap items-center justify-between gap-2">
        <p className="text-sm font-medium">Description</p>
        <button
          type="button"
          disabled={disabled || generating || !editor}
          onClick={() => generate.mutate()}
          className="border-border hover:bg-muted flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-semibold disabled:opacity-50"
        >
          <Sparkles className={`h-3.5 w-3.5 ${generating ? "animate-pulse" : ""}`} />
          {generating ? "Generating…" : "Generate with AI"}
        </button>
      </div>
      <p className="text-muted-foreground mb-2 text-xs">
        Writes a description from your listing details. Nothing is saved until you save the
        listing.
      </p>
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
              disabled={disabled || generating || !editor}
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
