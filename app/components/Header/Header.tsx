"use client";

import { useState, useEffect } from "react";
import { Container, Group, Title } from "@mantine/core";
import Link from "next/link";
import classes from "./Header.module.css";
import { supabase } from "../../../lib/supabase/supabase";
import { User } from "@supabase/supabase-js";

export function HeaderComponents() {
  const [active, setActive] = useState("/login");
  const [user, setUser] = useState<User | null>(null);

  // ユーザーのログイン状態を取得する関数
  const fetchUser = async () => {
    const { data, error } = await supabase.auth.getUser();
    if (error) {
      console.error("Error fetching user:", error.message);
      setUser(null);
    } else {
      setUser(data.user);
    }
  };

  useEffect(() => {
    // コンポーネントのマウント時にユーザー情報を取得
    fetchUser();

    // 認証状態の変化を監視
    const { data: authListener } = supabase.auth.onAuthStateChange(
      (event, session) => {
        if (session?.user) {
          setUser(session.user);
        } else {
          setUser(null);
        }
      }
    );

    // クリーンアップ関数
    return () => {
      authListener.subscription.unsubscribe();
    };
  }, []);

  // ログアウト処理
  const handleLogout = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      console.error("Error logging out:", error.message);
    } else {
      setUser(null);
      setActive("/login");
    }
  };

  // ログイン状態に応じたリンクの設定
  const links = user
    ? [
        {
          link: `/profile/${user.user_metadata.user_name}`,
          label: "Profile",
        },
        { link: "#", label: "Logout", onClick: handleLogout },
      ]
    : [
        { link: "/login", label: "Login" },
        { link: "/signup", label: "Signup" },
      ];

  // リンク要素の生成
  const items = links.map((link) => (
    <Link
      style={{
        textDecoration: "none",
        color: "black",
      }}
      key={link.label}
      href={link.link}
      passHref
      className={`${classes.link} ${
        active === link.link ? classes.active : ""
      }`}
      onClick={(e) => {
        if (link.onClick) {
          e.preventDefault();
          link.onClick();
        } else {
          setActive(link.link);
        }
      }}
    >
      {link.label}
    </Link>
  ));

  return (
    <header className={classes.header}>
      <Container size="lg" className={classes.inner}>
        <Link
          href="/"
          passHref
          style={{
            textDecoration: "none",
            color: "black",
          }}
        >
          <Title
            order={1}
            style={{
              fontFamily: "Tangerine, Arial, sans-serif",
            }}
          >
            Blogs for Engineer
          </Title>
        </Link>
        <Group className={classes.links}>{items}</Group>
      </Container>
    </header>
  );
}
