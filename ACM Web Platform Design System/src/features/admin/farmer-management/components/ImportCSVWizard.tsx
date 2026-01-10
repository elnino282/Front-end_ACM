import { Upload, AlertCircle, XCircle, CheckCircle } from 'lucide-react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import { CSVPreviewRow, ValidationError } from '../types';
import { ROLE_BADGE_COLORS, STATUS_BADGE_COLORS } from '../constants';

interface ImportCSVWizardProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    step: number;
    onStepChange: (step: number) => void;
    csvPreview: CSVPreviewRow[];
    validationErrors: ValidationError[];
    onFileUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
    onImportConfirm: () => void;
}

export function ImportCSVWizard({
    open,
    onOpenChange,
    step,
    onStepChange,
    csvPreview,
    validationErrors,
    onFileUpload,
    onImportConfirm,
}: ImportCSVWizardProps) {
    const validEntriesCount = csvPreview.length - validationErrors.length;

    const handleClose = () => {
        onOpenChange(false);
        onStepChange(1);
    };

    return (
        <Dialog open={open} onOpenChange={handleClose}>
            <DialogContent className="max-w-3xl">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2">
                        <Upload className="w-5 h-5" />
                        Import Farmers from CSV
                    </DialogTitle>
                    <DialogDescription>
                        Step {step} of 3: {step === 1 ? 'Upload File' : step === 2 ? 'Review & Validate' : 'Confirm Import'}
                    </DialogDescription>
                </DialogHeader>

                {/* Progress Indicator */}
                <div className="py-4">
                    <Progress value={(step / 3) * 100} className="h-2" />
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
                                id="csv-upload"
                            />
                            <label htmlFor="csv-upload">
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
                                        <li>Columns: name, email, phone, role, status</li>
                                        <li>Role must be: farmer, manager, or owner</li>
                                        <li>Status must be: active, inactive, or locked</li>
                                    </ul>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {step === 2 && (
                    <div className="space-y-4">
                        {validationErrors.length > 0 && (
                            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                                <div className="flex gap-3">
                                    <XCircle className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
                                    <div className="text-sm">
                                        <p className="font-medium text-red-900 mb-2">
                                            {validationErrors.length} Validation Error{validationErrors.length > 1 ? 's' : ''} Found
                                        </p>
                                        <ul className="text-red-800 space-y-1">
                                            {validationErrors.map((err, i) => (
                                                <li key={i}>
                                                    Row {err.row}, {err.field}: {err.message}
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                </div>
                            </div>
                        )}

                        <div className="border rounded-lg overflow-hidden">
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead className="w-12">#</TableHead>
                                        <TableHead>Name</TableHead>
                                        <TableHead>Email</TableHead>
                                        <TableHead>Phone</TableHead>
                                        <TableHead>Role</TableHead>
                                        <TableHead>Status</TableHead>
                                        <TableHead className="w-12"></TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {csvPreview.map((row, index) => {
                                        const hasError = validationErrors.some(err => err.row === index + 1);
                                        return (
                                            <TableRow key={index} className={hasError ? 'bg-red-50' : ''}>
                                                <TableCell>{index + 1}</TableCell>
                                                <TableCell>{row.name}</TableCell>
                                                <TableCell>{row.email}</TableCell>
                                                <TableCell>{row.phone}</TableCell>
                                                <TableCell>
                                                    <Badge variant="secondary" className={ROLE_BADGE_COLORS[row.role]}>
                                                        {row.role}
                                                    </Badge>
                                                </TableCell>
                                                <TableCell>
                                                    <Badge variant="secondary" className={STATUS_BADGE_COLORS[row.status]}>
                                                        {row.status}
                                                    </Badge>
                                                </TableCell>
                                                <TableCell>
                                                    {hasError ? (
                                                        <XCircle className="w-4 h-4 text-red-600" />
                                                    ) : (
                                                        <CheckCircle className="w-4 h-4 text-green-600" />
                                                    )}
                                                </TableCell>
                                            </TableRow>
                                        );
                                    })}
                                </TableBody>
                            </Table>
                        </div>

                        <p className="text-sm text-muted-foreground">
                            {validEntriesCount} valid entries will be imported.
                            Rows with errors will be skipped.
                        </p>
                    </div>
                )}

                <DialogFooter>
                    <Button
                        variant="outline"
                        onClick={() => {
                            if (step > 1) {
                                onStepChange(step - 1);
                            } else {
                                handleClose();
                            }
                        }}
                    >
                        {step === 1 ? 'Cancel' : 'Back'}
                    </Button>
                    {step === 2 && (
                        <Button
                            className="bg-[#2563EB] hover:bg-[#1E40AF]"
                            onClick={onImportConfirm}
                            disabled={validEntriesCount === 0}
                        >
                            Import {validEntriesCount} Farmer{validEntriesCount > 1 ? 's' : ''}
                        </Button>
                    )}
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
