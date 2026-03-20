import { Card, CardContent } from "@/components/ui/card";
import { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface StatCardProps {
  title: string;
  value: string | number;
  change?: string;
  changeType?: "positive" | "negative" | "warning" | "neutral";
  icon: LucideIcon;
  iconColor?: string; 
}

export function StatCard({
  title,
  value,
  change = "",
  changeType = "neutral",
  icon: Icon,
  iconColor,
}: StatCardProps) {
  const changeColor = {
    positive: "text-emerald-600",
    negative: "text-rose-600",
    warning: "text-amber-600",
    neutral: "text-muted-foreground",
  }[changeType];

  return (
    <Card className="border-l-4 border-l-amber-500 shadow-sm hover:shadow-md transition-shadow">
      <CardContent className="p-6 flex justify-between items-start">
        <div>
          <p className="text-sm font-medium text-muted-foreground mb-1">{title}</p>
          <h3 className="text-2xl font-bold tracking-tight mb-1">{value}</h3>
          {change && (
            <p className={cn("text-xs font-medium", changeColor)}>
              {change}
            </p>
          )}
        </div>
        <div className={cn("p-3 rounded-xl", iconColor || "bg-gray-100 text-gray-600")}>
          <Icon className="h-6 w-6" />
        </div>
      </CardContent>
    </Card>
  );
}