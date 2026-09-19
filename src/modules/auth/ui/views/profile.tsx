"use client";

import {
  type FieldDef,
  FieldRenderer,
} from "@/modules/shared/ui/components/common/field-renderer";
import { Button } from "@/modules/shared/ui/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/modules/shared/ui/components/ui/card";
import { Form } from "@/modules/shared/ui/components/ui/form";
import { Separator } from "@/modules/shared/ui/components/ui/separator";
import { Skeleton } from "@/modules/shared/ui/components/ui/skeleton";
import { zodResolver } from "@hookform/resolvers/zod";
import { Calendar, Lock, User as UserIcon } from "lucide-react";
import { useCallback } from "react";
import { type SubmitHandler, useForm } from "react-hook-form";
import { toast } from "sonner";
import { useChangePassword } from "../clients/change-password";
import { useGetMe } from "../clients/get-me";
import { useUpdateMe } from "../clients/update-me";
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

export function ProfileView() {
  const { data: user, isLoading } = useGetMe();
  const updateMe = useUpdateMe();
  const changePassword = useChangePassword();

  const profileForm = useForm<ProfileFormValues>({
    resolver: zodResolver(profileSchema),
    defaultValues: { name: "" },
    values: user ? { name: user.name } : undefined,
  });

  const passwordForm = useForm<ChangePasswordFormValues>({
    resolver: zodResolver(changePasswordSchema),
    defaultValues: {
      current_password: "",
      password: "",
      password_confirmation: "",
    },
  });

  const handleProfileSubmit: SubmitHandler<ProfileFormValues> = useCallback(
    (values) => {
      updateMe.mutate(values, {
        onError(error) {
          toast.error(error.message);
        },
        onSuccess() {
          toast.success("Profile updated successfully");
          profileForm.reset(values);
        },
      });
    },
    [updateMe, profileForm],
  );

  const handlePasswordSubmit: SubmitHandler<ChangePasswordFormValues> =
    useCallback(
      (values) => {
        changePassword.mutate(values, {
          onError(error) {
            toast.error(error.message);
          },
          onSuccess() {
            toast.success("Password changed successfully");
            passwordForm.reset();
          },
        });
      },
      [changePassword, passwordForm],
    );

  if (isLoading) {
    return (
      <div className="p-6 space-y-6">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-64 w-full max-w-2xl" />
      </div>
    );
  }

  if (!user) {
    return null;
  }

  const profileFields: FieldDef[] = [
    {
      name: "name",
      label: "Full Name",
      type: "text",
    },
  ];

  const passwordFields: FieldDef[] = [
    {
      name: "current_password",
      label: "Current Password",
      type: "password",
      dir: "ltr",
    },
    {
      name: "password",
      label: "New Password",
      type: "password",
      dir: "ltr",
    },
    {
      name: "password_confirmation",
      label: "Confirm New Password",
      type: "password",
      dir: "ltr",
    },
  ];

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Profile</h1>
        <p className="text-muted-foreground mt-1">
          Manage your account settings and preferences
        </p>
      </div>

      <div className="grid gap-6 max-w-2xl">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <UserIcon className="h-5 w-5" />
              Personal Information
            </CardTitle>
            <CardDescription>
              Update your personal details and profile information
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...profileForm}>
              <form
                className="flex flex-col gap-4"
                onSubmit={profileForm.handleSubmit(handleProfileSubmit)}
              >
                <FieldRenderer fields={profileFields} />

                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Calendar className="h-4 w-4" />
                  <span>Member since {formatDate(user.createdAt)}</span>
                </div>

                <Separator className="my-2" />

                <div className="flex justify-end">
                  <Button
                    type="submit"
                    loading={updateMe.isPending}
                    disabled={!profileForm.formState.isDirty}
                  >
                    Save Changes
                  </Button>
                </div>
              </form>
            </Form>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Lock className="h-5 w-5" />
              Change Password
            </CardTitle>
            <CardDescription>
              Update your password to keep your account secure
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...passwordForm}>
              <form
                className="flex flex-col gap-4"
                onSubmit={passwordForm.handleSubmit(handlePasswordSubmit)}
              >
                <FieldRenderer fields={passwordFields} />

                <Separator className="my-2" />

                <div className="flex justify-end">
                  <Button
                    type="submit"
                    loading={changePassword.isPending}
                    disabled={!passwordForm.formState.isDirty}
                  >
                    Change Password
                  </Button>
                </div>
              </form>
            </Form>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Account Details</CardTitle>
            <CardDescription>
              Your account information is read-only
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">
                    Username
                  </p>
                  <p className="text-sm">{user.username}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">
                    User ID
                  </p>
                  <p className="text-sm">{user.id}</p>
                </div>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  Last Updated
                </p>
                <p className="text-sm">{formatDateTime(user.updatedAt)}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
