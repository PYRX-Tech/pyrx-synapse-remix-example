import type { LoaderFunctionArgs, ActionFunctionArgs } from '@remix-run/node';
import { json } from '@remix-run/node';
import { synapse } from '~/lib/synapse.server';

export async function loader({ params }: LoaderFunctionArgs) {
  return json(await synapse.contacts.get(params.id!));
}

export async function action({ request, params }: ActionFunctionArgs) {
  if (request.method === 'PUT') {
    return json(await synapse.contacts.update(params.id!, await request.json()));
  }
  if (request.method === 'DELETE') {
    await synapse.contacts.delete(params.id!);
    return json({ success: true });
  }
  return json({ error: 'Method not allowed' }, { status: 405 });
}
