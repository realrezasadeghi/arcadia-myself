import { getMe } from "@/modules/auth/presentation/server-action/get-me";

export default async function Page() {
  const result = await getMe();

  return (
    <div>
      <p>{result.data?.name}</p>
    </div>
  );
}
