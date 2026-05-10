import { useState } from 'react';
import { supabase } from '../lib/supabase';
import type { GuestbookEntry } from '../lib/supabase-server';

interface Props {
  initialEntries: GuestbookEntry[];
}

function relativeTime(iso: string): string {
  const days = Math.floor((Date.now() - new Date(iso).getTime()) / 86_400_000);
  if (days < 1) return 'today';
  if (days === 1) return '1 day ago';
  if (days < 7) return `${days} days ago`;
  const wk = Math.floor(days / 7);
  if (wk === 1) return '1 week ago';
  if (wk < 5) return `${wk} weeks ago`;
  const mo = Math.floor(days / 30);
  return mo === 1 ? '1 month ago' : `${mo} months ago`;
}

export default function GuestbookForm({ initialEntries }: Props) {
  const [name, setName]         = useState('');
  const [location, setLocation] = useState('');
  const [message, setMessage]   = useState('');
  const [status, setStatus]     = useState<'idle' | 'sending' | 'sent' | 'error'>('idle');

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim() || !message.trim()) return;
    setStatus('sending');
    const { error } = await supabase.from('guestbook').insert({
      name: name.trim(),
      message: message.trim(),
      location: location.trim() || null,
    });
    if (error) { setStatus('error'); return; }
    setStatus('sent');
    setName('');
    setLocation('');
    setMessage('');
  }

  return (
    <>
      <div className="label">✎ leave a note</div>
      <form className="gb-form" onSubmit={handleSubmit}>
        <div className="row">
          <div className="field">
            <label htmlFor="gb-name">your name (or a handle)</label>
            <input
              id="gb-name"
              type="text"
              placeholder="e.g. mira"
              value={name}
              onChange={e => setName(e.target.value)}
              maxLength={80}
              required
            />
          </div>
          <div className="field">
            <label htmlFor="gb-where">
              where you're writing from{' '}
              <span style={{ color: 'var(--dim)', textTransform: 'none', letterSpacing: 0 }}>
                (optional)
              </span>
            </label>
            <input
              id="gb-where"
              type="text"
              placeholder="e.g. brooklyn, ny"
              value={location}
              onChange={e => setLocation(e.target.value)}
              maxLength={80}
            />
          </div>
        </div>
        <div className="field">
          <label htmlFor="gb-msg">your note</label>
          <textarea
            id="gb-msg"
            placeholder="say hi…"
            value={message}
            onChange={e => setMessage(e.target.value)}
            maxLength={280}
            required
          />
        </div>
        <div className="actions">
          <span className="hint">
            {status === 'sending' && 'sending…'}
            {status === 'sent'    && "left! it'll appear after moderation."}
            {status === 'error'   && 'something went wrong — try again.'}
            {status === 'idle'    && '280 chars · plain text · moderated by hand'}
          </span>
          <button className="btn" type="submit" disabled={status === 'sending'}>
            {status === 'sending' ? 'sending…' : 'leave the note ↗'}
          </button>
        </div>
      </form>

      <div className="label">❦ recent entries</div>
      {initialEntries.map((entry, i) => (
        <div key={entry.id} className={i === 0 ? 'entry featured' : 'entry'}>
          <p className="msg">{entry.message}</p>
          <div className="sig">
            <span className="who">— {entry.name}</span>
            {entry.location && <span className="where">{entry.location}</span>}
            <span>· {relativeTime(entry.created_at)}</span>
          </div>
        </div>
      ))}
    </>
  );
}
