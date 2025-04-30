"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  TextInput,
  Button,
  Text,
  Paper,
  Stack,
  Group,
  Container,
  Center,
  Title,
} from "@mantine/core";
import { notifications } from "@mantine/notifications";
import TiptapEditor from "../../components/TiptapEditor";
import { supabase } from "../../../lib/supabase/supabase";
import { trpc } from "@/app/_trpc/client";

export default function NewBlogPage() {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [userId, setUserId] = useState<string | null>(null);
  const router = useRouter();

  // ✅ tRPCのMutation Hookで定義
  const createPostMutation = trpc.post.create.useMutation({
    onSuccess: (post) => {
      router.push(`/blog/${post.id}`);
      notifications.show({
        title: "成功",
        message: "ブログを投稿しました",
        color: "green",
      });
    },
    onError: (error) => {
      notifications.show({
        title: "エラー",
        message: error.message || "投稿に失敗しました",
        color: "red",
      });
    },
  });

  useEffect(() => {
    const fetchUser = async () => {
      const { data, error } = await supabase.auth.getUser();
      if (error || !data.user) {
        notifications.show({
          title: "エラー",
          message: "ユーザー情報の取得に失敗しました",
          color: "red",
        });
        router.replace("/login");
      } else {
        setUserId(data.user.id);
      }
    };

    fetchUser();
  }, [router]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!userId) {
      notifications.show({
        title: "エラー",
        message: "ログインが必要です",
        color: "red",
      });
      router.push("/login");
      return;
    }

    createPostMutation.mutate({ title, content });
  };

  if (!userId) {
    return (
      <Container size="md" mt="xl">
        <Center h="100vh">
          <Text size="lg">ログイン中...</Text>
        </Center>
      </Container>
    );
  }

  return (
    <Container size="md" py="xl">
      <Title order={2} mb="lg">
        新規ブログ作成
      </Title>
      <Paper shadow="sm" p="xl" radius="md">
        <form onSubmit={handleSubmit}>
          <Stack gap="lg">
            <Text size="xl" fw={700} ta="center">
              新規ブログ投稿
            </Text>

            <TextInput
              label="タイトル"
              placeholder="ブログのタイトルを入力"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
              size="md"
              radius="md"
            />

            <Stack gap="xs">
              <Text size="sm" fw={500}>
                本文
              </Text>
              <Paper withBorder p="md" radius="md">
                <TiptapEditor content={content} onChange={setContent} />
              </Paper>
            </Stack>

            <Group justify="flex-end" mt="md">
              <Button
                type="submit"
                loading={createPostMutation.isPending}
                size="md"
                radius="md"
              >
                投稿する
              </Button>
            </Group>
          </Stack>
        </form>
      </Paper>
    </Container>
  );
}
