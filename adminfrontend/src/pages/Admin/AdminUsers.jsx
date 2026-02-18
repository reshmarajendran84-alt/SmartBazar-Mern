import { useEffect, useState } from "react";
import api from "../../utils/api";
import { toast } from "react-toastify";

const AdminUsers = () => {
  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);

  const loadUsers = async () => {
    try {
      setLoading(true);
      const res = await api.get("/admin/users");
      setUsers(res.data.users);
    } catch (err) {
      toast.error("Failed to load users");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadUsers();
  }, []);

  const deleteUser = async (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this user?"
    );
    if (!confirmDelete) return;

    try {
      await api.delete(`/admin/users/${id}`);
      setUsers((prev) => prev.filter((u) => u._id !== id));
      toast.success("User deleted successfully");
    } catch (err) {
      toast.error("Failed to delete user");
    }
  };

  const filteredUsers = users.filter((u) =>
    u.email.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="p-4 md:p-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6 gap-4">
        <h2 className="text-2xl font-bold text-gray-800">All Users</h2>

        <input
          type="text"
          placeholder="Search by email..."
          className="w-full md:w-72 px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {/* Loading */}
      {loading && (
        <p className="text-center text-gray-500">Loading users...</p>
      )}

      {/* Empty State */}
      {!loading && filteredUsers.length === 0 && (
        <p className="text-center text-gray-500">No users found</p>
      )}

      {/* Desktop Table */}
      {!loading && filteredUsers.length > 0 && (
        <>
          <div className="hidden md:block bg-white shadow rounded-xl overflow-x-auto">
            <table className="min-w-full text-sm text-left text-gray-600">
              <thead className="bg-gray-100 text-gray-700 uppercase text-xs">
                <tr>
                  <th className="px-6 py-4">Email</th>
                  <th className="px-6 py-4">Role</th>
                  <th className="px-6 py-4">Verified</th>
                  <th className="px-6 py-4 text-center">Action</th>
                </tr>
              </thead>

              <tbody>
                {filteredUsers.map((u) => (
                  <tr
                    key={u._id}
                    className="border-t hover:bg-gray-50 transition"
                  >
                    <td className="px-6 py-4 font-medium text-gray-900">
                      {u.email}
                    </td>

                    <td className="px-6 py-4 capitalize">
                      {u.role || "user"}
                    </td>

                    <td className="px-6 py-4">
                      {u.isVerified ? (
                        <span className="text-green-600 font-medium">
                          Verified
                        </span>
                      ) : (
                        <span className="text-red-500 font-medium">
                          Not Verified
                        </span>
                      )}
                    </td>

                    <td className="px-6 py-4 text-center">
                      <button
                        onClick={() => deleteUser(u._id)}
                        className="bg-red-500 hover:bg-red-600 
                                   text-white px-3 py-1 rounded-md text-xs"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile Card Layout */}
          <div className="md:hidden space-y-4">
            {filteredUsers.map((u) => (
              <div
                key={u._id}
                className="bg-white p-4 rounded-xl shadow"
              >
                <p className="font-semibold text-gray-800">
                  {u.email}
                </p>

                <p className="text-sm text-gray-500 mt-1">
                  Role: {u.role || "user"}
                </p>

                <p
                  className={`text-sm mt-1 ${
                    u.isVerified
                      ? "text-green-600"
                      : "text-red-500"
                  }`}
                >
                  {u.isVerified ? "Verified" : "Not Verified"}
                </p>

                <button
                  onClick={() => deleteUser(u._id)}
                  className="mt-3 bg-red-500 hover:bg-red-600 
                             text-white px-3 py-1 rounded-md text-xs w-full"
                >
                  Delete
                </button>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default AdminUsers;
