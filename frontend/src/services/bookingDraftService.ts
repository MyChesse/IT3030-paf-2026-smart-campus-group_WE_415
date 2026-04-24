interface DraftBooking {
  id: string;
  category: string;
  itemName: string;
  unitName: string;
  capacity: number;
  createdAt: string;
}

const STORAGE_KEY = "smart-campus.booking-drafts.v1";

const makeId = () =>
  `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`;

export const saveBookingDraft = (draft: Omit<DraftBooking, "id" | "createdAt">) => {
  const existing = localStorage.getItem(STORAGE_KEY);
  const list: DraftBooking[] = existing ? (JSON.parse(existing) as DraftBooking[]) : [];

  const next: DraftBooking[] = [
    {
      id: makeId(),
      createdAt: new Date().toISOString(),
      ...draft,
    },
    ...list,
  ];

  localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
  return next[0];
};
