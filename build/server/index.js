import { jsx, jsxs } from "react/jsx-runtime";
import { PassThrough } from "node:stream";
import { createReadableStreamFromReadable, json } from "@remix-run/node";
import { RemixServer, Meta, Links, Outlet, ScrollRestoration, Scripts, useActionData, Form } from "@remix-run/react";
import * as isbotModule from "isbot";
import { renderToPipeableStream } from "react-dom/server";
import { Synapse } from "@pyrx/synapse";
const ABORT_DELAY = 5e3;
function handleRequest(request, responseStatusCode, responseHeaders, remixContext, loadContext) {
  let prohibitOutOfOrderStreaming = isBotRequest(request.headers.get("user-agent")) || remixContext.isSpaMode;
  return prohibitOutOfOrderStreaming ? handleBotRequest(
    request,
    responseStatusCode,
    responseHeaders,
    remixContext
  ) : handleBrowserRequest(
    request,
    responseStatusCode,
    responseHeaders,
    remixContext
  );
}
function isBotRequest(userAgent) {
  if (!userAgent) {
    return false;
  }
  if ("isbot" in isbotModule && typeof isbotModule.isbot === "function") {
    return isbotModule.isbot(userAgent);
  }
  if ("default" in isbotModule && typeof isbotModule.default === "function") {
    return isbotModule.default(userAgent);
  }
  return false;
}
function handleBotRequest(request, responseStatusCode, responseHeaders, remixContext) {
  return new Promise((resolve, reject) => {
    let shellRendered = false;
    const { pipe, abort } = renderToPipeableStream(
      /* @__PURE__ */ jsx(
        RemixServer,
        {
          context: remixContext,
          url: request.url,
          abortDelay: ABORT_DELAY
        }
      ),
      {
        onAllReady() {
          shellRendered = true;
          const body = new PassThrough();
          const stream = createReadableStreamFromReadable(body);
          responseHeaders.set("Content-Type", "text/html");
          resolve(
            new Response(stream, {
              headers: responseHeaders,
              status: responseStatusCode
            })
          );
          pipe(body);
        },
        onShellError(error) {
          reject(error);
        },
        onError(error) {
          responseStatusCode = 500;
          if (shellRendered) {
            console.error(error);
          }
        }
      }
    );
    setTimeout(abort, ABORT_DELAY);
  });
}
function handleBrowserRequest(request, responseStatusCode, responseHeaders, remixContext) {
  return new Promise((resolve, reject) => {
    let shellRendered = false;
    const { pipe, abort } = renderToPipeableStream(
      /* @__PURE__ */ jsx(
        RemixServer,
        {
          context: remixContext,
          url: request.url,
          abortDelay: ABORT_DELAY
        }
      ),
      {
        onShellReady() {
          shellRendered = true;
          const body = new PassThrough();
          const stream = createReadableStreamFromReadable(body);
          responseHeaders.set("Content-Type", "text/html");
          resolve(
            new Response(stream, {
              headers: responseHeaders,
              status: responseStatusCode
            })
          );
          pipe(body);
        },
        onShellError(error) {
          reject(error);
        },
        onError(error) {
          responseStatusCode = 500;
          if (shellRendered) {
            console.error(error);
          }
        }
      }
    );
    setTimeout(abort, ABORT_DELAY);
  });
}
const entryServer = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: handleRequest
}, Symbol.toStringTag, { value: "Module" }));
function App() {
  return /* @__PURE__ */ jsxs("html", { lang: "en", children: [
    /* @__PURE__ */ jsxs("head", { children: [
      /* @__PURE__ */ jsx("meta", { charSet: "utf-8" }),
      /* @__PURE__ */ jsx("meta", { name: "viewport", content: "width=device-width, initial-scale=1" }),
      /* @__PURE__ */ jsx(Meta, {}),
      /* @__PURE__ */ jsx(Links, {})
    ] }),
    /* @__PURE__ */ jsxs("body", { children: [
      /* @__PURE__ */ jsx(Outlet, {}),
      /* @__PURE__ */ jsx(ScrollRestoration, {}),
      /* @__PURE__ */ jsx(Scripts, {})
    ] })
  ] });
}
const route0 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: App
}, Symbol.toStringTag, { value: "Module" }));
const synapse = new Synapse({
  baseUrl: process.env.SYNAPSE_API_URL || "https://synapse-api.pyrx.tech",
  apiKey: process.env.SYNAPSE_API_KEY,
  workspaceId: process.env.SYNAPSE_WORKSPACE_ID
});
async function action$9({ request, params }) {
  const body = await request.json();
  return json(await synapse.templates.preview(params.slug, body));
}
const route1 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  action: action$9
}, Symbol.toStringTag, { value: "Module" }));
async function loader$3({ params }) {
  return json(await synapse.templates.get(params.slug));
}
async function action$8({ request, params }) {
  if (request.method === "PUT") return json(await synapse.templates.update(params.slug, await request.json()));
  if (request.method === "DELETE") {
    await synapse.templates.delete(params.slug);
    return json({ success: true });
  }
  return json({ error: "Method not allowed" }, { status: 405 });
}
const route2 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  action: action$8,
  loader: loader$3
}, Symbol.toStringTag, { value: "Module" }));
async function action$7({ request }) {
  const { contacts } = await request.json();
  return json(await synapse.identifyBatch({ contacts }));
}
const route3 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  action: action$7
}, Symbol.toStringTag, { value: "Module" }));
async function loader$2({ params }) {
  return json(await synapse.contacts.get(params.id));
}
async function action$6({ request, params }) {
  if (request.method === "PUT") {
    return json(await synapse.contacts.update(params.id, await request.json()));
  }
  if (request.method === "DELETE") {
    await synapse.contacts.delete(params.id);
    return json({ success: true });
  }
  return json({ error: "Method not allowed" }, { status: 405 });
}
const route4 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  action: action$6,
  loader: loader$2
}, Symbol.toStringTag, { value: "Module" }));
async function action$5({ request }) {
  const { events } = await request.json();
  return json(await synapse.trackBatch({ events }));
}
const route5 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  action: action$5
}, Symbol.toStringTag, { value: "Module" }));
async function loader$1() {
  return json(await synapse.templates.list());
}
async function action$4({ request }) {
  return json(await synapse.templates.create(await request.json()));
}
const route6 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  action: action$4,
  loader: loader$1
}, Symbol.toStringTag, { value: "Module" }));
async function loader({ request }) {
  const url = new URL(request.url);
  return json(await synapse.contacts.list({ page: Number(url.searchParams.get("page")) || 1, limit: Number(url.searchParams.get("limit")) || 20 }));
}
const route7 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  loader
}, Symbol.toStringTag, { value: "Module" }));
async function action$3({ request }) {
  const b = await request.json();
  return json(await synapse.identify({ externalId: b.userId, email: b.email, properties: b.properties, tags: b.tags }));
}
const route8 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  action: action$3
}, Symbol.toStringTag, { value: "Module" }));
async function action$2({ request }) {
  const b = await request.json();
  const r = await synapse.track({ externalId: b.userId, eventName: b.event, attributes: b.attributes || {} });
  return json(r);
}
const route9 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  action: action$2
}, Symbol.toStringTag, { value: "Module" }));
async function action$1({ request }) {
  try {
    const b = await request.json();
    return json(await synapse.send({ templateSlug: b.templateSlug, to: b.to, attributes: b.attributes }));
  } catch (e) {
    const status = e.status || e.statusCode || 500;
    return json({ error: e.message, status }, { status });
  }
}
const route10 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  action: action$1
}, Symbol.toStringTag, { value: "Module" }));
async function action({ request }) {
  const form = await request.formData();
  const email = form.get("email");
  await synapse.track({ externalId: email, eventName: "user_signed_up", attributes: { source: "remix_form" } });
  await synapse.identify({ externalId: email, email });
  return json({ success: true });
}
function Index() {
  const data = useActionData();
  return /* @__PURE__ */ jsxs("main", { style: { padding: "2rem", fontFamily: "system-ui" }, children: [
    /* @__PURE__ */ jsx("h1", { children: "Synapse Remix Example" }),
    (data == null ? void 0 : data.success) && /* @__PURE__ */ jsx("p", { style: { color: "green" }, children: "Event tracked!" }),
    /* @__PURE__ */ jsxs(Form, { method: "post", children: [
      /* @__PURE__ */ jsx("input", { name: "email", type: "email", placeholder: "Email", required: true, style: { padding: "0.5rem", marginRight: "0.5rem" } }),
      /* @__PURE__ */ jsx("button", { type: "submit", style: { padding: "0.5rem 1rem" }, children: "Track Signup" })
    ] })
  ] });
}
const route11 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  action,
  default: Index
}, Symbol.toStringTag, { value: "Module" }));
const serverManifest = { "entry": { "module": "/assets/entry.client-ByuUasSL.js", "imports": ["/assets/components-30-zU3In.js"], "css": [] }, "routes": { "root": { "id": "root", "parentId": void 0, "path": "", "index": void 0, "caseSensitive": void 0, "hasAction": false, "hasLoader": false, "hasClientAction": false, "hasClientLoader": false, "hasErrorBoundary": false, "module": "/assets/root-Bv_Dvnwu.js", "imports": ["/assets/components-30-zU3In.js"], "css": [] }, "routes/api.templates.$slug.preview": { "id": "routes/api.templates.$slug.preview", "parentId": "routes/api.templates.$slug", "path": "preview", "index": void 0, "caseSensitive": void 0, "hasAction": true, "hasLoader": false, "hasClientAction": false, "hasClientLoader": false, "hasErrorBoundary": false, "module": "/assets/api.templates._slug.preview-l0sNRNKZ.js", "imports": [], "css": [] }, "routes/api.templates.$slug": { "id": "routes/api.templates.$slug", "parentId": "routes/api.templates", "path": ":slug", "index": void 0, "caseSensitive": void 0, "hasAction": true, "hasLoader": true, "hasClientAction": false, "hasClientLoader": false, "hasErrorBoundary": false, "module": "/assets/api.templates._slug-l0sNRNKZ.js", "imports": [], "css": [] }, "routes/api.identify.batch": { "id": "routes/api.identify.batch", "parentId": "routes/api.identify", "path": "batch", "index": void 0, "caseSensitive": void 0, "hasAction": true, "hasLoader": false, "hasClientAction": false, "hasClientLoader": false, "hasErrorBoundary": false, "module": "/assets/api.identify.batch-l0sNRNKZ.js", "imports": [], "css": [] }, "routes/api.contacts.$id": { "id": "routes/api.contacts.$id", "parentId": "routes/api.contacts", "path": ":id", "index": void 0, "caseSensitive": void 0, "hasAction": true, "hasLoader": true, "hasClientAction": false, "hasClientLoader": false, "hasErrorBoundary": false, "module": "/assets/api.contacts._id-l0sNRNKZ.js", "imports": [], "css": [] }, "routes/api.track.batch": { "id": "routes/api.track.batch", "parentId": "routes/api.track", "path": "batch", "index": void 0, "caseSensitive": void 0, "hasAction": true, "hasLoader": false, "hasClientAction": false, "hasClientLoader": false, "hasErrorBoundary": false, "module": "/assets/api.track.batch-l0sNRNKZ.js", "imports": [], "css": [] }, "routes/api.templates": { "id": "routes/api.templates", "parentId": "root", "path": "api/templates", "index": void 0, "caseSensitive": void 0, "hasAction": true, "hasLoader": true, "hasClientAction": false, "hasClientLoader": false, "hasErrorBoundary": false, "module": "/assets/api.templates-l0sNRNKZ.js", "imports": [], "css": [] }, "routes/api.contacts": { "id": "routes/api.contacts", "parentId": "root", "path": "api/contacts", "index": void 0, "caseSensitive": void 0, "hasAction": false, "hasLoader": true, "hasClientAction": false, "hasClientLoader": false, "hasErrorBoundary": false, "module": "/assets/api.contacts-l0sNRNKZ.js", "imports": [], "css": [] }, "routes/api.identify": { "id": "routes/api.identify", "parentId": "root", "path": "api/identify", "index": void 0, "caseSensitive": void 0, "hasAction": true, "hasLoader": false, "hasClientAction": false, "hasClientLoader": false, "hasErrorBoundary": false, "module": "/assets/api.identify-l0sNRNKZ.js", "imports": [], "css": [] }, "routes/api.track": { "id": "routes/api.track", "parentId": "root", "path": "api/track", "index": void 0, "caseSensitive": void 0, "hasAction": true, "hasLoader": false, "hasClientAction": false, "hasClientLoader": false, "hasErrorBoundary": false, "module": "/assets/api.track-l0sNRNKZ.js", "imports": [], "css": [] }, "routes/api.send": { "id": "routes/api.send", "parentId": "root", "path": "api/send", "index": void 0, "caseSensitive": void 0, "hasAction": true, "hasLoader": false, "hasClientAction": false, "hasClientLoader": false, "hasErrorBoundary": false, "module": "/assets/api.send-l0sNRNKZ.js", "imports": [], "css": [] }, "routes/_index": { "id": "routes/_index", "parentId": "root", "path": void 0, "index": true, "caseSensitive": void 0, "hasAction": true, "hasLoader": false, "hasClientAction": false, "hasClientLoader": false, "hasErrorBoundary": false, "module": "/assets/_index-UADECOTb.js", "imports": ["/assets/components-30-zU3In.js"], "css": [] } }, "url": "/assets/manifest-a596ffa1.js", "version": "a596ffa1" };
const mode = "production";
const assetsBuildDirectory = "build/client";
const basename = "/";
const future = { "v3_fetcherPersist": false, "v3_relativeSplatPath": false, "v3_throwAbortReason": false, "v3_routeConfig": false, "v3_singleFetch": false, "v3_lazyRouteDiscovery": false, "unstable_optimizeDeps": false };
const isSpaMode = false;
const publicPath = "/";
const entry = { module: entryServer };
const routes = {
  "root": {
    id: "root",
    parentId: void 0,
    path: "",
    index: void 0,
    caseSensitive: void 0,
    module: route0
  },
  "routes/api.templates.$slug.preview": {
    id: "routes/api.templates.$slug.preview",
    parentId: "routes/api.templates.$slug",
    path: "preview",
    index: void 0,
    caseSensitive: void 0,
    module: route1
  },
  "routes/api.templates.$slug": {
    id: "routes/api.templates.$slug",
    parentId: "routes/api.templates",
    path: ":slug",
    index: void 0,
    caseSensitive: void 0,
    module: route2
  },
  "routes/api.identify.batch": {
    id: "routes/api.identify.batch",
    parentId: "routes/api.identify",
    path: "batch",
    index: void 0,
    caseSensitive: void 0,
    module: route3
  },
  "routes/api.contacts.$id": {
    id: "routes/api.contacts.$id",
    parentId: "routes/api.contacts",
    path: ":id",
    index: void 0,
    caseSensitive: void 0,
    module: route4
  },
  "routes/api.track.batch": {
    id: "routes/api.track.batch",
    parentId: "routes/api.track",
    path: "batch",
    index: void 0,
    caseSensitive: void 0,
    module: route5
  },
  "routes/api.templates": {
    id: "routes/api.templates",
    parentId: "root",
    path: "api/templates",
    index: void 0,
    caseSensitive: void 0,
    module: route6
  },
  "routes/api.contacts": {
    id: "routes/api.contacts",
    parentId: "root",
    path: "api/contacts",
    index: void 0,
    caseSensitive: void 0,
    module: route7
  },
  "routes/api.identify": {
    id: "routes/api.identify",
    parentId: "root",
    path: "api/identify",
    index: void 0,
    caseSensitive: void 0,
    module: route8
  },
  "routes/api.track": {
    id: "routes/api.track",
    parentId: "root",
    path: "api/track",
    index: void 0,
    caseSensitive: void 0,
    module: route9
  },
  "routes/api.send": {
    id: "routes/api.send",
    parentId: "root",
    path: "api/send",
    index: void 0,
    caseSensitive: void 0,
    module: route10
  },
  "routes/_index": {
    id: "routes/_index",
    parentId: "root",
    path: void 0,
    index: true,
    caseSensitive: void 0,
    module: route11
  }
};
export {
  serverManifest as assets,
  assetsBuildDirectory,
  basename,
  entry,
  future,
  isSpaMode,
  mode,
  publicPath,
  routes
};
