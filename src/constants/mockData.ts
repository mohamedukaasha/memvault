import type { MemoryItem, Album } from '@/types';

const unsplash = (id: string, w = 600, h = 400) =>
  `https://images.unsplash.com/photo-${id}?w=${w}&h=${h}&fit=crop&auto=format&q=80`;

export const MEMORIES: MemoryItem[] = [];

export const ALBUMS: Album[] = [];

