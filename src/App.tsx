import { useEffect, useRef, useState } from 'react';
import type { FormEvent } from 'react';
import { Plus, RotateCcw, Trash2, X } from 'lucide-react';
import type { Counter } from './counters';
import { changeValue, createCounter, loadCounters, storageKey } from './counters';

function errorMessage(error: unknown): string {
  return error instanceof Error ? error.message : 'Unable to save counters.';
}

function AddCounter({ onAdd, onClose, error }: {
  onAdd: (name: string) => void;
  onClose: () => void;
  error: string;
}) {
  const ref = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const dialog = ref.current!;
    const previousFocus = document.activeElement;
    dialog.showModal();
    dialog.querySelector('input')?.focus();
    return () => {
      dialog.close();
      if (previousFocus instanceof HTMLElement) previousFocus.focus();
    };
  }, []);

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    onAdd(String(new FormData(event.currentTarget).get('name') ?? ''));
  }

  return (
    <dialog ref={ref} aria-label="New counter" onCancel={onClose} onClick={event => {
      if (event.target === event.currentTarget) onClose();
    }}>
      <form onSubmit={submit}>
        <input name="name" aria-label="Counter name" placeholder="Counter name" maxLength={80} required />
        <button type="submit" aria-label="Create counter"><Plus size={22} /></button>
        <button type="button" aria-label="Cancel" onClick={onClose}><X size={22} /></button>
      </form>
      {error && <p className="error" role="alert">{error}</p>}
    </dialog>
  );
}

export default function App() {
  const [initial] = useState(() => {
    try {
      return { counters: loadCounters(localStorage), error: '' };
    } catch (error) {
      console.error('Unable to load counters:', error);
      return { counters: [] as Counter[], error: errorMessage(error) };
    }
  });
  const [counters, setCounters] = useState(initial.counters);
  const [loadError, setLoadError] = useState(initial.error);
  const [error, setError] = useState(initial.error);
  const [adding, setAdding] = useState(() => location.pathname.replace(/\/$/, '').endsWith('/add'));

  useEffect(() => {
    function synchronize(event: StorageEvent) {
      if (event.storageArea !== localStorage || (event.key !== storageKey && event.key !== null)) return;
      try {
        setCounters(loadCounters(localStorage));
        setLoadError('');
        setError('');
      } catch (cause) {
        console.error('Unable to load counters:', cause);
        setLoadError(errorMessage(cause));
        setError(errorMessage(cause));
      }
    }
    window.addEventListener('storage', synchronize);
    return () => window.removeEventListener('storage', synchronize);
  }, []);

  function update(transform: (items: Counter[]) => Counter[]): boolean {
    try {
      if (loadError) throw new Error(loadError);
      const next = transform(counters);
      localStorage.setItem(storageKey, JSON.stringify(next));
      setCounters(next);
      setError('');
      return true;
    } catch (cause) {
      console.error('Unable to save counters:', cause);
      setError(errorMessage(cause));
      return false;
    }
  }

  function close() {
    setAdding(false);
    if (location.pathname.replace(/\/$/, '').endsWith('/add')) {
      history.replaceState(null, '', import.meta.env.BASE_URL);
    }
  }

  return (
    <main>
      {error && !adding && <p className="error" role="alert">{error}</p>}
      <div className="counters">
        {counters.map(counter => (
          <article className="counter" key={counter.id} aria-label={`${counter.name} counter`}>
            <h2>{counter.name}</h2>
            <button className="value" aria-label={`Increase ${counter.name}`} disabled={!!loadError}
              onClick={() => update(items => changeValue(items, counter.id, 1))}>
              <span aria-live="polite" aria-atomic="true">{counter.value.toLocaleString()}</span>
            </button>
            <div className="actions">
              <button aria-label={`Reset ${counter.name}`} disabled={!!loadError}
                onClick={() => update(items => items.map(item => item.id === counter.id ? { ...item, value: 0 } : item))}>
                <RotateCcw size={19} />
              </button>
              <button aria-label={`Remove ${counter.name}`} disabled={!!loadError}
                onClick={() => update(items => items.filter(item => item.id !== counter.id))}>
                <Trash2 size={19} />
              </button>
            </div>
          </article>
        ))}
      </div>
      <button className="add" aria-label="Add counter" disabled={!!loadError} onClick={() => setAdding(true)}>
        <Plus size={26} />
      </button>
      {adding && <AddCounter error={error} onClose={close} onAdd={name => {
        if (update(items => [...items, createCounter(name)])) close();
      }} />}
    </main>
  );
}
