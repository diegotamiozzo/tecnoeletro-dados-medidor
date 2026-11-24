import { jsxs, jsx, Fragment } from "react/jsx-runtime";
import { l as login } from "./app-logo-icon-DzE24oHT.js";
import { e as email } from "./index-BZgs4DCL.js";
import { Head, Form } from "@inertiajs/react";
import { LoaderCircle } from "lucide-react";
import { I as InputError } from "./input-error-Dyl9750B.js";
import { T as TextLink } from "./text-link-BhKQWCP2.js";
import { B as Button } from "./button-DRMeR9Ma.js";
import { I as Input } from "./input-M0YOvWWM.js";
import { L as Label } from "./label-DRUcbYUF.js";
import { A as AuthLayout } from "./auth-layout-DxCujAvd.js";
import "clsx";
import "tailwind-merge";
import "./index-DQAywWN6.js";
import "@radix-ui/react-slot";
import "class-variance-authority";
import "@radix-ui/react-label";
function ForgotPassword({ status }) {
  return /* @__PURE__ */ jsxs(
    AuthLayout,
    {
      title: "Esqueceu sua senha?",
      description: "Digite seu e-mail para receber um link de redefinição de senha",
      children: [
        /* @__PURE__ */ jsx(Head, { title: "Esqueci minha senha" }),
        status && /* @__PURE__ */ jsx("div", { className: "mb-4 text-center text-sm font-medium text-green-600", children: status }),
        /* @__PURE__ */ jsxs("div", { className: "space-y-6", children: [
          /* @__PURE__ */ jsx(Form, { ...email.form(), children: ({ processing, errors }) => /* @__PURE__ */ jsxs(Fragment, { children: [
            /* @__PURE__ */ jsxs("div", { className: "grid gap-2", children: [
              /* @__PURE__ */ jsx(Label, { htmlFor: "email", children: "Endereço de e-mail" }),
              /* @__PURE__ */ jsx(
                Input,
                {
                  id: "email",
                  type: "email",
                  name: "email",
                  autoComplete: "off",
                  autoFocus: true,
                  placeholder: "email@exemplo.com"
                }
              ),
              /* @__PURE__ */ jsx(InputError, { message: errors.email })
            ] }),
            /* @__PURE__ */ jsx("div", { className: "my-6 flex items-center justify-start", children: /* @__PURE__ */ jsxs(
              Button,
              {
                className: "w-full",
                disabled: processing,
                "data-test": "email-password-reset-link-button",
                children: [
                  processing && /* @__PURE__ */ jsx(LoaderCircle, { className: "h-4 w-4 animate-spin" }),
                  "Enviar link de redefinição"
                ]
              }
            ) })
          ] }) }),
          /* @__PURE__ */ jsxs("div", { className: "space-x-1 text-center text-sm text-muted-foreground", children: [
            /* @__PURE__ */ jsx("span", { children: "Ou, voltar para o" }),
            /* @__PURE__ */ jsx(TextLink, { href: login(), children: "login" })
          ] })
        ] })
      ]
    }
  );
}
export {
  ForgotPassword as default
};
