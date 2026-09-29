// Modelo de papelera: grupos y tareas archivadas con metadatos para restaurar.

import type { Group, Task } from "./contracts";

export type TrashedGroup = {
  /** Snapshot del grupo tal como estaba al archivarlo. */
  group: Group;
  /** Snapshot de sus tareas (tasks vive indexado por groupId). */
  tasks: Task[];
  deletedAt: number;
};

export type TrashedTask = {
  task: Task;
  /** Grupo de origen para poder restaurarla en su sitio. */
  groupId: string;
  groupName?: string;
  deletedAt: number;
};

export type TrashState = {
  groups: TrashedGroup[];
  tasks: TrashedTask[];
};

export type TrashAction =
  | { type: "TRASH_GROUP"; payload: { group: Group; tasks: Task[] } }
  | { type: "TRASH_TASK"; payload: { task: Task; groupId: string; groupName?: string } }
  | { type: "RESTORE_GROUP"; payload: { id: string } }
  | { type: "RESTORE_TASK"; payload: { groupId: string; taskId: string } }
  | { type: "RESTORE_ALL_GROUPS" }
  | { type: "RESTORE_ALL_TASKS" }
  | { type: "RESTORE_ALL" }
  | { type: "PURGE_GROUP"; payload: { id: string } }
  | { type: "PURGE_TASK"; payload: { groupId: string; taskId: string } }
  | { type: "EMPTY_TRASH" }
  | { type: "HYDRATE_TRASH"; payload: { trash: TrashState } }
  | { type: "SET_TRASH"; payload: { trash: TrashState } };
