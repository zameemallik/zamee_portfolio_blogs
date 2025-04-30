"use client";

import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Link from "@tiptap/extension-link";
import Image from "@tiptap/extension-image";
import { Group, ActionIcon, Tooltip, Divider, Stack } from "@mantine/core";
import {
  IconBold,
  IconItalic,
  IconStrikethrough,
  IconList,
  IconListNumbers,
  IconQuote,
  IconSeparator,
  IconH1,
  IconH2,
  IconH3,
  IconClearFormatting,
  IconLink,
  IconUnlink,
  IconCode,
} from "@tabler/icons-react";

interface TiptapEditorProps {
  content: string;
  onChange: (content: string) => void;
}

export default function TiptapEditor({ content, onChange }: TiptapEditorProps) {
  const editor = useEditor({
    extensions: [
      StarterKit,
      Link.configure({
        openOnClick: false,
        HTMLAttributes: {
          class: "text-blue-500 hover:text-blue-600 underline",
        },
      }),
      Image,
    ],
    content,
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
  });

  if (!editor) {
    return null;
  }

  const addLink = () => {
    const url = window.prompt("URLを入力してください:");
    if (url) {
      editor.chain().focus().setLink({ href: url }).run();
    }
  };

  return (
    <Stack gap="xs">
      <Group gap="xs">
        <Tooltip label="太字 (Ctrl + B)">
          <ActionIcon
            variant={editor.isActive("bold") ? "filled" : "subtle"}
            onClick={() => editor.chain().focus().toggleBold().run()}
          >
            <IconBold size={16} />
          </ActionIcon>
        </Tooltip>

        <Tooltip label="斜体 (Ctrl + I)">
          <ActionIcon
            variant={editor.isActive("italic") ? "filled" : "subtle"}
            onClick={() => editor.chain().focus().toggleItalic().run()}
          >
            <IconItalic size={16} />
          </ActionIcon>
        </Tooltip>

        <Tooltip label="取り消し線">
          <ActionIcon
            variant={editor.isActive("strike") ? "filled" : "subtle"}
            onClick={() => editor.chain().focus().toggleStrike().run()}
          >
            <IconStrikethrough size={16} />
          </ActionIcon>
        </Tooltip>

        <Tooltip label="コード">
          <ActionIcon
            variant={editor.isActive("code") ? "filled" : "subtle"}
            onClick={() => editor.chain().focus().toggleCode().run()}
          >
            <IconCode size={16} />
          </ActionIcon>
        </Tooltip>

        <Divider orientation="vertical" />

        <Tooltip label="見出し1">
          <ActionIcon
            variant={
              editor.isActive("heading", { level: 1 }) ? "filled" : "subtle"
            }
            onClick={() =>
              editor.chain().focus().toggleHeading({ level: 1 }).run()
            }
          >
            <IconH1 size={16} />
          </ActionIcon>
        </Tooltip>

        <Tooltip label="見出し2">
          <ActionIcon
            variant={
              editor.isActive("heading", { level: 2 }) ? "filled" : "subtle"
            }
            onClick={() =>
              editor.chain().focus().toggleHeading({ level: 2 }).run()
            }
          >
            <IconH2 size={16} />
          </ActionIcon>
        </Tooltip>

        <Tooltip label="見出し3">
          <ActionIcon
            variant={
              editor.isActive("heading", { level: 3 }) ? "filled" : "subtle"
            }
            onClick={() =>
              editor.chain().focus().toggleHeading({ level: 3 }).run()
            }
          >
            <IconH3 size={16} />
          </ActionIcon>
        </Tooltip>

        <Divider orientation="vertical" />

        <Tooltip label="箇条書き">
          <ActionIcon
            variant={editor.isActive("bulletList") ? "filled" : "subtle"}
            onClick={() => editor.chain().focus().toggleBulletList().run()}
          >
            <IconList size={16} />
          </ActionIcon>
        </Tooltip>

        <Tooltip label="番号付きリスト">
          <ActionIcon
            variant={editor.isActive("orderedList") ? "filled" : "subtle"}
            onClick={() => editor.chain().focus().toggleOrderedList().run()}
          >
            <IconListNumbers size={16} />
          </ActionIcon>
        </Tooltip>

        <Tooltip label="引用">
          <ActionIcon
            variant={editor.isActive("blockquote") ? "filled" : "subtle"}
            onClick={() => editor.chain().focus().toggleBlockquote().run()}
          >
            <IconQuote size={16} />
          </ActionIcon>
        </Tooltip>

        <Tooltip label="水平線">
          <ActionIcon
            variant="subtle"
            onClick={() => editor.chain().focus().setHorizontalRule().run()}
          >
            <IconSeparator size={16} />
          </ActionIcon>
        </Tooltip>

        <Divider orientation="vertical" />

        <Tooltip label="リンク">
          <ActionIcon
            variant={editor.isActive("link") ? "filled" : "subtle"}
            onClick={addLink}
          >
            <IconLink size={16} />
          </ActionIcon>
        </Tooltip>

        <Tooltip label="リンク解除">
          <ActionIcon
            variant="subtle"
            onClick={() => editor.chain().focus().unsetLink().run()}
          >
            <IconUnlink size={16} />
          </ActionIcon>
        </Tooltip>

        <Divider orientation="vertical" />

        <Tooltip label="書式をクリア">
          <ActionIcon
            variant="subtle"
            onClick={() =>
              editor.chain().focus().clearNodes().unsetAllMarks().run()
            }
          >
            <IconClearFormatting size={16} />
          </ActionIcon>
        </Tooltip>
      </Group>

      <EditorContent
        editor={editor}
        className="prose max-w-none min-h-[200px] border rounded-md p-4 focus-within:border-blue-500 transition-colors"
      />
    </Stack>
  );
}
