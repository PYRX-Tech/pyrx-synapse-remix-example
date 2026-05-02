import type { ActionFunctionArgs } from '@remix-run/node';
import { json } from '@remix-run/node';
import { synapse } from '~/lib/synapse.server';

export async function action({ request }: ActionFunctionArgs) {
  try {
    const b = await request.json();
    return json(await synapse.send({ templateSlug: b.templateSlug, to: b.to, attributes: b.attributes }));
  } catch (e: any) {
    const status = e.status || e.statusCode || 500;
    return json({ error: e.message, status }, { status });
  }
}
