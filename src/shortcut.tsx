import { Keyboard } from "@raycast/api";

const ChangeStatus: Keyboard.Shortcut = {
  Windows: { modifiers: ["ctrl", "shift"], key: "s" },
  macOS: { modifiers: ["cmd", "shift"], key: "s" },
};

const ChangePriority: Keyboard.Shortcut = {
  Windows: { modifiers: ["ctrl", "shift"], key: "p" },
  macOS: { modifiers: ["cmd", "shift"], key: "p" },
};

const CopyTaskTitle: Keyboard.Shortcut = {
  Windows: { modifiers: ["ctrl", "shift"], key: "t" },
  macOS: { modifiers: ["cmd", "shift"], key: "t" },
};

const CopyTaskDescription: Keyboard.Shortcut = {
  Windows: { modifiers: ["ctrl", "shift"], key: "d" },
  macOS: { modifiers: ["cmd", "shift"], key: "d" },
};

const CopyProjectName: Keyboard.Shortcut = {
  Windows: { modifiers: ["ctrl", "shift"], key: "p" },
  macOS: { modifiers: ["cmd", "shift"], key: "p" },
};

export { ChangeStatus, ChangePriority, CopyTaskTitle, CopyTaskDescription, CopyProjectName };
