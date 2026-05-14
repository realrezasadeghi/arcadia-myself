export type ProjectMemberRole = "OWNER" | "EDITOR" | "VIEWER";

export type ProjectMember = {
  userId: number;
  joinedAt: string;
  role: ProjectMemberRole;
};

export type Project = {
  id: number;
  name: string;
  description?: string;
  createdAt: string;
  updatedAt: string;
  ownerId: number;
  members: ProjectMember[];
};
