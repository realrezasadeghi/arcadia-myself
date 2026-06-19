import type { ReactNode } from "react";

type Props = {
  children: ReactNode;
};

/**
 * Project layout.
 *
 * The IDE-like Workbench (project page) provides its own Project Explorer and
 * dockable panels, so this layout only establishes a full-height container.
 */
export default function ProjectLayout({ children }: Props) {
  return <div className="h-full min-h-0">{children}</div>;
}
