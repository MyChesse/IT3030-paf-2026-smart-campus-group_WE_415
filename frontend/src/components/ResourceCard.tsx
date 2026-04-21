import { Link } from 'react-router-dom';

interface Resource {
  id: number;
  name: string;
  description?: string;
  category: string;
  location: string;
  capacity: number;
  available: boolean;
}

export default function ResourceCard({ resource }: { resource: Resource }) {
  return (
    <article className="resource-card">
      <div className="resource-card__header">
        <h3>{resource.name}</h3>
        <span className={resource.available ? 'status available' : 'status unavailable'}>
          {resource.available ? 'Available' : 'Unavailable'}
        </span>
      </div>
      <p>{resource.description || 'No description provided.'}</p>
      <div className="resource-card__meta">
        <span>{resource.category}</span>
        <span>{resource.location}</span>
        <span>Capacity: {resource.capacity}</span>
      </div>
      <div className="resource-card__actions">
        <Link to={`/resources/${resource.id}`}>View</Link>
        <Link to={`/resources/${resource.id}/edit`}>Edit</Link>
      </div>
    </article>
  );
}
