import type { DiagramTypeValue } from "@/modules/model/ui/types/diagram";
import { z } from "zod";

export const diagramFormSchema = z.object({
  type: z.enum<DiagramTypeValue[]>(
    [
      "OEB",
      "OAB",
      "OPD",
      "OCD",
      "OIS",
      "SAB",
      "SDFB",
      "SCD",
      "SS",
      "LAB",
      "LDFB",
      "LCB",
      "LS",
      "PAB",
      "PDFB",
      "PCB",
      "PS",
      "EPBB",
      "EAB",
      "ECB",
    ],
    {
      error: "نوع دیاگرام نامعتبر است",
    },
  ),
  name: z.string().min(1, "نام دیاگرام الزامی است"),
  description: z.string().optional(),
});

export type DiagramFormValues = z.infer<typeof diagramFormSchema>;
