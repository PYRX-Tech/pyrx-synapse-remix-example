import type { ActionFunctionArgs } from '@remix-run/node';
import { json } from '@remix-run/node';
import { Form, useActionData } from '@remix-run/react';
import { synapse } from '~/lib/synapse.server';

export async function action({ request }: ActionFunctionArgs) {
  const form = await request.formData();
  const email = form.get('email') as string;

  await synapse.track({ externalId: email, eventName: 'user_signed_up', attributes: { source: 'remix_form' } });
  await synapse.identify({ externalId: email, email });

  return json({ success: true });
}

export default function Index() {
  const data = useActionData<typeof action>();
  return (
    <main style={{ padding: '2rem', fontFamily: 'system-ui' }}>
      <h1>Synapse Remix Example</h1>
      {data?.success && <p style={{ color: 'green' }}>Event tracked!</p>}
      <Form method="post">
        <input name="email" type="email" placeholder="Email" required style={{ padding: '0.5rem', marginRight: '0.5rem' }} />
        <button type="submit" style={{ padding: '0.5rem 1rem' }}>Track Signup</button>
      </Form>
    </main>
  );
}
