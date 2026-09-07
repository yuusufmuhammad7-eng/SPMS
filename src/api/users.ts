import { apiGet } from './client';
import type { User } from '@/types';

export async function getUsers(): Promise<User[]> {
  const data = await apiGet<unknown[]>('getUsers');
  return data.map((raw) => normalizeUser(raw as Record<string, unknown>));
}

function normalizeUser(raw: Record<string, unknown>): User {
  return {
    id: String(raw.id ?? raw.ID ?? ''),
    nama: String(raw.nama ?? ''),
    email: String(raw.email ?? ''),
    role: String(raw.role ?? ''),
    unit: String(raw.unit ?? ''),
    status: String(raw.status ?? ''),
    passwordHash: raw.passwordHash ? String(raw.passwordHash) : undefined,
    createdAt: raw.createdAt ? String(raw.createdAt) : undefined,
    updatedAt: raw.updatedAt ? String(raw.updatedAt) : undefined,
  };
}
