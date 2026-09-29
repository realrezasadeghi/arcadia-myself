import type { Metadata } from "next";
import { Suspense } from "react";
import { getMe } from "@/modules/auth/presentation/server-action/get-me";
import { ProfileSkeleton } from "@/modules/auth/ui/components/profile-skeleton";
import { ProfileView } from "@/modules/auth/ui/views/profile";

export const metadata: Metadata = {
  title: "Profile",
};

/**
 * Prefetches the signed-in user on the server so the page renders real
 * markup on first paint. The fetch is deferred to `<Suspense>` because it
 * depends on runtime request data (cookies).
 */
export default function ProfilePage() {
  return (
    <Suspense fallback={<ProfileSkeleton />}>
      <ProfileSection />
    </Suspense>
  );
}

async function ProfileSection() {
  const result = await getMe();
  return <ProfileView user={result.success ? result.data : undefined} />;
}
