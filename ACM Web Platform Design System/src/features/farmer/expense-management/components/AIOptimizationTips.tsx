import {
    Sparkles,
    TrendingDown,
    AlertTriangle,
    Lightbulb,
} from "lucide-react";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

const AI_TIPS: any[] = []; // TODO: Replace with API data when available

export function AIOptimizationTips() {
    return (
        <Card className="border-secondary rounded-2xl shadow-sm bg-secondary/5">
            <CardHeader className="pb-3">
                <CardTitle className="text-base text-foreground flex items-center gap-2">
                    <Sparkles className="w-5 h-5 text-secondary" />
                    AI Cost Optimization
                </CardTitle>
                <CardDescription className="text-xs text-muted-foreground">
                    Smart insights to reduce costs
                </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
                {AI_TIPS.map((tip) => (
                    <div
                        key={tip.id}
                        className="p-3 rounded-xl bg-card border border-border"
                    >
                        <div className="flex items-start gap-3">
                            <div
                                className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${tip.type === "saving"
                                    ? "bg-primary/10"
                                    : tip.type === "warning"
                                        ? "bg-accent/10"
                                        : "bg-secondary/10"
                                    }`}
                            >
                                {tip.type === "saving" ? (
                                    <TrendingDown className="w-4 h-4 text-primary" />
                                ) : tip.type === "warning" ? (
                                    <AlertTriangle className="w-4 h-4 text-accent" />
                                ) : (
                                    <Lightbulb className="w-4 h-4 text-secondary" />
                                )}
                            </div>
                            <div className="flex-1 min-w-0">
                                <div className="flex items-start justify-between gap-2 mb-1">
                                    <h4 className="text-xs text-foreground">{tip.title}</h4>
                                    {tip.potentialSaving && (
                                        <Badge className="bg-primary/10 text-primary border-primary/20 text-xs numeric flex-shrink-0">
                                            -${tip.potentialSaving}
                                        </Badge>
                                    )}
                                </div>
                                <p className="text-xs text-muted-foreground leading-relaxed">
                                    {tip.description}
                                </p>
                            </div>
                        </div>
                    </div>
                ))}

                <Button
                    variant="outline"
                    className="w-full rounded-xl border-secondary text-secondary hover:bg-secondary/10"
                >
                    View All Insights
                </Button>
            </CardContent>
        </Card>
    );
}



