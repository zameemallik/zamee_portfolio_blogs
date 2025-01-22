export default async function ProfilePage({
  params,
}: {
  params: Promise<{ userName: string }>;
}) {
  const { userName } = await params;

  return (
    <>
      <h1>Welcome, {userName}!</h1>
    </>
  );
}
