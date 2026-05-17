import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbSeparator,
} from "@/modules/shared/ui/components/ui/breadcrumb";
import Link from "next/link";

type DiagramToolbarBreadcrumbProps = {
  projectId: string;
  diagramName: string;
  projectName: string;
  layerName: string;
};

export function DiagramToolbarBreadcrumb({
  projectId,
  projectName,
  diagramName,
  layerName,
}: DiagramToolbarBreadcrumbProps) {
  return (
    <Breadcrumb>
      <BreadcrumbList>
        <BreadcrumbItem>
          <BreadcrumbLink asChild>
            <Link href={"/dashboard/project"}>پروژه ها</Link>
          </BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbSeparator />
        <BreadcrumbItem>
          <BreadcrumbLink asChild>
            <Link href={`/dashboard/project/${projectId}`}>{projectName}</Link>
          </BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbSeparator />
        <BreadcrumbItem>
          <span>{layerName}</span>
        </BreadcrumbItem>
        <BreadcrumbSeparator />
        <BreadcrumbItem>
          <span className="text-foreground font-medium truncate max-w-40">
            {diagramName}
          </span>
        </BreadcrumbItem>
      </BreadcrumbList>
    </Breadcrumb>
  );
}
