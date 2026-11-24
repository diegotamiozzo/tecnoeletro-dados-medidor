import { jsx, jsxs } from "react/jsx-runtime";
import { A as AppLogoIcon, h as home } from "./app-logo-icon-DzE24oHT.js";
import { Link } from "@inertiajs/react";
function AuthSimpleLayout({
  children,
  title,
  description
}) {
  return /* @__PURE__ */ jsx("div", { className: "flex min-h-svh flex-col items-center justify-center gap-6 bg-background p-6 md:p-10", children: /* @__PURE__ */ jsx("div", { className: "w-full max-w-sm", children: /* @__PURE__ */ jsxs("div", { className: "flex flex-col gap-4", children: [
    /* @__PURE__ */ jsxs("div", { className: "flex flex-col items-center gap-4", children: [
      /* @__PURE__ */ jsxs(
        Link,
        {
          href: home(),
          className: "flex flex-col items-center gap-2 font-medium",
          children: [
            /* @__PURE__ */ jsx(AppLogoIcon, { className: "mb-0 h-48 w-auto" }),
            /* @__PURE__ */ jsx("span", { className: "sr-only", children: title })
          ]
        }
      ),
      /* @__PURE__ */ jsxs("div", { className: "space-y-2 text-center", children: [
        /* @__PURE__ */ jsx("h1", { className: "text-xl font-medium", children: title }),
        /* @__PURE__ */ jsx("p", { className: "text-center text-sm text-muted-foreground", children: description })
      ] })
    ] }),
    children
  ] }) }) });
}
function AuthLayout({
  children,
  title,
  description,
  ...props
}) {
  return /* @__PURE__ */ jsx(AuthSimpleLayout, { title, description, ...props, children });
}
export {
  AuthLayout as A
};
