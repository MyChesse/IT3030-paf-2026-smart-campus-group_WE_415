import { useState } from 'react';
import { useAuth } from '../context/AuthContext';

export default function ProfilePage() {
  const { user, updateProfile } = useAuth();
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({ name: '', profilePictureUrl: '' });
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  if (!user) {
    return null;
  }

  const startEdit = () => {
    setForm({ name: user.name || '', profilePictureUrl: user.profilePictureUrl || '' });
    setEditing(true);
    setSuccess(false);
    setError('');
  };

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setForm((prev) => ({ ...prev, [event.target.name]: event.target.value }));
  };

  const handleSave = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!form.name.trim() || form.name.length < 2) {
      setError('Name must be at least 2 characters.');
      return;
    }

    setSaving(true);
    setError('');

    try {
      await updateProfile(form);
      setEditing(false);
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to update profile.');
    } finally {
      setSaving(false);
    }
  };

  const initials = user.name
    ? user.name
        .split(' ')
        .map((w) => w[0])
        .join('')
        .toUpperCase()
        .slice(0, 2)
    : '?';

  return (
    <div className="page-container" style={{ maxWidth: '600px' }}>
      <div className="page-header">
        <h1 className="page-title">My Profile</h1>
      </div>

      {success && <div className="alert alert-success">Profile updated successfully.</div>}
      {error && <div className="alert alert-error">{error}</div>}

      <div className="profile-card">
        <div className="profile-avatar-row">
          {user.profilePictureUrl ? (
            <img src={user.profilePictureUrl} alt={user.name} className="profile-avatar" />
          ) : (
            <div className="profile-avatar profile-avatar--initials">{initials}</div>
          )}
          <div>
            <h2 className="profile-name">{user.name}</h2>
            <p className="profile-email">{user.email}</p>
          </div>
        </div>

        {!editing ? (
          <button className="btn btn-primary" onClick={startEdit}>
            Edit profile
          </button>
        ) : (
          <form onSubmit={handleSave} className="profile-form">
            <div className="form-group">
              <label htmlFor="name">Full name</label>
              <input id="name" name="name" type="text" value={form.name} onChange={handleChange} />
            </div>

            <div className="form-group">
              <label htmlFor="profilePictureUrl">Profile picture URL</label>
              <input id="profilePictureUrl" name="profilePictureUrl" type="url" value={form.profilePictureUrl} onChange={handleChange} />
            </div>

            <div className="form-actions">
              <button type="submit" className="btn btn-primary" disabled={saving}>
                {saving ? 'Saving...' : 'Save changes'}
              </button>
              <button type="button" className="btn btn-outline" onClick={() => setEditing(false)}>
                Cancel
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
