export interface Counter {
  id: string;
  name: string;
  value: number;
}

export const storageKey = 'counter.workspace.v1';

export function parseCounters(raw: string): Counter[] {
  const value: unknown = JSON.parse(raw);
  if (!Array.isArray(value) || !value.every((item: unknown) => {
    if (typeof item !== 'object' || item === null) return false;
    const counter = item as Record<string, unknown>;
    return typeof counter.id === 'string'
      && typeof counter.name === 'string'
      && typeof counter.value === 'number' && Number.isSafeInteger(counter.value);
  })) {
    throw new Error('Your saved counters could not be read. Your original data has not been changed.');
  }
  if (new Set(value.map(item => item.id)).size !== value.length) {
    throw new Error('Your saved counters contain duplicate identifiers. Your original data has not been changed.');
  }
  return value;
}

export function loadCounters(storage: Pick<Storage, 'getItem'>): Counter[] {
  const saved = storage.getItem(storageKey);
  if (saved !== null) return parseCounters(saved);

  const legacy = storage.getItem('items');
  if (!legacy) return [];
  return legacy.split('|^%').map((entry, index) => {
    const parts = entry.split(';');
    const value = Number(parts[2]);
    if (parts.length !== 3 || parts[2].trim() === '' || !Number.isSafeInteger(value)) {
      throw new Error('Your previous counters could not be imported. Your original data has not been changed.');
    }
    return {
      id: `imported-${index}`,
      name: parts[0],
      value,
    };
  });
}

export function changeValue(counters: Counter[], id: string, amount: number): Counter[] {
  return counters.map(counter => {
    if (counter.id !== id) return counter;
    const value = counter.value + amount;
    if (!Number.isSafeInteger(value)) throw new Error('This counter has reached its numeric limit.');
    return { ...counter, value };
  });
}

export function createCounter(name: string): Counter {
  if (!name.trim()) throw new Error('Give your counter a name.');
  return {
    id: crypto.randomUUID(),
    name: name.trim(),
    value: 0,
  };
}
