import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { useI18n } from "@/hooks/useI18n";
import type { AdminAlert } from "@/services/api.admin";
import { adminAlertApi, adminInventoryApi } from "@/services/api.admin";
import { usePreferences } from "@/shared/contexts";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { AlertCircle, RefreshCw, Send, ShieldAlert } from "lucide-react";
import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";

const WINDOW_OPTIONS = [7, 14, 30, 60, 90];

const parseNumber = (value: string) => {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : undefined;
};

const formatDate = (value: string | null | undefined, locale: string) => {
  if (!value) return "-";
  try {
    return new Date(value).toLocaleDateString(locale);
  } catch {
    return value;
  }
};

export function AdminAlertsPage() {
  const navigate = useNavigate();
  const { preferences } = usePreferences();
  const { t } = useI18n();
  const queryClient = useQueryClient();
  const [page, setPage] = useState(0);
  const [windowDays, setWindowDays] = useState(30);
  const [type, setType] = useState("ALL");
  const [severity, setSeverity] = useState("ALL");
  const [status, setStatus] = useState("ALL");
  const [farmId, setFarmId] = useState<number | null>(null);
  const [detailOpen, setDetailOpen] = useState(false);
  const [selectedAlert, setSelectedAlert] = useState<AdminAlert | null>(null);
  const [recipientMode, setRecipientMode] = useState<
    "ALL_FARMERS_IN_FARM" | "SELECTED"
  >("ALL_FARMERS_IN_FARM");
  const [recipientInput, setRecipientInput] = useState("");

  const TYPE_OPTIONS = useMemo(() => [
    { value: "ALL", label: t('admin.alerts.types.all') },
    { value: "INVENTORY_EXPIRED", label: t('admin.alerts.types.inventoryExpired') },
    { value: "INVENTORY_EXPIRING", label: t('admin.alerts.types.inventoryExpiring') },
  ], [t]);

  const SEVERITY_OPTIONS = useMemo(() => [
    { value: "ALL", label: t('admin.alerts.severity.all') },
    { value: "LOW", label: t('admin.alerts.severity.low') },
    { value: "MEDIUM", label: t('admin.alerts.severity.medium') },
    { value: "HIGH", label: t('admin.alerts.severity.high') },
    { value: "CRITICAL", label: t('admin.alerts.severity.critical') },
  ], [t]);

  const STATUS_OPTIONS = useMemo(() => [
    { value: "ALL", label: t('admin.alerts.status.all') },
    { value: "NEW", label: t('admin.alerts.status.new') },
    { value: "SENT", label: t('admin.alerts.status.sent') },
    { value: "DISMISSED", label: t('admin.alerts.status.dismissed') },
  ], [t]);

  const optionsQuery = useQuery({
    queryKey: ["adminAlerts", "options"],
    queryFn: () => adminInventoryApi.getOptions(),
  });

  const alertsQuery = useQuery({
    queryKey: [
      "adminAlerts",
      "list",
      type,
      severity,
      status,
      farmId,
      windowDays,
      page,
    ],
    queryFn: () =>
      adminAlertApi.list({
        type: type === "ALL" ? undefined : type,
        severity: severity === "ALL" ? undefined : severity,
        status: status === "ALL" ? undefined : status,
        farmId: farmId ?? undefined,
        windowDays,
        page,
        limit: 20,
      }),
  });

  const refreshMutation = useMutation({
    mutationFn: () => adminAlertApi.refresh({ windowDays }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["adminAlerts", "list"] });
    },
  });

  const sendMutation = useMutation({
    mutationFn: ({
      id,
      payload,
    }: {
      id: number;
      payload: Parameters<typeof adminAlertApi.send>[1];
    }) => adminAlertApi.send(id, payload),
    onSuccess: (updatedAlert) => {
      queryClient.setQueryData(
        [
          "adminAlerts",
          "list",
          type,
          severity,
          status,
          farmId,
          windowDays,
          page,
        ],
        (oldData: any) => {
          if (!oldData) return oldData;
          return {
            ...oldData,
            items: oldData.items.map((item: AdminAlert) =>
              item.id === updatedAlert.id ? updatedAlert : item,
            ),
          };
        },
      );
      setSelectedAlert(updatedAlert);
    },
  });

  const dismissMutation = useMutation({
    mutationFn: (id: number) => adminAlertApi.updateStatus(id, "DISMISSED"),
    onSuccess: (updatedAlert) => {
      queryClient.invalidateQueries({ queryKey: ["adminAlerts", "list"] });
      if (selectedAlert?.id === updatedAlert.id) {
        setSelectedAlert(updatedAlert);
      }
    },
  });

  const formatNumber = useMemo(
    () => (value: number) =>
      new Intl.NumberFormat(preferences.locale).format(value),
    [preferences.locale],
  );

  const renderSeverityBadge = (value?: string | null) => {
    switch (value) {
      case "CRITICAL":
        return <Badge variant="destructive">{t('admin.alerts.severity.critical')}</Badge>;
      case "HIGH":
        return <Badge variant="destructive">{t('admin.alerts.severity.high')}</Badge>;
      case "MEDIUM":
        return <Badge variant="warning">{t('admin.alerts.severity.medium')}</Badge>;
      case "LOW":
        return <Badge variant="secondary">{t('admin.alerts.severity.low')}</Badge>;
      default:
        return <Badge variant="outline">-</Badge>;
    }
  };

  const renderStatusBadge = (value?: string | null) => {
    switch (value) {
      case "NEW":
        return <Badge variant="outline">{t('admin.alerts.status.new')}</Badge>;
      case "SENT":
        return <Badge variant="success">{t('admin.alerts.status.sent')}</Badge>;
      case "DISMISSED":
        return <Badge variant="secondary">{t('admin.alerts.status.dismissed')}</Badge>;
      default:
        return <Badge variant="outline">-</Badge>;
    }
  };

  const openDetail = (alert: AdminAlert) => {
    setSelectedAlert(alert);
    setDetailOpen(true);
  };

  const handleSend = () => {
    if (!selectedAlert) return;
    const recipientIds =
      recipientMode === "SELECTED"
        ? recipientInput
            .split(",")
            .map((value) => parseNumber(value.trim()))
            .filter((value): value is number => value !== undefined)
        : undefined;

    sendMutation.mutate({
      id: selectedAlert.id,
      payload: {
        channel: "IN_APP",
        recipientMode,
        recipientFarmerIds: recipientIds,
      },
    });
  };

  return (
    <div className="p-6 max-w-[1500px] mx-auto space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl font-bold mb-1">
          <b>{t('admin.alerts.title')}</b>
        </h1>
        <p className="text-muted-foreground">
          {t('admin.alerts.subtitle')}
        </p>
      </div>

      <Card className="border-0 shadow-sm">
        <CardHeader className="space-y-3">
          <div className="flex flex-wrap items-center gap-3 justify-between">
            <div className="flex flex-wrap items-center gap-3">
              <Select
                value={String(windowDays)}
                onValueChange={(value) => setWindowDays(Number(value))}
              >
                <SelectTrigger className="h-9 w-[120px]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {WINDOW_OPTIONS.map((option) => (
                    <SelectItem key={option} value={String(option)}>
                      {option} {t('admin.alerts.days')}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Button
                variant="outline"
                size="sm"
                onClick={() => refreshMutation.mutate()}
                disabled={refreshMutation.isPending}
              >
                {refreshMutation.isPending ? (
                  <RefreshCw className="h-4 w-4 animate-spin" />
                ) : (
                  <RefreshCw className="h-4 w-4" />
                )}
                <span className="ml-2">{t('admin.alerts.refreshRisks')}</span>
              </Button>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <Select value={type} onValueChange={setType}>
              <SelectTrigger className="h-9 w-[200px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {TYPE_OPTIONS.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={severity} onValueChange={setSeverity}>
              <SelectTrigger className="h-9 w-[160px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {SEVERITY_OPTIONS.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={status} onValueChange={setStatus}>
              <SelectTrigger className="h-9 w-[160px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {STATUS_OPTIONS.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select
              value={farmId?.toString() ?? "all"}
              onValueChange={(value) =>
                setFarmId(value === "all" ? null : Number(value))
              }
            >
              <SelectTrigger className="h-9 w-[220px]">
                <SelectValue placeholder={t('admin.alerts.farms.all')} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">{t('admin.alerts.farms.all')}</SelectItem>
                {(optionsQuery.data?.farms ?? []).map((farm) => (
                  <SelectItem key={farm.id} value={String(farm.id)}>
                    {farm.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardHeader>
        <CardContent>
          {alertsQuery.isLoading && (
            <div className="space-y-3">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="h-10 w-full rounded-md bg-muted" />
              ))}
            </div>
          )}

          {alertsQuery.isError && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>{t('admin.alerts.error.title')}</AlertTitle>
              <AlertDescription>{alertsQuery.error?.message}</AlertDescription>
            </Alert>
          )}

          {!alertsQuery.isLoading && !alertsQuery.isError && (
            <>
              {alertsQuery.data?.items?.length ? (
                <>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>{t('admin.alerts.table.severity')}</TableHead>
                        <TableHead>{t('admin.alerts.table.farm')}</TableHead>
                        <TableHead>{t('admin.alerts.table.title')}</TableHead>
                        <TableHead>{t('admin.alerts.table.type')}</TableHead>
                        <TableHead>{t('admin.alerts.table.created')}</TableHead>
                        <TableHead>{t('admin.alerts.table.status')}</TableHead>
                        <TableHead className="text-right">{t('admin.alerts.table.actions')}</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {alertsQuery.data.items.map((alertItem) => (
                        <TableRow key={alertItem.id}>
                          <TableCell>
                            {renderSeverityBadge(alertItem.severity)}
                          </TableCell>
                          <TableCell>{alertItem.farmName || "-"}</TableCell>
                          <TableCell className="font-medium">
                            {alertItem.title || "Alert"}
                          </TableCell>
                          <TableCell>{alertItem.type || "-"}</TableCell>
                          <TableCell>
                            {formatDate(
                              alertItem.createdAt,
                              preferences.locale,
                            )}
                          </TableCell>
                          <TableCell>
                            {renderStatusBadge(alertItem.status)}
                          </TableCell>
                          <TableCell className="text-right">
                            <div className="flex justify-end gap-2">
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => openDetail(alertItem)}
                              >
                                {t('admin.alerts.actions.view')}
                              </Button>
                              {alertItem.status !== "DISMISSED" && (
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => {
                                    setSelectedAlert(alertItem);
                                    setDetailOpen(true);
                                  }}
                                >
                                  {t('admin.alerts.actions.send')}
                                </Button>
                              )}
                              {alertItem.status !== "DISMISSED" && (
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() =>
                                    dismissMutation.mutate(alertItem.id)
                                  }
                                  disabled={dismissMutation.isPending}
                                >
                                  {t('admin.alerts.actions.dismiss')}
                                </Button>
                              )}
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                  <div className="flex items-center justify-between mt-4 text-sm text-muted-foreground">
                    <span>
                      {formatNumber(page + 1)} /{" "}
                      {formatNumber(alertsQuery.data.totalPages)}
                    </span>
                    <div className="flex items-center gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        disabled={page === 0}
                        onClick={() => setPage((prev) => Math.max(prev - 1, 0))}
                      >
                        {t('admin.alerts.pagination.previous')}
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        disabled={
                          page >= (alertsQuery.data.totalPages ?? 1) - 1
                        }
                        onClick={() => setPage((prev) => prev + 1)}
                      >
                        {t('admin.alerts.pagination.next')}
                      </Button>
                    </div>
                  </div>
                </>
              ) : (
                <div className="py-10 text-center text-sm text-muted-foreground">
                  {t('admin.alerts.empty')}
                </div>
              )}
            </>
          )}
        </CardContent>
      </Card>

      {detailOpen && selectedAlert && (
        <div
          className="fixed inset-0 z-50 bg-background/80 backdrop-blur-sm cursor-pointer"
          onClick={() => setDetailOpen(false)}
        >
          <div
            className="fixed right-0 top-0 h-full w-full max-w-xl bg-card border-l border-border shadow-lg overflow-auto cursor-default"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="p-6 space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-lg font-semibold">{t('admin.alerts.detail.title')}</h2>
                  <p className="text-sm text-muted-foreground">
                    {selectedAlert.title}
                  </p>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setDetailOpen(false)}
                >
                  X
                </Button>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-xs text-muted-foreground">{t('admin.alerts.detail.severity')}</p>
                  {renderSeverityBadge(selectedAlert.severity)}
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">{t('admin.alerts.detail.status')}</p>
                  {renderStatusBadge(selectedAlert.status)}
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">{t('admin.alerts.detail.farm')}</p>
                  <p className="text-sm font-medium">
                    {selectedAlert.farmName || "-"}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">{t('admin.alerts.detail.created')}</p>
                  <p className="text-sm font-medium">
                    {formatDate(selectedAlert.createdAt, preferences.locale)}
                  </p>
                </div>
              </div>

              <div>
                <p className="text-sm font-semibold mb-2">{t('admin.alerts.detail.message')}</p>
                <p className="text-sm text-muted-foreground whitespace-pre-wrap">
                  {selectedAlert.message || t('admin.alerts.detail.noMessage')}
                </p>
              </div>

              {selectedAlert.suggestedActionUrl && (
                <Button
                  variant="outline"
                  onClick={() =>
                    navigate(selectedAlert.suggestedActionUrl || "")
                  }
                  className="w-full"
                >
                  <ShieldAlert className="h-4 w-4 mr-2" />
                  {t('admin.alerts.detail.viewSuggestedAction')}
                </Button>
              )}

              <div className="border-t border-border pt-4 space-y-3">
                <p className="text-sm font-semibold">{t('admin.alerts.sendWarning.title')}</p>
                <Select
                  value={recipientMode}
                  onValueChange={(value) =>
                    setRecipientMode(
                      value as "ALL_FARMERS_IN_FARM" | "SELECTED",
                    )
                  }
                >
                  <SelectTrigger className="h-9 w-full">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="ALL_FARMERS_IN_FARM">
                      {t('admin.alerts.sendWarning.allFarmersInFarm')}
                    </SelectItem>
                    <SelectItem value="SELECTED">{t('admin.alerts.sendWarning.selectedFarmers')}</SelectItem>
                  </SelectContent>
                </Select>

                {recipientMode === "SELECTED" && (
                  <Input
                    placeholder={t('admin.alerts.sendWarning.farmerIdsPlaceholder')}
                    value={recipientInput}
                    onChange={(event) => setRecipientInput(event.target.value)}
                  />
                )}

                <Button
                  onClick={handleSend}
                  disabled={
                    sendMutation.isPending || selectedAlert.status === "SENT"
                  }
                  className="w-full"
                >
                  <Send className="h-4 w-4 mr-2" />
                  {sendMutation.isPending ? t('admin.alerts.sendWarning.sending') : t('admin.alerts.sendWarning.sendAlert')}
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
