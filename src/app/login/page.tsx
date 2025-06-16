import { LoginButton } from './_components/login-button';

export default async function Page({
  searchParams,
}: {
  searchParams: Promise<{ redirect: string }>;
}) {
  const redirect = (await searchParams).redirect;

  return (
    <div className="p-4">
      <h1 className="flex justify-between border-b">ログインして使えるよ</h1>
      <div className="mt-4 flex flex-col items-center justify-center gap-y-4">
        <p>ログインする必要があります。</p>
        <LoginButton redirectUrl={redirect} />
        <p>Googleログインのみ対応だよ</p>
      </div>
    </div>
  );
}
