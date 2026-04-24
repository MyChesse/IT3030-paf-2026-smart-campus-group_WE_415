import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { categoryMeta, emptyCatalog, getFacilityCatalog } from '../services/facilityCatalog';
import type { FacilityCatalog, FacilityCategoryKey } from '../services/facilityCatalog';

const categoryOrder: FacilityCategoryKey[] = ['lectureHalls', 'labs', 'meetingRooms'];

const renderUnitReason = (reason?: string | null) =>
  reason?.trim() ? reason : 'No reason provided yet.';

const FacilitiesOverview: React.FC = () => {
  const navigate = useNavigate();
  const [catalog, setCatalog] = useState<FacilityCatalog>(emptyCatalog());
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const loadCatalog = async () => {
      try {
        setLoading(true);
        const result = await getFacilityCatalog();
        setCatalog(result);
      } catch (loadError) {
        setError(
          loadError instanceof Error
            ? loadError.message
            : 'Failed to load facilities overview.'
        );
      } finally {
        setLoading(false);
      }
    };

    void loadCatalog();
  }, []);

  return (
    <div className="min-h-screen bg-campus-surface text-slate-100">
      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <header className="mb-8 rounded-3xl border border-campus-line bg-campus-card p-7 shadow-campus">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.18em] text-campus-accent">
                Facilities Overview
              </p>
              <h1 className="mt-2 text-3xl font-bold sm:text-4xl">
                Availability and Unavailability
              </h1>
            </div>
            <div className="flex flex-wrap gap-2">
              <button
                type="button"
                onClick={() => navigate('/facilities')}
                className="rounded-xl border border-campus-line px-4 py-2 text-sm font-semibold text-slate-200 hover:border-campus-accent hover:text-campus-accent"
              >
                Open Booking
              </button>
              <button
                type="button"
                onClick={() => navigate('/')}
                className="rounded-xl border border-campus-line px-4 py-2 text-sm font-semibold text-slate-200 hover:border-campus-accent hover:text-campus-accent"
              >
                Back to Home
              </button>
            </div>
          </div>
          <p className="mt-3 max-w-3xl text-slate-300">
            This page is view-only. You can only check which facility items and units are
            available or unavailable.
          </p>
          {error && (
            <p className="mt-4 rounded-xl border border-rose-400/40 bg-rose-500/10 px-3 py-2 text-sm text-rose-200">
              {error}
            </p>
          )}
        </header>

        {loading ? (
          <div className="rounded-3xl border border-campus-line bg-campus-card p-8 text-slate-300 shadow-campus-soft">
            Loading availability data...
          </div>
        ) : (
          <div className="space-y-8">
            {categoryOrder.map((category) => {
              const items = catalog[category];
              return (
                <section key={category} className="space-y-4">
                  <div>
                    <h2 className="text-2xl font-semibold">{categoryMeta[category].title}</h2>
                    <p className="text-sm text-slate-400">{categoryMeta[category].helper}</p>
                  </div>

                  <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">
                    {items.map((item) => {
                      const availableCount = item.units.filter((unit) => unit.available).length;
                      const unavailableCount = item.units.length - availableCount;

                      return (
                        <article
                          key={item.id}
                          className="rounded-2xl border border-campus-line bg-campus-card p-5 shadow-campus-soft"
                        >
                          <h3 className="text-xl font-semibold">{item.name}</h3>
                          <p className="mt-2 text-sm text-slate-300">{item.description}</p>

                          <div className="mt-4 flex flex-wrap gap-2 text-xs">
                            <span className="rounded-full bg-emerald-500/20 px-3 py-1 font-semibold text-emerald-300">
                              Available: {availableCount}
                            </span>
                            <span className="rounded-full bg-rose-500/20 px-3 py-1 font-semibold text-rose-300">
                              Unavailable: {unavailableCount}
                            </span>
                          </div>

                          <div className="mt-4 space-y-2">
                            {item.units.map((unit) => (
                              <div
                                key={unit.id}
                                className="rounded-xl border border-campus-line bg-campus-surface/80 px-3 py-2"
                              >
                                <div className="flex items-center justify-between">
                                  <p className="text-sm font-semibold text-slate-100">{unit.name}</p>
                                  <span
                                    className={`text-xs font-semibold ${
                                      unit.available ? 'text-emerald-300' : 'text-rose-300'
                                    }`}
                                  >
                                    {unit.available ? 'Available' : 'Unavailable'}
                                  </span>
                                </div>
                                <p className="mt-1 text-xs text-slate-300">
                                  Seats: {unit.capacity} | {unit.projector ? 'Projector' : 'No Projector'} | {unit.camera ? 'Camera' : 'No Camera'}
                                </p>
                                {!unit.available && (
                                  <p className="mt-2 rounded-lg border border-rose-400/30 bg-rose-500/10 px-2 py-1 text-xs text-rose-100">
                                    Unavailable because: {renderUnitReason(unit.unavailabilityReason)}
                                  </p>
                                )}
                              </div>
                            ))}
                          </div>
                        </article>
                      );
                    })}
                  </div>
                </section>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default FacilitiesOverview;
