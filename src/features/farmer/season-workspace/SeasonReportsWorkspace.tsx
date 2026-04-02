import { AlertCircle, BarChart3, Wheat } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useAllFarmerHarvests } from "@/entities/harvest";
import { useSeasonById } from "@/entities/season";
import { Reports } from "@/features/farmer/reports";

const computeHarvestProgressPercent = (
  expectedYieldKg: number,
  totalHarvestedKg: number,
  harvestCount: number,
  seasonStatus?: string
) => {
  if (expectedYieldKg > 0) {
    return Math.min(100, Math.round((totalHarvestedKg / expectedYieldKg) * 100));
  }

  if (harvestCount === 0) {
    return 0;
  }

  return seasonStatus === "COMPLETED" || seasonStatus === "ARCHIVED" ? 100 : 50;
};

export function SeasonReportsWorkspace() {
  const { seasonId } = useParams();
  const navigate = useNavigate();
  const seasonIdNumber = Number(seasonId);
  const hasValidSeasonId = Number.isFinite(seasonIdNumber) && seasonIdNumber > 0;

  const { data: season, isLoading: isSeasonLoading } = useSeasonById(seasonIdNumber, {
    enabled: hasValidSeasonId,
  });
  const { data: harvestData, isLoading: isHarvestLoading } = useAllFarmerHarvests(
    {
      seasonId: seasonIdNumber,
      page: 0,
      size: 200,
    },
    { enabled: hasValidSeasonId }
  );

  if (!hasValidSeasonId) {
    return (
      <div className="p-6">
        <Card className="border border-destructive/20 bg-destructive/5">
          <CardContent className="p-6 space-y-2">
            <div className="flex items-center gap-2 text-destructive">
              <AlertCircle className="w-4 h-4" />
              <p className="text-sm">Mùa vụ không hợp lệ.</p>
            </div>
            <Button variant="outline" onClick={() => navigate("/farmer/seasons")}>
              Quay lại danh sách mùa vụ
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (isSeasonLoading || isHarvestLoading) {
    return (
      <div className="p-6">
        <Card>
          <CardContent className="p-6 text-sm text-muted-foreground">Đang tải dữ liệu báo cáo...</CardContent>
        </Card>
      </div>
    );
  }

  if (!season) {
    return (
      <div className="p-6">
        <Card className="border border-destructive/20 bg-destructive/5">
          <CardContent className="p-6">
            <p className="text-sm text-destructive">Không tìm thấy mùa vụ.</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  const harvestBatches = harvestData?.items ?? [];
  const harvestCount = harvestData?.totalElements ?? harvestBatches.length;
  const totalHarvestedKg = harvestBatches.reduce((sum, item) => sum + (item.quantity ?? 0), 0);
  const expectedYieldKg = season.expectedYieldKg ?? 0;
  const harvestProgressPercent = computeHarvestProgressPercent(
    expectedYieldKg,
    totalHarvestedKg,
    harvestCount,
    season.status
  );
  const canAccessReport = harvestProgressPercent >= 100;

  if (!canAccessReport) {
    return (
      <div className="p-6">
        <Card className="border border-amber-300 bg-amber-50">
          <CardContent className="p-6 space-y-3">
            <div className="flex items-center gap-2 text-amber-700">
              <Wheat className="w-5 h-5" />
              <p className="text-sm">
                Báo cáo chỉ khả dụng khi mùa vụ đã thu hoạch xong 100%. Hiện tại tiến độ là{" "}
                <span className="font-semibold">{harvestProgressPercent}%</span>.
              </p>
            </div>
            <div className="flex gap-2">
              <Button
                variant="outline"
                onClick={() => navigate(`/farmer/seasons/${seasonIdNumber}/workspace/harvest`)}
              >
                Đi tới Thu hoạch
              </Button>
              <Button onClick={() => navigate(`/farmer/seasons/${seasonIdNumber}/workspace`)}>
                <BarChart3 className="w-4 h-4 mr-2" />
                Về tổng quan workspace
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return <Reports workspaceSeasonId={seasonIdNumber} workspaceSeasonName={season.seasonName} />;
}
