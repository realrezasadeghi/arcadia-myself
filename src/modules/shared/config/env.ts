import { z } from "zod";

const envSchema = z.object({
  // App
  NODE_ENV: z
    .enum(["development", "production", "test"])
    .default("development"),

  NEXT_PUBLIC_APP_BASE_URL: z.url().default("http://localhost:3000"),

  // Api
  API_BASE_URL: z.url().default("http://localhost:8000"),

  DATABASE_URL: z.string().default("file:./data/app.db"),
});

type Env = z.infer<typeof envSchema>;

class Environment {
  private env: Env;

  constructor() {
    try {
      this.env = envSchema.parse(process.env);
    } catch (error) {
      if (error instanceof z.ZodError) {
        const missingVars = error.issues
          .map((e) => e.path.join("."))
          .join(", ");
        throw new Error(
          `Missing or invalid environment variables: ${missingVars}`,
        );
      }
      throw error;
    }
  }

  get<K extends keyof Env>(key: K): Env[K] {
    return this.env[key];
  }

  getAll(): Env {
    return this.env;
  }

  isDevelopment(): boolean {
    return this.env.NODE_ENV === "development";
  }

  isProduction(): boolean {
    return this.env.NODE_ENV === "production";
  }

  isTest(): boolean {
    return this.env.NODE_ENV === "test";
  }
}

export const env = new Environment();
