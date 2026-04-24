import React, { useEffect, useMemo, useState } from 'react';
import { saveBookingDraft } from '../services/bookingDraftService';
import {
  categoryMeta,
  emptyCatalog,
  getFacilityCatalog,
} from '../services/facilityCatalog';
import type {
  FacilityCatalog,
  FacilityCategoryKey,
  FacilityItem,
} from '../services/facilityCatalog';

const categoryOrder: FacilityCategoryKey[] = [
  'lectureHalls',
  'labs',
  'meetingRooms',
];

const booleanLabel = (value: boolean, yes: string, no: string) =>
  value ? yes : no;

const formatReason = (reason?: string | null) =>
  reason?.trim() ? reason : 'No reason provided yet.';

const Facilities: React.FC = () => {
  const [catalog, setCatalog] = useState<FacilityCatalog>(emptyCatalog());
  const [activeCategory, setActiveCategory] =
    useState<FacilityCategoryKey>('lectureHalls');
  const [selected, setSelected] = useState<{
    category: FacilityCategoryKey;
    itemId: number;
  } | null>(null);
  const [selectedUnitId, setSelectedUnitId] = useState<number | null>(null);
  const [bookingMessage, setBookingMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [requireProjector, setRequireProjector] = useState(false);
  const [requireCamera, setRequireCamera] = useState(false);

  useEffect(() => {
    const loadCatalog = async () => {
      try {
        setLoading(true);
        const result = await getFacilityCatalog();
        setCatalog(result);
        setActiveCategory((current) => current);
      } catch (loadError) {
        setError(
          loadError instanceof Error
            ? loadError.message
            : 'Failed to load facilities from the backend.'
        );
      } finally {
        setLoading(false);
      }
    };

    void loadCatalog();
  }, []);

  const activeItems = catalog[activeCategory] ?? [];

  const selectedItem: FacilityItem | null = useMemo(() => {
    if (!selected) {
      return null;
    }

    const item = catalog[selected.category].find((entry) => entry.id === selected.itemId);
    return item ?? null;
  }, [catalog, selected]);

  const getMatchingUnits = (item: FacilityItem) =>
    item.units.filter(
      (unit) =>
        unit.available &&
        (!requireProjector || unit.projector) &&
        (!requireCamera || unit.camera)
    );

  const availableUnits = useMemo(() => {
    if (!selectedItem) {
      return [];
    }

    return getMatchingUnits(selectedItem);
  }, [selectedItem, requireProjector, requireCamera]);

  const onBookNow = (category: FacilityCategoryKey, itemId: number) => {
    const item = catalog[category].find((entry) => entry.id === itemId);
    const firstAvailableUnit = item ? getMatchingUnits(item)[0] : undefined;

    setSelected({ category, itemId });
    setSelectedUnitId(firstAvailableUnit?.id ?? null);
    setBookingMessage('');
  };

  const onConfirmBooking = () => {
    if (!selectedItem || !selectedUnitId) {
      setBookingMessage('Please select an available option before confirming.');
      return;
    }

    const selectedUnit = selectedItem.units.find((unit) => unit.id === selectedUnitId);
    if (!selectedUnit || !selectedUnit.available) {
      setBookingMessage('The selected option is no longer available.');
      return;
    }

    const selectedCategory = selected?.category ?? activeCategory;

    saveBookingDraft({
      category: categoryMeta[selectedCategory].title,
      itemName: selectedItem.name,
      unitName: selectedUnit.name,
      capacity: selectedUnit.capacity,
    });

    setBookingMessage(
      `Booking confirmed for ${selectedItem.name} - ${selectedUnit.name}.`
    );
  };

  return (
    <div className="min-h-screen bg-campus-surface text-slate-100">
      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <header className="mb-8 rounded-3xl border border-campus-line bg-campus-card p-7 shadow-campus">
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-campus-accent">
            User Facilities
          </p>
          <h1 className="mt-3 text-3xl font-bold sm:text-4xl">Book Campus Resources</h1>
          <p className="mt-3 max-w-3xl text-slate-300">
            Open one of the sections and choose your item. Each item has a Book Now
            button, and the booking cart in the middle area shows available numbers,
            seats, projector and camera details before confirmation.
          </p>
          {error && (
            <p className="mt-4 rounded-xl border border-rose-400/40 bg-rose-500/10 px-3 py-2 text-sm text-rose-200">
              {error}
            </p>
          )}
        </header>

        <div className="mb-6 rounded-2xl border border-campus-line bg-campus-card p-4 shadow-campus-soft">
          <p className="text-sm font-semibold text-campus-accent">Availability Filters</p>
          <div className="mt-3 flex flex-wrap gap-6">
            <label className="inline-flex items-center gap-2 text-sm text-slate-200">
              <input
                type="checkbox"
                checked={requireProjector}
                onChange={(event) => setRequireProjector(event.target.checked)}
              />
              Must have Projector
            </label>
            <label className="inline-flex items-center gap-2 text-sm text-slate-200">
              <input
                type="checkbox"
                checked={requireCamera}
                onChange={(event) => setRequireCamera(event.target.checked)}
              />
              Must have Camera
            </label>
          </div>
        </div>

        <div className="mb-8 grid grid-cols-1 gap-3 sm:grid-cols-3">
          {categoryOrder.map((category) => {
            const isActive = activeCategory === category;

            return (
              <button
                key={category}
                type="button"
                onClick={() => setActiveCategory(category)}
                className={`rounded-2xl border px-4 py-3 text-left transition ${
                  isActive
                    ? 'border-campus-accent bg-campus-accent/15 text-white'
                    : 'border-campus-line bg-campus-card/70 text-slate-300 hover:border-campus-accent/60'
                }`}
              >
                <p className="font-semibold">{categoryMeta[category].title}</p>
                <p className="mt-1 text-xs text-slate-400">{categoryMeta[category].helper}</p>
              </button>
            );
          })}
        </div>

        {loading ? (
          <div className="rounded-3xl border border-campus-line bg-campus-card p-8 text-slate-300 shadow-campus-soft">
            Loading facility catalog...
          </div>
        ) : (
          <div className="grid gap-8 lg:grid-cols-[1.7fr_1fr]">
            <section className="space-y-5">
              <div className="flex items-end justify-between">
                <div>
                  <h2 className="text-2xl font-semibold">{categoryMeta[activeCategory].title}</h2>
                  <p className="text-sm text-slate-400">{categoryMeta[activeCategory].helper}</p>
                </div>
              </div>

              <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
                {activeItems.map((item) => {
                  const availableCount = getMatchingUnits(item).length;
                  const total = item.units.length;
                  const unavailableUnits = item.units.filter((unit) => !unit.available);

                  return (
                    <article
                      key={item.id}
                      className="rounded-2xl border border-campus-line bg-campus-card p-5 shadow-campus-soft"
                    >
                      <div className="mb-3 flex items-center justify-between gap-4">
                        <h3 className="text-xl font-semibold">{item.name}</h3>
                        <span className="rounded-full bg-campus-accent/20 px-3 py-1 text-xs font-bold uppercase tracking-wide text-campus-accent">
                          Cart Item
                        </span>
                      </div>
                      <p className="mb-4 text-sm text-slate-300">{item.description}</p>

                      {(requireProjector || requireCamera) && (
                        <p className="mb-3 text-xs text-slate-300">
                          Filtered by:{' '}
                          {requireProjector ? 'Projector' : ''}
                          {requireProjector && requireCamera ? ' + ' : ''}
                          {requireCamera ? 'Camera' : ''}
                        </p>
                      )}

                      <div className="mb-5 flex gap-3 text-xs">
                        <span className="rounded-full bg-emerald-500/20 px-3 py-1 font-semibold text-emerald-300">
                          Available: {availableCount}
                        </span>
                        <span className="rounded-full bg-slate-600/40 px-3 py-1 font-semibold text-slate-300">
                          Total: {total}
                        </span>
                      </div>

                      {unavailableUnits.length > 0 && (
                        <div className="mb-4 rounded-xl border border-rose-400/30 bg-rose-500/10 p-3 text-xs text-rose-100">
                          <p className="font-semibold uppercase tracking-wide text-rose-200">
                            Unavailable units
                          </p>
                          <div className="mt-2 space-y-2">
                            {unavailableUnits.map((unit) => (
                              <div key={unit.id} className="rounded-lg bg-black/10 px-3 py-2">
                                <div className="flex items-center justify-between gap-3">
                                  <span className="font-semibold text-rose-100">{unit.name}</span>
                                  <span className="text-[11px] uppercase tracking-wide text-rose-200">
                                    Unavailable
                                  </span>
                                </div>
                                <p className="mt-1 text-rose-50/90">
                                  {formatReason(unit.unavailabilityReason)}
                                </p>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      <button
                        type="button"
                        disabled={availableCount === 0}
                        onClick={() => onBookNow(activeCategory, item.id)}
                        className="w-full rounded-xl bg-campus-accent px-4 py-2.5 text-sm font-bold text-slate-900 transition hover:bg-campus-accent-strong disabled:cursor-not-allowed disabled:bg-slate-600 disabled:text-slate-300"
                      >
                        {availableCount === 0 ? 'No Available Slots' : 'Book Now'}
                      </button>
                    </article>
                  );
                })}
              </div>
            </section>

            <aside className="lg:sticky lg:top-6 lg:h-fit">
              <div className="rounded-3xl border border-campus-line bg-campus-card p-6 shadow-campus">
                <p className="text-sm font-semibold uppercase tracking-[0.18em] text-campus-accent">
                  Booking Cart
                </p>
                <h3 className="mt-2 text-2xl font-semibold">Confirm Selection</h3>

                {!selectedItem && (
                  <p className="mt-4 text-sm text-slate-400">
                    Select an item using Book Now to view hall numbers, seats, projector and
                    camera details in this panel.
                  </p>
                )}

                {selectedItem && (
                  <div className="mt-4 space-y-4">
                    <div>
                      <p className="text-sm text-slate-400">Selected Item</p>
                      <p className="text-lg font-semibold">{selectedItem.name}</p>
                      <p className="text-xs text-slate-400">{selectedItem.description}</p>
                    </div>

                    {selectedItem.units.some((unit) => !unit.available) && (
                      <div className="rounded-xl border border-rose-400/30 bg-rose-500/10 p-3 text-xs text-rose-100">
                        <p className="font-semibold uppercase tracking-wide text-rose-200">
                          Unavailability notes
                        </p>
                        <div className="mt-2 space-y-2">
                          {selectedItem.units
                            .filter((unit) => !unit.available)
                            .map((unit) => (
                              <div key={unit.id} className="rounded-lg bg-black/10 px-3 py-2">
                                <p className="font-semibold text-rose-100">{unit.name}</p>
                                <p className="mt-1 text-rose-50/90">{formatReason(unit.unavailabilityReason)}</p>
                              </div>
                            ))}
                        </div>
                      </div>
                    )}

                    <div className="space-y-2">
                      {availableUnits.length === 0 && (
                        <p className="text-sm text-amber-300">
                          No available options match the current filters.
                        </p>
                      )}

                      {availableUnits.map((unit) => {
                        const isSelected = selectedUnitId === unit.id;

                        return (
                          <button
                            key={unit.id}
                            type="button"
                            onClick={() => setSelectedUnitId(unit.id)}
                            className={`w-full rounded-xl border p-3 text-left transition ${
                              isSelected
                                ? 'border-campus-accent bg-campus-accent/15'
                                : 'border-campus-line bg-campus-surface/80 hover:border-campus-accent/50'
                            }`}
                          >
                            <div className="flex items-center justify-between">
                              <p className="font-semibold">{unit.name}</p>
                              <span className="text-xs text-emerald-300">Available</span>
                            </div>
                            <p className="mt-1 text-xs text-slate-300">
                              Seats: {unit.capacity} | {booleanLabel(unit.projector, 'Projector', 'No Projector')} |{' '}
                              {booleanLabel(unit.camera, 'Camera', 'No Camera')}
                            </p>
                          </button>
                        );
                      })}
                    </div>

                    <button
                      type="button"
                      onClick={onConfirmBooking}
                      disabled={!selectedUnitId}
                      className="w-full rounded-xl bg-emerald-400 px-4 py-2.5 font-bold text-slate-900 transition hover:bg-emerald-300 disabled:cursor-not-allowed disabled:bg-slate-600 disabled:text-slate-300"
                    >
                      Confirm Booking
                    </button>

                    {bookingMessage && (
                      <p className="rounded-xl border border-campus-line bg-campus-surface px-3 py-2 text-sm text-slate-200">
                        {bookingMessage}
                      </p>
                    )}
                  </div>
                )}
              </div>
            </aside>
          </div>
        )}
      </div>
    </div>
  );
};

export default Facilities;
