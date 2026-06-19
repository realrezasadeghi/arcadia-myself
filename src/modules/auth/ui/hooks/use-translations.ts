"use client";

import { useTranslations } from "next-intl";

export function useLoginTranslations() {
  return useTranslations("auth.login");
}

export function useRegisterTranslations() {
  return useTranslations("auth.register");
}

export function useCommonTranslations() {
  return useTranslations("common");
}
