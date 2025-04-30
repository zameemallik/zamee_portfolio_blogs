"use client";

import { useForm } from "@mantine/form";
import { TextInput, Button, Box, Text } from "@mantine/core";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "../../providers/AuthProvider";
import { trpc } from "@/app/_trpc/client";
import { useEffect } from "react";

interface CommentFormProps {
  postId: string;
}

export default function CommentForm({ postId }: CommentFormProps) {
  const router = useRouter();
  const { user, isLoading } = useAuth();

  const form = useForm({
    initialValues: {
      content: "",
    },
    validate: {
      content: (value) =>
        value.length < 1 ? "コメントを入力してください" : null,
    },
  });

  const utils = trpc.useUtils();

  // tRPCのuseMutation形式で定義
  const addComment = trpc.post.addComment.useMutation({
    onSuccess: async () => {
      form.reset();
      await utils.post.getPostById.invalidate({ id: postId });
    },
    onError: (error) => {
      console.error("コメント投稿に失敗しました:", error);
    },
  });

  const handleSubmit = (values: { content: string }) => {
    if (!user) {
      router.push("/login");
      return;
    }

    addComment.mutate({
      content: values.content,
      postId,
    });
  };

  useEffect(() => {
    console.log("user:", user);
    console.log("isLoading:", isLoading);
  }, [user, isLoading]);

  if (isLoading) {
    return null;
  }

  if (!user) {
    return (
      <Box>
        <Text size="sm" c="dimmed">
          コメントを投稿するには
          <Link
            href="/login"
            style={{
              color: "var(--mantine-color-blue-6)",
              textDecoration: "none",
              marginLeft: 4,
            }}
          >
            ログイン
          </Link>
          してください
        </Text>
      </Box>
    );
  }

  return (
    <Box>
      <form onSubmit={form.onSubmit(handleSubmit)}>
        <TextInput
          label="新しいコメント"
          placeholder="コメントを入力してください"
          {...form.getInputProps("content")}
        />
        <Button type="submit" mt="sm" loading={addComment.isPending}>
          投稿
        </Button>
      </form>
    </Box>
  );
}
