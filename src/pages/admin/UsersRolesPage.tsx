import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useI18n } from "@/hooks/useI18n";
import {
    adminRoleApi,
    adminUsersApi,
    type AdminUser,
    type Role,
} from "@/services/api.admin";
import {
    AlertCircle,
    AlertTriangle,
    Edit2,
    Lock,
    MoreVertical,
    Plus,
    RefreshCw,
    Search,
    Shield,
    Trash2,
    Unlock,
    UserMinus,
    UserPlus,
    Users,
} from "lucide-react";
import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { toast } from "sonner";
import { RoleFormModal } from "./components/RoleFormModal";
import { UserFormModal } from "./components/UserFormModal";
import { UserWarningModal } from "./components/UserWarningModal";

// Re-export AdminUser as User for local usage
type User = AdminUser;

const STATUS_COLORS: Record<string, string> = {
  ACTIVE:
    "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400",
  LOCKED: "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400",
  INACTIVE: "bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400",
  PENDING:
    "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400",
};

export function UsersRolesPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const { t } = useI18n();
  const [activeTab, setActiveTab] = useState<"users" | "roles">("users");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [users, setUsers] = useState<User[]>([]);
  const [roles, setRoles] = useState<Role[]>([]);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [showUserDetail, setShowUserDetail] = useState(false);
  const [showUserFormModal, setShowUserFormModal] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [showWarningModal, setShowWarningModal] = useState(false);
  const [warningUser, setWarningUser] = useState<User | null>(null);
  const [showRoleFormModal, setShowRoleFormModal] = useState(false);
  const [editingRole, setEditingRole] = useState<Role | null>(null);

  const tabParam = searchParams.get("tab");
  const qParam = searchParams.get("q") ?? "";
  const userIdParam = Number(searchParams.get("userId"));
  const parsedUserId = Number.isFinite(userIdParam) ? userIdParam : null;

  const handleUserFormOpenChange = (open: boolean) => {
    // If the modal was opened via deep-link (?userId=...), clear it so closing stays closed.
    if (!open && searchParams.get("userId")) {
      const next = new URLSearchParams(searchParams);
      next.delete("userId");
      setSearchParams(next, { replace: true });
    }
    setShowUserFormModal(open);
    if (!open) {
      setEditingUser(null);
    }
  };

  const fetchUsers = async (keywordOverride?: string) => {
    setLoading(true);
    setError(null);
    try {
      const keyword = keywordOverride ?? searchTerm;
      const response = await adminUsersApi.list({
        page,
        size: 20,
        keyword: keyword || undefined,
      });
      if (response?.items) {
        setUsers(response.items);
        setTotalPages(response.totalPages || 0);
      }
    } catch (err) {
      setError("Failed to load users");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const fetchRoles = async () => {
    setLoading(true);
    setError(null);
    try {
      const rolesList = await adminRoleApi.list();
      setRoles(rolesList || []);
    } catch (err) {
      setError("Failed to load roles");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (activeTab === "users") {
      fetchUsers();
    } else {
      fetchRoles();
    }
  }, [activeTab, page]);

  useEffect(() => {
    if (tabParam === "users" || tabParam === "roles") {
      setActiveTab(tabParam);
      setPage(0);
    }
  }, [tabParam]);

  useEffect(() => {
    if (qParam === searchTerm || activeTab !== "users") return;
    setSearchTerm(qParam);
    setPage(0);
    fetchUsers(qParam);
  }, [qParam, activeTab, searchTerm]);

  useEffect(() => {
    if (!parsedUserId || activeTab !== "users") return;
    if (editingUser?.id === parsedUserId && showUserFormModal) return;

    const match = users.find((user) => Number(user.id) === parsedUserId);
    if (match) {
      setEditingUser(match);
      setShowUserFormModal(true);
      return;
    }

    adminUsersApi
      .getById(parsedUserId)
      .then((detail) => {
        if (detail) {
          setEditingUser(detail);
          setShowUserFormModal(true);
        }
      })
      .catch(() => {});
  }, [parsedUserId, activeTab, users, editingUser?.id, showUserFormModal]);

  const handleSearch = () => {
    setPage(0);
    fetchUsers();
  };

  const handleViewUser = async (user: User) => {
    setEditingUser(user);
    setShowUserFormModal(true);
  };

  const handleAddUser = () => {
    setEditingUser(null);
    setShowUserFormModal(true);
  };

  const handleUserFormSuccess = () => {
    fetchUsers();
    setEditingUser(null);
  };

  const handleWarningUser = (user: User) => {
    setWarningUser(user);
    setShowWarningModal(true);
  };

  const handleWarningOpenChange = (open: boolean) => {
    setShowWarningModal(open);
    if (!open) {
      setWarningUser(null);
    }
  };

  const handleWarningSuccess = () => {
    fetchUsers();
    setWarningUser(null);
  };

  const handleToggleStatus = async (user: User) => {
    const newStatus = user.status === "ACTIVE" ? "LOCKED" : "ACTIVE";
    try {
      await adminUsersApi.updateStatus(Number(user.id), { status: newStatus });
      toast.success(
        newStatus === "ACTIVE" ? t('admin.users.toast.activated') : t('admin.users.toast.locked'),
      );
      fetchUsers();
    } catch (err) {
      console.error("Failed to update status:", err);
      toast.error(t('admin.users.toast.statusError'));
    }
  };

  const handleDeleteUser = async (user: User) => {
    if (
      !window.confirm(
        t('admin.users.confirm.delete', { username: user.username }),
      )
    ) {
      return;
    }
    try {
      await adminUsersApi.delete(Number(user.id));
      toast.success(t('admin.users.toast.deleteSuccess'));
      fetchUsers();
    } catch (err: any) {
      console.error("Failed to delete user:", err);
      const errorCode = err?.response?.data?.code;
      if (errorCode === "ERR_USER_HAS_ASSOCIATED_DATA") {
        toast.error(t('admin.users.toast.deleteHasData'));
      } else {
        toast.error(t('admin.users.toast.deleteFailed'));
      }
    }
  };

  const handleToggleFarmerRole = async (userId: number, hasRole: boolean) => {
    try {
      const currentRoles = selectedUser?.roles || [];
      let newRoles: string[];

      if (hasRole) {
        newRoles = currentRoles.filter((r) => r !== "FARMER" && r !== "farmer");
      } else {
        newRoles = [...currentRoles, "FARMER"];
      }

      await adminUsersApi.update(userId, { roles: newRoles });

      // Refresh user detail
      const detail = await adminUsersApi.getById(userId);
      setSelectedUser(detail || selectedUser);
      fetchUsers();
      toast.success(t('admin.users.toast.rolesUpdated'));
    } catch (err) {
      console.error("Failed to update roles:", err);
      toast.error(t('admin.users.toast.rolesFailed'));
    }
  };

  const renderUsers = () => (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <input
              type="text"
              placeholder={t('admin.users.searchPlaceholder')}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSearch()}
              className="pl-10 pr-4 py-2 border border-border rounded-lg bg-background text-sm w-64"
            />
          </div>
          <button
            onClick={handleSearch}
            className="inline-flex items-center gap-2 px-3 py-2 border border-border rounded-lg text-sm hover:bg-muted/50"
          >
            <Search className="h-4 w-4" />
            {t('admin.users.searchButton')}
          </button>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={handleAddUser}
            className="inline-flex items-center gap-2 px-3 py-2 bg-primary text-primary-foreground rounded-lg text-sm hover:bg-primary/90"
          >
            <Plus className="h-4 w-4" />
            {t('admin.users.addUser')}
          </button>
          <button
            onClick={fetchUsers}
            className="inline-flex items-center gap-2 px-3 py-2 border border-border rounded-lg text-sm hover:bg-muted/50"
          >
            <RefreshCw className={`h-4 w-4 ${loading ? "animate-spin" : ""}`} />
            {t('admin.users.refresh')}
          </button>
        </div>
      </div>

      <div className="bg-card border border-border rounded-lg overflow-hidden">
        <table className="w-full">
          <thead className="bg-muted/50 border-b border-border">
            <tr>
              <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">
                {t('admin.users.table.username')}
              </th>
              <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">
                {t('admin.users.table.email')}
              </th>
              <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">
                {t('admin.users.table.status')}
              </th>
              <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">
                {t('admin.users.table.roles')}
              </th>
              <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">
                {t('admin.users.table.actions')}
              </th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td
                  colSpan={5}
                  className="px-4 py-8 text-center text-muted-foreground"
                >
                  <RefreshCw className="h-6 w-6 animate-spin mx-auto mb-2" />
                  {t('admin.users.loading')}
                </td>
              </tr>
            ) : error ? (
              <tr>
                <td colSpan={5} className="px-4 py-8 text-center">
                  <div className="flex flex-col items-center gap-2 text-destructive">
                    <AlertCircle className="h-6 w-6" />
                    {error}
                    <button
                      onClick={fetchUsers}
                      className="text-sm text-primary hover:underline"
                    >
                      {t('admin.users.tryAgain')}
                    </button>
                  </div>
                </td>
              </tr>
            ) : users.length === 0 ? (
              <tr>
                <td
                  colSpan={5}
                  className="px-4 py-8 text-center text-muted-foreground"
                >
                  <Users className="h-8 w-8 mx-auto mb-2 opacity-50" />
                  {t('admin.users.noUsers')}
                </td>
              </tr>
            ) : (
              users.map((user) => (
                <tr
                  key={user.id}
                  className="border-b border-border hover:bg-muted/30"
                >
                  <td className="px-4 py-3">
                    <div className="font-medium text-sm">{user.username}</div>
                    {user.fullName && (
                      <div className="text-xs text-muted-foreground">
                        {user.fullName}
                      </div>
                    )}
                  </td>
                  <td className="px-4 py-3 text-sm text-muted-foreground">
                    {user.email || "—"}
                  </td>
                  <td className="px-4 py-3 text-sm">
                    <span
                      className={`inline-flex items-center px-2 py-1 rounded-full text-xs ${
                        STATUS_COLORS[user.status || "ACTIVE"] ||
                        "bg-gray-100 text-gray-800"
                      }`}
                    >
                      {user.status || "ACTIVE"}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-sm">
                    <div className="flex flex-wrap gap-1">
                      {user.roles?.map((role, idx) => (
                        <span
                          key={idx}
                          className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-primary/10 text-primary"
                        >
                          {role}
                        </span>
                      )) || <span className="text-muted-foreground">—</span>}
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <button
                          className="p-2 rounded-lg hover:bg-muted transition-colors focus:outline-none focus:ring-2 focus:ring-primary/20"
                          aria-label="Actions menu"
                        >
                          <MoreVertical className="h-4 w-4 text-muted-foreground" />
                        </button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="w-48">
                        <DropdownMenuItem
                          onClick={() => handleViewUser(user)}
                          className="cursor-pointer"
                        >
                          <Edit2 className="mr-2 h-4 w-4" />
                          {t('admin.users.actions.editUser')}
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => handleWarningUser(user)}
                          className="cursor-pointer"
                        >
                          <AlertTriangle className="mr-2 h-4 w-4 text-amber-500" />
                          {t('admin.users.actions.warningUser')}
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => handleToggleStatus(user)}
                          className="cursor-pointer"
                        >
                          {user.status === "LOCKED" ? (
                            <>
                              <Unlock className="mr-2 h-4 w-4 text-green-500" />
                              {t('admin.users.actions.activateUser')}
                            </>
                          ) : (
                            <>
                              <Lock className="mr-2 h-4 w-4 text-amber-500" />
                              {t('admin.users.actions.lockUser')}
                            </>
                          )}
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                          onClick={() => handleDeleteUser(user)}
                          className="cursor-pointer text-destructive focus:text-destructive"
                        >
                          <Trash2 className="mr-2 h-4 w-4" />
                          {t('admin.users.actions.deleteUser')}
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {totalPages > 1 && (
        <div className="flex items-center justify-between">
          <button
            onClick={() => setPage(Math.max(0, page - 1))}
            disabled={page === 0}
            className="px-3 py-1 border border-border rounded text-sm disabled:opacity-50"
          >
            {t('admin.users.pagination.previous')}
          </button>
          <span className="text-sm text-muted-foreground">
            {t('admin.users.pagination.page', { current: page + 1, total: totalPages })}
          </span>
          <button
            onClick={() => setPage(page + 1)}
            disabled={page >= totalPages - 1}
            className="px-3 py-1 border border-border rounded text-sm disabled:opacity-50"
          >
            {t('admin.users.pagination.next')}
          </button>
        </div>
      )}
    </div>
  );

  // Role CRUD handlers
  const handleAddRole = () => {
    setEditingRole(null);
    setShowRoleFormModal(true);
  };

  const handleEditRole = (role: Role) => {
    setEditingRole(role);
    setShowRoleFormModal(true);
  };

  const handleDeleteRole = async (role: Role) => {
    if (
      !window.confirm(t('admin.roles.confirm.delete', { name: role.name }))
    ) {
      return;
    }
    try {
      await adminRoleApi.delete(role.code || "");
      toast.success(t('admin.roles.toast.deleteSuccess'));
      fetchRoles();
    } catch (err: any) {
      console.error("Failed to delete role:", err);
      const errorCode = err?.response?.data?.code;
      if (errorCode === "ROLE_NOT_FOUND") {
        toast.error(t('admin.roles.toast.deleteNotFound'));
      } else {
        toast.error(t('admin.roles.toast.deleteFailed'));
      }
    }
  };

  const handleRoleFormSuccess = () => {
    fetchRoles();
    setEditingRole(null);
  };

  const renderRoles = () => (
    <div className="space-y-4">
      <div className="flex items-center justify-end gap-2">
        <button
          onClick={handleAddRole}
          className="inline-flex items-center gap-2 px-3 py-2 bg-primary text-primary-foreground rounded-lg text-sm hover:bg-primary/90"
        >
          <Plus className="h-4 w-4" />
          {t('admin.roles.addRole')}
        </button>
        <button
          onClick={fetchRoles}
          className="inline-flex items-center gap-2 px-3 py-2 border border-border rounded-lg text-sm hover:bg-muted/50"
        >
          <RefreshCw className={`h-4 w-4 ${loading ? "animate-spin" : ""}`} />
          {t('admin.roles.refresh')}
        </button>
      </div>

      <div className="bg-card border border-border rounded-lg overflow-hidden">
        <table className="w-full">
          <thead className="bg-muted/50 border-b border-border">
            <tr>
              <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">
                {t('admin.roles.table.code')}
              </th>
              <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">
                {t('admin.roles.table.name')}
              </th>
              <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">
                {t('admin.roles.table.description')}
              </th>
              <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">
                {t('admin.roles.table.actions')}
              </th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td
                  colSpan={4}
                  className="px-4 py-8 text-center text-muted-foreground"
                >
                  <RefreshCw className="h-6 w-6 animate-spin mx-auto mb-2" />
                  {t('admin.roles.loading')}
                </td>
              </tr>
            ) : error ? (
              <tr>
                <td colSpan={4} className="px-4 py-8 text-center">
                  <div className="flex flex-col items-center gap-2 text-destructive">
                    <AlertCircle className="h-6 w-6" />
                    {error}
                    <button
                      onClick={fetchRoles}
                      className="text-sm text-primary hover:underline"
                    >
                      {t('admin.users.tryAgain')}
                    </button>
                  </div>
                </td>
              </tr>
            ) : roles.length === 0 ? (
              <tr>
                <td
                  colSpan={4}
                  className="px-4 py-8 text-center text-muted-foreground"
                >
                  <Shield className="h-8 w-8 mx-auto mb-2 opacity-50" />
                  {t('admin.roles.noRoles')}
                </td>
              </tr>
            ) : (
              roles.map((role, idx) => (
                <tr
                  key={role.id || idx}
                  className="border-b border-border hover:bg-muted/30"
                >
                  <td className="px-4 py-3 text-sm font-medium">{role.code}</td>
                  <td className="px-4 py-3 text-sm">{role.name}</td>
                  <td className="px-4 py-3 text-sm text-muted-foreground">
                    {role.description || "-"}
                  </td>
                  <td className="px-4 py-3">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <button
                          className="p-2 rounded-lg hover:bg-muted transition-colors focus:outline-none focus:ring-2 focus:ring-primary/20"
                          aria-label="Actions menu"
                        >
                          <MoreVertical className="h-4 w-4 text-muted-foreground" />
                        </button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="w-40">
                        <DropdownMenuItem
                          onClick={() => handleEditRole(role)}
                          className="cursor-pointer"
                        >
                          <Edit2 className="mr-2 h-4 w-4" />
                          {t('admin.roles.actions.edit')}
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                          onClick={() => handleDeleteRole(role)}
                          className="cursor-pointer text-destructive focus:text-destructive"
                        >
                          <Trash2 className="mr-2 h-4 w-4" />
                          {t('admin.roles.actions.delete')}
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );

  const userHasFarmerRole = selectedUser?.roles?.some(
    (r) => r === "FARMER" || r === "farmer",
  );

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold mb-1">{t('admin.users.title')}</h1>
        <p className="text-muted-foreground">
          {t('admin.users.subtitle')}
        </p>
      </div>

      {/* Tab Navigation */}
      <div className="flex border-b border-border mb-6">
        <button
          onClick={() => {
            setActiveTab("users");
            setPage(0);
          }}
          className={`px-4 py-2 text-sm font-medium border-b-2 -mb-px ${
            activeTab === "users"
              ? "border-primary text-primary"
              : "border-transparent text-muted-foreground hover:text-foreground"
          }`}
        >
          <Users className="inline-block h-4 w-4 mr-2" />
          {t('admin.users.tabs.users')}
        </button>
        <button
          onClick={() => {
            setActiveTab("roles");
            setPage(0);
          }}
          className={`px-4 py-2 text-sm font-medium border-b-2 -mb-px ${
            activeTab === "roles"
              ? "border-primary text-primary"
              : "border-transparent text-muted-foreground hover:text-foreground"
          }`}
        >
          <Shield className="inline-block h-4 w-4 mr-2" />
          {t('admin.users.tabs.roles')}
        </button>
      </div>

      {/* Tab Content */}
      {activeTab === "users" && renderUsers()}
      {activeTab === "roles" && renderRoles()}

      {/* User Detail Drawer */}
      {showUserDetail && selectedUser && (
        <div className="fixed inset-0 z-50 bg-background/80 backdrop-blur-sm">
          <div className="fixed right-0 top-0 h-full w-full max-w-md bg-card border-l border-border shadow-lg overflow-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-semibold">{t('admin.users.detail.title')}</h2>
                <button
                  onClick={() => setShowUserDetail(false)}
                  className="p-2 hover:bg-muted rounded"
                >
                  ✕
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-muted-foreground">
                    {t('admin.users.detail.username')}
                  </label>
                  <p className="text-sm">{selectedUser.username}</p>
                </div>

                {selectedUser.email && (
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">
                      {t('admin.users.detail.email')}
                    </label>
                    <p className="text-sm">{selectedUser.email}</p>
                  </div>
                )}

                <div>
                  <label className="text-sm font-medium text-muted-foreground">
                    {t('admin.users.detail.status')}
                  </label>
                  <p className="text-sm">
                    <span
                      className={`inline-flex items-center px-2 py-1 rounded-full text-xs ${
                        STATUS_COLORS[selectedUser.status || "ACTIVE"] ||
                        "bg-gray-100 text-gray-800"
                      }`}
                    >
                      {selectedUser.status || "ACTIVE"}
                    </span>
                  </p>
                </div>

                <div>
                  <label className="text-sm font-medium text-muted-foreground">
                    {t('admin.users.detail.roles')}
                  </label>
                  <div className="flex flex-wrap gap-1 mt-1">
                    {selectedUser.roles?.map((role, idx) => (
                      <span
                        key={idx}
                        className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-primary/10 text-primary"
                      >
                        {role}
                      </span>
                    )) || (
                      <span className="text-muted-foreground text-sm">
                        {t('admin.users.detail.noRoles')}
                      </span>
                    )}
                  </div>
                </div>

                {/* Role Management */}
                <div className="pt-4 border-t border-border">
                  <label className="text-sm font-medium text-muted-foreground">
                    {t('admin.users.detail.roleManagement')}
                  </label>
                  <div className="mt-2">
                    <button
                      onClick={() =>
                        handleToggleFarmerRole(
                          Number(selectedUser.id),
                          !!userHasFarmerRole,
                        )
                      }
                      className={`inline-flex items-center gap-2 px-3 py-2 rounded-lg text-sm ${
                        userHasFarmerRole
                          ? "bg-red-100 text-red-800 hover:bg-red-200 dark:bg-red-900/30 dark:text-red-400"
                          : "bg-green-100 text-green-800 hover:bg-green-200 dark:bg-green-900/30 dark:text-green-400"
                      }`}
                    >
                      {userHasFarmerRole ? (
                        <>
                          <UserMinus className="h-4 w-4" />
                          {t('admin.users.detail.removeFarmerRole')}
                        </>
                      ) : (
                        <>
                          <UserPlus className="h-4 w-4" />
                          {t('admin.users.detail.addFarmerRole')}
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* User Form Modal */}
      <UserFormModal
        isOpen={showUserFormModal}
        onOpenChange={handleUserFormOpenChange}
        user={editingUser}
        onSuccess={handleUserFormSuccess}
      />

      {/* User Warning Modal */}
      <UserWarningModal
        isOpen={showWarningModal}
        onOpenChange={handleWarningOpenChange}
        user={warningUser}
        onSuccess={handleWarningSuccess}
      />

      {/* Role Form Modal */}
      <RoleFormModal
        isOpen={showRoleFormModal}
        onOpenChange={setShowRoleFormModal}
        role={editingRole}
        onSuccess={handleRoleFormSuccess}
      />
    </div>
  );
}
