import { getPreferenceValues } from "@raycast/api";
import { KaneoAPI } from "../api/kaneo";

type Preferences = {
    workspaceId: string;
};

type Input = {
    /**
     * The user's request about Kaneo.
     */
    request: string;
};

function includesAny(value: string, terms: string[]) {
    return terms.some((term) => value.includes(term));
}

function flattenTasks(
    board: Array<{
        project: {
            id: string | number;
            name: string;
        };
        columns: Array<{
            name?: string;
            title?: string;
            tasks?: Array<Record<string, unknown>>;
            cards?: Array<Record<string, unknown>>;
        }>;
    }>,
) {
    return board.flatMap(({ project, columns }) =>
        columns.flatMap((column) => {
            const tasks = column.tasks ?? column.cards ?? [];

            return tasks.map((task) => ({
                ...task,
                projectId: project.id,
                projectName: project.name,
                columnName: column.name ?? column.title ?? null,
            }));
        }),
    );
}

/**
 * Searches Kaneo projects, tasks, and notifications.
 */
export default async function kaneoAI(input: Input) {
    if (!input.request?.trim()) {
        throw new Error("The request cannot be empty.");
    }

    const { workspaceId } =
        getPreferenceValues<Preferences>();

    const request = input.request.toLowerCase();

    const wantsProjects = includesAny(request, [
        "project",
        "projects",
        "projet",
        "projets",
    ]);

    const wantsTasks = includesAny(request, [
        "task",
        "tasks",
        "tâche",
        "tâches",
    ]);

    const wantsNotifications = includesAny(request, [
        "notification",
        "notifications",
    ]);

    const api = new KaneoAPI();

    const projects =
        wantsProjects || (!wantsTasks && !wantsNotifications)
            ? await api.getProjects(workspaceId)
            : [];

    const board =
        wantsTasks || (!wantsProjects && !wantsNotifications)
            ? await api.getWorkspaceBoard(workspaceId)
            : [];

    const notifications =
        wantsNotifications || (!wantsProjects && !wantsTasks)
            ? await api.getNotifications()
            : [];

    return {
        projects,
        tasks: flattenTasks(board),
        notifications,
    };
}