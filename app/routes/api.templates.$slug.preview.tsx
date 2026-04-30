import type { ActionFunctionArgs } from '@remix-run/node';
import { json } from '@remix-run/node';
import { synapse } from '~/lib/synapse.server';

export async function action({ request, params }: ActionFunctionArgs) {
  const { attributes } = await request.json();
  return json(await synapse.templates.preview(params.slug!, { attributes }));
}
