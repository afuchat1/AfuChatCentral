import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { queryClient, apiRequest } from "@/lib/queryClient";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { Shield, Users, Flag, Ban, Eye, Check, X, AlertTriangle } from "lucide-react";

interface Report {
  id: number;
  reporterId: string;
  reportedUserId?: string;
  reportedPostId?: number;
  category: string;
  reason: string;
  status: string;
  reviewedBy?: string;
  reviewedAt?: string;
  actionTaken?: string;
  createdAt: string;
  reporter: {
    username: string;
  };
  reportedUser?: {
    username: string;
  };
}

interface UserBan {
  id: number;
  userId: string;
  bannedBy: string;
  reason: string;
  banType: string;
  durationHours?: number;
  expiresAt?: string;
  isActive: boolean;
  createdAt: string;
  user: {
    username: string;
  };
  banner: {
    username: string;
  };
}

interface AdminStats {
  totalUsers: number;
  totalPosts: number;
  pendingReports: number;
  activeBans: number;
  recentActivity: number;
}

export default function AdminPanel() {
  const [selectedReport, setSelectedReport] = useState<Report | null>(null);
  const [banDialogOpen, setBanDialogOpen] = useState(false);
  const [banUserId, setBanUserId] = useState("");
  const [banReason, setBanReason] = useState("");
  const [banType, setBanType] = useState("temporary");
  const [banDuration, setBanDuration] = useState("24");
  const { toast } = useToast();

  // Fetch admin statistics
  const { data: stats } = useQuery<AdminStats>({
    queryKey: ['/api/admin/stats'],
  });

  // Fetch pending reports
  const { data: reports = [], isLoading: reportsLoading } = useQuery<Report[]>({
    queryKey: ['/api/admin/reports'],
  });

  // Fetch active bans
  const { data: bans = [], isLoading: bansLoading } = useQuery<UserBan[]>({
    queryKey: ['/api/admin/bans'],
  });

  // Review report mutation
  const reviewReportMutation = useMutation({
    mutationFn: async ({ reportId, action, actionTaken }: { reportId: number; action: string; actionTaken?: string }) => {
      const response = await fetch(`/api/admin/reports/${reportId}/review`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action, actionTaken }),
      });
      if (!response.ok) throw new Error("Failed to review report");
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/admin/reports'] });
      queryClient.invalidateQueries({ queryKey: ['/api/admin/stats'] });
      toast({ title: "Report reviewed successfully" });
      setSelectedReport(null);
    },
  });

  // Ban user mutation
  const banUserMutation = useMutation({
    mutationFn: async (banData: any) => {
      const response = await fetch("/api/admin/bans", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(banData),
      });
      if (!response.ok) throw new Error("Failed to ban user");
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/admin/bans'] });
      queryClient.invalidateQueries({ queryKey: ['/api/admin/stats'] });
      toast({ title: "User banned successfully" });
      setBanDialogOpen(false);
      setBanUserId("");
      setBanReason("");
    },
  });

  // Unban user mutation
  const unbanUserMutation = useMutation({
    mutationFn: async (banId: number) => {
      const response = await fetch(`/api/admin/bans/${banId}/revoke`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
      });
      if (!response.ok) throw new Error("Failed to revoke ban");
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/admin/bans'] });
      queryClient.invalidateQueries({ queryKey: ['/api/admin/stats'] });
      toast({ title: "Ban revoked successfully" });
    },
  });

  const handleReviewReport = (action: string, actionTaken?: string) => {
    if (!selectedReport) return;
    reviewReportMutation.mutate({
      reportId: selectedReport.id,
      action,
      actionTaken,
    });
  };

  const handleBanUser = () => {
    if (!banUserId || !banReason) return;
    
    const banData = {
      userId: banUserId,
      reason: banReason,
      banType,
      durationHours: banType === "temporary" ? parseInt(banDuration) : undefined,
    };
    
    banUserMutation.mutate(banData);
  };

  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case "pending": return "destructive";
      case "reviewed": return "secondary";
      case "action_taken": return "default";
      case "dismissed": return "outline";
      default: return "secondary";
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case "spam": return <Flag className="h-4 w-4" />;
      case "harassment": return <AlertTriangle className="h-4 w-4" />;
      case "inappropriate_content": return <Eye className="h-4 w-4" />;
      default: return <Flag className="h-4 w-4" />;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Admin Panel</h1>
          <p className="text-muted-foreground">Manage platform moderation and abuse reports</p>
        </div>
        <Shield className="h-8 w-8 text-primary" />
      </div>

      {/* Admin Statistics */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Users</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.totalUsers || 0}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Posts</CardTitle>
            <Eye className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.totalPosts || 0}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending Reports</CardTitle>
            <Flag className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{stats?.pendingReports || 0}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Bans</CardTitle>
            <Ban className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">{stats?.activeBans || 0}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Recent Activity</CardTitle>
            <AlertTriangle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.recentActivity || 0}</div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="reports" className="space-y-4">
        <TabsList>
          <TabsTrigger value="reports">Reports</TabsTrigger>
          <TabsTrigger value="bans">Bans</TabsTrigger>
          <TabsTrigger value="actions">Quick Actions</TabsTrigger>
        </TabsList>

        <TabsContent value="reports" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Abuse Reports</CardTitle>
              <CardDescription>Review and take action on reported content and users</CardDescription>
            </CardHeader>
            <CardContent>
              {reportsLoading ? (
                <div className="flex items-center justify-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                </div>
              ) : (
                <div className="space-y-4">
                  {reports.map((report) => (
                    <div key={report.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex items-start space-x-4">
                        {getCategoryIcon(report.category)}
                        <div className="space-y-1">
                          <div className="flex items-center space-x-2">
                            <h4 className="font-medium">{report.category.replace('_', ' ')}</h4>
                            <Badge variant={getStatusBadgeVariant(report.status)}>
                              {report.status}
                            </Badge>
                          </div>
                          <p className="text-sm text-muted-foreground">{report.reason}</p>
                          <div className="text-xs text-muted-foreground">
                            Reported by @{report.reporter.username} • {new Date(report.createdAt).toLocaleDateString()}
                            {report.reportedUser && ` • Against @${report.reportedUser.username}`}
                          </div>
                        </div>
                      </div>
                      {report.status === "pending" && (
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => setSelectedReport(report)}
                        >
                          Review
                        </Button>
                      )}
                    </div>
                  ))}
                  {reports.length === 0 && (
                    <div className="text-center py-8 text-muted-foreground">
                      No reports to review
                    </div>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="bans" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>User Bans</CardTitle>
              <CardDescription>Manage active and expired user bans</CardDescription>
            </CardHeader>
            <CardContent>
              {bansLoading ? (
                <div className="flex items-center justify-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                </div>
              ) : (
                <div className="space-y-4">
                  {bans.map((ban) => (
                    <div key={ban.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="space-y-1">
                        <div className="flex items-center space-x-2">
                          <h4 className="font-medium">@{ban.user.username}</h4>
                          <Badge variant={ban.isActive ? "destructive" : "outline"}>
                            {ban.isActive ? "Active" : "Expired"}
                          </Badge>
                          <Badge variant="secondary">{ban.banType}</Badge>
                        </div>
                        <p className="text-sm text-muted-foreground">{ban.reason}</p>
                        <div className="text-xs text-muted-foreground">
                          Banned by @{ban.banner.username} • {new Date(ban.createdAt).toLocaleDateString()}
                          {ban.expiresAt && ` • Expires ${new Date(ban.expiresAt).toLocaleDateString()}`}
                        </div>
                      </div>
                      {ban.isActive && (
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => unbanUserMutation.mutate(ban.id)}
                          disabled={unbanUserMutation.isPending}
                        >
                          Revoke Ban
                        </Button>
                      )}
                    </div>
                  ))}
                  {bans.length === 0 && (
                    <div className="text-center py-8 text-muted-foreground">
                      No bans to display
                    </div>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="actions" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
              <CardDescription>Perform common moderation tasks</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Dialog open={banDialogOpen} onOpenChange={setBanDialogOpen}>
                <DialogTrigger asChild>
                  <Button variant="destructive" className="w-full">
                    <Ban className="h-4 w-4 mr-2" />
                    Ban User
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Ban User</DialogTitle>
                    <DialogDescription>
                      Enter the user ID and reason for the ban
                    </DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="userId">User ID</Label>
                      <Input
                        id="userId"
                        value={banUserId}
                        onChange={(e) => setBanUserId(e.target.value)}
                        placeholder="Enter user ID"
                      />
                    </div>
                    <div>
                      <Label htmlFor="reason">Reason</Label>
                      <Textarea
                        id="reason"
                        value={banReason}
                        onChange={(e) => setBanReason(e.target.value)}
                        placeholder="Reason for ban"
                      />
                    </div>
                    <div>
                      <Label htmlFor="banType">Ban Type</Label>
                      <Select value={banType} onValueChange={setBanType}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="temporary">Temporary</SelectItem>
                          <SelectItem value="permanent">Permanent</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    {banType === "temporary" && (
                      <div>
                        <Label htmlFor="duration">Duration (hours)</Label>
                        <Input
                          id="duration"
                          type="number"
                          value={banDuration}
                          onChange={(e) => setBanDuration(e.target.value)}
                          placeholder="24"
                        />
                      </div>
                    )}
                  </div>
                  <DialogFooter>
                    <Button variant="outline" onClick={() => setBanDialogOpen(false)}>
                      Cancel
                    </Button>
                    <Button 
                      variant="destructive" 
                      onClick={handleBanUser}
                      disabled={!banUserId || !banReason || banUserMutation.isPending}
                    >
                      Ban User
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Report Review Dialog */}
      <Dialog open={!!selectedReport} onOpenChange={() => setSelectedReport(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Review Report</DialogTitle>
            <DialogDescription>
              Take action on this abuse report
            </DialogDescription>
          </DialogHeader>
          {selectedReport && (
            <div className="space-y-4">
              <div>
                <h4 className="font-medium">{selectedReport.category.replace('_', ' ')}</h4>
                <p className="text-sm text-muted-foreground mt-1">{selectedReport.reason}</p>
              </div>
              <div className="text-sm">
                <p><strong>Reported by:</strong> @{selectedReport.reporter.username}</p>
                {selectedReport.reportedUser && (
                  <p><strong>Against:</strong> @{selectedReport.reportedUser.username}</p>
                )}
                <p><strong>Date:</strong> {new Date(selectedReport.createdAt).toLocaleDateString()}</p>
              </div>
            </div>
          )}
          <DialogFooter className="flex justify-between">
            <Button 
              variant="outline" 
              onClick={() => handleReviewReport("dismissed")}
              disabled={reviewReportMutation.isPending}
            >
              <X className="h-4 w-4 mr-2" />
              Dismiss
            </Button>
            <div className="space-x-2">
              <Button 
                variant="secondary"
                onClick={() => handleReviewReport("reviewed", "warning_sent")}
                disabled={reviewReportMutation.isPending}
              >
                <AlertTriangle className="h-4 w-4 mr-2" />
                Warning
              </Button>
              <Button 
                variant="destructive"
                onClick={() => handleReviewReport("action_taken", "content_removed")}
                disabled={reviewReportMutation.isPending}
              >
                <Check className="h-4 w-4 mr-2" />
                Remove Content
              </Button>
            </div>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}