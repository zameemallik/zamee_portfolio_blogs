"use client";

import { useState, useEffect } from "react";
import { Container, Group, Title, Burger } from "@mantine/core";
import Link from "next/link";
import classes from "./Header.module.css";
import { supabase } from "../../../lib/supabase/supabase";
import { User } from "@supabase/supabase-js";

export function HeaderComponents() {
  const [active, setActive] = useState("/login");
  const [user, setUser] = useState<User | null>(null);
  const [menuOpened, setMenuOpened] = useState(false);

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
    fetchUser();
    const { data: authListener } = supabase.auth.onAuthStateChange(
      (event, session) => {
        setUser(session?.user || null);
      }
    );
    return () => {
      authListener.subscription.unsubscribe();
    };
  }, []);

  const handleLogout = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      console.error("Error logging out:", error.message);
    } else {
      setUser(null);
      setActive("/login");
      setMenuOpened(false);
    }
  };

  const links = user
    ? [
        { link: `/profile/${user.user_metadata.user_name}`, label: "Profile" },
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
