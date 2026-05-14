import { Button } from "@/modules/shared/ui/components/ui/button";
import { Input } from "@/modules/shared/ui/components/ui/input";
import { Plus, Search } from "lucide-react";

export type ProjectToolbarProps = {
  onCreate: () => void;
};

export function ProjectToolbar({ onCreate }: ProjectToolbarProps) {
  return (
    <div className="flex items-center justify-between gap-4 sticky bg-background top-0 px-6 py-2">
      <div>
        <h1 className="text-2xl font-bold">پروژه‌ها</h1>
        <p className="text-sm text-muted-foreground mt-0.5">
          پروژه تعریف کنید و مدل هاتون رو مدیریت کنید
        </p>
      </div>
      <div className="flex gap-x-4 items-center">
        <div className="relative max-w-sm">
          <Search className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input placeholder="جستجو در پروژه‌ها..." className="pr-9" />
        </div>
        <Button className="gap-2" onClick={onCreate}>
          <Plus className="h-4 w-4" />
          پروژه جدید
        </Button>
      </div>
    </div>
  );
}
