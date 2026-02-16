export type MediaType = 'photo' | 'video';

export type EventCategory =
  | 'graduation'
  | 'sports'
  | 'prom'
  | 'field-trip'
  | 'club'
  | 'classroom'
  | 'festival'
  | 'other';

export type SubmissionStatus = 'approved' | 'pending' | 'rejected';

export interface MemoryItem {
  id: string;
  title: string;
  description: string;
  mediaType: MediaType;
  mediaUrl: string;
  thumbnailUrl: string;
  eventCategory: EventCategory;
  grade: string;
  schoolYear: string;
  albumId?: string;
  uploadedBy: string;
  uploadedAt: string;
  status: SubmissionStatus;
  likes: number;
  tags: string[];
}

export interface Album {
  id: string;
  name: string;
  description: string;
  coverUrl: string;
  createdBy: string;
  createdAt: string;
  itemCount: number;
  isPublic: boolean;
}

export interface FilterState {
  eventCategory: EventCategory | 'all';
  grade: string;
  schoolYear: string;
  mediaType: MediaType | 'all';
  search: string;
}
