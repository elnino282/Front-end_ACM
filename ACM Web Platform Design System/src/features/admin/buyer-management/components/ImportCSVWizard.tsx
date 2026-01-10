import { Upload, AlertCircle, CheckCircle } from 'lucide-react';
import type { BuyerRole } from '../types';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';

interface ImportCSVWizardProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    step: number;
    onStepChange: (step: number) => void;
    csvPreview: any[];
    onFileUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
    onConfirm: () => void;
    getRoleBadge: (role: BuyerRole) => string;
}

export function ImportCSVWizard({
    open,
    onOpenChange,
    step,
    onStepChange,
    csvPreview,
    onFileUpload,
    onConfirm,
    getRoleBadge,
}: ImportCSVWizardProps) {
    const handleBack = () => {
        if (step > 1) {
            onStepChange(step - 1);
        } else {
            onOpenChange(false);
            onStepChange(1);
        }
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-3xl">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2">
                        <Upload className="w-5 h-5" />
                        Import Buyers from CSV
                    </DialogTitle>
                    <DialogDescription>
                        Step {step} of 2: {step === 1 ? 'Upload File' : 'Review & Confirm'}
                    </DialogDescription>
                </DialogHeader>

                <div className="py-4">
                    <Progress value={(step / 2) * 100} className="h-2" />
                </div>

                {step === 1 && (
                    <div className="space-y-4">
                        <div className="border-2 border-dashed rounded-lg p-8 text-center">
                            <Upload className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
                            <h4 className="mb-2">Upload CSV File</h4>
                            <p className="text-sm text-muted-foreground mb-4">
                                Drag and drop your CSV file here, or click to browse
                            </p>
                            <input
                                type="file"
                                accept=".csv"
                                onChange={onFileUpload}
                                className="hidden"
                                id="csv-upload-buyer"
                            />
                            <label htmlFor="csv-upload-buyer">
                                <Button variant="outline" asChild>
                                    <span>Browse Files</span>
                                </Button>
                            </label>
                        </div>
                        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                            <div className="flex gap-3">
                                <AlertCircle className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
                                <div className="text-sm">
                                    <p className="font-medium text-blue-900 mb-1">CSV Format Requirements:</p>
                                    <ul className="text-blue-800 space-y-1 list-disc list-inside">
                                        <li>Columns: companyName, taxId, contactName, email, phone, role</li>
                                        <li>Role must be: buyer, enterprise, or distributor</li>
                                    </ul>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {step === 2 && (
                    <div className="space-y-4">
                        <div className="border rounded-lg overflow-hidden">
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead className="w-12">#</TableHead>
                                        <TableHead>Company</TableHead>
                                        <TableHead>Tax ID</TableHead>
                                        <TableHead>Contact</TableHead>
                                        <TableHead>Email</TableHead>
                                        <TableHead>Role</TableHead>
                                        <TableHead className="w-12"></TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {csvPreview.map((row, index) => (
                                        <TableRow key={index}>
                                            <TableCell>{index + 1}</TableCell>
                                            <TableCell>{row.companyName}</TableCell>
                                            <TableCell>{row.taxId}</TableCell>
                                            <TableCell>{row.contactName}</TableCell>
                                            <TableCell>{row.email}</TableCell>
                                            <TableCell>
                                                <Badge variant="secondary" className={getRoleBadge(row.role)}>
                                                    {row.role}
                                                </Badge>
                                            </TableCell>
                                            <TableCell>
                                                <CheckCircle className="w-4 h-4 text-green-600" />
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </div>

                        <p className="text-sm text-muted-foreground">
                            {csvPreview.length} valid entries will be imported.
                        </p>
                    </div>
                )}

                <DialogFooter>
                    <Button variant="outline" onClick={handleBack}>
                        {step === 1 ? 'Cancel' : 'Back'}
                    </Button>
                    {step === 2 && (
                        <Button className="bg-[#2563EB] hover:bg-[#1E40AF]" onClick={onConfirm}>
                            Import {csvPreview.length} Buyer{csvPreview.length > 1 ? 's' : ''}
                        </Button>
                    )}
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
