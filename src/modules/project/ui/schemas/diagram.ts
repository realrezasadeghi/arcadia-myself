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
      "CDB",
    ],
    {
      error: "Diagram type is invalid",
    },
  ),
  name: z.string().min(1, "Diagram name is required"),
  description: z.string().optional(),
});

export type DiagramFormValues = z.infer<typeof diagramFormSchema>;
