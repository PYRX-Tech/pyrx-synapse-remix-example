import type { LoaderFunctionArgs, ActionFunctionArgs } from '@remix-run/node';
import { json } from '@remix-run/node';
import { synapse } from '~/lib/synapse.server';

export async function loader({ params }: LoaderFunctionArgs) {
  return json(await synapse.templates.get(params.slug!));
}

export async function action({ request, params }: ActionFunctionArgs) {
  if (request.method === 'PUT') return json(await synapse.templates.update(params.slug!, await request.json()));
  if (request.method === 'DELETE') { await synapse.templates.delete(params.slug!); return json({ success: true }); }
  return json({ error: 'Method not allowed' }, { status: 405 });
}
