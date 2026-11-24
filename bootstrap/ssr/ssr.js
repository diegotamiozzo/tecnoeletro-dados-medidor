import { jsx } from "react/jsx-runtime";
import { createInertiaApp } from "@inertiajs/react";
import createServer from "@inertiajs/react/server";
import ReactDOMServer from "react-dom/server";
async function resolvePageComponent(path, pages) {
  for (const p of Array.isArray(path) ? path : [path]) {
    const page = pages[p];
    if (typeof page === "undefined") {
      continue;
    }
    return typeof page === "function" ? page() : page;
  }
  throw new Error(`Page not found: ${path}`);
}
const appName = "Tecnoeletro";
createServer(
  (page) => createInertiaApp({
    page,
    render: ReactDOMServer.renderToString,
    title: (title) => title ? `${title} - ${appName}` : appName,
    resolve: (name) => resolvePageComponent(
      `./pages/${name}.tsx`,
      /* @__PURE__ */ Object.assign({ "./pages/admin/devices.tsx": () => import("./assets/devices-UbSyzFxG.js"), "./pages/auth/confirm-password.tsx": () => import("./assets/confirm-password-BwzVNLrB.js"), "./pages/auth/forgot-password.tsx": () => import("./assets/forgot-password-DJVuc-it.js"), "./pages/auth/login.tsx": () => import("./assets/login-BXjMmQxL.js"), "./pages/auth/register.tsx": () => import("./assets/register-BFzbRAaT.js"), "./pages/auth/reset-password.tsx": () => import("./assets/reset-password-Bo4IsZDo.js"), "./pages/auth/two-factor-challenge.tsx": () => import("./assets/two-factor-challenge-DDvV-JzK.js"), "./pages/auth/verify-email.tsx": () => import("./assets/verify-email-CJ5Snxe0.js"), "./pages/dashboard.tsx": () => import("./assets/dashboard-D8HiN0oj.js"), "./pages/devices.tsx": () => import("./assets/devices-CaZYHQgT.js"), "./pages/settings/appearance.tsx": () => import("./assets/appearance-D1A-8Hi1.js"), "./pages/settings/password.tsx": () => import("./assets/password-Bmop5koz.js"), "./pages/settings/profile.tsx": () => import("./assets/profile-DZ0hX3Pl.js"), "./pages/settings/two-factor.tsx": () => import("./assets/two-factor-CWVnol6R.js"), "./pages/welcome.tsx": () => import("./assets/welcome-ChkCNNNA.js") })
    ),
    setup: ({ App, props }) => {
      return /* @__PURE__ */ jsx(App, { ...props });
    }
  })
);
