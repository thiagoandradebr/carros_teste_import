import { Badge } from "@/components/ui/badge";
import { StatusConfig } from "@/utils/statusUtils";
import cn from "classnames";

interface StatusBadgeProps {
  status: string;
  config: StatusConfig;
  className?: string;
}

export function StatusBadge({ status, config, className }: StatusBadgeProps) {
  const variant = config[status]?.variant || "outline";
  const label = config[status]?.label || status;

  return (
    <Badge
      variant={variant}
      className={cn("status-badge", className)}
    >
      {label}
    </Badge>
  );
}
