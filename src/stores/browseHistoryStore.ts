import { defineStore } from 'pinia';

export interface BrowseRecord {
  itemId: string;
  viewedAt: number;
}

const STORAGE_KEY = 'reswap:browse-history';
const MAX_RECORDS = 20;

function load(): BrowseRecord[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    return JSON.parse(raw) as BrowseRecord[];
  } catch {
    return [];
  }
}

function save(records: BrowseRecord[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(records));
}

export const useBrowseHistoryStore = defineStore('browseHistory', {
  state: () => ({
    records: load() as BrowseRecord[],
  }),
  getters: {
    recentItemIds: (state) => state.records.map((r) => r.itemId),
  },
  actions: {
    record(itemId: string) {
      const rest = this.records.filter((r) => r.itemId !== itemId);
      rest.unshift({ itemId, viewedAt: Date.now() });
      this.records = rest.slice(0, MAX_RECORDS);
      save(this.records);
    },
    clear() {
      this.records = [];
      localStorage.removeItem(STORAGE_KEY);
    },
  },
});
