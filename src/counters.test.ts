import { describe, expect, it } from 'vitest';
import { changeValue, createCounter, loadCounters, parseCounters, storageKey } from './counters';

const storage = (entries: Record<string, string>) => ({
  getItem: (key: string) => entries[key] ?? null,
});

describe('counter persistence', () => {
  it('imports the existing Angular storage without changing names or values', () => {
    const counters = loadCounters(storage({ items: 'Coffee;Morning ritual;12|^%Books;Read this year;0' }));
    expect(counters.map(({ name, value }) => ({ name, value }))).toEqual([
      { name: 'Coffee', value: 12 },
      { name: 'Books', value: 0 },
    ]);
    expect(new Set(counters.map(counter => counter.id)).size).toBe(2);
  });

  it('prefers saved React data, including an intentionally empty workspace', () => {
    expect(loadCounters(storage({ [storageKey]: '[]', items: 'Coffee;Morning;12' }))).toEqual([]);
  });

  it('reads counters saved by the previous interface', () => {
    const counter = {
      id: 'existing', name: 'Coffee', description: 'Morning', value: 12,
      color: 'lavender', pinned: true, createdAt: 123,
    };
    expect(loadCounters(storage({ [storageKey]: JSON.stringify([counter]) }))[0]).toMatchObject({
      id: 'existing', name: 'Coffee', value: 12,
    });
  });

  it('round-trips names containing legacy delimiters', () => {
    const counter = createCounter('Tea; coffee |^%');
    expect(parseCounters(JSON.stringify([counter]))).toEqual([counter]);
  });

  it('reports invalid data instead of silently replacing it', () => {
    expect(() => loadCounters(storage({ items: 'Broken;counter;NaN' }))).toThrow('could not be imported');
    expect(() => parseCounters('[{"name":"Missing fields"}]')).toThrow('could not be read');
    const counter = createCounter('Duplicate');
    expect(() => parseCounters(JSON.stringify([counter, counter]))).toThrow('duplicate');
  });
});

describe('counter changes', () => {
  it('updates only the selected counter and preserves the previous state', () => {
    const first = createCounter('First');
    const second = createCounter('Second');
    const counters = [first, second];
    const changed = changeValue(counters, first.id, 1);
    expect(changed.map(counter => counter.value)).toEqual([1, 0]);
    expect(counters.map(counter => counter.value)).toEqual([0, 0]);
    expect(changeValue(changed, first.id, -1)[0].value).toBe(0);
  });

  it('rejects blank names and unsafe values', () => {
    expect(() => createCounter('  ')).toThrow('name');
    const counter = { ...createCounter('Full'), value: Number.MAX_SAFE_INTEGER };
    expect(() => changeValue([counter], counter.id, 1)).toThrow('numeric limit');
  });
});
