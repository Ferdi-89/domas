'use client';

import { FormEvent, useCallback, useEffect, useState } from 'react';
import type { Session, User } from '@supabase/supabase-js';
import { supabase } from '@/lib/supabase';

type Category = { id: number; name: string; type: 'income' | 'expense'; user_id: string | null };
type Transaction = { id: number; type: 'income' | 'expense'; amount: number; transaction_date: string; description: string | null; categories: { name: string } | null };

export default function Home() {
  const [session, setSession] = useState<Session | null>(null);
  const [categories, setCategories] = useState<Category[]>([]);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [signup, setSignup] = useState(false);
  const [type, setType] = useState<'income' | 'expense'>('expense');
  const [amount, setAmount] = useState('');
  const [categoryId, setCategoryId] = useState('');
  const [date, setDate] = useState(new Date().toISOString().slice(0, 10));
  const [description, setDescription] = useState('');
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState(false);

  const user = session?.user;
  const client = supabase;
  const notify = (text: string, isError = false) => { setMessage(text); setError(isError); };
  const loadTransactions = useCallback(async (currentUser: User) => {
    if (!client) return;
    const { data, error: queryError } = await client.from('transactions')
      .select('id,type,amount,transaction_date,description,categories(name)')
      .eq('user_id', currentUser.id)
      .order('transaction_date', { ascending: false }).order('id', { ascending: false }).limit(50);
    if (queryError) throw queryError;
    setTransactions((data ?? []) as unknown as Transaction[]);
  }, [client]);

  const initialize = useCallback(async (currentUser: User) => {
    if (!client) return;
    const { error: profileError } = await client.from('users').upsert({
      id: currentUser.id,
      email: currentUser.email!,
      name: currentUser.user_metadata?.name || currentUser.email!.split('@')[0],
    });
    if (profileError) throw profileError;
    const { data, error: categoryError } = await client.from('categories')
      .select('id,name,type,user_id').order('name');
    if (categoryError) throw categoryError;
    const next = (data ?? []) as Category[];
    for (const [name, categoryType] of [['Makanan', 'expense'], ['Pemasukan lain', 'income']] as const) {
      if (!next.some(category => category.name === name && category.type === categoryType)) {
        const { data: created, error: insertError } = await client.from('categories')
          .insert({ user_id: currentUser.id, name, type: categoryType })
          .select('id,name,type,user_id').single();
        if (insertError) throw insertError;
        next.push(created as Category);
      }
    }
    setCategories(next);
    await loadTransactions(currentUser);
  }, [client, loadTransactions]);

  useEffect(() => {
    if (!supabase) return;
    let alive = true;
    supabase.auth.getSession().then(({ data, error: sessionError }) => {
      if (!alive) return;
      if (sessionError) notify(sessionError.message, true);
      setSession(data.session);
      if (data.session) void initialize(data.session.user).catch(e => notify(e.message, true));
    });
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, nextSession) => {
      if (!alive) return;
      setSession(nextSession);
      if (nextSession) setTimeout(() => { void initialize(nextSession.user).catch(e => notify(e.message, true)); }, 0);
      else { setCategories([]); setTransactions([]); }
    });
    return () => { alive = false; subscription.unsubscribe(); };
  }, [initialize]);

  useEffect(() => {
    const first = categories.find(category => category.type === type);
    setCategoryId(String(first?.id ?? ''));
  }, [categories, type]);

  async function submitAuth(event: FormEvent<HTMLFormElement>) {
    event.preventDefault(); if (!supabase) return;
    setBusy(true);
    const form = new FormData(event.currentTarget);
    const email = String(form.get('email')).trim();
    const password = String(form.get('password'));
    try {
      const result = signup
        ? await supabase.auth.signUp({ email, password, options: { data: { name: String(form.get('name')).trim() } } })
        : await supabase.auth.signInWithPassword({ email, password });
      if (result.error) throw result.error;
      if (!result.data.session) notify('Akun dibuat. Verifikasi email jika diminta, lalu masuk.');
    } catch (e) { notify(e instanceof Error ? e.message : 'Autentikasi gagal.', true); }
    finally { setBusy(false); }
  }

  async function submitTransaction(event: FormEvent<HTMLFormElement>) {
    event.preventDefault(); if (!supabase || !user) return;
    const value = Number(amount);
    if (!Number.isFinite(value) || value <= 0) return notify('Nominal harus lebih besar dari nol.', true);
    setBusy(true);
    try {
      const { error: insertError } = await supabase.from('transactions').insert({
        user_id: user.id, category_id: Number(categoryId), type, amount: value,
        transaction_date: date, description: description.trim() || null,
      });
      if (insertError) throw insertError;
      setAmount(''); setDescription(''); await loadTransactions(user); notify('Transaksi tersimpan.');
    } catch (e) { notify(e instanceof Error ? e.message : 'Gagal menyimpan transaksi.', true); }
    finally { setBusy(false); }
  }

  return <main className="shell">
    <header className="header"><div className="eyebrow">DOMAS · WALKING SKELETON</div><h1>Catatan keuangan</h1><p>Masuk, catat transaksi, tinjau riwayat tersimpan di Supabase.</p></header>
    {message && <div className={`notice ${error ? 'error' : ''}`} role="status" aria-live="polite">{message}</div>}
    {!supabase && <section className="panel"><h2>Konfigurasi Supabase belum ada</h2><p>Isi <code>.env.local</code> memakai <code>.env.example</code>, jalankan <code>supabase.sql</code> di SQL Editor, lalu restart server.</p><p className="muted">Pakai publishable/anon key. Jangan pernah masukkan service-role key ke aplikasi browser.</p></section>}
    {supabase && !session && <section className="panel"><div className="panel-head"><h2>{signup ? 'Buat akun' : 'Masuk'}</h2><button className="text-button" onClick={() => setSignup(!signup)} type="button">{signup ? 'Sudah punya akun?' : 'Buat akun'}</button></div>
      <form onSubmit={submitAuth} className="form"><label>Email<input name="email" type="email" autoComplete="email" required /></label><label>Kata sandi<input name="password" type="password" autoComplete={signup ? 'new-password' : 'current-password'} minLength={8} required /></label>{signup && <label>Nama<input name="name" autoComplete="name" maxLength={100} required /></label>}<button className="primary" disabled={busy}>{busy ? 'Memproses…' : signup ? 'Daftar' : 'Masuk'}</button></form></section>}
    {supabase && session && <>
      <section className="panel"><div className="panel-head"><div><h2>Transaksi baru</h2><p className="muted">{user?.user_metadata?.name || user?.email}</p></div><button className="text-button" onClick={async () => { const { error: signOutError } = await client!.auth.signOut(); if (signOutError) notify(signOutError.message, true); }} type="button">Keluar</button></div>
        <form onSubmit={submitTransaction} className="form"><div className="grid"><label>Jenis<select value={type} onChange={e => setType(e.target.value as 'income' | 'expense')}><option value="expense">Pengeluaran</option><option value="income">Pemasukan</option></select></label><label>Kategori<select value={categoryId} onChange={e => setCategoryId(e.target.value)} required>{categories.filter(c => c.type === type).map(c => <option key={c.id} value={c.id}>{c.name}</option>)}</select></label></div><div className="grid"><label>Nominal (Rp)<input type="number" min="1" step="1" inputMode="numeric" value={amount} onChange={e => setAmount(e.target.value)} required /></label><label>Tanggal<input type="date" value={date} onChange={e => setDate(e.target.value)} required /></label></div><label>Catatan (opsional)<input value={description} onChange={e => setDescription(e.target.value)} maxLength={500} /></label><button className="primary" disabled={busy}>{busy ? 'Menyimpan…' : 'Simpan transaksi'}</button></form>
      </section>
      <section className="panel"><div className="panel-head"><h2>Riwayat transaksi</h2><button className="text-button" onClick={() => user && void loadTransactions(user).then(() => notify('Riwayat diperbarui.')).catch(e => notify(e.message, true))} type="button">Muat ulang</button></div>
        {transactions.length ? <ul className="list">{transactions.map(t => <li key={t.id}><div><strong>{t.description || t.categories?.name || 'Transaksi'}</strong><small>{t.categories?.name} · {t.transaction_date}</small></div><strong className={t.type}>{t.type === 'income' ? '+' : '−'} Rp {Number(t.amount).toLocaleString('id-ID')}</strong></li>)}</ul> : <p className="muted">Belum ada transaksi. Catat transaksi pertama di atas.</p>}
      </section>
    </>}
    <footer>Versi awal: autentikasi, pencatatan, dan riwayat transaksi. Data dibatasi Row Level Security di PostgreSQL.</footer>
  </main>;
}
