"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import {
  AlertTriangle,
  Check,
  Lock,
  Pencil,
  RotateCcw,
  Save,
  User as UserIcon,
} from "lucide-react";
import { type ReactNode, useCallback, useMemo } from "react";
import { type SubmitHandler, useForm } from "react-hook-form";
import { toast } from "sonner";
import {
  type FieldDef,
  FieldRenderer,
} from "@/modules/shared/ui/components/common/field-renderer";
import {
  Avatar,
  AvatarFallback,
} from "@/modules/shared/ui/components/ui/avatar";
import { Badge } from "@/modules/shared/ui/components/ui/badge";
import { Button } from "@/modules/shared/ui/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/modules/shared/ui/components/ui/card";
import { Form } from "@/modules/shared/ui/components/ui/form";
import type { GetMeResponse } from "../../application/use-cases/get-me";
import { useChangePassword } from "../clients/change-password";
import { useGetMe } from "../clients/get-me";
import { useUpdateMe } from "../clients/update-me";
import { ProfileSkeleton } from "../components/profile-skeleton";
import {
  type ChangePasswordFormValues,
  changePasswordSchema,
} from "../schemas/change-password";
import { type ProfileFormValues, profileSchema } from "../schemas/profile";

function formatDate(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

function formatDateTime(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
}

/**
 * Shared footer for both profile forms: dirty-state indicator + discard/submit.
 */
function FormFooter({
  dirty,
  pending,
  emptyHint,
  onDiscard,
  children,
}: {
  dirty: boolean;
  pending: boolean;
  emptyHint: string;
  onDiscard: () => void;
  children: ReactNode;
}) {
  const disabled = !dirty || pending;

  return (
    <div className="flex flex-wrap items-center justify-between gap-3 border-t pt-4">
      <div aria-live="polite">
        {dirty ? (
          <Badge variant="secondary" className="gap-1.5">
            <Pencil className="size-3" aria-hidden="true" />
            Unsaved changes
          </Badge>
        ) : (
          <span className="flex items-center gap-1.5 text-xs text-muted-foreground">
            <Check className="size-3.5" aria-hidden="true" />
            {emptyHint}
          </span>
        )}
      </div>
      <div className="flex items-center gap-2">
        <Button
          type="button"
          variant="outline"
          disabled={disabled}
          onClick={onDiscard}
        >
          <RotateCcw className="size-4" aria-hidden="true" />
          Discard
        </Button>
        <Button type="submit" loading={pending} disabled={disabled}>
          {children}
        </Button>
      </div>
    </div>
  );
}

function ProfileErrorState({
  message,
  retrying,
  onRetry,
}: {
  message: string;
  retrying: boolean;
  onRetry: () => void;
}) {
  return (
    <div className="mx-auto flex w-full max-w-4xl flex-col gap-6 p-6">
      <div className="flex flex-col gap-1">
        <h1 className="text-xl font-semibold tracking-tight">Profile</h1>
        <p className="text-sm text-muted-foreground">
          Manage your account settings and preferences
        </p>
      </div>
      <div
        role="alert"
        className="flex flex-col items-center justify-center gap-4 rounded-xl border bg-card px-6 py-16 text-center"
      >
        <div className="flex h-14 w-14 items-center justify-center rounded-full bg-destructive/10">
          <AlertTriangle className="h-7 w-7 text-destructive" />
        </div>
        <div className="flex max-w-sm flex-col gap-1.5">
          <p className="text-base font-semibold">
            We couldn&apos;t load your profile
          </p>
          <p className="text-sm text-muted-foreground">{message}</p>
        </div>
        <Button variant="outline" loading={retrying} onClick={onRetry}>
          <RotateCcw className="size-4" aria-hidden="true" />
          Try again
        </Button>
      </div>
    </div>
  );
}

type Props = {
  /** User prefetched on the server, seeded into the query cache. */
  user?: GetMeResponse;
};

export function ProfileView({ user: prefetchedUser }: Props) {
  const {
    data: user,
    isError,
    error,
    isFetching,
    refetch,
  } = useGetMe({ initialData: prefetchedUser });
  const updateMe = useUpdateMe();
  const changePassword = useChangePassword();

  const profileForm = useForm<ProfileFormValues>({
    resolver: zodResolver(profileSchema),
    mode: "onBlur",
    defaultValues: { name: "" },
    values: user ? { name: user.name } : undefined,
  });

  const passwordForm = useForm<ChangePasswordFormValues>({
    resolver: zodResolver(changePasswordSchema),
    mode: "onBlur",
    defaultValues: {
      current_password: "",
      password: "",
      password_confirmation: "",
    },
  });

  const initials = useMemo(() => {
    const parts = user?.name.trim().split(/\s+/) ?? [];
    const chars = parts
      .slice(0, 2)
      .map((part) => part.charAt(0))
      .join("")
      .toUpperCase();
    return chars || "U";
  }, [user?.name]);

  const handleProfileSubmit: SubmitHandler<ProfileFormValues> = useCallback(
    (values) => {
      updateMe.mutate(values, {
        onError(err) {
          toast.error(err.message);
        },
        onSuccess() {
          toast.success("Profile updated successfully");
          profileForm.reset(values);
        },
      });
    },
    [updateMe, profileForm],
  );

  const handleProfileDiscard = useCallback(() => {
    profileForm.reset(user ? { name: user.name } : { name: "" });
  }, [profileForm, user]);

  const handlePasswordSubmit: SubmitHandler<ChangePasswordFormValues> =
    useCallback(
      (values) => {
        changePassword.mutate(values, {
          onError(err) {
            toast.error(err.message);
          },
          onSuccess() {
            toast.success("Password changed successfully");
            passwordForm.reset();
          },
        });
      },
      [changePassword, passwordForm],
    );

  const handlePasswordDiscard = useCallback(() => {
    passwordForm.reset();
  }, [passwordForm]);

  if (!user && !isError) {
    return <ProfileSkeleton />;
  }

  if (!user) {
    return (
      <ProfileErrorState
        message={error?.message || "Something went wrong"}
        retrying={isFetching}
        onRetry={() => refetch()}
      />
    );
  }

  const profileFields: FieldDef[] = [
    {
      name: "name",
      label: "Full Name",
      type: "text",
      autoComplete: "name",
      description: "This name is visible to your project collaborators",
    },
  ];

  const passwordFields: FieldDef[] = [
    {
      name: "current_password",
      label: "Current Password",
      type: "password",
      dir: "ltr",
      autoComplete: "current-password",
    },
    {
      name: "password",
      label: "New Password",
      type: "password",
      dir: "ltr",
      autoComplete: "new-password",
      description: "Must be at least 8 characters",
    },
    {
      name: "password_confirmation",
      label: "Confirm New Password",
      type: "password",
      dir: "ltr",
      autoComplete: "new-password",
    },
  ];

  const accountDetails = [
    { label: "Username", value: user.username, ltr: true },
    { label: "Member since", value: formatDate(user.createdAt), ltr: false },
    {
      label: "Last updated",
      value: formatDateTime(user.updatedAt),
      ltr: false,
    },
  ];

  return (
    <div className="mx-auto flex w-full max-w-4xl flex-col gap-6 p-6">
      <div className="flex flex-col gap-1">
        <h1 className="text-xl font-semibold tracking-tight">Profile</h1>
        <p className="text-sm text-muted-foreground">
          Manage your account settings and preferences
        </p>
      </div>

      <div className="grid items-start gap-6 lg:grid-cols-[17rem_1fr]">
        <Card className="lg:sticky lg:top-6">
          <CardContent className="flex flex-col items-center pt-6 text-center">
            <Avatar className="size-16">
              <AvatarFallback className="bg-primary/10 text-primary text-xl font-semibold">
                {initials}
              </AvatarFallback>
            </Avatar>
            <p className="mt-3 text-base font-semibold">{user.name}</p>
            <p className="text-sm text-muted-foreground" dir="ltr">
              {user.username}
            </p>
          </CardContent>
          <div className="px-4 pb-2">
            <dl className="flex flex-col gap-3 rounded-lg border bg-muted/30 p-3">
              {accountDetails.map((detail) => (
                <div key={detail.label} className="flex flex-col gap-0.5">
                  <dt className="text-xs text-muted-foreground">
                    {detail.label}
                  </dt>
                  <dd
                    className="break-words text-sm font-medium"
                    dir={detail.ltr ? "ltr" : undefined}
                  >
                    {detail.value}
                  </dd>
                </div>
              ))}
            </dl>
          </div>
        </Card>

        <div className="flex flex-col gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2.5">
                <span className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                  <UserIcon className="size-4" aria-hidden="true" />
                </span>
                Personal Information
              </CardTitle>
              <CardDescription>
                Update your personal details and profile information
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Form {...profileForm}>
                <form
                  noValidate
                  className="flex flex-col gap-4"
                  onSubmit={profileForm.handleSubmit(handleProfileSubmit)}
                >
                  <FieldRenderer fields={profileFields} />
                  <FormFooter
                    dirty={profileForm.formState.isDirty}
                    pending={updateMe.isPending}
                    emptyHint="All changes saved"
                    onDiscard={handleProfileDiscard}
                  >
                    <Save className="size-4" aria-hidden="true" />
                    Save Changes
                  </FormFooter>
                </form>
              </Form>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2.5">
                <span className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                  <Lock className="size-4" aria-hidden="true" />
                </span>
                Change Password
              </CardTitle>
              <CardDescription>
                Choose a strong password to keep your account secure
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Form {...passwordForm}>
                <form
                  noValidate
                  className="flex flex-col gap-4"
                  onSubmit={passwordForm.handleSubmit(handlePasswordSubmit)}
                >
                  <FieldRenderer fields={passwordFields} />
                  <FormFooter
                    dirty={passwordForm.formState.isDirty}
                    pending={changePassword.isPending}
                    emptyHint="No pending changes"
                    onDiscard={handlePasswordDiscard}
                  >
                    <Lock className="size-4" aria-hidden="true" />
                    Change Password
                  </FormFooter>
                </form>
              </Form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
