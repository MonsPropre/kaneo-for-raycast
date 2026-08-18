import { getPreferenceValues } from "@raycast/api";

export type KaneoPreferences = {
    instanceUrl: string;
    apiToken: string;
    workspaceId: string;
    requestTimeout: string;
};

export function getKaneoPreferences(): KaneoPreferences {
    return getPreferenceValues<KaneoPreferences>();
}