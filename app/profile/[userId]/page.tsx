import { supabase } from "../../../lib/supabase/supabase";

export default async function ProfilePage({
  params,
}: {
  params: Promise<{ userId: string }>;
}) {
  const { userId } = await params;

  // Supabase からユーザー情報を取得
  const { data: user, error } = await supabase
    .from("User")
    .select("displayName, userImgUrl")
    .eq("id", userId)
    .single();

  if (error) {
    return (
      <>
        <h1>ユーザー情報の取得中にエラーが発生しました。</h1>
        <p>{error.message}</p>
      </>
    );
  }

  return (
    <>
      <h1>ようこそ、{user.displayName} さん！</h1>
      {user.userImgUrl && <img src={user.userImgUrl} alt="User Image" />}
      <p>こちらのページはまだ未実装です。</p>
    </>
  );
}
