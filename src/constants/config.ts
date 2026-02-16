export const EVENT_CATEGORIES = [
  { value: 'all', label: 'All Events' },
  { value: 'graduation', label: 'Graduation' },
  { value: 'sports', label: 'Sports Day' },
  { value: 'prom', label: 'Prom Night' },
  { value: 'field-trip', label: 'Field Trips' },
  { value: 'club', label: 'Clubs & Activities' },
  { value: 'classroom', label: 'Classroom Moments' },
  { value: 'festival', label: 'School Festivals' },
  { value: 'other', label: 'Other' },
] as const;

export const GRADES = [
  { value: 'all', label: 'All Grades' },
  { value: '9th', label: '9th Grade' },
  { value: '10th', label: '10th Grade' },
  { value: '11th', label: '11th Grade' },
  { value: '12th', label: '12th Grade' },
] as const;

export const SCHOOL_YEARS = [
  { value: 'all', label: 'All Years' },
  { value: '2024-2025', label: '2024–2025' },
  { value: '2023-2024', label: '2023–2024' },
  { value: '2022-2023', label: '2022–2023' },
  { value: '2021-2022', label: '2021–2022' },
] as const;

export const NAV_LINKS = [
  { to: '/', label: 'Home' },
  { to: '/gallery', label: 'Gallery' },
  { to: '/albums', label: 'Albums' },
  { to: '/submit', label: 'Submit' },
] as const;
