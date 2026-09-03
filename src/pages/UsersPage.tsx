import { useState } from 'react';
import { Plus, Search, Edit2, Trash2 } from 'lucide-react';
import { useApp } from '@/hooks/useAppStore';
import { PageHeader, Card, Button, Input, Modal, ConfirmDialog, Badge, EmptyState } from '@/components/ui';

interface UserItem {
  id: string;
  nama: string;
  email: string;
  role: string;
  unit: string;
  status: 'Aktif' | 'Nonaktif';
}

const userSeed: UserItem[] = [
  { id: 'usr-001', nama: 'M. Yusuf Badru Tamam', email: 'yusuf@idn.sch.id', role: 'Super Admin', unit: 'Kantor Yayasan', status: 'Aktif' },
  { id: 'usr-002', nama: 'Doni Azizi, S.Kom', email: 'doni@idn.sch.id', role: 'Kepala Sarana Prasarana', unit: 'Kantor Yayasan', status: 'Aktif' },
  { id: 'usr-003', nama: 'Bapak Ari', email: 'ari@idn.sch.id', role: 'Staff', unit: 'IDN Jonggol Ikhwan', status: 'Aktif' },
  { id: 'usr-004', nama: 'Bapak Hendro', email: 'hendro@idn.sch.id', role: 'Staff', unit: 'IDN Jonggol Ikhwan', status: 'Aktif' },
  { id: 'usr-005', nama: 'Ibu Siti', email: 'siti@idn.sch.id', role: 'Staff', unit: 'IDN Jonggol Akhwat', status: 'Aktif' },
  { id: 'usr-006', nama: 'Bapak Akim', email: 'akim@idn.sch.id', role: 'Staff', unit: 'IDN Pamijahan', status: 'Aktif' },
  { id: 'usr-007', nama: 'Bapak Yusuf', email: 'yusuf.s@idn.sch.id', role: 'Staff', unit: 'IDN Sentul', status: 'Aktif' },
  { id: 'usr-008', nama: 'Bapak Hari', email: 'hari@idn.sch.id', role: 'Staff', unit: 'IDN Solo', status: 'Aktif' },
];

const roleOptions = ['Super Admin', 'Kepala Sarana Prasarana', 'Staff'];
const unitOptions = ['Kantor Yayasan', 'IDN Jonggol Ikhwan', 'IDN Jonggol Akhwat', 'IDN Pamijahan', 'IDN Sentul', 'IDN Solo'];

export function UsersPage() {
  const [users, setUsers] = useState<UserItem[]>(userSeed);
  const [search, setSearch] = useState('');
  const [filterRole, setFilterRole] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [editing, setEditing] = useState<UserItem | null>(null);
  const { pushToast } = useApp();

  const filtered = users.filter(u => {
    const matchSearch = !search || u.nama.toLowerCase().includes(search.toLowerCase()) || u.email.toLowerCase().includes(search.toLowerCase());
    const matchRole = !filterRole || u.role === filterRole;
    return matchSearch && matchRole;
  });

  const handleSave = (data: Omit<UserItem, 'id'>) => {
    if (editing) {
      setUsers(prev => prev.map(u => u.id === editing.id ? { ...editing, ...data } : u));
    } else {
      setUsers(prev => [{ ...data, id: `usr-${Date.now()}` }, ...prev]);
    }
    pushToast('Data berhasil disimpan.');
    setModalOpen(false); setEditing(null);
  };

  const handleDelete = (id: string) => {
    setUsers(prev => prev.filter(u => u.id !== id));
  };

  const roleBadge = (role: string) => {
    if (role === 'Super Admin') return <Badge variant="brand">{role}</Badge>;
    if (role === 'Kepala Sarana Prasarana') return <Badge variant="info">{role}</Badge>;
    return <Badge variant="neutral">{role}</Badge>;
  };

  return (
    <div>
      <PageHeader title="User & Role" subtitle="Manajemen pengguna dan hak akses sistem"
        breadcrumb={['SPMS', 'Pengaturan', 'User & Role']}
        actions={<Button onClick={() => { setEditing(null); setModalOpen(true); }}><Plus size={16} /> Tambah User</Button>} />

      <Card className="mb-4 p-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <div className="relative">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-ink-300" />
            <input type="text" value={search} onChange={e => setSearch(e.target.value)} placeholder="Cari user..."
              className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-ink-200 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500 bg-white" />
          </div>
          <select value={filterRole} onChange={e => setFilterRole(e.target.value)} className="px-3 py-2.5 rounded-lg border border-ink-200 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-brand-500">
            <option value="">Semua Role</option>
            {roleOptions.map(r => <option key={r} value={r}>{r}</option>)}
          </select>
        </div>
      </Card>

      <Card className="overflow-hidden">
        <div className="overflow-x-auto scrollbar-thin">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-ink-100 bg-ink-50/50">
                <th className="text-left px-4 py-3 text-xs font-bold text-ink-500 uppercase">User</th>
                <th className="text-left px-4 py-3 text-xs font-bold text-ink-500 uppercase">Email</th>
                <th className="text-left px-4 py-3 text-xs font-bold text-ink-500 uppercase">Role</th>
                <th className="text-left px-4 py-3 text-xs font-bold text-ink-500 uppercase">Unit</th>
                <th className="text-left px-4 py-3 text-xs font-bold text-ink-500 uppercase">Status</th>
                <th className="text-center px-4 py-3 text-xs font-bold text-ink-500 uppercase">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr><td colSpan={6}><EmptyState message="Tidak ada data user" /></td></tr>
              ) : filtered.map(u => (
                <tr key={u.id} className="border-b border-ink-50 hover:bg-ink-50/30 transition-colors">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-lg bg-brand-600 flex items-center justify-center text-white font-bold text-xs">
                        {u.nama.split(' ').map(n => n[0]).slice(0, 2).join('')}
                      </div>
                      <span className="font-semibold text-ink-800">{u.nama}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-ink-600 text-xs">{u.email}</td>
                  <td className="px-4 py-3">{roleBadge(u.role)}</td>
                  <td className="px-4 py-3 text-ink-600 text-xs">{u.unit}</td>
                  <td className="px-4 py-3"><Badge variant={u.status === 'Aktif' ? 'success' : 'neutral'}>{u.status}</Badge></td>
                  <td className="px-4 py-3">
                    <div className="flex items-center justify-center gap-1">
                      <button onClick={() => { setEditing(u); setModalOpen(true); }} className="p-1.5 rounded-lg text-ink-400 hover:bg-brand-50 hover:text-brand-600 transition-colors"><Edit2 size={15} /></button>
                      <button onClick={() => setDeleteId(u.id)} className="p-1.5 rounded-lg text-ink-400 hover:bg-red-50 hover:text-red-600 transition-colors"><Trash2 size={15} /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="px-4 py-3 border-t border-ink-100 text-xs text-ink-500">Menampilkan {filtered.length} dari {users.length} user</div>
      </Card>

      {modalOpen && (
        <UserForm editing={editing} onClose={() => { setModalOpen(false); setEditing(null); }} onSave={handleSave} />
      )}

      <ConfirmDialog open={!!deleteId} onClose={() => setDeleteId(null)}
        onConfirm={() => { if (deleteId) { handleDelete(deleteId); pushToast('Data berhasil dihapus.'); } }}
        title="Hapus User" message="Apakah Anda yakin ingin menghapus user ini?" confirmText="Hapus" />
    </div>
  );
}

function UserForm({ editing, onClose, onSave }: { editing: UserItem | null; onClose: () => void; onSave: (d: Omit<UserItem, 'id'>) => void; }) {
  const [form, setForm] = useState<Omit<UserItem, 'id'>>({
    nama: editing?.nama || '',
    email: editing?.email || '',
    role: editing?.role || 'Staff',
    unit: editing?.unit || unitOptions[0],
    status: editing?.status || 'Aktif',
  });
  const set = (k: keyof typeof form, v: string) => setForm(f => ({ ...f, [k]: v }));

  return (
    <Modal open onClose={onClose} title={editing ? 'Edit User' : 'Tambah User'} size="md"
      footer={<><Button variant="secondary" onClick={onClose}>Batal</Button><Button onClick={() => onSave(form)}>Simpan</Button></>}>
      <div className="grid grid-cols-2 gap-4">
        <div className="col-span-2"><Input label="Nama Lengkap" value={form.nama} onChange={v => set('nama', v)} required /></div>
        <div className="col-span-2"><Input label="Email" type="email" value={form.email} onChange={v => set('email', v)} required /></div>
        <Input label="Role" value={form.role} onChange={v => set('role', v)} options={roleOptions} />
        <Input label="Unit" value={form.unit} onChange={v => set('unit', v)} options={unitOptions} />
        <Input label="Status" value={form.status} onChange={v => set('status', v as 'Aktif' | 'Nonaktif')} options={['Aktif', 'Nonaktif']} />
      </div>
    </Modal>
  );
}
