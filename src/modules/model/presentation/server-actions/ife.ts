"use server";

import { fail, type IRes, ok } from "@/modules/shared/utils/response";
import { db } from "../../infrastructure/persistence/drizzle/client";
import { seedIFEProject } from "../../infrastructure/persistence/drizzle/seed";

/**
 * seedIFEProject
 *
 * یک پروژه IFE کامل با تمام 4 لایه ایجاد می‌کند.
 * اگر model برای یک لایه از قبل وجود داشته باشد، از آن استفاده می‌کند.
 */
export async function seedIFE(projectId: string): Promise<IRes<boolean>> {
  try {
    await seedIFEProject({ projectId }, db);
    return ok(true, "IFE model seeded successfully");
  } catch (err) {
    return fail(err, false);
  }
}
