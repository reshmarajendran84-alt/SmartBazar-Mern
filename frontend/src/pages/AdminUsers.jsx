import { useEffect, useState } from "react";
import adminApi from "../utils/api";

const AdminUsers = () => {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    const loadUsers = async () => {
      const res = await adminApi.get("/admin/users");
      setUsers(res.data.users);
    };

    loadUsers();
  }, []);

  return (
    <div>
      <h2>All Users</h2>
      {users.map((u) => (
        <div key={u._id}>{u.email}</div>
      ))}
    </div>
  );
};

export default AdminUsers;
