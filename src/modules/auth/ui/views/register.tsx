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
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/modules/shared/ui/components/ui/card";
import { Form } from "@/modules/shared/ui/components/ui/form";
import { zodResolver } from "@hookform/resolvers/zod";
import { UserPlus } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/router";
import { useCallback } from "react";
import { type SubmitHandler, useForm } from "react-hook-form";
import { toast } from "sonner";
import { useRegister } from "../clients/register";
import { type RegisterFormValues, registerSchema } from "../schemas/register";

const fields: FieldDef[] = [
  {
    name: "name",
    label: "نام و نام خانوادگی",
    type: "text",
  },
  {
    name: "username",
    label: "نام کاربری",
    type: "text",
    dir: "ltr",
  },
  {
    name: "password",
    label: "رمز عبور",
    type: "password",
    placeholder: "********",
  },
];

export function RegisterView() {
  const form = useForm<RegisterFormValues>({
    mode: "onChange",
    resolver: zodResolver(registerSchema),
    defaultValues: { name: "", username: "", password: "" },
  });

  const router = useRouter();

  const register = useRegister();

  const handleSubmit: SubmitHandler<RegisterFormValues> = useCallback(
    (values) => {
      register.mutate(values, {
        onError(error) {
          toast.error(error?.meta?.message);
        },
        onSuccess() {
          router.replace("/dashboard");
        },
      });
    },
    [register, router],
  );

  return (
    <Card className="w-full max-w-sm">
      <CardHeader className="text-center">
        <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10">
          <span className="text-2xl font-black text-primary">ن</span>
        </div>
        <CardTitle className="text-xl">ثبت‌نام در آرکدیا</CardTitle>
        <CardDescription>یک حساب برای خودتان بسازید بسازید</CardDescription>
      </CardHeader>

      <CardContent>
        <Form {...form}>
          <form
            className="flex flex-col gap-4"
            onSubmit={form.handleSubmit(handleSubmit)}
          >
            <FieldRenderer fields={fields} />
            <Button
              type="submit"
              loading={register.isPending}
              className="w-full gap-2 mt-1"
            >
              <UserPlus className="h-4 w-4" />
              ایجاد حساب
            </Button>
          </form>
        </Form>
      </CardContent>

      <CardFooter className="justify-center">
        <p className="text-sm text-muted-foreground">
          قبلاً ثبت‌نام کرده‌اید؟
          <Link
            href="/login"
            className="text-primary hover:underline font-medium ms-1"
          >
            وارد شوید
          </Link>
        </p>
      </CardFooter>
    </Card>
  );
}
