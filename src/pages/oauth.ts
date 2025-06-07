import type { APIRoute } from 'astro';

export const GET: APIRoute = async ({ url, redirect }) => {
  const searchParams = url.search;
  return redirect(`/.netlify/functions/oauth${searchParams}`, 302);
};