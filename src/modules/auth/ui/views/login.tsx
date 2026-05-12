"use client";

import {
  type FieldDef,
  FieldRenderer,
} from "@/modules/shared/ui/components/common/form-renderer";
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
import { LogIn } from "lucide-react";
import Link from "next/link";
import { useCallback } from "react";
import { type SubmitHandler, useForm } from "react-hook-form";
import { type LoginFormValues, loginSchema } from "../schemas/login";

const fields: FieldDef[] = [
  {
    name: "username",
    label: "نام کاربری",
    type: "text",
    dir: "ltr",
  },
  { name: "password", label: "رمز عبور", type: "password" },
];

export function LoginView() {
  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: { username: "", password: "" },
  });

  const handleSubmit: SubmitHandler<LoginFormValues> =
    useCallback(() => {}, []);

  return (
    <Card className="w-full max-w-sm">
      <CardHeader className="text-center">
        <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10">
          <span className="text-2xl font-black text-primary">ن</span>
        </div>
        <CardTitle className="text-xl">ورود به آرکدیا پلتفرم</CardTitle>
        <CardDescription>پلتفرم مدل‌سازی متدولوژی آرکدیا</CardDescription>
      </CardHeader>

      <CardContent>
        <Form {...form}>
          <form
            className="flex flex-col gap-4"
            onSubmit={form.handleSubmit(handleSubmit)}
          >
            <FieldRenderer form={form} fields={fields} />
            <Button type="submit" className="w-full gap-2 mt-1">
              <LogIn className="h-4 w-4" />
              ورود
            </Button>
          </form>
        </Form>
      </CardContent>

      <CardFooter className="justify-center">
        <p className="text-sm text-muted-foreground">
          حساب ندارید؟
          <Link
            href="/register"
            className="text-primary hover:underline font-medium"
          >
            ثبت‌نام کنید
          </Link>
        </p>
      </CardFooter>
    </Card>
  );
}
