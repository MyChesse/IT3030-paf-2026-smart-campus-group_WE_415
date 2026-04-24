import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? '/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export type FacilityCategoryKey = 'lectureHalls' | 'labs' | 'meetingRooms';

export interface FacilityUnit {
  id: number;
  name: string;
  capacity: number;
  projector: boolean;
  camera: boolean;
  available: boolean;
  unavailabilityReason?: string | null;
}

export interface FacilityItem {
  id: number;
  name: string;
  description: string;
  units: FacilityUnit[];
}

export type FacilityCatalog = Record<FacilityCategoryKey, FacilityItem[]>;

export const categoryMeta: Record<
  FacilityCategoryKey,
  { title: string; shortTitle: string; helper: string; apiValue: string }
> = {
  lectureHalls: {
    title: 'Lecture Halls',
    shortTitle: 'Lec Halls',
    helper: 'Find halls with seats, projector and camera availability.',
    apiValue: 'LECTURE_HALLS',
  },
  labs: {
    title: 'Labs',
    shortTitle: 'Labs',
    helper: 'Book labs with required capacity and technical setup.',
    apiValue: 'LABS',
  },
  meetingRooms: {
    title: 'Meeting Rooms',
    shortTitle: 'Meeting Rooms',
    helper: 'Reserve meeting rooms for team and faculty sessions.',
    apiValue: 'MEETING_ROOMS',
  },
};

const mapUnit = (unit: any): FacilityUnit => ({
  id: unit.id,
  name: unit.name,
  capacity: unit.capacity,
  projector: unit.projector,
  camera: unit.camera,
  available: unit.available,
  unavailabilityReason: unit.unavailabilityReason ?? unit.unavailability_reason ?? null,
});

const mapItem = (item: any): FacilityItem => ({
  id: item.id,
  name: item.name,
  description: item.description ?? '',
  units: (item.units ?? []).map(mapUnit),
});

export const emptyCatalog = (): FacilityCatalog => ({
  lectureHalls: [],
  labs: [],
  meetingRooms: [],
});

export const getFacilityCatalog = async (): Promise<FacilityCatalog> => {
  const response = await api.get('/facilities/catalog');
  const data = response.data ?? {};

  return {
    lectureHalls: (data.lectureHalls ?? []).map(mapItem),
    labs: (data.labs ?? []).map(mapItem),
    meetingRooms: (data.meetingRooms ?? []).map(mapItem),
  };
};

export const createFacilityItem = async (
  category: FacilityCategoryKey,
  payload: { name: string; description: string }
): Promise<FacilityItem> => {
  const response = await api.post(`/facilities/${categoryMeta[category].apiValue}/items`, payload);
  return mapItem(response.data);
};

export const updateFacilityItem = async (
  category: FacilityCategoryKey,
  itemId: number,
  payload: { name: string; description: string }
): Promise<FacilityItem> => {
  const response = await api.put(`/facilities/${categoryMeta[category].apiValue}/items/${itemId}`, payload);
  return mapItem(response.data);
};

export const deleteFacilityItem = async (
  category: FacilityCategoryKey,
  itemId: number
): Promise<void> => {
  await api.delete(`/facilities/${categoryMeta[category].apiValue}/items/${itemId}`);
};

export const createFacilityUnit = async (
  category: FacilityCategoryKey,
  itemId: number,
  payload: {
    name: string;
    capacity: number;
    projector: boolean;
    camera: boolean;
    available: boolean;
    unavailabilityReason?: string | null;
  }
): Promise<FacilityItem> => {
  const response = await api.post(
    `/facilities/${categoryMeta[category].apiValue}/items/${itemId}/units`,
    payload
  );
  return mapItem(response.data);
};

export const updateFacilityUnit = async (
  category: FacilityCategoryKey,
  itemId: number,
  unitId: number,
  payload: {
    name: string;
    capacity: number;
    projector: boolean;
    camera: boolean;
    available: boolean;
    unavailabilityReason?: string | null;
  }
): Promise<FacilityItem> => {
  const response = await api.put(
    `/facilities/${categoryMeta[category].apiValue}/items/${itemId}/units/${unitId}`,
    payload
  );
  return mapItem(response.data);
};
