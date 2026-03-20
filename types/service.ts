export interface Service {
    id: number;
    serviceName: string;
    description: string;
    price: number;
    category: string; // e.g. "Dining", "Wellness", "Transport", "Housekeeping"
    image?: string;
    photo?: string; // Helper in case backend uses this
}
