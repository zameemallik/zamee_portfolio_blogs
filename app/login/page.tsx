"use client";

import { Button, Group } from "@mantine/core";
import { GithubIcon } from "@mantinex/dev-icons";
import styles from "./page.module.css";
import React from "react";
import { supabase } from "../../lib/supabase/supabase";
import { notifications } from "@mantine/notifications";

export default function LoginPage() {
  const signInWithGithub = async () => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "github",
      options: {
        redirectTo: `${window.location.origin}/auth/callback`, // 認証後のコールバックURL
      },
    });
    if (error) {
      notifications.show({
        title: "Login Error",
        message: "Login attempt failed. Please try again.",
        color: "red",
      });
    }
  };
  return (
    <Group justify="center" p="md">
      <Button
        leftSection={<GithubIcon size={16} />}
        className={styles.githubButton}
        onClick={() => signInWithGithub()}
      >
        Login with GitHub
      </Button>
    </Group>
  );
}
