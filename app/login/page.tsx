"use client";

import React from "react";
import { Button, Group, TextInput, PasswordInput } from "@mantine/core";
import { GithubIcon } from "@mantinex/dev-icons";
import { useForm } from "@mantine/form";
import { supabase } from "../../lib/supabase/supabase";
import { notifications } from "@mantine/notifications";

import styles from "./page.module.css";
import { useRouter } from "next/navigation";

export default function LoginPage() {
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
        value.length > 0 ? null : "パスワードを入力してください",
    },
  });

  const handleLogin = async (values: { email: string; password: string }) => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email: values.email,
      password: values.password,
    });

    if (error) {
      if (error.message === "Invalid login credentials") {
        notifications.show({
          title: "Login Error",
          message: "You are not Signed up yet",
          color: "red",
        });
      } else {
        notifications.show({
          title: "Login Error",
          message: "Login failed. Please try again.",
          color: "red",
        });
      }
    } else {
      notifications.show({
        title: "Login Success",
        message: "Login has been Succeeded",
        color: "green",
      });
      router.push(`/profile/${data.user.id}`);
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
        title: "Login Error",
        message: "Login Failed. Please try again",
        color: "red",
      });
    }
  };

  return (
    <Group justify="center">
      <form
        onSubmit={form.onSubmit((values) => handleLogin(values))}
        className={styles.form}
      >
        <TextInput
          label="メールアドレス"
          placeholder="your-email@example.com"
          {...form.getInputProps("email")}
        />
        <PasswordInput
          label="パスワード"
          placeholder="パスワード"
          {...form.getInputProps("password")}
        />
        <Button type="submit" mt="md" fullWidth>
          Login
        </Button>
        <Button
          leftSection={<GithubIcon size={16} />}
          className={styles.githubButton}
          onClick={signInWithGithub}
          mt="md"
          fullWidth
        >
          Login with GitHub
        </Button>
      </form>
    </Group>
  );
}
