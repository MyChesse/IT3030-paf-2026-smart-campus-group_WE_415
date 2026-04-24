import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';
import {
  categoryMeta,
  createFacilityItem,
  createFacilityUnit,
  deleteFacilityItem,
  emptyCatalog,
  getFacilityCatalog,
  updateFacilityItem,
  updateFacilityUnit,
} from '../services/facilityCatalog';
import type { FacilityCatalog, FacilityCategoryKey } from '../services/facilityCatalog';

const categoryOrder: FacilityCategoryKey[] = [
  'lectureHalls',
  'labs',
  'meetingRooms',
];

type ConfirmAction = {
  title: string;
  message: string;
  confirmLabel: string;
  action: () => Promise<void>;
};

type UnavailabilityPrompt = {
  category: FacilityCategoryKey;
  itemId: number;
  unitId: number;
  itemName: string;
  unitName: string;
  reason: string;
};

const extractErrorMessage = (error: unknown, fallback: string) => {
  if (axios.isAxiosError(error)) {
    const data = error.response?.data as { message?: string; error?: string } | undefined;
    return data?.message || data?.error || error.message || fallback;
  }

  if (error instanceof Error) {
    return error.message;
  }

  return fallback;
};

const AdminDashboardFacility: React.FC = () => {
  const navigate = useNavigate();
  const [catalog, setCatalog] = useState<FacilityCatalog>(emptyCatalog());
  const [originalCatalog, setOriginalCatalog] = useState<FacilityCatalog>(emptyCatalog());
  const [activeCategory, setActiveCategory] =
    useState<FacilityCategoryKey>('lectureHalls');
  const [newItemName, setNewItemName] = useState('');
  const [newItemDescription, setNewItemDescription] = useState('');
  const [statusMessage, setStatusMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [confirmAction, setConfirmAction] = useState<ConfirmAction | null>(null);
  const [actionBusy, setActionBusy] = useState(false);
  const [unavailabilityPrompt, setUnavailabilityPrompt] = useState<UnavailabilityPrompt | null>(null);
  const [reasonSaving, setReasonSaving] = useState(false);

  useEffect(() => {
    const loadCatalog = async () => {
      try {
        setLoading(true);
        const result = await getFacilityCatalog();
        setCatalog(result);
        setOriginalCatalog(result);
      } catch (loadError) {
        setStatusMessage(
          loadError instanceof Error
            ? loadError.message
            : 'Failed to load facility catalog from the backend.'
        );
      } finally {
        setLoading(false);
      }
    };

    void loadCatalog();
  }, []);

  const refreshCatalog = async () => {
    const result = await getFacilityCatalog();
    setCatalog(result);
    setOriginalCatalog(result);
  };

  const handleAddItem = async () => {
    const name = newItemName.trim();
    if (!name) {
      setStatusMessage('Facility item name is required.');
      return;
    }

    await createFacilityItem(activeCategory, {
      name,
      description: newItemDescription.trim(),
    });
    await refreshCatalog();
    setStatusMessage(`${categoryMeta[activeCategory].title}: item added.`);
    setNewItemName('');
    setNewItemDescription('');
  };

  const openConfirm = (
    title: string,
    message: string,
    confirmLabel: string,
    action: () => Promise<void>
  ) => {
    setConfirmAction({ title, message, confirmLabel, action });
  };

  const runConfirmedAction = async () => {
    if (!confirmAction) {
      return;
    }

    try {
      setActionBusy(true);
      await confirmAction.action();
      setConfirmAction(null);
    } catch (runError) {
      setStatusMessage(extractErrorMessage(runError, 'Action failed. Please try again.'));
    } finally {
      setActionBusy(false);
    }
  };

  const updateLocalItem = (
    category: FacilityCategoryKey,
    itemId: number,
    field: 'name' | 'description',
    value: string
  ) => {
    setCatalog((current) => ({
      ...current,
      [category]: current[category].map((item) =>
        item.id === itemId ? { ...item, [field]: value } : item
      ),
    }));
  };

  const updateLocalUnit = (
    category: FacilityCategoryKey,
    itemId: number,
    unitId: number,
    patch: Partial<{
      name: string;
      capacity: number;
      projector: boolean;
      camera: boolean;
      available: boolean;
      unavailabilityReason: string | null;
    }>
  ) => {
    setCatalog((current) => ({
      ...current,
      [category]: current[category].map((item) => {
        if (item.id !== itemId) {
          return item;
        }

        return {
          ...item,
          units: item.units.map((unit) =>
            unit.id === unitId ? { ...unit, ...patch } : unit
          ),
        };
      }),
    }));
  };

  const handleSaveItem = async (category: FacilityCategoryKey, itemId: number) => {
    const item = catalog[category].find((entry) => entry.id === itemId);
    if (!item) {
      setStatusMessage('Facility item not found.');
      return;
    }

    await updateFacilityItem(category, itemId, {
      name: item.name,
      description: item.description,
    });
    await refreshCatalog();
    setStatusMessage(`${item.name}: details updated.`);
  };

  const handleDeleteItem = async (category: FacilityCategoryKey, itemId: number) => {
    const item = catalog[category].find((entry) => entry.id === itemId);
    await deleteFacilityItem(category, itemId);
    await refreshCatalog();
    setStatusMessage(`${item?.name ?? 'Item'} removed.`);
  };

  const handleAddUnit = async (category: FacilityCategoryKey, itemId: number) => {
    const item = catalog[category].find((entry) => entry.id === itemId);
    await createFacilityUnit(category, itemId, {
      name: `${item?.name ?? 'Unit'} New`,
      capacity: 30,
      projector: false,
      camera: false,
      available: true,
      unavailabilityReason: null,
    });
    await refreshCatalog();
    setStatusMessage(`${item?.name ?? 'Item'}: new unit added.`);
  };

  const updateLocalUnitAvailability = (
    category: FacilityCategoryKey,
    itemId: number,
    unitId: number,
    available: boolean
  ) => {
    if (available) {
      updateLocalUnit(category, itemId, unitId, {
        available: true,
        unavailabilityReason: null,
      });
      return;
    }

    const item = catalog[category].find((entry) => entry.id === itemId);
    const unit = item?.units.find((entry) => entry.id === unitId);
    if (!item || !unit) {
      setStatusMessage('Facility unit not found.');
      return;
    }

    updateLocalUnit(category, itemId, unitId, {
      available: false,
      unavailabilityReason: unit.unavailabilityReason ?? null,
    });
    setUnavailabilityPrompt({
      category,
      itemId,
      unitId,
      itemName: item.name,
      unitName: unit.name,
      reason: unit.unavailabilityReason ?? '',
    });
  };

  const saveUnitChanges = async (
    category: FacilityCategoryKey,
    itemId: number,
    unitId: number
  ) => {
    const item = catalog[category].find((entry) => entry.id === itemId);
    const unit = item?.units.find((entry) => entry.id === unitId);
    if (!item || !unit) {
      throw new Error('Facility unit not found.');
    }

    await updateFacilityUnit(category, itemId, unitId, {
      name: unit.name,
      capacity: unit.capacity,
      projector: unit.projector,
      camera: unit.camera,
      available: unit.available,
      unavailabilityReason: unit.unavailabilityReason ?? null,
    });
  };

  const handleSaveUnit = async (
    category: FacilityCategoryKey,
    itemId: number,
    unitId: number
  ) => {
    const item = catalog[category].find((entry) => entry.id === itemId);
    const unit = item?.units.find((entry) => entry.id === unitId);
    if (!item || !unit) {
      setStatusMessage('Facility unit not found.');
      return;
    }

    await saveUnitChanges(category, itemId, unitId);
    await refreshCatalog();
    setStatusMessage(`${item.name} / ${unit.name}: unit updated.`);
  };

  const handleSaveAllUnits = async () => {
    const dirtyUnits: Array<{
      category: FacilityCategoryKey;
      itemId: number;
      unitId: number;
    }> = [];

    categoryOrder.forEach((category) => {
      catalog[category].forEach((item) => {
        const originalItem = originalCatalog[category].find((entry) => entry.id === item.id);
        item.units.forEach((unit) => {
          const originalUnit = originalItem?.units.find((entry) => entry.id === unit.id);
          const isChanged =
            !originalUnit ||
            originalUnit.name !== unit.name ||
            originalUnit.capacity !== unit.capacity ||
            originalUnit.projector !== unit.projector ||
            originalUnit.camera !== unit.camera ||
            originalUnit.available !== unit.available ||
            (originalUnit.unavailabilityReason ?? '') !== (unit.unavailabilityReason ?? '');

          if (isChanged) {
            dirtyUnits.push({
              category,
              itemId: item.id,
              unitId: unit.id,
            });
          }
        });
      });
    });

    if (dirtyUnits.length === 0) {
      setStatusMessage('No unit changes to save.');
      return;
    }

    for (const entry of dirtyUnits) {
      await saveUnitChanges(entry.category, entry.itemId, entry.unitId);
    }

    await refreshCatalog();
    setStatusMessage(`Saved ${dirtyUnits.length} unit change${dirtyUnits.length === 1 ? '' : 's'} across the catalogue.`);
  };

  const hasDirtyUnits = categoryOrder.some((category) =>
    catalog[category].some((item) => {
      const originalItem = originalCatalog[category].find((entry) => entry.id === item.id);
      return item.units.some((unit) => {
        const originalUnit = originalItem?.units.find((entry) => entry.id === unit.id);
        return (
          !originalUnit ||
          originalUnit.name !== unit.name ||
          originalUnit.capacity !== unit.capacity ||
          originalUnit.projector !== unit.projector ||
          originalUnit.camera !== unit.camera ||
          originalUnit.available !== unit.available ||
          (originalUnit.unavailabilityReason ?? '') !== (unit.unavailabilityReason ?? '')
        );
      });
    })
  );

  const handleConfirmUnavailability = async () => {
    if (!unavailabilityPrompt) {
      return;
    }

    const reason = unavailabilityPrompt.reason.trim();
    if (!reason) {
      setStatusMessage('Please provide a reason before marking the unit unavailable.');
      return;
    }

    const category = unavailabilityPrompt.category;
    const itemId = unavailabilityPrompt.itemId;
    const unitId = unavailabilityPrompt.unitId;
    const item = catalog[category].find((entry) => entry.id === itemId);
    const unit = item?.units.find((entry) => entry.id === unitId);

    if (!item || !unit) {
      setStatusMessage('Facility unit not found.');
      return;
    }

    try {
      setReasonSaving(true);
      await updateFacilityUnit(category, itemId, unitId, {
        name: unit.name,
        capacity: unit.capacity,
        projector: unit.projector,
        camera: unit.camera,
        available: false,
        unavailabilityReason: reason,
      });
      await refreshCatalog();
      setStatusMessage(`${item.name} / ${unit.name}: unavailability reason saved.`);
      setUnavailabilityPrompt(null);
    } catch (saveError) {
      setStatusMessage(extractErrorMessage(saveError, 'Failed to save unavailability reason.'));
    } finally {
      setReasonSaving(false);
    }
  };

  const handleCancelUnavailability = () => {
    if (unavailabilityPrompt) {
      updateLocalUnit(unavailabilityPrompt.category, unavailabilityPrompt.itemId, unavailabilityPrompt.unitId, {
        available: true,
        unavailabilityReason: null,
      });
    }
    setUnavailabilityPrompt(null);
  };

  const generatePdfReport = () => {
    const doc = new jsPDF({ orientation: 'portrait', unit: 'pt', format: 'a4' });
    const pageWidth = doc.internal.pageSize.getWidth();
    const reportDate = new Date();
    const generatedAt = reportDate.toLocaleString();

    let totalItems = 0;
    let totalUnits = 0;
    let totalAvailable = 0;

    categoryOrder.forEach((category) => {
      const items = catalog[category] ?? [];
      totalItems += items.length;
      items.forEach((item) => {
        totalUnits += item.units.length;
        totalAvailable += item.units.filter((unit) => unit.available).length;
      });
    });

    doc.setFillColor(18, 34, 58);
    doc.rect(0, 0, pageWidth, 92, 'F');
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(18);
    doc.setFont('helvetica', 'bold');
    doc.text('Smart Campus - Facility Catalogue Report', 40, 42);
    doc.setFontSize(11);
    doc.setFont('helvetica', 'normal');
    doc.text(`Generated: ${generatedAt}`, 40, 66);
    doc.text('Prepared by: Admin Dashboard', 40, 82);

    doc.setTextColor(40, 40, 40);
    doc.setFontSize(12);
    doc.setFont('helvetica', 'bold');
    doc.text('Summary', 40, 122);
    doc.setFont('helvetica', 'normal');
    doc.text(
      `Items: ${totalItems}   |   Units: ${totalUnits}   |   Available Units: ${totalAvailable}`,
      40,
      142
    );

    let currentY = 160;

    categoryOrder.forEach((category) => {
      const items = catalog[category] ?? [];

      doc.setFont('helvetica', 'bold');
      doc.setFontSize(12);
      doc.text(categoryMeta[category].title, 40, currentY);

      const rows: Array<string[]> = [];
      items.forEach((item) => {
        if (item.units.length === 0) {
          rows.push([
            item.name,
            item.description || '-',
            '-',
            '-',
            '-',
            '-',
            'No units',
          ]);
          return;
        }

        item.units.forEach((unit) => {
          rows.push([
            item.name,
            item.description || '-',
            unit.name,
            String(unit.capacity),
            unit.projector ? 'Yes' : 'No',
            unit.camera ? 'Yes' : 'No',
            unit.available ? 'Available' : 'Unavailable',
          ]);
        });
      });

      if (rows.length === 0) {
        rows.push(['-', '-', '-', '-', '-', '-', 'No data']);
      }

      autoTable(doc, {
        startY: currentY + 8,
        head: [['Item', 'Description', 'Unit', 'Capacity', 'Projector', 'Camera', 'Status']],
        body: rows,
        theme: 'grid',
        margin: { left: 40, right: 40 },
        styles: {
          fontSize: 9,
          cellPadding: 6,
          textColor: [35, 35, 35],
        },
        headStyles: {
          fillColor: [39, 65, 95],
          textColor: [255, 255, 255],
          fontStyle: 'bold',
        },
        alternateRowStyles: {
          fillColor: [245, 248, 252],
        },
        didParseCell: (data) => {
          if (data.section === 'body' && data.column.index === 6) {
            const value = String(data.cell.raw);
            if (value === 'Available') {
              data.cell.styles.textColor = [22, 132, 77];
              data.cell.styles.fontStyle = 'bold';
            }
            if (value === 'Unavailable') {
              data.cell.styles.textColor = [190, 24, 93];
              data.cell.styles.fontStyle = 'bold';
            }
          }
        },
      });

      currentY = (doc as jsPDF & { lastAutoTable?: { finalY: number } }).lastAutoTable?.finalY
        ? (doc as jsPDF & { lastAutoTable?: { finalY: number } }).lastAutoTable!.finalY + 28
        : currentY + 28;
    });

    const pageCount = doc.getNumberOfPages();
    for (let page = 1; page <= pageCount; page += 1) {
      doc.setPage(page);
      doc.setFontSize(9);
      doc.setTextColor(120, 120, 120);
      doc.text('Smart Campus Facility Catalogue', 40, 820);
      doc.text(`Page ${page} of ${pageCount}`, pageWidth - 100, 820);
    }

    doc.save(`facility-catalogue-report-${reportDate.toISOString().slice(0, 10)}.pdf`);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-campus-surface text-slate-100">
        <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">Loading facility catalogue...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-campus-surface text-slate-100">
      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <header className="mb-8 rounded-3xl border border-campus-line bg-campus-card p-7 shadow-campus">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.18em] text-campus-accent">
                Facility Catalogue
              </p>
              <h1 className="mt-2 text-3xl font-bold sm:text-4xl">Manage Facilities and Units</h1>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <button
                type="button"
                onClick={() => void handleSaveAllUnits()}
                disabled={!hasDirtyUnits}
                className="rounded-xl border border-campus-accent px-4 py-2 text-sm font-semibold text-campus-accent hover:bg-campus-accent/10 disabled:cursor-not-allowed disabled:border-slate-600 disabled:text-slate-500"
              >
                Save All Units
              </button>
              <button
                type="button"
                onClick={generatePdfReport}
                className="rounded-xl bg-campus-accent px-4 py-2 text-sm font-semibold text-slate-900 hover:bg-campus-accent-strong"
              >
                Generate PDF Report
              </button>
              <button
                type="button"
                onClick={() => navigate('/admin')}
                className="rounded-xl border border-campus-line px-4 py-2 text-sm font-semibold text-slate-200 hover:border-campus-accent hover:text-campus-accent"
              >
                Back to Admin Dashboard
              </button>
            </div>
          </div>
          <p className="mt-3 max-w-3xl text-slate-300">
            Add and update lecture halls, labs, and meeting rooms from one panel.
          </p>
          {statusMessage && (
            <p className="mt-4 rounded-xl border border-campus-line bg-campus-surface px-3 py-2 text-sm text-slate-200">
              {statusMessage}
            </p>
          )}
        </header>

        <div className="mb-8 grid grid-cols-1 gap-3 sm:grid-cols-3">
          {categoryOrder.map((category) => {
            const isActive = category === activeCategory;

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

        <section className="mb-8 rounded-3xl border border-campus-line bg-campus-card p-6 shadow-campus-soft">
          <h2 className="text-xl font-semibold">
            Add New {categoryMeta[activeCategory].shortTitle} Item
          </h2>
          <div className="mt-4 grid gap-4 md:grid-cols-2">
            <label className="text-sm text-slate-300">
              Item Name
              <input
                type="text"
                value={newItemName}
                onChange={(event) => setNewItemName(event.target.value)}
                className="mt-2 w-full rounded-xl border border-campus-line bg-campus-surface px-3 py-2 text-slate-100 outline-none focus:border-campus-accent"
                placeholder="Example: Hall C"
              />
            </label>
            <label className="text-sm text-slate-300">
              Description
              <input
                type="text"
                value={newItemDescription}
                onChange={(event) => setNewItemDescription(event.target.value)}
                className="mt-2 w-full rounded-xl border border-campus-line bg-campus-surface px-3 py-2 text-slate-100 outline-none focus:border-campus-accent"
                placeholder="Short description"
              />
            </label>
          </div>
          <button
            type="button"
            onClick={() =>
              openConfirm(
                'Confirm Add Item',
                `Add a new item to ${categoryMeta[activeCategory].title}?`,
                'Add Item',
                handleAddItem
              )
            }
            className="mt-4 rounded-xl bg-campus-accent px-5 py-2.5 font-semibold text-slate-900 hover:bg-campus-accent-strong"
          >
            Add Item
          </button>
        </section>

        <div className="space-y-6">
          {catalog[activeCategory].map((item) => (
            <article
              key={item.id}
              className="rounded-3xl border border-campus-line bg-campus-card p-6 shadow-campus-soft"
            >
              <div className="grid gap-4 md:grid-cols-[1fr_auto] md:items-end">
                <div className="grid gap-4 md:grid-cols-2">
                  <label className="text-sm text-slate-300">
                    Item Name
                    <input
                      type="text"
                      value={item.name}
                      onChange={(event) =>
                        updateLocalItem(activeCategory, item.id, 'name', event.target.value)
                      }
                      className="mt-2 w-full rounded-xl border border-campus-line bg-campus-surface px-3 py-2 text-slate-100 outline-none focus:border-campus-accent"
                    />
                  </label>
                  <label className="text-sm text-slate-300">
                    Description
                    <input
                      type="text"
                      value={item.description}
                      onChange={(event) =>
                        updateLocalItem(activeCategory, item.id, 'description', event.target.value)
                      }
                      className="mt-2 w-full rounded-xl border border-campus-line bg-campus-surface px-3 py-2 text-slate-100 outline-none focus:border-campus-accent"
                    />
                  </label>
                </div>
                <div className="flex gap-3">
                  <button
                    type="button"
                    onClick={() =>
                      openConfirm(
                        'Confirm Save Item',
                        `Save changes for ${item.name}?`,
                        'Save Item',
                        async () => {
                          await handleSaveItem(activeCategory, item.id);
                        }
                      )
                    }
                    className="rounded-xl bg-emerald-400 px-4 py-2 text-sm font-semibold text-slate-900 hover:bg-emerald-300"
                  >
                    Save Item
                  </button>
                  <button
                    type="button"
                    onClick={() =>
                      openConfirm(
                        'Confirm Delete Item',
                        `Delete ${item.name} and all of its units?`,
                        'Delete',
                        async () => {
                          await handleDeleteItem(activeCategory, item.id);
                        }
                      )
                    }
                    className="rounded-xl bg-rose-400 px-4 py-2 text-sm font-semibold text-slate-900 hover:bg-rose-300"
                  >
                    Delete
                  </button>
                </div>
              </div>

              <div className="mt-5 rounded-2xl border border-campus-line bg-campus-surface/60 p-4">
                <h3 className="text-lg font-semibold">Units</h3>
                <div className="mt-3 space-y-3">
                  {item.units.map((unit) => (
                    <div
                      key={unit.id}
                      className="grid gap-3 rounded-xl border border-campus-line bg-campus-card p-3 md:grid-cols-[1.2fr_0.8fr_auto_auto_auto_auto]"
                    >
                      <input
                        type="text"
                        value={unit.name}
                        onChange={(event) =>
                          updateLocalUnit(activeCategory, item.id, unit.id, {
                            name: event.target.value,
                          })
                        }
                        className="rounded-lg border border-campus-line bg-campus-surface px-3 py-2 text-sm text-slate-100 outline-none focus:border-campus-accent"
                        placeholder="Unit name"
                      />
                      <input
                        type="number"
                        min={1}
                        value={unit.capacity}
                        onChange={(event) =>
                          updateLocalUnit(activeCategory, item.id, unit.id, {
                            capacity: Number(event.target.value) || 1,
                          })
                        }
                        className="rounded-lg border border-campus-line bg-campus-surface px-3 py-2 text-sm text-slate-100 outline-none focus:border-campus-accent"
                      />
                      <label className="inline-flex items-center gap-2 text-xs text-slate-300">
                        <input
                          type="checkbox"
                          checked={unit.projector}
                          onChange={(event) =>
                            updateLocalUnit(activeCategory, item.id, unit.id, {
                              projector: event.target.checked,
                            })
                          }
                        />
                        Projector
                      </label>
                      <label className="inline-flex items-center gap-2 text-xs text-slate-300">
                        <input
                          type="checkbox"
                          checked={unit.camera}
                          onChange={(event) =>
                            updateLocalUnit(activeCategory, item.id, unit.id, {
                              camera: event.target.checked,
                            })
                          }
                        />
                        Camera
                      </label>
                      <label className="inline-flex items-center gap-2 text-xs text-slate-300">
                        <input
                          type="checkbox"
                          checked={unit.available}
                          onChange={(event) => updateLocalUnitAvailability(activeCategory, item.id, unit.id, event.target.checked)}
                        />
                        Available
                      </label>
                      {!unit.available && (
                        <div className="rounded-lg border border-rose-400/30 bg-rose-500/10 px-3 py-2 text-xs text-rose-100 md:col-span-2 lg:col-span-1">
                          <p className="font-semibold uppercase tracking-wide text-rose-200">
                            Unavailability Reason
                          </p>
                          <p className="mt-1">
                            {unit.unavailabilityReason?.trim() || 'Reason required before saving.'}
                          </p>
                        </div>
                      )}
                      <button
                        type="button"
                        onClick={() =>
                          openConfirm(
                            'Confirm Save Unit',
                            `Save changes for ${item.name} / ${unit.name}?`,
                            'Save Unit',
                            async () => {
                              await handleSaveUnit(activeCategory, item.id, unit.id);
                            }
                          )
                        }
                        className="rounded-lg bg-campus-accent px-3 py-2 text-xs font-semibold text-slate-900 hover:bg-campus-accent-strong"
                      >
                        Save Unit
                      </button>
                    </div>
                  ))}
                </div>

                <button
                  type="button"
                  onClick={() =>
                    openConfirm(
                      'Confirm Add Unit',
                      `Add a new unit under ${item.name}?`,
                      'Add Unit',
                      async () => {
                        await handleAddUnit(activeCategory, item.id);
                      }
                    )
                  }
                  className="mt-4 rounded-xl border border-campus-accent px-4 py-2 text-sm font-semibold text-campus-accent hover:bg-campus-accent/10"
                >
                  Add Unit
                </button>
              </div>
            </article>
          ))}
        </div>
      </div>

      {confirmAction && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 px-4">
          <div className="w-full max-w-md rounded-2xl border border-campus-line bg-campus-card p-6 shadow-campus">
            <h3 className="text-xl font-semibold text-white">{confirmAction.title}</h3>
            <p className="mt-2 text-sm text-slate-300">{confirmAction.message}</p>
            <div className="mt-5 flex justify-end gap-3">
              <button
                type="button"
                disabled={actionBusy}
                onClick={() => setConfirmAction(null)}
                className="rounded-xl border border-campus-line px-4 py-2 text-sm font-semibold text-slate-200 hover:bg-campus-surface disabled:cursor-not-allowed"
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={actionBusy}
                onClick={() => void runConfirmedAction()}
                className="rounded-xl bg-campus-accent px-4 py-2 text-sm font-semibold text-slate-900 hover:bg-campus-accent-strong disabled:cursor-not-allowed"
              >
                {actionBusy ? 'Please wait...' : confirmAction.confirmLabel}
              </button>
            </div>
          </div>
        </div>
      )}

      {unavailabilityPrompt && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/65 px-4">
          <div className="w-full max-w-lg rounded-3xl border border-campus-line bg-campus-card p-6 shadow-campus">
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-campus-accent">
              Unavailable Unit
            </p>
            <h3 className="mt-2 text-2xl font-semibold text-white">
              Why is {unavailabilityPrompt.itemName} / {unavailabilityPrompt.unitName} unavailable?
            </h3>
            <p className="mt-2 text-sm text-slate-300">
              This note will appear on the student-facing facility pages.
            </p>
            <label className="mt-5 block text-sm text-slate-300">
              Reason
              <textarea
                value={unavailabilityPrompt.reason}
                onChange={(event) =>
                  setUnavailabilityPrompt((current) =>
                    current ? { ...current, reason: event.target.value } : current
                  )
                }
                rows={4}
                className="mt-2 w-full rounded-xl border border-campus-line bg-campus-surface px-3 py-2 text-slate-100 outline-none focus:border-campus-accent"
                placeholder="Example: Maintenance scheduled until Friday"
              />
            </label>
            <div className="mt-5 flex justify-end gap-3">
              <button
                type="button"
                disabled={reasonSaving}
                onClick={handleCancelUnavailability}
                className="rounded-xl border border-campus-line px-4 py-2 text-sm font-semibold text-slate-200 hover:bg-campus-surface disabled:cursor-not-allowed disabled:opacity-60"
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={reasonSaving}
                onClick={() => void handleConfirmUnavailability()}
                className="rounded-xl bg-campus-accent px-4 py-2 text-sm font-semibold text-slate-900 hover:bg-campus-accent-strong disabled:cursor-not-allowed disabled:opacity-70"
              >
                {reasonSaving ? 'Saving...' : 'Save Reason'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboardFacility;
