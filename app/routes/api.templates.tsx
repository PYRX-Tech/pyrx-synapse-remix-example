import type { ActionFunctionArgs } from '@remix-run/node';
import { json } from '@remix-run/node';
import { synapse } from '~/lib/synapse.server';

export async function loader() {
  return json(await synapse.templates.list());
}

export async function action({ request }: ActionFunctionArgs) {
  return json(await synapse.templates.create(await request.json()));
}
