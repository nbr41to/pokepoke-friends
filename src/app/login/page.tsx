import { LoginButton } from './_components/login-button';

export default async function Page({
  searchParams,
}: {
  searchParams: Promise<{ redirect: string }>;
}) {
  const redirect = (await searchParams).redirect;

  return (
    <div className="flex w-full items-center justify-center p-5">
      <div className="flex w-fit flex-col items-center justify-center gap-y-4 rounded-md border p-4">
        <p className="text-center text-sm font-bold">
          この機能を使用するためには、Googleアカウントでログインする必要があります。
        </p>
        <LoginButton redirectUrl={redirect} />
      </div>
    </div>
  );
}
