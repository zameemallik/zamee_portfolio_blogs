"use client";

import { useState, useEffect } from "react";
import { useForm } from "@mantine/form";
import { TextInput, Button, Box } from "@mantine/core";
import axios from "axios";
import { supabase } from "../../../lib/supabase/supabase";
import { useRouter } from "next/navigation"; // useRouterをインポート

interface CommentFormProps {
  postId: string;
}

export default function CommentForm({ postId }: CommentFormProps) {
  const [userId, setUserId] = useState<string | null>(null);
  const router = useRouter(); // useRouterフックを初期化

  useEffect(() => {
    const fetchUser = async () => {
      const { data, error } = await supabase.auth.getUser();

      if (error) {
        setUserId(null);
      } else if (data.user) {
        setUserId(data.user.id);
      }
    };

    fetchUser();
  }, []);

  const form = useForm({
    initialValues: {
      content: "",
    },
    validate: {
      content: (value) =>
        value.length < 1 ? "コメントを入力してください" : null,
    },
  });

  const handleSubmit = async (values: { content: string }) => {
    try {
      const response = await axios.post("/api/comments/addComment", {
        content: values.content,
        postId,
        userId,
      });
      form.reset();
      router.refresh(); // コメント投稿後にページを再レンダリングz
    } catch (error) {
      console.error("コメントの投稿中にエラーが発生しました:", error);
    }
  };

  return (
    <Box>
      <form onSubmit={form.onSubmit(handleSubmit)}>
        <TextInput
          label="新しいコメント"
          placeholder="コメントを入力してください"
          {...form.getInputProps("content")}
        />
        <Button type="submit" mt="sm">
          投稿
        </Button>
      </form>
    </Box>
  );
}
