import type { Metadata } from "next";
import { Suspense } from "react";
import { ProfileView } from "@/modules/auth/ui/views/profile";
import { Skeleton } from "@/modules/shared/ui/components/ui/skeleton";

export const metadata: Metadata = {
  title: "Profile",
};

/**
 * Cache Components: the profile view reads uncached auth data, so it must be
 * rendered inside a Suspense boundary to keep the static shell prerenderable.
 */
export default function ProfilePage() {
  return (
    <Suspense
      fallback={
        <div className="p-6 space-y-6">
          <Skeleton className="h-8 w-48" />
          <Skeleton className="h-64 w-full max-w-2xl" />
        </div>
      }
    >
      <ProfileView />
    </Suspense>
  );
}
