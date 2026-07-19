"use client";

import { Badge } from "@/modules/shared/ui/components/ui/badge";
import { Button } from "@/modules/shared/ui/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
} from "@/modules/shared/ui/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/modules/shared/ui/components/ui/dropdown-menu";
import { cn } from "@/modules/shared/ui/libs/cn";
import {
  ArrowRight,
  Calendar,
  MoreHorizontal,
  Pencil,
  Trash2,
  Users,
} from "lucide-react";
import Link from "next/link";
import type { Project } from "../types/project";

const LAYER_BADGES = [
  {
    label: "OA",
    className: "bg-blue-500 text-white",
  },
  {
    label: "SA",
    className: "bg-amber-500 text-white",
  },
  {
    label: "LA",
    className: "bg-emerald-600 text-white",
  },
  {
    label: "PA",
    className: "bg-purple-600 text-white",
  },
  {
    label: "EPBS",
    className: "bg-rose-600 text-white",
  },
];

interface ProjectCardProps {
  project: Project;
  onEdit: (project: Project) => void;
  onDelete: (project: Project) => void;
}

export function ProjectCard({ project, onEdit, onDelete }: ProjectCardProps) {
  const memberCount = project.members.length;
  const date = new Intl.DateTimeFormat("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  }).format(new Date(project.updatedAt));

  return (
    <Card className="group flex flex-col hover:shadow-md hover:border-primary/30 transition-all duration-200">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between gap-2">
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-base truncate">{project.name}</h3>
            {project.description && (
              <p className="mt-1 text-sm text-muted-foreground line-clamp-2">
                {project.description}
              </p>
            )}
          </div>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                size="icon"
                variant="ghost"
                className="h-7 w-7 opacity-0 group-hover:opacity-100 shrink-0"
              >
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start">
              <DropdownMenuItem onClick={() => onEdit(project)}>
                <Pencil className="h-4 w-4" /> Edit
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={() => onDelete(project)}
                className="text-destructive focus:text-destructive"
              >
                <Trash2 className="h-4 w-4" /> Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        {/* Layer Badges */}
        <div className="flex gap-1.5 flex-wrap mt-2">
          {LAYER_BADGES.map((b) => (
            <Badge key={b.label} className={cn("text-xs", b.className)}>
              {b.label}
            </Badge>
          ))}
        </div>
      </CardHeader>

      <CardContent className="pt-0 mt-auto">
        <div className="flex items-center justify-between text-xs text-muted-foreground mb-3">
          <span className="flex items-center gap-1">
            <Users className="h-3.5 w-3.5" />
            {memberCount} members
          </span>
          <span className="flex items-center gap-1">
            <Calendar className="h-3.5 w-3.5" />
            {date}
          </span>
        </div>

        <Link href={`/dashboard/project/${project.id}`}>
          <Button variant="outline" size="sm" className="w-full gap-1.5">
            Open
            <ArrowRight className="h-3.5 w-3.5" />
          </Button>
        </Link>
      </CardContent>
    </Card>
  );
}
