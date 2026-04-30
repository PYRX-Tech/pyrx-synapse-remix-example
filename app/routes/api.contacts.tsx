import type { LoaderFunctionArgs } from '@remix-run/node';
import { json } from '@remix-run/node';
import { synapse } from '~/lib/synapse.server';

export async function loader({ request }: LoaderFunctionArgs) {
  const url = new URL(request.url);
  return json(await synapse.contacts.list({ page: Number(url.searchParams.get('page')) || 1, limit: Number(url.searchParams.get('limit')) || 20 }));
}
