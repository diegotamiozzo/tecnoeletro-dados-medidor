import { jsxs, jsx, Fragment } from "react/jsx-runtime";
import { T as TextLink } from "./text-link-BhKQWCP2.js";
import { B as Button } from "./button-DRMeR9Ma.js";
import { S as Spinner } from "./spinner-qShBjBDb.js";
import { A as AuthLayout } from "./auth-layout-DxCujAvd.js";
import { b as logout } from "./app-logo-icon-DzE24oHT.js";
import { s as send } from "./index-CY7S6wGh.js";
import { Head, Form } from "@inertiajs/react";
import "@radix-ui/react-slot";
import "class-variance-authority";
import "lucide-react";
import "clsx";
import "tailwind-merge";
function VerifyEmail({ status }) {
  return /* @__PURE__ */ jsxs(
    AuthLayout,
    {
      title: "Verifique seu e-mail",
      description: "Por favor, verifique seu endereço de e-mail clicando no link que acabamos de enviar para você.",
      children: [
        /* @__PURE__ */ jsx(Head, { title: "Verificação de e-mail" }),
        status === "verification-link-sent" && /* @__PURE__ */ jsx("div", { className: "mb-4 text-center text-sm font-medium text-green-600", children: "Um novo link de verificação foi enviado para o endereço de e-mail que você forneceu durante o registro." }),
        /* @__PURE__ */ jsx(Form, { ...send.form(), className: "space-y-6 text-center", children: ({ processing }) => /* @__PURE__ */ jsxs(Fragment, { children: [
          /* @__PURE__ */ jsxs(Button, { disabled: processing, variant: "secondary", children: [
            processing && /* @__PURE__ */ jsx(Spinner, {}),
            "Reenviar e-mail de verificação"
          ] }),
          /* @__PURE__ */ jsx(
            TextLink,
            {
              href: logout(),
              className: "mx-auto block text-sm",
              children: "Sair"
            }
          )
        ] }) })
      ]
    }
  );
}
export {
  VerifyEmail as default
};
