"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "../../../lib/supabase/supabase";

export default function AuthCallback() {
  const router = useRouter();

  useEffect(() => {
    const handleAuth = async () => {
      // URLのクエリパラメータから認証コードを交換してセッションを取得
      const {
        data: { user },
        error,
      } = await supabase.auth.getUser();

      if (user) {
        const username = user.user_metadata?.user_name;
        if (username) {
          router.push(`/profile/${username}`);
        } else {
          console.error("Username not found in user metadata");
        }
      } else if (error) {
        console.error("Error fetching user:", error.message);
      }
    };

    handleAuth();
  }, []);

  return <div>Loading...</div>;
}
