import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { z } from 'zod';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { useSeasonById } from '@/entities/season';
import {
  useCreateIrrigationWaterAnalysis,
  useSeasonIrrigationWaterAnalyses,
  type IrrigationSourceType,
} from '@/entities/irrigation-water-analysis';
import { AlertCircle, Droplets, Loader2 } from 'lucide-react';
import { toast } from 'sonner';

const IrrigationWaterAnalysisFormSchema = z
  .object({
    sampleDate: z.string().min(1, 'Ngày lấy mẫu là bắt buộc'),
    nitrateMgPerL: z.number().min(0, 'Giá trị phải >= 0').optional(),
    ammoniumMgPerL: z.number().min(0, 'Giá trị phải >= 0').optional(),
    totalNmgPerL: z.number().min(0, 'Giá trị phải >= 0').optional(),
    irrigationVolumeM3: z
      .number({ required_error: 'Thể tích tưới là bắt buộc' })
      .min(0, 'Giá trị phải >= 0'),
    sourceType: z.enum(['user_entered', 'lab_measured', 'external_reference']),
    sourceDocument: z.string().trim().max(255).optional(),
    labReference: z.string().trim().max(255).optional(),
    note: z.string().trim().max(4000).optional(),
  })
  .superRefine((value, ctx) => {
    if (
      value.totalNmgPerL === undefined &&
      value.nitrateMgPerL === undefined &&
      value.ammoniumMgPerL === undefined
    ) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'Cần nhập total N hoặc nitrate/ammonium',
        path: ['totalNmgPerL'],
      });
    }
  });

type IrrigationWaterAnalysisFormValues = z.infer<typeof IrrigationWaterAnalysisFormSchema>;

const SOURCE_OPTIONS: { value: IrrigationSourceType; label: string }[] = [
  { value: 'user_entered', label: 'Người dùng nhập' },
  { value: 'lab_measured', label: 'Đo phòng lab' },
  { value: 'external_reference', label: 'Tham chiếu bên ngoài' },
];

const defaultValues = (): IrrigationWaterAnalysisFormValues => ({
  sampleDate: new Date().toISOString().split('T')[0],
  nitrateMgPerL: undefined,
  ammoniumMgPerL: undefined,
  totalNmgPerL: undefined,
  irrigationVolumeM3: 0,
  sourceType: 'user_entered',
  sourceDocument: '',
  labReference: '',
  note: '',
});

const formatDate = (value?: string | null) => {
  if (!value) {
    return '-';
  }
  const parsed = new Date(`${value}T00:00:00`);
  if (Number.isNaN(parsed.getTime())) {
    return value;
  }
  return parsed.toLocaleDateString('vi-VN');
};

const formatNumber = (value?: number | null, fallback = '-') => {
  if (value === null || value === undefined) {
    return fallback;
  }
  return value.toFixed(4);
};

const labelForSourceType = (value?: string | null) =>
  SOURCE_OPTIONS.find((item) => item.value === value)?.label ?? value ?? 'N/A';

function toNumberOrUndefined(raw: string): number | undefined {
  const parsed = Number.parseFloat(raw);
  return Number.isNaN(parsed) ? undefined : parsed;
}

export function SeasonIrrigationWaterAnalysesWorkspace() {
  const { seasonId } = useParams();
  const navigate = useNavigate();
  const seasonIdNumber = Number(seasonId);
  const hasValidSeasonId = Number.isFinite(seasonIdNumber) && seasonIdNumber > 0;
  const [submitMode, setSubmitMode] = useState<'stay' | 'dashboard'>('stay');

  const form = useForm<IrrigationWaterAnalysisFormValues>({
    resolver: zodResolver(IrrigationWaterAnalysisFormSchema),
    defaultValues: defaultValues(),
  });

  const { data: seasonDetail, isLoading: isSeasonLoading } = useSeasonById(seasonIdNumber, {
    enabled: hasValidSeasonId,
  });

  const { data: analyses, isLoading: isListLoading } = useSeasonIrrigationWaterAnalyses(
    seasonIdNumber,
    undefined,
    { enabled: hasValidSeasonId }
  );

  const createMutation = useCreateIrrigationWaterAnalysis(seasonIdNumber, {
    onSuccess: () => {
      toast.success('Đã lưu irrigation water analysis');
      form.reset({
        ...defaultValues(),
        sourceType: form.getValues('sourceType'),
      });
      if (submitMode === 'dashboard') {
        navigate('/farmer/dashboard');
      }
    },
    onError: (error) => {
      toast.error(error.message || 'Không thể lưu irrigation water analysis');
    },
  });

  const plotId = seasonDetail?.plotId ?? null;
  const records = useMemo(() => analyses ?? [], [analyses]);

  const onSubmit = form.handleSubmit((values) => {
    if (!plotId) {
      toast.error('Mùa vụ chưa gắn plot hợp lệ, chưa thể submit.');
      return;
    }

    createMutation.mutate({
      plotId,
      sampleDate: values.sampleDate,
      nitrateMgPerL: values.nitrateMgPerL,
      ammoniumMgPerL: values.ammoniumMgPerL,
      totalNmgPerL: values.totalNmgPerL,
      irrigationVolumeM3: values.irrigationVolumeM3,
      sourceType: values.sourceType,
      sourceDocument: values.sourceDocument?.trim() || undefined,
      labReference: values.labReference?.trim() || undefined,
      note: values.note?.trim() || undefined,
    });
  });

  if (!hasValidSeasonId) {
    return (
      <Card className="border border-destructive/20 bg-destructive/5">
        <CardContent className="p-6 space-y-3">
          <div className="flex items-start gap-3">
            <AlertCircle className="h-5 w-5 text-destructive mt-0.5" />
            <div className="space-y-2">
              <p className="text-sm text-foreground">Mùa vụ không hợp lệ.</p>
              <Button variant="outline" onClick={() => navigate('/farmer/seasons')}>
                Quay lại danh sách mùa vụ
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <Card className="border border-border rounded-2xl shadow-sm">
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <Droplets className="w-5 h-5 text-primary" />
            Irrigation Water Analysis
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {isSeasonLoading ? (
            <div className="text-sm text-muted-foreground flex items-center gap-2">
              <Loader2 className="w-4 h-4 animate-spin" />
              Đang tải thông tin mùa vụ...
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <div className="rounded-xl border border-border p-3 bg-card">
                <p className="text-xs text-muted-foreground mb-1">Mùa vụ</p>
                <p className="text-sm text-foreground">{seasonDetail?.seasonName ?? '-'}</p>
              </div>
              <div className="rounded-xl border border-border p-3 bg-card">
                <p className="text-xs text-muted-foreground mb-1">Thửa đất</p>
                <p className="text-sm text-foreground">{seasonDetail?.plotName ?? '-'}</p>
              </div>
              <div className="rounded-xl border border-border p-3 bg-card">
                <p className="text-xs text-muted-foreground mb-1">Crop</p>
                <p className="text-sm text-foreground">{seasonDetail?.cropName ?? '-'}</p>
              </div>
            </div>
          )}

          {!plotId && !isSeasonLoading && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Thiếu liên kết thửa đất</AlertTitle>
              <AlertDescription>
                Mùa vụ này chưa có plotId, chưa thể submit irrigation water analysis.
              </AlertDescription>
            </Alert>
          )}

          <Form {...form}>
            <form onSubmit={onSubmit} className="space-y-4" data-testid="irrigation-analysis-form">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="sampleDate"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Ngày lấy mẫu *</FormLabel>
                      <FormControl>
                        <Input
                          type="date"
                          data-testid="irrigation-sample-date-input"
                          value={field.value}
                          onChange={field.onChange}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="sourceType"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Nguồn dữ liệu *</FormLabel>
                      <Select value={field.value} onValueChange={field.onChange}>
                        <FormControl>
                          <SelectTrigger className="rounded-xl border-border">
                            <SelectValue placeholder="Chọn nguồn dữ liệu" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {SOURCE_OPTIONS.map((item) => (
                            <SelectItem key={item.value} value={item.value}>
                              {item.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="nitrateMgPerL"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Nitrate (mg N/L)</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          step="0.0001"
                          min="0"
                          data-testid="irrigation-nitrate-input"
                          value={field.value ?? ''}
                          onChange={(event) => field.onChange(toNumberOrUndefined(event.target.value))}
                          placeholder="Ví dụ: 4.2"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="ammoniumMgPerL"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Ammonium (mg N/L)</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          step="0.0001"
                          min="0"
                          data-testid="irrigation-ammonium-input"
                          value={field.value ?? ''}
                          onChange={(event) => field.onChange(toNumberOrUndefined(event.target.value))}
                          placeholder="Ví dụ: 1.8"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="totalNmgPerL"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Total N (mg N/L)</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          step="0.0001"
                          min="0"
                          data-testid="irrigation-total-n-input"
                          value={field.value ?? ''}
                          onChange={(event) => field.onChange(toNumberOrUndefined(event.target.value))}
                          placeholder="Nếu có total N thì ưu tiên sử dụng"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="irrigationVolumeM3"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Thể tích tưới (m3) *</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          step="0.0001"
                          min="0"
                          data-testid="irrigation-volume-input"
                          value={Number.isFinite(field.value) ? field.value : ''}
                          onChange={(event) => {
                            const nextValue = Number.parseFloat(event.target.value);
                            field.onChange(Number.isNaN(nextValue) ? undefined : nextValue);
                          }}
                          placeholder="Ví dụ: 500"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="sourceDocument"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Tài liệu tham chiếu</FormLabel>
                      <FormControl>
                        <Input
                          value={field.value ?? ''}
                          onChange={field.onChange}
                          placeholder="Ví dụ: water-lab-report.pdf"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="labReference"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Lab reference</FormLabel>
                      <FormControl>
                        <Input value={field.value ?? ''} onChange={field.onChange} placeholder="LAB-IRR-101" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="note"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Ghi chú</FormLabel>
                    <FormControl>
                      <Textarea
                        rows={3}
                        value={field.value ?? ''}
                        onChange={field.onChange}
                        placeholder="Mô tả bổ sung điều kiện lấy mẫu..."
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="flex flex-wrap gap-2">
                <Button
                  type="submit"
                  data-testid="submit-irrigation-analysis"
                  disabled={createMutation.isPending || !plotId}
                  onClick={() => setSubmitMode('stay')}
                >
                  {createMutation.isPending && submitMode === 'stay' ? (
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  ) : null}
                  Lưu irrigation analysis
                </Button>
                <Button
                  type="submit"
                  data-testid="submit-irrigation-analysis-dashboard"
                  variant="outline"
                  disabled={createMutation.isPending || !plotId}
                  onClick={() => setSubmitMode('dashboard')}
                >
                  {createMutation.isPending && submitMode === 'dashboard' ? (
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  ) : null}
                  Lưu và mở Dashboard
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>

      <Card className="border border-border rounded-2xl shadow-sm">
        <CardHeader>
          <CardTitle className="text-base">Danh sách irrigation water analyses</CardTitle>
        </CardHeader>
        <CardContent>
          {isListLoading ? (
            <div className="text-sm text-muted-foreground flex items-center gap-2">
              <Loader2 className="w-4 h-4 animate-spin" />
              Đang tải danh sách irrigation analyses...
            </div>
          ) : records.length === 0 ? (
            <p className="text-sm text-muted-foreground">Chưa có bản ghi irrigation water analysis cho mùa vụ này.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border text-muted-foreground">
                    <th className="text-left font-medium py-2 pr-3">Ngày</th>
                    <th className="text-left font-medium py-2 pr-3">Effective N (mg/L)</th>
                    <th className="text-left font-medium py-2 pr-3">Volume (m3)</th>
                    <th className="text-left font-medium py-2 pr-3">N contribution (kg)</th>
                    <th className="text-left font-medium py-2 pr-3">Nguồn</th>
                    <th className="text-left font-medium py-2 pr-3">Trạng thái</th>
                  </tr>
                </thead>
                <tbody>
                  {records.map((item) => (
                    <tr key={item.id} className="border-b border-border/60">
                      <td className="py-2 pr-3">{formatDate(item.sampleDate)}</td>
                      <td className="py-2 pr-3">{formatNumber(item.effectiveNmgPerL)}</td>
                      <td className="py-2 pr-3">{formatNumber(item.irrigationVolumeM3)}</td>
                      <td className="py-2 pr-3">{formatNumber(item.estimatedNContributionKg)}</td>
                      <td className="py-2 pr-3">{labelForSourceType(item.sourceType)}</td>
                      <td className="py-2 pr-3">
                        <Badge variant={item.status === 'measured' ? 'default' : 'secondary'}>
                          {item.status}
                        </Badge>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
