import { AlertCircle, Calendar as CalendarIcon } from "lucide-react";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const UPCOMING_PAYABLES: any[] = []; // TODO: Replace with API data when available

export function UpcomingPayables() {
    return (
        <Card className="border-border rounded-2xl shadow-sm">
            <CardHeader className="pb-3">
                <CardTitle className="text-base text-foreground flex items-center gap-2">
                    <AlertCircle className="w-5 h-5 text-destructive" />
                    Upcoming Payables
                </CardTitle>
                <CardDescription className="text-xs text-muted-foreground">
                    <span className="numeric">{UPCOMING_PAYABLES.length}</span> payables
                    due soon
                </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
                {UPCOMING_PAYABLES.map((payable) => (
                    <div
                        key={payable.id}
                        className={`p-3 rounded-xl border-l-4 ${payable.urgency === "high"
                            ? "border-destructive bg-destructive/5"
                            : payable.urgency === "medium"
                                ? "border-accent bg-accent/5"
                                : "border-secondary bg-secondary/5"
                            }`}
                    >
                        <div className="flex items-start justify-between mb-2">
                            <div className="flex-1">
                                <p className="text-sm text-foreground">{payable.vendor}</p>
                                <p className="text-xs text-muted-foreground mt-0.5">
                                    {payable.category}
                                </p>
                            </div>
                            <Badge
                                className={`text-xs ${payable.urgency === "high"
                                    ? "bg-destructive/10 text-destructive border-destructive/20"
                                    : payable.urgency === "medium"
                                        ? "bg-accent/10 text-foreground border-accent/20"
                                        : "bg-secondary/10 text-secondary border-secondary/20"
                                    }`}
                            >
                                {payable.urgency}
                            </Badge>
                        </div>
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-1 text-xs text-muted-foreground">
                                <CalendarIcon className="w-3 h-3" />
                                {new Date(payable.dueDate).toLocaleDateString("en-US", {
                                    month: "short",
                                    day: "numeric",
                                })}
                            </div>
                            <p className="numeric text-foreground">
                                ${payable.amount.toLocaleString()}
                            </p>
                        </div>
                    </div>
                ))}
            </CardContent>
        </Card>
    );
}



