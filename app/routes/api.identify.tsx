import type { ActionFunctionArgs } from '@remix-run/node';
import { json } from '@remix-run/node';
import { synapse } from '~/lib/synapse.server';

export async function action({ request }: ActionFunctionArgs) {
  const b = await request.json();
  return json(await synapse.identify({ externalId: b.userId, email: b.email, properties: b.properties, tags: b.tags }));
}
