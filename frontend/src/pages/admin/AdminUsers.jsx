import { useEffect, useState } from "react";
import api from "../../utils/api";

const AdminUsers = () => {
  const [users, setUsers] = useState([]);

  const loadUsers = async () => {
  try {
    console.log("Calling /admin/users");
    const res = await api.get("/admin/users");
    console.log("Users response:", res.data);
    setUsers(res.data.users);
  } catch (err) {
    console.error("Users error:", err.response?.data || err.message);
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
    } catch (err) {
      alert("Failed to delete user");
    }
  };

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <h2 className="text-2xl font-bold mb-6">All Users</h2>

      {users.length === 0 ? (
        <p className="text-gray-500 text-center">No users found</p>
      ) : (
        <div className="bg-white shadow rounded-lg overflow-hidden">
          <div className="grid grid-cols-3 bg-gray-100 px-4 py-3 font-semibold">
            <span>Email</span>
            <span>Role</span>
            <span className="text-center">Action</span>
          </div>

          {users.map((u) => (
            <div
              key={u._id}
              className="grid grid-cols-3 px-4 py-3 border-t items-center hover:bg-gray-50"
            >
              <span className="truncate">{u.email}</span>
              <span className="capitalize">{u.role || "user"}</span>
              <div className="text-center">
                <button
                  onClick={() => deleteUser(u._id)}
                  className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded text-sm"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AdminUsers;