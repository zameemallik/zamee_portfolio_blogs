"use client";

import React from "react";
import { Button, Group, TextInput, PasswordInput } from "@mantine/core";
import { GithubIcon } from "@mantinex/dev-icons";
import { useForm } from "@mantine/form";
import { supabase } from "../../lib/supabase/supabase";
import { notifications } from "@mantine/notifications";
import styles from "./page.module.css";
import { useRouter } from "next/navigation";

export default function SignUpPage() {
  const router = useRouter();
  const form = useForm({
    initialValues: {
      email: "",
      password: "",
    },
    validate: {
      email: (value) =>
        /^\S+@\S+$/.test(value) ? null : "無効なメールアドレスです",
      password: (value) =>
        value.length >= 6 ? null : "パスワードは6文字以上である必要があります",
    },
  });

  const handleSignUp = async (values: { email: string; password: string }) => {
    const { data, error } = await supabase.auth.signUp({
      email: values.email,
      password: values.password,
    });

    if (error) {
      notifications.show({
        title: "サインアップエラー",
        message: `${error.message}`,
        color: "red",
      });
    } else {
      notifications.show({
        title: "サインアップ成功",
        message: "アカウント登録ありがとうございます。",
        color: "green",
      });
      // セッションが存在する場合、プロフィールページにリダイレクト
      if (data.session) {
        router.push(`/profile/${data.user?.id}`);
      }
    }
  };

  const signInWithGithub = async () => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "github",
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
      },
    });
    if (error) {
      notifications.show({
        title: "ログインエラー",
        message: "ログインに失敗しました。再度お試しください。",
        color: "red",
      });
    }
  };

  return (
    <Group justify="center">
      <form
        onSubmit={form.onSubmit((values) => handleSignUp(values))}
        className={styles.form}
      >
        <TextInput
          label="メールアドレス"
          placeholder="your-email@example.com"
          {...form.getInputProps("email")}
        />
        <PasswordInput
          label="パスワード"
          placeholder="6文字以上のパスワード"
          {...form.getInputProps("password")}
        />
        <Button type="submit" mt="md" fullWidth>
          Signup
        </Button>
        <Button
          leftSection={<GithubIcon size={16} />}
          className={styles.githubButton}
          onClick={signInWithGithub}
          mt="md"
          fullWidth
        >
          Signup with GitHub
        </Button>
      </form>
    </Group>
  );
}
