"use client";

import { useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { supabase } from "../../../lib/supabase/supabase";
import { notifications } from "@mantine/notifications";
import { Suspense } from "react";

function AuthCallbackComponent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    const handleAuth = async () => {
      // URLのクエリパラメータからエラー情報を取得
      const error = searchParams.get("error");
      const errorDescription = searchParams.get("error_description");

      if (error) {
        // エラーが存在する場合、通知を表示してからログインページにリダイレクト
        notifications.show({
          title: "Login Error",
          message: errorDescription || "An error occurred during login.",
          color: "red",
        });
        router.push("/login");
      } else {
        // エラーがない場合、ユーザー情報を取得
        const {
          data: { user },
          error: userError,
        } = await supabase.auth.getUser();

        if (user) {
          const userId = user.id;
          if (userId) {
            router.push(`/profile/${userId}`);
          } else {
            console.error("userId not found in user");
            notifications.show({
              title: "Login Error",
              message: "userId not found.",
              color: "red",
            });
            router.push("/login");
          }
        } else if (userError) {
          console.error("Error fetching user:", userError.message);
          notifications.show({
            title: "Login Error",
            message: userError.message,
            color: "red",
          });
          router.push("/login");
        }
      }
    };

    handleAuth();
  }, [router, searchParams]);

  return <div>Loading...</div>;
}

export default function AuthCallback() {
  return (
    <Suspense>
      <AuthCallbackComponent />
    </Suspense>
  );
}
