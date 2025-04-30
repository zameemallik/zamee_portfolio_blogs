"use client";

import { useState } from "react";
import { Container, Title, Burger } from "@mantine/core";
import Link from "next/link";
import classes from "./Header.module.css";
import { useAuth } from "@/app/providers/AuthProvider";

export function HeaderComponents() {
  const [active, setActive] = useState("/login");
  const [menuOpened, setMenuOpened] = useState(false);
  const { user, signOut } = useAuth(); // AuthContext から user と signOut を取得

  const handleLogout = async () => {
    await signOut();
    setActive("/login");
    setMenuOpened(false);
  };

  const links = user
    ? [
        { link: `/profile/${user.id}`, label: "Profile" },
        { link: "/blog/new", label: "新規作成" },
        { link: "#", label: "Logout", onClick: handleLogout },
      ]
    : [
        { link: "/login", label: "Login" },
        { link: "/signup", label: "Signup" },
      ];

  const items = links.map((link) => (
    <Link
      key={link.label}
      href={link.link}
      className={`${classes.link} ${
        active === link.link ? classes.active : ""
      }`}
      onClick={(e) => {
        if (link.onClick) {
          e.preventDefault();
          link.onClick();
        } else {
          setActive(link.link);
          setMenuOpened(false);
        }
      }}
    >
      {link.label}
    </Link>
  ));

  return (
    <header className={classes.header}>
      <Container size="lg" className={classes.inner}>
        <Link href="/" className={classes.logo}>
          <Title
            order={1}
            style={{
              fontFamily: "Tangerine, Arial, sans-serif",
            }}
          >
            Blogs for Engineer
          </Title>
        </Link>
        <Burger
          opened={menuOpened}
          onClick={() => setMenuOpened((o) => !o)}
          className={classes.burger}
        />
        <nav className={`${classes.nav} ${menuOpened ? classes.navOpen : ""}`}>
          {items}
        </nav>
      </Container>
    </header>
  );
}
