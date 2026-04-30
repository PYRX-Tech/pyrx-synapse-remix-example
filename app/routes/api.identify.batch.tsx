import type { ActionFunctionArgs } from '@remix-run/node';
import { json } from '@remix-run/node';
import { synapse } from '~/lib/synapse.server';

export async function action({ request }: ActionFunctionArgs) {
  const { contacts } = await request.json();
  return json(await synapse.identifyBatch({ contacts }));
}
