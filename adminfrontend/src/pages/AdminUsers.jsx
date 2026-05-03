import { useEffect, useState } from "react";
import api from "../utils/api";
import { toast } from "react-hot-toast";
import {
  Search, UserCheck, UserX, Mail, Phone, Calendar,
  Trash2, Eye, RefreshCw, MapPin, ShoppingBag,
  ChevronLeft, ChevronRight, X, AlertTriangle
} from "lucide-react";

const AdminUsers = () => {
  const [users, setUsers]               = useState([]);
  const [loading, setLoading]           = useState(true);
  const [searchTerm, setSearchTerm]     = useState("");
  const [selectedUser, setSelectedUser] = useState(null);
  const [showUserModal, setShowUserModal]     = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [userToDelete, setUserToDelete]       = useState(null);
  const [deletingId, setDeletingId]           = useState(null);
  const [currentPage, setCurrentPage]   = useState(1);
  const ITEMS_PER_PAGE = 10;

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const response = await api.get("/users");
      const usersData = response.data.users || response.data;
      setUsers(Array.isArray(usersData) ? usersData : []);
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to load users");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchUsers(); }, []);

  const getUserName = (user) => {
    if (user.name?.trim()) return user.name;
    const def = user.addresses?.find(a => a.isDefault) || user.addresses?.[0];
    if (def?.name) return def.name;
    return user.email?.split("@")[0] || "Guest User";
  };

  const getUserPhone = (user) => {
    const def = user.addresses?.find(a => a.isDefault) || user.addresses?.[0];
    return def?.phone || null;
  };

  const getUserInitials = (name) => {
    if (!name || name === "Guest User") return "?";
    return name.split(" ").map(w => w[0]).join("").toUpperCase().slice(0, 2);
  };

  const formatDate = (date) => {
    if (!date) return "N/A";
    return new Date(date).toLocaleDateString("en-IN", {
      day: "numeric", month: "short", year: "numeric",
    });
  };

  const confirmDelete = (user) => {
    setUserToDelete(user);
    setShowDeleteModal(true);
  };

  const handleDeleteUser = async () => {
    if (!userToDelete) return;
    try {
      setDeletingId(userToDelete._id);
      await api.delete(`/users/${userToDelete._id}`);
      toast.success("User deleted");
      setShowDeleteModal(false);
      setUserToDelete(null);
      fetchUsers();
    } catch (error) {
      toast.error(error.response?.data?.message || "Delete failed");
    } finally {
      setDeletingId(null);
    }
  };

  // Filter + paginate
  const filtered = users.filter(user => {
    const q = searchTerm.toLowerCase();
    return (
      getUserName(user).toLowerCase().includes(q) ||
      user.email?.toLowerCase().includes(q) ||
      (getUserPhone(user) || "").includes(q)
    );
  });

  const totalPages     = Math.ceil(filtered.length / ITEMS_PER_PAGE);
  const paginated      = filtered.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE);
  const startIdx       = (currentPage - 1) * ITEMS_PER_PAGE + 1;
  const endIdx         = Math.min(currentPage * ITEMS_PER_PAGE, filtered.length);

  // Reset to page 1 on search
  const handleSearch = (val) => { setSearchTerm(val); setCurrentPage(1); };

  // Page numbers to show
  const getPageNumbers = () => {
    const pages = [];
    const delta = 2;
    for (let i = Math.max(1, currentPage - delta); i <= Math.min(totalPages, currentPage + delta); i++) {
      pages.push(i);
    }
    return pages;
  };

  if (loading) return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-indigo-600 mx-auto" />
        <p className="mt-3 text-sm text-gray-500">Loading users...</p>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 p-4 sm:p-6">
      <div className="max-w-7xl mx-auto space-y-5">

        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">User Management</h1>
            <p className="text-sm text-gray-500 mt-0.5">Manage all registered users</p>
          </div>
          <div className="flex gap-2">
            <button
              onClick={fetchUsers}
              className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-lg text-sm text-gray-600 hover:bg-gray-50 transition"
            >
              <RefreshCw size={15} className={loading ? "animate-spin" : ""} />
              Refresh
            </button>
            <div className="px-4 py-2 bg-white border border-gray-200 rounded-lg text-sm">
              <span className="text-gray-500">Total: </span>
              <span className="font-semibold text-indigo-600">{users.length}</span>
            </div>
          </div>
        </div>

        {/* Search */}
        <div className="bg-white rounded-xl border border-gray-200 p-4">
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
            <input
              type="text"
              placeholder="Search by name, email or phone..."
              value={searchTerm}
              onChange={(e) => handleSearch(e.target.value)}
              className="w-full pl-9 pr-4 py-2.5 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
            {searchTerm && (
              <button onClick={() => handleSearch("")} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                <X size={15} />
              </button>
            )}
          </div>
        </div>

        {/* Table */}
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
          {filtered.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 text-gray-400">
              <UserX size={40} className="mb-3" />
              <p className="text-sm">No users found</p>
            </div>
          ) : (
            <>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-100">
                  <thead className="bg-gray-50">
                    <tr>
                      {["User", "Email", "Phone", "Joined", "Status", "Addresses", "Actions"].map(col => (
                        <th key={col} className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                          {col}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50">
                    {paginated.map((user) => {
                      const name  = getUserName(user);
                      const phone = getUserPhone(user);
                      return (
                        <tr key={user._id} className="hover:bg-gray-50 transition">

                          {/* User */}
                          <td className="px-4 py-3">
                            <div className="flex items-center gap-3">
                              <div className="w-9 h-9 rounded-full bg-gradient-to-r from-indigo-500 to-purple-500 flex items-center justify-center text-white text-sm font-semibold flex-shrink-0">
                                {getUserInitials(name)}
                              </div>
                              <div>
                                <p className="text-sm font-medium text-gray-800">{name}</p>
                                <p className="text-[11px] text-gray-400 font-mono">#{user._id?.slice(-8)}</p>
                              </div>
                            </div>
                          </td>

                          {/* Email */}
                          <td className="px-4 py-3">
                            <div className="flex items-center gap-1.5 text-sm text-gray-600">
                              <Mail size={13} className="text-gray-400 flex-shrink-0" />
                              <span className="truncate max-w-[180px]">{user.email || "—"}</span>
                            </div>
                          </td>

                          {/* Phone */}
                          <td className="px-4 py-3">
                            {phone ? (
                              <div className="flex items-center gap-1.5 text-sm text-gray-600">
                                <Phone size={13} className="text-gray-400 flex-shrink-0" />
                                {phone}
                              </div>
                            ) : (
                              <span className="text-gray-300 text-sm">—</span>
                            )}
                          </td>

                          {/* Joined */}
                          <td className="px-4 py-3">
                            <div className="flex items-center gap-1.5 text-sm text-gray-500">
                              <Calendar size={13} className="text-gray-400 flex-shrink-0" />
                              {formatDate(user.createdAt)}
                            </div>
                          </td>

                          {/* Status */}
                          <td className="px-4 py-3">
                            <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${
                              user.isVerified
                                ? "bg-green-100 text-green-700"
                                : "bg-yellow-100 text-yellow-700"
                            }`}>
                              {user.isVerified ? <UserCheck size={11} /> : <UserX size={11} />}
                              {user.isVerified ? "Verified" : "Unverified"}
                            </span>
                          </td>

                          {/* Addresses */}
                          <td className="px-4 py-3">
                            {user.addresses?.length > 0 ? (
                              <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-700">
                                <MapPin size={11} />
                                {user.addresses.length}
                              </span>
                            ) : (
                              <span className="text-gray-300 text-sm">—</span>
                            )}
                          </td>

                          {/* Actions */}
                          <td className="px-4 py-3">
                            <div className="flex items-center gap-1.5">
                              <button
                                onClick={() => { setSelectedUser(user); setShowUserModal(true); }}
                                className="p-1.5 rounded-md bg-blue-50 text-blue-600 hover:bg-blue-100 transition"
                                title="View"
                              >
                                <Eye size={14} />
                              </button>
                              <button
                                onClick={() => confirmDelete(user)}
                                className="p-1.5 rounded-md bg-red-50 text-red-600 hover:bg-red-100 transition"
                                title="Delete"
                              >
                                <Trash2 size={14} />
                              </button>
                            </div>
                          </td>

                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="flex flex-col sm:flex-row items-center justify-between gap-3 px-4 py-3 border-t border-gray-100 bg-gray-50">
                  <p className="text-xs text-gray-500">
                    Showing <span className="font-medium">{startIdx}</span> to <span className="font-medium">{endIdx}</span> of <span className="font-medium">{filtered.length}</span> users
                  </p>
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => setCurrentPage(p => Math.max(p - 1, 1))}
                      disabled={currentPage === 1}
                      className="p-1.5 rounded-lg border border-gray-200 bg-white text-gray-500 hover:bg-gray-100 disabled:opacity-40 disabled:cursor-not-allowed transition"
                    >
                      <ChevronLeft size={16} />
                    </button>

                    {currentPage > 3 && (
                      <>
                        <button onClick={() => setCurrentPage(1)} className="px-3 py-1.5 rounded-lg text-xs border border-gray-200 bg-white text-gray-600 hover:bg-gray-50">1</button>
                        {currentPage > 4 && <span className="px-1 text-gray-400 text-xs">…</span>}
                      </>
                    )}

                    {getPageNumbers().map(n => (
                      <button
                        key={n}
                        onClick={() => setCurrentPage(n)}
                        className={`px-3 py-1.5 rounded-lg text-xs border transition ${
                          currentPage === n
                            ? "bg-indigo-600 text-white border-indigo-600"
                            : "border-gray-200 bg-white text-gray-600 hover:bg-gray-50"
                        }`}
                      >
                        {n}
                      </button>
                    ))}

                    {currentPage < totalPages - 2 && (
                      <>
                        {currentPage < totalPages - 3 && <span className="px-1 text-gray-400 text-xs">…</span>}
                        <button onClick={() => setCurrentPage(totalPages)} className="px-3 py-1.5 rounded-lg text-xs border border-gray-200 bg-white text-gray-600 hover:bg-gray-50">{totalPages}</button>
                      </>
                    )}

                    <button
                      onClick={() => setCurrentPage(p => Math.min(p + 1, totalPages))}
                      disabled={currentPage === totalPages}
                      className="p-1.5 rounded-lg border border-gray-200 bg-white text-gray-500 hover:bg-gray-100 disabled:opacity-40 disabled:cursor-not-allowed transition"
                    >
                      <ChevronRight size={16} />
                    </button>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteModal && userToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-sm p-6">
            <div className="flex flex-col items-center text-center gap-3">
              <div className="w-14 h-14 rounded-full bg-red-100 flex items-center justify-center">
                <AlertTriangle size={26} className="text-red-600" />
              </div>
              <h2 className="text-base font-semibold text-gray-800">Delete User?</h2>
              <p className="text-sm text-gray-500">
                You're about to permanently delete{" "}
                <span className="font-semibold text-gray-700">{getUserName(userToDelete)}</span>.
                This action cannot be undone.
              </p>
            </div>
            <div className="flex gap-3 mt-6">
              <button
                onClick={() => { setShowDeleteModal(false); setUserToDelete(null); }}
                className="flex-1 px-4 py-2.5 rounded-xl text-sm font-medium text-gray-600 bg-gray-100 hover:bg-gray-200 transition"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteUser}
                disabled={!!deletingId}
                className="flex-1 px-4 py-2.5 rounded-xl text-sm font-medium text-white bg-red-600 hover:bg-red-700 transition disabled:opacity-50"
              >
                {deletingId ? "Deleting..." : "Yes, Delete"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* User Detail Modal */}
      {showUserModal && selectedUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b border-gray-100 px-5 py-4 flex items-center justify-between">
              <h2 className="text-base font-semibold text-gray-800">User Details</h2>
              <button onClick={() => setShowUserModal(false)} className="p-1.5 hover:bg-gray-100 rounded-lg transition">
                <X size={18} />
              </button>
            </div>
            <div className="p-5 space-y-5">

              {/* Avatar + name */}
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-full bg-gradient-to-r from-indigo-500 to-purple-500 flex items-center justify-center text-white text-2xl font-bold">
                  {getUserInitials(getUserName(selectedUser))}
                </div>
                <div>
                  <h3 className="text-lg font-bold text-gray-800">{getUserName(selectedUser)}</h3>
                  <p className="text-sm text-gray-500">{selectedUser.email}</p>
                  <p className="text-xs text-gray-400 font-mono">ID: {selectedUser._id}</p>
                </div>
              </div>

              {/* Info grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <p className="text-xs font-medium text-gray-400 uppercase tracking-wide mb-2">Account Info</p>
                  <div className="bg-gray-50 rounded-xl p-3 space-y-2">
                    {[
                      { label: "Role", val: selectedUser.role || "User" },
                      { label: "Verified", val: selectedUser.isVerified ? "Yes" : "No", cls: selectedUser.isVerified ? "text-green-600" : "text-yellow-600" },
                      { label: "Joined", val: formatDate(selectedUser.createdAt) },
                    ].map(r => (
                      <div key={r.label} className="flex justify-between">
                        <span className="text-xs text-gray-500">{r.label}</span>
                        <span className={`text-xs font-medium capitalize ${r.cls || "text-gray-700"}`}>{r.val}</span>
                      </div>
                    ))}
                  </div>
                </div>
                <div>
                  <p className="text-xs font-medium text-gray-400 uppercase tracking-wide mb-2">Statistics</p>
                  <div className="bg-gray-50 rounded-xl p-3 space-y-2">
                    {[
                      { label: "Total Orders", val: selectedUser.totalOrders || 0 },
                      { label: "Total Spent", val: `₹${(selectedUser.totalSpent || 0).toLocaleString("en-IN")}` },
                      { label: "Addresses", val: selectedUser.addresses?.length || 0 },
                    ].map(r => (
                      <div key={r.label} className="flex justify-between">
                        <span className="text-xs text-gray-500">{r.label}</span>
                        <span className="text-xs font-medium text-gray-700">{r.val}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Addresses */}
              {selectedUser.addresses?.length > 0 && (
                <div>
                  <p className="text-xs font-medium text-gray-400 uppercase tracking-wide mb-2">Saved Addresses</p>
                  <div className="space-y-2">
                    {selectedUser.addresses.map((addr, idx) => (
                      <div key={idx} className="bg-gray-50 rounded-xl p-3">
                        <div className="flex items-center justify-between mb-1">
                          <p className="text-sm font-medium text-gray-800">{addr.fullName}</p>
                          {addr.isDefault && (
                            <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full">Default</span>
                          )}
                        </div>
                        <p className="text-xs text-gray-500">{addr.addressLine}</p>
                        <p className="text-xs text-gray-500">{addr.city}, {addr.state} — {addr.pincode}</p>
                        <p className="text-xs text-gray-500 mt-0.5">📞 {addr.phone}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminUsers;