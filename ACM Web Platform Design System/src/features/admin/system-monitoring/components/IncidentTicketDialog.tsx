// Create incident ticket dialog

import { AlertTriangle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import type { IncidentForm, AlertSeverity } from '../types';

interface IncidentTicketDialogProps {
    incidentModalOpen: boolean;
    setIncidentModalOpen: (open: boolean) => void;
    incidentForm: IncidentForm;
    setIncidentForm: (form: IncidentForm) => void;
    handleCreateIncident: () => void;
}

export function IncidentTicketDialog({
    incidentModalOpen,
    setIncidentModalOpen,
    incidentForm,
    setIncidentForm,
    handleCreateIncident,
}: IncidentTicketDialogProps) {
    return (
        <Dialog open={incidentModalOpen} onOpenChange={setIncidentModalOpen}>
            <DialogContent className="max-w-2xl">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2">
                        <AlertTriangle className="w-5 h-5" />
                        Create Incident Ticket
                    </DialogTitle>
                    <DialogDescription>
                        Report and track system incidents
                    </DialogDescription>
                </DialogHeader>

                <div className="space-y-6 py-4">
                    <div className="space-y-2">
                        <Label htmlFor="incident-title">Title *</Label>
                        <Input
                            id="incident-title"
                            placeholder="Brief description of the incident"
                            value={incidentForm.title}
                            onChange={(e) => setIncidentForm({ ...incidentForm, title: e.target.value })}
                        />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="incident-description">Description *</Label>
                        <Textarea
                            id="incident-description"
                            placeholder="Detailed description of the incident, steps to reproduce, and impact"
                            value={incidentForm.description}
                            onChange={(e) => setIncidentForm({ ...incidentForm, description: e.target.value })}
                            rows={5}
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="severity">Severity *</Label>
                            <Select
                                value={incidentForm.severity}
                                onValueChange={(v: string) =>
                                    setIncidentForm({ ...incidentForm, severity: v as AlertSeverity })
                                }
                            >
                                <SelectTrigger id="severity">
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="critical">Critical</SelectItem>
                                    <SelectItem value="high">High</SelectItem>
                                    <SelectItem value="medium">Medium</SelectItem>
                                    <SelectItem value="low">Low</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="status">Status *</Label>
                            <Select
                                value={incidentForm.status}
                                onValueChange={(v: string) =>
                                    setIncidentForm({ ...incidentForm, status: v as IncidentForm['status'] })
                                }
                            >
                                <SelectTrigger id="status">
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="open">Open</SelectItem>
                                    <SelectItem value="in-progress">In Progress</SelectItem>
                                    <SelectItem value="resolved">Resolved</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="assigned-to">Assigned To</Label>
                        <Select
                            value={incidentForm.assignedTo}
                            onValueChange={(v: string) => setIncidentForm({ ...incidentForm, assignedTo: v })}
                        >
                            <SelectTrigger id="assigned-to">
                                <SelectValue placeholder="Select team member" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="admin-user">Admin User</SelectItem>
                                <SelectItem value="dev-team">Development Team</SelectItem>
                                <SelectItem value="ops-team">Operations Team</SelectItem>
                                <SelectItem value="security-team">Security Team</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                </div>

                <DialogFooter>
                    <Button variant="outline" onClick={() => setIncidentModalOpen(false)}>
                        Cancel
                    </Button>
                    <Button className="bg-[#2563EB] hover:bg-[#1E40AF]" onClick={handleCreateIncident}>
                        Create Ticket
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
