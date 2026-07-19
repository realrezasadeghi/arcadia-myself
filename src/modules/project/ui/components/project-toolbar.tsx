import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/modules/shared/ui/components/ui/breadcrumb";
import { Button } from "@/modules/shared/ui/components/ui/button";
import { Home, Plus } from "lucide-react";
import Link from "next/link";
import { SearchInput } from "./search-input";

type ProjectToolbarProps = {
  searchQuery: string;
};

export function ProjectToolbar({ searchQuery }: ProjectToolbarProps) {
  return (
    <div className="sticky bg-background top-0 z-10 border-b">
      <div className="px-6 py-4">
        <Breadcrumb className="mb-3">
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink asChild>
                <Link href="/dashboard" className="flex items-center gap-1">
                  <Home className="h-3.5 w-3.5" />
                  <span className="hidden sm:inline">Dashboard</span>
                </Link>
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>Projects</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>

        <div className="flex items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Projects</h1>
            <p className="text-sm text-muted-foreground mt-0.5">
              Create and manage your architecture models
            </p>
          </div>
          <div className="flex gap-3 items-center">
            <SearchInput defaultValue={searchQuery} />
            <Button asChild className="gap-2">
              <Link href="/dashboard/project/new">
                <Plus className="h-4 w-4" />
                New Project
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
