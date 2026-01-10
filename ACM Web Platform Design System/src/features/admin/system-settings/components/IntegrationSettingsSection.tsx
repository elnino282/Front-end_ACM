import { Save, TestTube2, Eye, EyeOff, Copy, Cloud, DollarSign, Cpu, Zap } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import type { Integration } from '../types';

interface IntegrationSettingsProps {
    integrations: Record<string, Integration>;
    showApiKey: Record<string, boolean>;
    onApiKeyUpdate: (service: string, apiKey: string) => void;
    onToggleApiKeyVisibility: (service: string) => void;
    onTestConnection: (service: string) => void;
    getStatusBadge: (status: string) => string;
}

export function IntegrationSettingsSection({
    integrations,
    showApiKey,
    onApiKeyUpdate,
    onToggleApiKeyVisibility,
    onTestConnection,
    getStatusBadge,
}: IntegrationSettingsProps) {
    const integrationConfigs = [
        { key: 'weather', icon: Cloud, label: 'Weather API' },
        { key: 'market', icon: DollarSign, label: 'Market Price API' },
        { key: 'payment', icon: DollarSign, label: 'Payment Gateway' },
        { key: 'iot', icon: Cpu, label: 'IoT Device Platform' },
        { key: 'ai', icon: Zap, label: 'AI Assistant Service' },
    ];

    return (
        <Card>
            <CardHeader>
                <CardTitle>External Integrations</CardTitle>
                <CardDescription>Manage third-party API connections and services</CardDescription>
            </CardHeader>
            <CardContent>
                <Accordion type="single" collapsible className="w-full">
                    {integrationConfigs.map(({ key, icon: Icon, label }) => {
                        const integration = integrations[key];
                        if (!integration) return null;

                        return (
                            <AccordionItem key={key} value={key}>
                                <AccordionTrigger>
                                    <div className="flex items-center gap-3">
                                        <Icon className="w-5 h-5" />
                                        <span>{label}</span>
                                        <Badge variant="secondary" className={getStatusBadge(integration.status)}>
                                            {integration.status}
                                        </Badge>
                                    </div>
                                </AccordionTrigger>
                                <AccordionContent className="space-y-4 pt-4">
                                    <div className="space-y-2">
                                        <Label htmlFor={`${key}ApiKey`}>API Key</Label>
                                        <div className="flex gap-2">
                                            <Input
                                                id={`${key}ApiKey`}
                                                type={showApiKey[key] ? 'text' : 'password'}
                                                value={integration.apiKey}
                                                placeholder={key === 'payment' ? 'Enter payment gateway API key' : undefined}
                                                onChange={(e) => onApiKeyUpdate(key, e.target.value)}
                                            />
                                            <Button
                                                variant="outline"
                                                size="icon"
                                                onClick={() => onToggleApiKeyVisibility(key)}
                                            >
                                                {showApiKey[key] ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                            </Button>
                                            {key !== 'payment' && (
                                                <Button variant="outline" size="icon">
                                                    <Copy className="w-4 h-4" />
                                                </Button>
                                            )}
                                        </div>
                                    </div>
                                    <div className="flex gap-2">
                                        <Button variant="outline" onClick={() => onTestConnection(label)}>
                                            <TestTube2 className="w-4 h-4 mr-2" />
                                            Test Connection
                                        </Button>
                                        <Button className="bg-[#2563EB] hover:bg-[#1E40AF]">
                                            <Save className="w-4 h-4 mr-2" />
                                            Save
                                        </Button>
                                    </div>
                                </AccordionContent>
                            </AccordionItem>
                        );
                    })}
                </Accordion>
            </CardContent>
        </Card>
    );
}
