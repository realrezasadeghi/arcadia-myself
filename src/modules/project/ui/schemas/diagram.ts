import { z } from "zod";
import type { DiagramTypeValue } from "@/modules/model/ui/types/diagram";

export const diagramFormSchema = z.object({
  type: z.enum<DiagramTypeValue[]>(
    [
      "OEB",
      "OCD",
      "OAB",
      "OPD",
      "OIS",
      "OAAB",
      "CSA",
      "SCD",
      "SFB",
      "SDFB",
      "SAB",
      "SS",
      "LCB",
      "LFB",
      "LDFB",
      "LAB",
      "LS",
      "PCB",
      "PFB",
      "PDFB",
      "PAB",
      "PS",
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
