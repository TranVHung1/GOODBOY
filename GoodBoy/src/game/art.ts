/** URL for a file in /public/art. Works on any base path (Vercel root, subfolder, preview). */
export const art = (path: string) => `${import.meta.env.BASE_URL}art/${path}`;
