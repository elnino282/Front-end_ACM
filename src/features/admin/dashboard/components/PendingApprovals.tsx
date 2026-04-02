import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { PendingApproval } from '../types';
import { getPriorityBadge } from '../constants';

interface PendingApprovalsProps {
  approvals: PendingApproval[];
  onReview: (approvalId: number) => void;
}

/**
 * PendingApprovals Component
 * 
 * Displays a list of pending approval items requiring admin attention.
 * Each item shows type, requester, priority badge, and a review action button.
 */
export const PendingApprovals = ({ approvals, onReview }: PendingApprovalsProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Pending Approvals</CardTitle>
        <CardDescription>Items requiring your attention</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {approvals.map((approval) => (
            <div
              key={approval.id}
              className="flex items-center justify-between p-3 rounded-lg border bg-muted/30 hover:bg-muted/50 transition-colors"
            >
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <p className="text-sm truncate">{approval.type}</p>
                  <Badge variant={getPriorityBadge(approval.priority) as any} className="text-xs">
                    {approval.priority}
                  </Badge>
                </div>
                <p className="text-xs text-muted-foreground truncate">
                  {approval.requester}
                </p>
              </div>
              <Button 
                size="sm" 
                variant="outline" 
                className="ml-3"
                onClick={() => onReview(approval.id)}
              >
                Review
              </Button>
            </div>
          ))}
        </div>
        <Button variant="ghost" className="w-full mt-4">
          View All Approvals
        </Button>
      </CardContent>
    </Card>
  );
};

