import { create } from 'zustand';
import type { MemoryItem, Album, SubmissionStatus } from '@/types';
import { MEMORIES, ALBUMS } from '@/constants/mockData';

interface MemoryStore {
  memories: MemoryItem[];
  albums: Album[];
  likedIds: string[];
  addMemory: (memory: MemoryItem) => void;
  toggleLike: (id: string) => void;
  getMemoryById: (id: string) => MemoryItem | undefined;
  getMemoriesByStatus: (status: SubmissionStatus) => MemoryItem[];
  getMemoriesByAlbum: (albumId: string) => MemoryItem[];
  fetchMemories: () => Promise<void>;
  fetchAlbums: () => Promise<void>;
  addAlbum: (album: Omit<Album, 'itemCount'>) => Promise<void>;
  updateMemory: (id: string, updates: Partial<MemoryItem>) => Promise<void>;
  deleteMemory: (id: string) => Promise<void>;
  deleteAlbum: (id: string) => Promise<void>;
}

const loadLikes = (): string[] => {
  const saved = localStorage.getItem('memvault-likes');
  return saved ? JSON.parse(saved) : [];
};

const loadSubmissions = (): MemoryItem[] => {
  const saved = localStorage.getItem('memvault-submissions');
  return saved ? JSON.parse(saved) : [];
};

export const useMemoryStore = create<MemoryStore>((set, get) => ({
  memories: [...MEMORIES],
  albums: ALBUMS,
  likedIds: loadLikes(),

  addMemory: (memory) => {
    set((state) => {
      const updated = [...state.memories, memory];
      const submissions = updated.filter((m) => !MEMORIES.find((o) => o.id === m.id));
      localStorage.setItem('memvault-submissions', JSON.stringify(submissions));
      return { memories: updated };
    });
  },

  toggleLike: (id) => {
    set((state) => {
      const isLiked = state.likedIds.includes(id);
      const newLikedIds = isLiked
        ? state.likedIds.filter((lid) => lid !== id)
        : [...state.likedIds, id];
      const newMemories = state.memories.map((m) =>
        m.id === id ? { ...m, likes: m.likes + (isLiked ? -1 : 1) } : m
      );
      localStorage.setItem('memvault-likes', JSON.stringify(newLikedIds));
      return { likedIds: newLikedIds, memories: newMemories };
    });
  },

  getMemoryById: (id) => get().memories.find((m) => m.id === id),

  getMemoriesByStatus: (status) => get().memories.filter((m) => m.status === status),

  getMemoriesByAlbum: (albumId) => get().memories.filter((m) => m.albumId === albumId),

  fetchMemories: async () => {
    try {
      // Dynamic import to avoid circular dependencies if any, though likely safe to import at top
      const { supabase } = await import('@/lib/supabase');

      const { data, error } = await supabase
        .from('memories')
        .select('*')
        .order('uploaded_at', { ascending: false });

      if (error) {
        console.error('Error fetching memories:', error);
        return;
      }

      if (data) {
        const mappedMemories: MemoryItem[] = data.map((item: any) => ({
          id: item.id,
          title: item.title,
          description: item.description,
          mediaType: item.media_type as 'photo' | 'video',
          mediaUrl: item.media_url,
          thumbnailUrl: item.thumbnail_url || item.media_url,
          eventCategory: item.event_category as any,
          grade: item.grade,
          schoolYear: item.school_year,
          uploadedBy: item.uploaded_by,
          uploadedAt: item.uploaded_at,
          status: item.status as SubmissionStatus,
          likes: item.likes || 0,
          tags: item.tags || [],
          albumId: item.album_id // Optional
        }));

        set((state) => {
          // Merge with local submissions that might not be in DB yet (optimistic updates)
          // We prioritize server data for existing IDs, but keep local-only IDs
          const serverIds = new Set(mappedMemories.map(m => m.id));
          const localOnly = state.memories.filter(m => !serverIds.has(m.id) && !MEMORIES.find(om => om.id === m.id));

          const allMemories = [...MEMORIES, ...mappedMemories, ...localOnly];
          // Sort by uploadedAt descending (newest first)
          allMemories.sort((a, b) => b.uploadedAt.localeCompare(a.uploadedAt));

          return {
            memories: allMemories
          };
        });
      }
    } catch (err) {
      console.error('Failed to fetch memories:', err);
    }
  },

  fetchAlbums: async () => {
    try {
      const { supabase } = await import('@/lib/supabase');

      const { data, error } = await supabase
        .from('albums')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching albums:', error);
        return;
      }

      if (data) {
        const mappedAlbums: Album[] = data.map((item: any) => ({
          id: item.id,
          name: item.name,
          description: item.description,
          coverUrl: item.cover_url,
          createdBy: item.created_by,
          createdAt: item.created_at,
          itemCount: item.item_count || 0,
          isPublic: item.is_public ?? true
        }));

        set({ albums: mappedAlbums });
      }
    } catch (err) {
      console.error('Failed to fetch albums:', err);
    }
  },

  addAlbum: async (albumData) => {
    try {
      const { supabase } = await import('@/lib/supabase');

      const { data, error } = await supabase
        .from('albums')
        .insert([{
          id: albumData.id,
          name: albumData.name,
          description: albumData.description,
          cover_url: albumData.coverUrl,
          created_by: albumData.createdBy,
          created_at: albumData.createdAt,
          is_public: albumData.isPublic
        }])
        .select()
        .single();

      if (error) throw error;

      if (data) {
        const newAlbum: Album = {
          id: data.id,
          name: data.name,
          description: data.description,
          coverUrl: data.cover_url,
          createdBy: data.created_by,
          createdAt: data.created_at,
          itemCount: 0,
          isPublic: data.is_public
        };

        set((state) => ({
          albums: [newAlbum, ...state.albums]
        }));
      }
    } catch (err) {
      console.error('Failed to add album:', err);
      throw err;
    }
  },

  updateMemory: async (id, updates) => {
    try {
      const { supabase } = await import('@/lib/supabase');

      const dbUpdates: any = {};
      if (updates.title !== undefined) dbUpdates.title = updates.title;
      if (updates.description !== undefined) dbUpdates.description = updates.description;
      if (updates.eventCategory !== undefined) dbUpdates.event_category = updates.eventCategory;
      if (updates.grade !== undefined) dbUpdates.grade = updates.grade;
      if (updates.schoolYear !== undefined) dbUpdates.school_year = updates.schoolYear;
      if (updates.tags !== undefined) dbUpdates.tags = updates.tags;
      if (updates.status !== undefined) dbUpdates.status = updates.status;

      const { error } = await supabase
        .from('memories')
        .update(dbUpdates)
        .eq('id', id);

      if (error) throw error;

      set((state) => ({
        memories: state.memories.map((m) => (m.id === id ? { ...m, ...updates } : m)),
      }));
    } catch (err) {
      console.error('Failed to update memory:', err);
      throw err;
    }
  },

  deleteMemory: async (id) => {
    try {
      const { supabase } = await import('@/lib/supabase');

      // Get memory details first to delete from storage
      const { data: memory } = await supabase
        .from('memories')
        .select('media_url')
        .eq('id', id)
        .single();

      // Delete from Database
      const { error } = await supabase
        .from('memories')
        .delete()
        .eq('id', id);

      if (error) throw error;

      // Best effort: Delete from Storage
      if (memory?.media_url) {
        try {
          // Extract path from public URL
          const urlParts = memory.media_url.split('/memories/');
          if (urlParts.length > 1) {
            const storagePath = urlParts[1];
            await supabase.storage.from('memories').remove([storagePath]);
          }
        } catch (storageErr) {
          console.error('Failed to clear storage:', storageErr);
        }
      }

      set((state) => ({
        memories: state.memories.filter((m) => m.id !== id),
      }));
    } catch (err) {
      console.error('Failed to delete memory:', err);
      throw err;
    }
  },

  deleteAlbum: async (id) => {
    try {
      const { supabase } = await import('@/lib/supabase');

      // 1. Get album details for storage deletion
      const { data: album } = await supabase
        .from('albums')
        .select('cover_url')
        .eq('id', id)
        .single();

      // 2. Delete the album
      const { error } = await supabase
        .from('albums')
        .delete()
        .eq('id', id);

      if (error) throw error;

      // 3. Best effort: Delete cover from Storage
      if (album?.cover_url) {
        try {
          const urlParts = album.cover_url.split('/memories/');
          if (urlParts.length > 1) {
            const storagePath = urlParts[1];
            await supabase.storage.from('memories').remove([storagePath]);
          }
        } catch (storageErr) {
          console.error('Failed to clear album cover storage:', storageErr);
        }
      }

      // 4. Update local state
      set((state) => ({
        albums: state.albums.filter((a) => a.id !== id),
        // Optional: We might want to null out albumId for memories that were in this album
        memories: state.memories.map((m) =>
          m.albumId === id ? { ...m, albumId: undefined } : m
        )
      }));
    } catch (err) {
      console.error('Failed to delete album:', err);
      throw err;
    }
  }
}));
