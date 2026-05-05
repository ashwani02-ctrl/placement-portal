"use client";

import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";

type Props = {
  value: string;
  onChange: (content: string) => void;
};

export default function TiptapEditor({ value, onChange }: Props) {
  const editor = useEditor({
    extensions: [StarterKit], // ✅ only this
    content: value || "", // ✅ avoid undefined warning
    immediatelyRender: false,
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
  });

  if (!editor) return null;

  return (
    <div className="border rounded p-2 space-y-2">
      
      {/* Toolbar */}
      <div className="flex gap-2 border-b pb-2">
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleBold().run()}
        >
          Bold
        </button>

        <button
          type="button"
          onClick={() => editor.chain().focus().toggleItalic().run()}
        >
          Italic
        </button>

        <button
          type="button"
          onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
        >
          H1
        </button>

        <button
          type="button"
          onClick={() => editor.chain().focus().toggleBulletList().run()}
        >
          Bullet List
        </button>
      </div>

      {/* Editor */}
      <EditorContent editor={editor} />
    </div>
  );
}