export type MaintenanceTicket = {
  id: number;
  roomId: number;
  reportedById: number;
  reportedByName?: string;
  issue: string;
  priority: "LOW" | "MEDIUM" | "HIGH";
  status: "OPEN" | "FIXING" | "RESOLVED";
  openedAt?: string;
  resolvedAt?: string | null;
  createdAt?: string;
  updatedAt?: string;
};

export type MaintenanceTicketCreate = {
  roomId: number;
  reportedById: number;
  issue: string;
  priority?: "LOW" | "MEDIUM" | "HIGH";
};

export type MaintenanceTicketUpdate = {
  issue?: string;
  priority?: "LOW" | "MEDIUM" | "HIGH";
  status?: "OPEN" | "FIXING" | "RESOLVED";
  resolvedAt?: string | null;
};
