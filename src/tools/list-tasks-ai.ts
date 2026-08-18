import { getPreferenceValues } from "@raycast/api";
import { KaneoAPI } from "../api/kaneo";
import type { Project, Column } from "../types";

type Preferences = {
    workspaceId: string;
};

type Input = {
    /**
     * Optional text used to search tasks.
     */
    search?: string;

    /**
     * Optional task status filter.
     */
    status?: string;

    /**
     * Optional priority filter.
     */
    priority?: string;
};

type KaneoTask = {
    id?: string | number;
    title?: string;
    name?: string;
    description?: string | null;
    status?: string | null;
    priority?: string | null;
    dueDate?: string | null;
    projectId: string | number;
    projectName: string;
    columnName: string | null;
} & Record<string, any>;

function flattenTasks(
    board: Array<{
        project: Project;
        columns: Column[];
    }>,
): KaneoTask[] {
    return board.flatMap(({ project, columns }) =>
        columns.flatMap((column) => {
            const tasks = column.tasks ?? [];

            return tasks.map((task) => ({
                ...task,
                projectId: project.id,
                projectName: project.name,
                columnName: column.name ?? null,
            }));
        }),
    );
}

/**
 * Lists and filters Kaneo tasks.
 *
 * Use this tool when the user asks about tasks,
 * priorities, statuses, or due dates.
 */
export default async function listTasksAI(input: Input = {}) {
    const { workspaceId } =
        getPreferenceValues<Preferences>();

    const api = new KaneoAPI();

    const board = await api.getWorkspaceBoard(workspaceId);
    const tasks = flattenTasks(board);

    const search = input.search?.trim().toLowerCase();
    const status = input.status?.trim().toLowerCase();
    const priority = input.priority?.trim().toLowerCase();

    return tasks
        .filter((task) => {
            if (!search) {
                return true;
            }

            return [
                task.title,
                task.name,
                task.description,
                task.projectName,
                task.columnName,
            ].some((value) =>
                String(value ?? "").toLowerCase().includes(search),
            );
        })
        .filter((task) => {
            if (!status) {
                return true;
            }

            return String(
                task.status ?? task.columnName ?? "",
            ).toLowerCase() === status;
        })
        .filter((task) => {
            if (!priority) {
                return true;
            }

            return String(task.priority ?? "").toLowerCase() === priority;
        })
        .map((task) => ({
            id: task.id ?? null,
            title: task.title ?? task.name ?? "Untitled task",
            description: task.description ?? null,
            status: task.status ?? null,
            priority: task.priority ?? null,
            dueDate: task.dueDate ?? null,
            projectId: task.projectId,
            projectName: task.projectName,
            columnName: task.columnName,
        }));
}