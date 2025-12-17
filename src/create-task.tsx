import {
  ActionPanel,
  Action,
  Form,
  getPreferenceValues,
  Icon,
  closeMainWindow,
  PopToRootType,
  showHUD,
} from "@raycast/api";
import { useFetch, useForm } from "@raycast/utils";
import { Project } from "./types";

export default function Command() {
  const { instanceUrl, apiToken, workspaceId } = getPreferenceValues();
  const apiUrl = new URL(instanceUrl);
  apiUrl.pathname = "/api/project";
  apiUrl.searchParams.set("workspaceId", workspaceId);

  const { isLoading, data: projects = [] } = useFetch<Project[]>(apiUrl.toString(), {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiToken}`,
    },
  });

  const { handleSubmit, itemProps } = useForm({
    onSubmit: async (values) => {
      const taskApiUrl = new URL(instanceUrl);
      taskApiUrl.pathname = `/api/task/${values.projectId}`;

      try {
        const response = await fetch(taskApiUrl.toString(), {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${apiToken}`,
          },
          body: JSON.stringify({
            projectId: values.projectId,
            title: values.title,
            description: values.description || "",
            dueDate: values.dueDate || "",
            priority: values.priority || "no-priority",
            status: "to-do",
          }),
        });

        if (!response.ok) {
          const errorData = (await response.json()) as { message: string };
          throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
        }

        await response.json();
        closeMainWindow({ popToRootType: PopToRootType.Immediate });
        showHUD("Task created successfully!");
      } catch (error) {
        closeMainWindow({ popToRootType: PopToRootType.Immediate });
        showHUD(`Failed to create task: ${error instanceof Error ? error.message : "Unknown error"}`);
      }
    },
    validation: {
      title: (value) => {
        if (!value) {
          return "Title is required";
        }
      },
      projectId: (value) => {
        if (!value) {
          return "Project is required";
        }
      },
    },
  });

  return (
    <Form
      isLoading={isLoading}
      actions={
        <ActionPanel>
          <Action.SubmitForm title="Create Task" onSubmit={handleSubmit} />
        </ActionPanel>
      }
    >
      <Form.TextField {...itemProps.title} title="Title" placeholder="Enter task title" />
      <Form.TextArea {...itemProps.description} title="Description" placeholder="Enter task description" />

      <Form.Separator />
      <Form.DatePicker {...itemProps.dueDate} title="Due Date" type={Form.DatePicker.Type.DateTime} />
      <Form.Dropdown {...itemProps.priority} title="Priority">
        <Form.Dropdown.Item value="urgent" title="Urgent" />
        <Form.Dropdown.Item value="high" title="High" />
        <Form.Dropdown.Item value="medium" title="Medium" />
        <Form.Dropdown.Item value="low" title="Low" />
        <Form.Dropdown.Item value="" title="No Priority" />
      </Form.Dropdown>

      {projects && projects.length > 0 ? (
        <Form.Dropdown {...itemProps.projectId} title="Project">
          <Form.Dropdown.Item title="No project" value="" icon={Icon.List} />

          {projects.map((project) => (
            <Form.Dropdown.Item key={project.id} value={project.id.toString()} title={project.name} />
          ))}
        </Form.Dropdown>
      ) : null}
    </Form>
  );
}
