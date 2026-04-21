import { useEffect, useState } from 'react';
import { adminApi } from '../api/adminApi';
import './AdminPage.css';

interface AdminUser {
  id?: number;
  _id?: number;
  name: string;
  email: string;
  role?: string;
  roles?: string[];
}

export default function AdminPage() {
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [technicians, setTechnicians] = useState<AdminUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [pageError, setPageError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [techForm, setTechForm] = useState({ name: '', email: '', password: '' });

  const getRoleText = (user: AdminUser) => {
    if (user.role) return user.role;
    if (Array.isArray(user.roles)) return user.roles.join(', ');
    return 'N/A';
  };

  const loadAdminData = async () => {
    try {
      setLoading(true);
      setPageError('');
      const [usersRes, techsRes] = await Promise.all([adminApi.getUsers(), adminApi.getTechnicians()]);
      setUsers((usersRes.data as AdminUser[]) || []);
      setTechnicians((techsRes.data as AdminUser[]) || []);
    } catch (error: any) {
      setPageError(error?.response?.data?.message || 'Failed to load admin panel data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void loadAdminData();
  }, []);

  const handleCreateTechnician = async (event: React.FormEvent) => {
    event.preventDefault();
    setPageError('');
    setSuccessMessage('');

    try {
      await adminApi.createTechnician(techForm);
      setSuccessMessage('Technician created successfully.');
      setTechForm({ name: '', email: '', password: '' });
      await loadAdminData();
    } catch (error: any) {
      setPageError(error?.response?.data?.message || 'Failed to create technician');
    }
  };

  const handleDeleteUser = async (userId: number, role: string) => {
    setPageError('');
    setSuccessMessage('');

    if (role === 'ADMIN') {
      setPageError('Admin users cannot be deleted from this panel.');
      return;
    }

    if (!window.confirm('Are you sure you want to delete this user?')) {
      return;
    }

    try {
      await adminApi.deleteUser(userId);
      setSuccessMessage('User deleted successfully.');
      await loadAdminData();
    } catch (error: any) {
      setPageError(error?.response?.data?.message || 'Failed to delete user');
    }
  };

  const totalAdmins = users.filter((u) => getRoleText(u).includes('ADMIN')).length;

  if (loading) return <div className="admin-page"><p>Loading admin panel...</p></div>;

  return (
    <div className="admin-page">
      <div className="admin-header">
        <h1>Admin Panel</h1>
        <p>Manage users, technician accounts, and access from one place.</p>
      </div>

      {pageError && <div className="alert alert-error">{pageError}</div>}
      {successMessage && <div className="alert alert-success">{successMessage}</div>}

      <div className="stats-grid">
        <div className="stat-card"><h3>Total Users</h3><p>{users.length}</p></div>
        <div className="stat-card"><h3>Technicians</h3><p>{technicians.length}</p></div>
        <div className="stat-card"><h3>Admins</h3><p>{totalAdmins}</p></div>
      </div>

      <div className="admin-grid">
        <div className="card">
          <h2>Create Technician</h2>
          <form onSubmit={handleCreateTechnician} className="tech-form">
            <input name="name" value={techForm.name} onChange={(e) => setTechForm((p) => ({ ...p, name: e.target.value }))} required placeholder="Full name" />
            <input name="email" type="email" value={techForm.email} onChange={(e) => setTechForm((p) => ({ ...p, email: e.target.value }))} required placeholder="Email address" />
            <input name="password" type="password" value={techForm.password} onChange={(e) => setTechForm((p) => ({ ...p, password: e.target.value }))} required placeholder="Password" />
            <button type="submit" className="primary-btn">Create Technician</button>
          </form>
        </div>

        <div className="card">
          <h2>Technicians</h2>
          {technicians.length === 0 ? <p className="empty-text">No technicians found.</p> : (
            <div className="table-wrapper">
              <table className="admin-table">
                <thead><tr><th>Name</th><th>Email</th><th>Role</th></tr></thead>
                <tbody>
                  {technicians.map((tech) => {
                    const techId = tech._id || tech.id || 0;
                    const role = getRoleText(tech);
                    return (
                      <tr key={techId}>
                        <td>{tech.name}</td>
                        <td>{tech.email}</td>
                        <td><span className={`role-badge ${role.toLowerCase()}`}>{role}</span></td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      <div className="card full-width-card">
        <h2>All Users</h2>
        {users.length === 0 ? <p className="empty-text">No users found.</p> : (
          <div className="table-wrapper">
            <table className="admin-table">
              <thead><tr><th>Name</th><th>Email</th><th>Role</th><th>Action</th></tr></thead>
              <tbody>
                {users.map((user) => {
                  const userId = user._id || user.id || 0;
                  const role = getRoleText(user);
                  return (
                    <tr key={userId}>
                      <td>{user.name}</td>
                      <td>{user.email}</td>
                      <td><span className={`role-badge ${role.toLowerCase()}`}>{role}</span></td>
                      <td>
                        {role === 'ADMIN' ? <span className="protected-text">Protected</span> : (
                          <button className="danger-btn" onClick={() => void handleDeleteUser(userId, role)}>
                            Delete
                          </button>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
