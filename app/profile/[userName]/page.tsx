export default async function ProfilePage({
  params,
}: {
  params: Promise<{ userName: string }>;
}) {
  const { userName } = await params;

  return (
    <>
      <h1>
        Welcome, {userName}! <br />
        こちらのページまだ未実装です。
      </h1>
      <p></p>
    </>
  );
}
