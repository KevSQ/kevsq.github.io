import { useState } from 'react';
import { supabase } from '../lib/supabase';

interface Entry {
  id: number;
  name: string;
  message: string;
  created_at: string;
}

interface Props {
  initialEntries: Entry[];
}

function formatAge(iso: string): string {
  const days = Math.floor((Date.now() - new Date(iso).valueOf()) / 86_400_000);
  if (days < 1)  return 'today';
  if (days === 1) return '1d';
  if (days < 7)  return `${days}d`;
  if (days < 30) return `${Math.floor(days / 7)}w`;
  return `${Math.floor(days / 30)}mo`;
}

export default function GuestbookForm({ initialEntries }: Props) {
  const [entries, setEntries]   = useState<Entry[]>(initialEntries);
  const [name, setName]         = useState('');
  const [message, setMessage]   = useState('');
  const [status, setStatus]     = useState<'idle' | 'sending' | 'done' | 'error'>('idle');

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus('sending');
    const { data, error } = await supabase
      .from('guestbook')
      .insert({ name: name.trim(), message: message.trim() })
      .select()
      .single();
    if (error) {
      setStatus('error');
      return;
    }
    setEntries([data, ...entries]);
    setName('');
    setMessage('');
    setStatus('done');
    setTimeout(() => setStatus('idle'), 3000);
  }

  return (
    <div>
      <div className="gb-section-label">❦ leave a note</div>
      <form onSubmit={handleSubmit} className="gb-form">
        <div className="gb-field">
          <label className="gb-field-label">name</label>
          <input type="text" value={name} onChange={e => setName(e.target.value)}
            maxLength={50} required className="gb-input" placeholder="your name" />
        </div>
        <div className="gb-field">
          <label className="gb-field-label">message</label>
          <textarea value={message} onChange={e => setMessage(e.target.value)}
            maxLength={280} required rows={3} className="gb-input gb-textarea" placeholder="say something" />
        </div>
        <div className="gb-form-footer">
          <button type="submit" disabled={status === 'sending'} className="gb-button">
            {status === 'sending' ? 'sending...' : '+ sign →'}
          </button>
          {status === 'done'  && <span className="gb-success">signed!</span>}
          {status === 'error' && <span className="gb-error">something went wrong — try again</span>}
        </div>
      </form>

      <div className="gb-section-label gb-entries-label">❦ notes from readers</div>

      {entries.length === 0 && (
        <p className="gb-empty">no entries yet — be the first</p>
      )}

      {entries.map(entry => (
        <div key={entry.id} className="gb-entry">
          <div className="gb-quote">"{entry.message}"</div>
          <div className="gb-author">— {entry.name} · {formatAge(entry.created_at)}</div>
        </div>
      ))}

      <style>{`
        .gb-section-label { font-family: var(--mono); font-size: 10.5px; color: var(--dim); text-transform: uppercase; letter-spacing: 1.5px; margin-bottom: 12px; }
        .gb-form { display: flex; flex-direction: column; gap: 10px; margin-bottom: 28px; }
        .gb-field { display: flex; flex-direction: column; gap: 4px; }
        .gb-field-label { font-family: var(--mono); font-size: 10px; color: var(--dim); text-transform: uppercase; letter-spacing: 1px; }
        .gb-input { background: var(--panel); border: 1px solid var(--border); color: var(--fg); font-family: var(--serif); font-size: 14px; padding: 6px 8px; outline: none; width: 100%; }
        .gb-input:focus { border-color: var(--accent); }
        .gb-textarea { resize: vertical; }
        .gb-form-footer { display: flex; align-items: center; gap: 12px; }
        .gb-button { font-family: var(--mono); font-size: 11px; color: var(--accent); background: none; border: 1px solid var(--accent); padding: 6px 14px; cursor: pointer; }
        .gb-button:hover:not(:disabled) { background: var(--panel); }
        .gb-button:disabled { opacity: 0.5; cursor: default; }
        .gb-success { font-family: var(--mono); font-size: 11px; color: var(--moss); }
        .gb-error { font-family: var(--mono); font-size: 11px; color: var(--terra); }
        .gb-entries-label { margin-top: 0; }
        .gb-entry { padding: 10px 0; border-bottom: 1px dashed var(--border); }
        .gb-entry:last-child { border-bottom: none; }
        .gb-quote { font-family: var(--hand); color: var(--fg); font-size: 15px; line-height: 1.4; }
        .gb-author { font-family: var(--mono); font-size: 10.5px; color: var(--dim); margin-top: 4px; }
        .gb-empty { font-family: var(--mono); font-size: 11px; color: var(--dim); margin: 0 0 28px; }
      `}</style>
    </div>
  );
}
