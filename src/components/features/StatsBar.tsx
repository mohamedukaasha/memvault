import { motion } from 'framer-motion';
import type { MemoryItem } from '@/types';

interface StatsBarProps {
  memories: MemoryItem[];
}

export default function StatsBar({ memories }: StatsBarProps) {
  const totalPhotos = memories.filter((m) => m.mediaType === 'photo').length;
  const totalVideos = memories.filter((m) => m.mediaType === 'video').length;
  const totalLikes = memories.reduce((sum, m) => sum + m.likes, 0);
  const uniqueContributors = new Set(memories.map((m) => m.uploadedBy)).size;

  const stats = [
    { label: 'Photos', value: totalPhotos },
    { label: 'Videos', value: totalVideos },
    { label: 'Total Likes', value: totalLikes.toLocaleString() },
    { label: 'Contributors', value: uniqueContributors },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
      {stats.map((stat, i) => (
        <motion.div
          key={stat.label}
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: i * 0.08 }}
          className="flex flex-col items-center py-4 px-3 rounded-xl bg-surface-elevated border border-border/30"
        >
          <span className="text-2xl font-bold text-gold tabular-nums">{stat.value}</span>
          <span className="text-xs text-subtle mt-1 font-medium">{stat.label}</span>
        </motion.div>
      ))}
    </div>
  );
}
