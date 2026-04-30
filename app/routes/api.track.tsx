import type { ActionFunctionArgs } from '@remix-run/node';
import { json } from '@remix-run/node';
import { synapse } from '~/lib/synapse.server';

export async function action({ request }: ActionFunctionArgs) {
  const b = await request.json();
  const r = await synapse.track({ externalId: b.userId, eventName: b.event, attributes: b.attributes || {} });
  return json(r);
}
