import { useState, useEffect } from 'react';
import { Users, Shield, Search, RefreshCw, AlertCircle, Plus, Edit2, Lock, Unlock, Trash2, UserPlus, UserMinus, MoreVertical } from 'lucide-react';
import { adminUsersApi, adminRoleApi, type Role, type AdminUser } from '@/services/api.admin';
import { toast } from 'sonner';
import { UserFormModal } from './components/UserFormModal';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

// Re-export AdminUser as User for local usage
type User = AdminUser;

const STATUS_COLORS: Record<string, string> = {
  ACTIVE: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400',
  LOCKED: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400',
  INACTIVE: 'bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400',
  PENDING: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400',
};

export function UsersRolesPage() {
  const [activeTab, setActiveTab] = useState<'users' | 'roles'>('users');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [users, setUsers] = useState<User[]>([]);
  const [roles, setRoles] = useState<Role[]>([]);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [showUserDetail, setShowUserDetail] = useState(false);
  const [showUserFormModal, setShowUserFormModal] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);

  const fetchUsers = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await adminUsersApi.list({ page, size: 20, keyword: searchTerm || undefined });
      if (response?.items) {
        setUsers(response.items);
        setTotalPages(response.totalPages || 0);
      }
    } catch (err) {
      setError('Failed to load users');
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
      setError('Failed to load roles');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (activeTab === 'users') {
      fetchUsers();
    } else {
      fetchRoles();
    }
  }, [activeTab, page]);

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

  const handleToggleStatus = async (user: User) => {
    const newStatus = user.status === 'ACTIVE' ? 'LOCKED' : 'ACTIVE';
    try {
      await adminUsersApi.updateStatus(Number(user.id), { status: newStatus });
      toast.success(`User ${newStatus === 'ACTIVE' ? 'activated' : 'locked'} successfully`);
      fetchUsers();
    } catch (err) {
      console.error('Failed to update status:', err);
      toast.error('Failed to update user status');
    }
  };

  const handleDeleteUser = async (user: User) => {
    if (!window.confirm(`Are you sure you want to delete user "${user.username}"?`)) {
      return;
    }
    try {
      await adminUsersApi.delete(Number(user.id));
      toast.success('User deleted successfully');
      fetchUsers();
    } catch (err: any) {
      console.error('Failed to delete user:', err);
      const errorCode = err?.response?.data?.code;
      if (errorCode === 'ERR_USER_HAS_ASSOCIATED_DATA') {
        toast.error('Cannot delete: User has associated farms. Lock the user instead.');
      } else {
        toast.error('Failed to delete user');
      }
    }
  };

  const handleToggleFarmerRole = async (userId: number, hasRole: boolean) => {
    try {
      const currentRoles = selectedUser?.roles || [];
      let newRoles: string[];

      if (hasRole) {
        newRoles = currentRoles.filter(r => r !== 'FARMER' && r !== 'farmer');
      } else {
        newRoles = [...currentRoles, 'FARMER'];
      }

      await adminUsersApi.update(userId, { roles: newRoles });

      // Refresh user detail
      const detail = await adminUsersApi.getById(userId);
      setSelectedUser(detail || selectedUser);
      fetchUsers();
      toast.success('Roles updated successfully');
    } catch (err) {
      console.error('Failed to update roles:', err);
      toast.error('Failed to update roles');
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
              placeholder="Search users..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
              className="pl-10 pr-4 py-2 border border-border rounded-lg bg-background text-sm w-64"
            />
          </div>
          <button
            onClick={handleSearch}
            className="inline-flex items-center gap-2 px-3 py-2 border border-border rounded-lg text-sm hover:bg-muted/50"
          >
            <Search className="h-4 w-4" />
            Search
          </button>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={handleAddUser}
            className="inline-flex items-center gap-2 px-3 py-2 bg-primary text-primary-foreground rounded-lg text-sm hover:bg-primary/90"
          >
            <Plus className="h-4 w-4" />
            Add User
          </button>
          <button
            onClick={fetchUsers}
            className="inline-flex items-center gap-2 px-3 py-2 border border-border rounded-lg text-sm hover:bg-muted/50"
          >
            <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
            Refresh
          </button>
        </div>
      </div>

      <div className="bg-card border border-border rounded-lg overflow-hidden">
        <table className="w-full">
          <thead className="bg-muted/50 border-b border-border">
            <tr>
              <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">Username</th>
              <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">Email</th>
              <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">Status</th>
              <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">Roles</th>
              <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={5} className="px-4 py-8 text-center text-muted-foreground">
                  <RefreshCw className="h-6 w-6 animate-spin mx-auto mb-2" />
                  Loading...
                </td>
              </tr>
            ) : error ? (
              <tr>
                <td colSpan={5} className="px-4 py-8 text-center">
                  <div className="flex flex-col items-center gap-2 text-destructive">
                    <AlertCircle className="h-6 w-6" />
                    {error}
                    <button onClick={fetchUsers} className="text-sm text-primary hover:underline">
                      Try again
                    </button>
                  </div>
                </td>
              </tr>
            ) : users.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-4 py-8 text-center text-muted-foreground">
                  <Users className="h-8 w-8 mx-auto mb-2 opacity-50" />
                  No users found
                </td>
              </tr>
            ) : (
              users.map((user) => (
                <tr key={user.id} className="border-b border-border hover:bg-muted/30">
                  <td className="px-4 py-3">
                    <div className="font-medium text-sm">{user.username}</div>
                    {user.fullName && (
                      <div className="text-xs text-muted-foreground">{user.fullName}</div>
                    )}
                  </td>
                  <td className="px-4 py-3 text-sm text-muted-foreground">
                    {user.email || '—'}
                  </td>
                  <td className="px-4 py-3 text-sm">
                    <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs ${STATUS_COLORS[user.status || 'ACTIVE'] || 'bg-gray-100 text-gray-800'
                      }`}>
                      {user.status || 'ACTIVE'}
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
                          Edit User
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => handleToggleStatus(user)}
                          className="cursor-pointer"
                        >
                          {user.status === 'LOCKED' ? (
                            <>
                              <Unlock className="mr-2 h-4 w-4 text-green-500" />
                              Activate User
                            </>
                          ) : (
                            <>
                              <Lock className="mr-2 h-4 w-4 text-amber-500" />
                              Lock User
                            </>
                          )}
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                          onClick={() => handleDeleteUser(user)}
                          className="cursor-pointer text-destructive focus:text-destructive"
                        >
                          <Trash2 className="mr-2 h-4 w-4" />
                          Delete User
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
            Previous
          </button>
          <span className="text-sm text-muted-foreground">
            Page {page + 1} of {totalPages}
          </span>
          <button
            onClick={() => setPage(page + 1)}
            disabled={page >= totalPages - 1}
            className="px-3 py-1 border border-border rounded text-sm disabled:opacity-50"
          >
            Next
          </button>
        </div>
      )}
    </div>
  );

  const renderRoles = () => (
    <div className="space-y-4">
      <div className="flex items-center justify-end">
        <button
          onClick={fetchRoles}
          className="inline-flex items-center gap-2 px-3 py-2 border border-border rounded-lg text-sm hover:bg-muted/50"
        >
          <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
          Refresh
        </button>
      </div>

      <div className="bg-card border border-border rounded-lg overflow-hidden">
        <table className="w-full">
          <thead className="bg-muted/50 border-b border-border">
            <tr>
              <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">Code</th>
              <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">Name</th>
              <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">Description</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={3} className="px-4 py-8 text-center text-muted-foreground">
                  <RefreshCw className="h-6 w-6 animate-spin mx-auto mb-2" />
                  Loading...
                </td>
              </tr>
            ) : error ? (
              <tr>
                <td colSpan={3} className="px-4 py-8 text-center">
                  <div className="flex flex-col items-center gap-2 text-destructive">
                    <AlertCircle className="h-6 w-6" />
                    {error}
                    <button onClick={fetchRoles} className="text-sm text-primary hover:underline">
                      Try again
                    </button>
                  </div>
                </td>
              </tr>
            ) : roles.length === 0 ? (
              <tr>
                <td colSpan={3} className="px-4 py-8 text-center text-muted-foreground">
                  <Shield className="h-8 w-8 mx-auto mb-2 opacity-50" />
                  No roles found
                </td>
              </tr>
            ) : (
              roles.map((role, idx) => (
                <tr key={role.id || idx} className="border-b border-border hover:bg-muted/30">
                  <td className="px-4 py-3 text-sm font-medium">{role.code}</td>
                  <td className="px-4 py-3 text-sm">{role.name}</td>
                  <td className="px-4 py-3 text-sm text-muted-foreground">{role.description || '-'}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );

  const userHasFarmerRole = selectedUser?.roles?.some(
    r => r === 'FARMER' || r === 'farmer'
  );

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold mb-1">Users & Roles</h1>
        <p className="text-muted-foreground">Manage users and their roles across the system</p>
      </div>

      {/* Tab Navigation */}
      <div className="flex border-b border-border mb-6">
        <button
          onClick={() => { setActiveTab('users'); setPage(0); }}
          className={`px-4 py-2 text-sm font-medium border-b-2 -mb-px ${activeTab === 'users'
            ? 'border-primary text-primary'
            : 'border-transparent text-muted-foreground hover:text-foreground'
            }`}
        >
          <Users className="inline-block h-4 w-4 mr-2" />
          Users
        </button>
        <button
          onClick={() => { setActiveTab('roles'); setPage(0); }}
          className={`px-4 py-2 text-sm font-medium border-b-2 -mb-px ${activeTab === 'roles'
            ? 'border-primary text-primary'
            : 'border-transparent text-muted-foreground hover:text-foreground'
            }`}
        >
          <Shield className="inline-block h-4 w-4 mr-2" />
          Roles
        </button>
      </div>

      {/* Tab Content */}
      {activeTab === 'users' && renderUsers()}
      {activeTab === 'roles' && renderRoles()}

      {/* User Detail Drawer */}
      {showUserDetail && selectedUser && (
        <div className="fixed inset-0 z-50 bg-background/80 backdrop-blur-sm">
          <div className="fixed right-0 top-0 h-full w-full max-w-md bg-card border-l border-border shadow-lg overflow-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-semibold">User Details</h2>
                <button
                  onClick={() => setShowUserDetail(false)}
                  className="p-2 hover:bg-muted rounded"
                >
                  ✕
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Username</label>
                  <p className="text-sm">{selectedUser.username}</p>
                </div>

                {selectedUser.email && (
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Email</label>
                    <p className="text-sm">{selectedUser.email}</p>
                  </div>
                )}

                <div>
                  <label className="text-sm font-medium text-muted-foreground">Status</label>
                  <p className="text-sm">
                    <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs ${STATUS_COLORS[selectedUser.status || 'ACTIVE'] || 'bg-gray-100 text-gray-800'
                      }`}>
                      {selectedUser.status || 'ACTIVE'}
                    </span>
                  </p>
                </div>

                <div>
                  <label className="text-sm font-medium text-muted-foreground">Roles</label>
                  <div className="flex flex-wrap gap-1 mt-1">
                    {selectedUser.roles?.map((role, idx) => (
                      <span
                        key={idx}
                        className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-primary/10 text-primary"
                      >
                        {role}
                      </span>
                    )) || <span className="text-muted-foreground text-sm">No roles assigned</span>}
                  </div>
                </div>

                {/* Role Management */}
                <div className="pt-4 border-t border-border">
                  <label className="text-sm font-medium text-muted-foreground">Role Management</label>
                  <div className="mt-2">
                    <button
                      onClick={() => handleToggleFarmerRole(Number(selectedUser.id), !!userHasFarmerRole)}
                      className={`inline-flex items-center gap-2 px-3 py-2 rounded-lg text-sm ${userHasFarmerRole
                        ? 'bg-red-100 text-red-800 hover:bg-red-200 dark:bg-red-900/30 dark:text-red-400'
                        : 'bg-green-100 text-green-800 hover:bg-green-200 dark:bg-green-900/30 dark:text-green-400'
                        }`}
                    >
                      {userHasFarmerRole ? (
                        <>
                          <UserMinus className="h-4 w-4" />
                          Remove FARMER Role
                        </>
                      ) : (
                        <>
                          <UserPlus className="h-4 w-4" />
                          Add FARMER Role
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
        onOpenChange={setShowUserFormModal}
        user={editingUser}
        onSuccess={handleUserFormSuccess}
      />
    </div>
  );
}
