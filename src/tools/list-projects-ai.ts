import { getPreferenceValues } from "@raycast/api";
import { KaneoAPI } from "../api/kaneo";

type Preferences = {
    workspaceId: string;
};

type Input = {
    /**
     * Optional project name used to filter the result.
     */
    search?: string;
};

/**
 * Lists Kaneo projects.
 *
 * Use this tool when the user asks to list, search,
 * or find a Kaneo project.
 */
export default async function listProjectsAI(input: Input = {}) {
    const { workspaceId } =
        getPreferenceValues<Preferences>();

    const api = new KaneoAPI();
    const projects = await api.getProjects(workspaceId);

    const search = input.search?.trim().toLowerCase();

    const filteredProjects = search
        ? projects.filter((project) =>
            project.name.toLowerCase().includes(search),
        )
        : projects;

    return filteredProjects.map((project) => ({
        id: project.id,
        name: project.name,
    }));
}