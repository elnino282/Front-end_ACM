import { Settings } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import type { SettingsSection } from '../types';
import { SECTION_NAV } from '../constants';

interface SidebarProps {
    activeSection: SettingsSection;
    onSectionChange: (section: SettingsSection) => void;
}

export function Sidebar({ activeSection, onSectionChange }: SidebarProps) {
    return (
        <Card className="lg:col-span-1 h-fit">
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <Settings className="w-5 h-5" />
                    Settings
                </CardTitle>
            </CardHeader>
            <CardContent className="p-0">
                <nav className="space-y-1">
                    {SECTION_NAV.map((section) => {
                        const Icon = section.icon;
                        const isActive = activeSection === section.id;
                        return (
                            <button
                                key={section.id}
                                onClick={() => onSectionChange(section.id)}
                                className={`w-full flex items-center gap-3 px-6 py-3 text-sm transition-colors ${isActive
                                        ? 'bg-[#2563EB] text-white'
                                        : 'hover:bg-muted text-muted-foreground hover:text-foreground'
                                    }`}
                            >
                                <Icon className="w-4 h-4" />
                                <span>{section.label}</span>
                            </button>
                        );
                    })}
                </nav>
            </CardContent>
        </Card>
    );
}
