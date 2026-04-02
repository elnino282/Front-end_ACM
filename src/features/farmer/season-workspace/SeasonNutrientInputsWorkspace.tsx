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
  useCreateNutrientInput,
  useSeasonNutrientInputs,
  type NutrientInputSourceType,
} from '@/entities/nutrient-input';
import { AlertCircle, Beaker, Loader2 } from 'lucide-react';
import { toast } from 'sonner';

const NutrientInputFormSchema = z.object({
  inputSource: z.enum(['MINERAL_FERTILIZER', 'ORGANIC_FERTILIZER']),
  value: z
    .number({ required_error: 'Giá trị đạm là bắt buộc' })
    .min(0, 'Giá trị phải lớn hơn hoặc bằng 0'),
  unit: z.enum(['kg_n', 'kg_n_per_ha']),
  recordedAt: z.string().min(1, 'Ngày ghi nhận là bắt buộc'),
  sourceType: z.enum(['user_entered', 'lab_measured', 'external_reference']),
  sourceDocument: z.string().trim().max(255).optional(),
  note: z.string().trim().max(4000).optional(),
});

type NutrientInputFormValues = z.infer<typeof NutrientInputFormSchema>;

const SOURCE_OPTIONS: { value: NutrientInputSourceType; label: string }[] = [
  { value: 'user_entered', label: 'Người dùng nhập' },
  { value: 'lab_measured', label: 'Đo kiểm phòng lab' },
  { value: 'external_reference', label: 'Tham chiếu bên ngoài' },
];

const INPUT_SOURCE_OPTIONS = [
  { value: 'MINERAL_FERTILIZER', label: 'Phan bon vo co (mineral)' },
  { value: 'ORGANIC_FERTILIZER', label: 'Phan huu co / manure' },
] as const;

const UNIT_OPTIONS = [
  { value: 'kg_n', label: 'kg N / mùa vụ' },
  { value: 'kg_n_per_ha', label: 'kg N / ha' },
] as const;

const defaultFormValues = (): NutrientInputFormValues => ({
  inputSource: 'MINERAL_FERTILIZER',
  value: 0,
  unit: 'kg_n',
  recordedAt: new Date().toISOString().split('T')[0],
  sourceType: 'user_entered',
  sourceDocument: '',
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

const labelForSource = (value: string) =>
  INPUT_SOURCE_OPTIONS.find((item) => item.value === value)?.label ?? value;

const labelForSourceType = (value?: string | null) =>
  SOURCE_OPTIONS.find((item) => item.value === value)?.label ?? value ?? 'N/A';

export function SeasonNutrientInputsWorkspace() {
  const { seasonId } = useParams();
  const navigate = useNavigate();
  const seasonIdNumber = Number(seasonId);
  const hasValidSeasonId = Number.isFinite(seasonIdNumber) && seasonIdNumber > 0;
  const [submitMode, setSubmitMode] = useState<'stay' | 'dashboard'>('stay');

  const form = useForm<NutrientInputFormValues>({
    resolver: zodResolver(NutrientInputFormSchema),
    defaultValues: defaultFormValues(),
  });

  const { data: seasonDetail, isLoading: isSeasonLoading } = useSeasonById(seasonIdNumber, {
    enabled: hasValidSeasonId,
  });

  const { data: nutrientInputs, isLoading: isInputsLoading } = useSeasonNutrientInputs(seasonIdNumber, undefined, {
    enabled: hasValidSeasonId,
  });

  const createMutation = useCreateNutrientInput(seasonIdNumber, {
    onSuccess: () => {
      toast.success('Đã lưu dữ liệu nutrient input');
      form.reset({
        ...defaultFormValues(),
        inputSource: form.getValues('inputSource'),
        unit: form.getValues('unit'),
        sourceType: form.getValues('sourceType'),
      });

      if (submitMode === 'dashboard') {
        navigate('/farmer/dashboard');
      }
    },
    onError: (error) => {
      toast.error(error.message || 'Không thể lưu nutrient input');
    },
  });

  const plotId = seasonDetail?.plotId ?? null;

  const createdRecords = useMemo(() => nutrientInputs ?? [], [nutrientInputs]);

  const onSubmit = form.handleSubmit((values) => {
    if (!plotId) {
      toast.error('Mùa vụ chưa gắn với thửa đất hợp lệ, chưa thể ghi nhận nutrient input.');
      return;
    }

    createMutation.mutate({
      plotId,
      inputSource: values.inputSource,
      value: values.value,
      unit: values.unit,
      recordedAt: values.recordedAt,
      sourceType: values.sourceType,
      sourceDocument: values.sourceDocument?.trim() || undefined,
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
            <Beaker className="w-5 h-5 text-primary" />
            Nhập liệu nutrient inputs
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
                Mùa vụ này chưa có `plotId`, chưa thể submit nutrient input. Vui lòng cập nhật mùa vụ hoặc thửa đất.
              </AlertDescription>
            </Alert>
          )}

          <Form {...form}>
            <form onSubmit={onSubmit} className="space-y-4" data-testid="nutrient-input-form">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="inputSource"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Loại input *</FormLabel>
                      <Select value={field.value} onValueChange={field.onChange}>
                        <FormControl>
                          <SelectTrigger className="rounded-xl border-border">
                            <SelectValue placeholder="Chọn loại input" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {INPUT_SOURCE_OPTIONS.map((item) => (
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
                  name="value"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Giá trị N *</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          step="0.0001"
                          min="0"
                          data-testid="nutrient-value-input"
                          value={Number.isFinite(field.value) ? field.value : ''}
                          onChange={(event) => {
                            const nextValue = Number.parseFloat(event.target.value);
                            field.onChange(Number.isNaN(nextValue) ? undefined : nextValue);
                          }}
                          placeholder="Ví dụ: 24.5"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="unit"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Đơn vị *</FormLabel>
                      <Select value={field.value} onValueChange={field.onChange}>
                        <FormControl>
                          <SelectTrigger className="rounded-xl border-border">
                            <SelectValue placeholder="Chọn đơn vị" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {UNIT_OPTIONS.map((item) => (
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
                  name="recordedAt"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Ngày ghi nhận *</FormLabel>
                      <FormControl>
                        <Input
                          type="date"
                          data-testid="nutrient-recorded-at-input"
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
                  name="sourceDocument"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Tài liệu tham chiếu</FormLabel>
                      <FormControl>
                        <Input
                          value={field.value ?? ''}
                          onChange={field.onChange}
                          placeholder="Ví dụ: lab-report-2026-03-11.pdf"
                        />
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
                        placeholder="Mô tả thêm về nguồn hoặc điều kiện đo..."
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="flex flex-wrap gap-2">
                <Button
                  type="submit"
                  data-testid="submit-nutrient-input"
                  disabled={createMutation.isPending || !plotId}
                  onClick={() => setSubmitMode('stay')}
                >
                  {createMutation.isPending && submitMode === 'stay' ? (
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  ) : null}
                  Lưu nutrient input
                </Button>
                <Button
                  type="submit"
                  data-testid="submit-nutrient-input-dashboard"
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
          <CardTitle className="text-base">Danh sách nutrient inputs của mùa vụ</CardTitle>
        </CardHeader>
        <CardContent>
          {isInputsLoading ? (
            <div className="text-sm text-muted-foreground flex items-center gap-2">
              <Loader2 className="w-4 h-4 animate-spin" />
              Đang tải dữ liệu nutrient inputs...
            </div>
          ) : createdRecords.length === 0 ? (
            <p className="text-sm text-muted-foreground">
              Chưa có bản ghi nutrient input nào cho mùa vụ này.
            </p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border text-muted-foreground">
                    <th className="text-left font-medium py-2 pr-3">Ngày</th>
                    <th className="text-left font-medium py-2 pr-3">Loại input</th>
                    <th className="text-left font-medium py-2 pr-3">Giá trị</th>
                    <th className="text-left font-medium py-2 pr-3">Nguồn dữ liệu</th>
                    <th className="text-left font-medium py-2 pr-3">Trạng thái</th>
                  </tr>
                </thead>
                <tbody>
                  {createdRecords.map((item) => (
                    <tr key={item.id} className="border-b border-border/60">
                      <td className="py-2 pr-3">{formatDate(item.recordedAt)}</td>
                      <td className="py-2 pr-3">{labelForSource(item.inputSource)}</td>
                      <td className="py-2 pr-3">
                        {item.value} {item.unit}
                      </td>
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

