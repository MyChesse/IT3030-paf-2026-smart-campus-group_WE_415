import { useEffect, useMemo, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { resourceApi } from '../api/resourceApi';

const emptyForm = {
  name: '',
  category: '',
  location: '',
  description: '',
  capacity: 1,
  available: true,
  amenities: '',
  imageUrl: '',
  contactPerson: '',
};

export default function ResourceForm() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const isEdit = useMemo(() => Boolean(id), [id]);

  const [formData, setFormData] = useState(emptyForm);
  const [loading, setLoading] = useState(isEdit);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!isEdit || !id) return;

    const fetchResource = async () => {
      try {
        const response = await resourceApi.getById(id);
        const data = response.data as any;
        setFormData({
          name: data.name || '',
          category: data.category || '',
          location: data.location || '',
          description: data.description || '',
          capacity: data.capacity || 1,
          available: Boolean(data.available),
          amenities: data.amenities?.join(', ') || '',
          imageUrl: data.imageUrl || '',
          contactPerson: data.contactPerson || '',
        });
      } catch (err: any) {
        setError(err.response?.data?.error || 'Failed to load resource');
      } finally {
        setLoading(false);
      }
    };

    void fetchResource();
  }, [id, isEdit]);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = event.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? (event.target as HTMLInputElement).checked : value,
    }));
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setSubmitting(true);
    setError('');

    const payload = {
      ...formData,
      capacity: Number(formData.capacity),
      amenities: formData.amenities.split(',').map((item) => item.trim()).filter(Boolean),
    };

    try {
      if (isEdit && id) {
        await resourceApi.update(id, payload);
        navigate(`/resources/${id}`);
      } else {
        const response = await resourceApi.create(payload);
        navigate(`/resources/${response.data.id}`);
      }
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to save resource');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <p className="page">Loading form...</p>;

  return (
    <section className="page">
      <h1>{isEdit ? 'Edit Resource' : 'Create Resource'}</h1>
      {error && <p className="error">{error}</p>}

      <form className="resource-form" onSubmit={handleSubmit}>
        <input required name="name" placeholder="Name" value={formData.name} onChange={handleChange} />
        <input required name="category" placeholder="Category" value={formData.category} onChange={handleChange} />
        <input required name="location" placeholder="Location" value={formData.location} onChange={handleChange} />
        <input required min="1" type="number" name="capacity" placeholder="Capacity" value={formData.capacity} onChange={handleChange} />
        <input name="contactPerson" placeholder="Contact Person" value={formData.contactPerson} onChange={handleChange} />
        <input name="imageUrl" placeholder="Image URL" value={formData.imageUrl} onChange={handleChange} />
        <input name="amenities" placeholder="Amenities (comma separated)" value={formData.amenities} onChange={handleChange} />
        <textarea name="description" placeholder="Description" rows={4} value={formData.description} onChange={handleChange} />

        <label className="checkbox-row">
          <input type="checkbox" name="available" checked={formData.available} onChange={handleChange} />
          Available
        </label>

        <div className="page-actions">
          <button className="primary-btn" type="submit" disabled={submitting}>{submitting ? 'Saving...' : 'Save'}</button>
          <Link className="secondary-btn" to={isEdit && id ? `/resources/${id}` : '/resources'}>Cancel</Link>
        </div>
      </form>
    </section>
  );
}
