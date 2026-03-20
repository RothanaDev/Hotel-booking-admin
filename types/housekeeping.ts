export type HousekeepingTask = {
  id: number;
  roomId: number;
  assignedToId: number;
  assignedToName?: string;
  taskDate: string; // YYYY-MM-DD
  status: "PENDING" | "IN_PROGRESS" | "DONE";
  remarks?: string | null;
  createdAt?: string;
  updatedAt?: string;
};

export type HousekeepingTaskCreate = {
  roomId: number;
  assignedToId: number;
  taskDate: string;
  status?: "PENDING" | "IN_PROGRESS" | "DONE";
  remarks?: string | null;
};

export type HousekeepingTaskUpdate = {
  assignedToId?: number;
  taskDate?: string;
  status?: "PENDING" | "IN_PROGRESS" | "DONE";
  remarks?: string | null;
};
