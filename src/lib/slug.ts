export function getHabitSlug(name: string): string {
  return name
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, '') // remove non-alphanumeric except spaces and hyphens
    .replace(/\s+/g, '-')          // replace spaces with hyphens
    .replace(/-+/g, '-')           // collapse multiple hyphens into one
    .replace(/^-|-$/g, '');        // remove leading/trailing hyphens
}