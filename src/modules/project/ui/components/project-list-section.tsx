import { getAllProjects } from "../../presentation/server-actions/get-all";
import { ProjectCardWrapper } from "./project-card-wrapper";
import { ProjectListEmpty } from "./project-list-empty";

type ProjectListSectionProps = {
  searchParams: Promise<{ search?: string }>;
};

export async function ProjectListSection({
  searchParams,
}: ProjectListSectionProps) {
  const { data: projects } = await getAllProjects();
  const allProjects = projects ?? [];

  const { search } = await searchParams;

  const filteredProjects = search
    ? allProjects.filter(
        (p) =>
          p.name.toLowerCase().includes(search.toLowerCase()) ||
          p.description?.toLowerCase().includes(search.toLowerCase()),
      )
    : allProjects;

  if (allProjects.length === 0) {
    return (
      <ProjectListEmpty
        showCreateButton
        title="No projects yet"
        description="Create your first project to start designing system architectures."
      />
    );
  }

  if (filteredProjects.length === 0) {
    return (
      <ProjectListEmpty
        title="No results found"
        description={`No projects match "${search}". Try a different search term.`}
      />
    );
  }

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {filteredProjects.map((project) => (
        <ProjectCardWrapper key={project.id} project={project} />
      ))}
    </div>
  );
}
