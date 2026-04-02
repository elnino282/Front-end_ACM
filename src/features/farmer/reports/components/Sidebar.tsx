import { BarChart3 } from "lucide-react";
import type { ReportSection } from "../types";
import { SIDEBAR_ITEMS } from "../constants";

interface SidebarProps {
    activeSection: ReportSection;
    onSectionChange: (section: ReportSection) => void;
}

export function Sidebar({ activeSection, onSectionChange }: SidebarProps) {
    return (
        <aside className="bg-card border-r border-border min-h-screen sticky top-0 hidden lg:block">
            <div className="p-6">
                <div className="flex items-center gap-3 mb-6">
                    <div
                        className="w-10 h-10 rounded-xl flex items-center justify-center"
                        style={{
                            background: "linear-gradient(to bottom right, var(--primary), var(--chart-4))",
                        }}
                    >
                        <BarChart3 className="w-6 h-6 text-white" />
                    </div>
                    <div>
                        <h2 className="text-lg text-foreground">Reports</h2>
                        <p className="text-xs text-muted-foreground">Analytics</p>
                    </div>
                </div>

                <nav className="space-y-1">
                    {SIDEBAR_ITEMS.map((item) => {
                        const Icon = item.icon;
                        const isActive = activeSection === item.id;
                        return (
                            <button
                                key={item.id}
                                onClick={() => onSectionChange(item.id)}
                                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm transition-all relative ${isActive
                                        ? "bg-primary/10 text-primary"
                                        : "text-muted-foreground hover:bg-muted"
                                    }`}
                            >
                                {isActive && (
                                    <div className="absolute left-0 top-0 bottom-0 w-1 bg-primary rounded-r-full" />
                                )}
                                <Icon className="w-5 h-5" />
                                <span>{item.label}</span>
                            </button>
                        );
                    })}
                </nav>
            </div>
        </aside>
    );
}



