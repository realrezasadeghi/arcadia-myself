import { getAllProjects } from "../../presentation/server-actions/get-all";
import { ProjectContainer } from "../components/project-container";

export async function ProjectView() {
  const { data: projects } = await getAllProjects();

  return <ProjectContainer projects={projects || []} />;
}
