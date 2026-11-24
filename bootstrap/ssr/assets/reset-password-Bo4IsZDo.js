import { jsxs, jsx } from "react/jsx-runtime";
import { u as update } from "./index-BZgs4DCL.js";
import { Head, Form } from "@inertiajs/react";
import { I as InputError } from "./input-error-Dyl9750B.js";
import { B as Button } from "./button-DRMeR9Ma.js";
import { I as Input } from "./input-M0YOvWWM.js";
import { L as Label } from "./label-DRUcbYUF.js";
import { S as Spinner } from "./spinner-qShBjBDb.js";
import { A as AuthLayout } from "./auth-layout-DxCujAvd.js";
import "./app-logo-icon-DzE24oHT.js";
import "clsx";
import "tailwind-merge";
import "./index-DQAywWN6.js";
import "@radix-ui/react-slot";
import "class-variance-authority";
import "@radix-ui/react-label";
import "lucide-react";
function ResetPassword({ token, email }) {
  return /* @__PURE__ */ jsxs(
    AuthLayout,
    {
      title: "Redefinir senha",
      description: "Por favor, digite sua nova senha abaixo",
      children: [
        /* @__PURE__ */ jsx(Head, { title: "Redefinir senha" }),
        /* @__PURE__ */ jsx(
          Form,
          {
            ...update.form(),
            transform: (data) => ({ ...data, token, email }),
            resetOnSuccess: ["password", "password_confirmation"],
            children: ({ processing, errors }) => /* @__PURE__ */ jsxs("div", { className: "grid gap-6", children: [
              /* @__PURE__ */ jsxs("div", { className: "grid gap-2", children: [
                /* @__PURE__ */ jsx(Label, { htmlFor: "email", children: "E-mail" }),
                /* @__PURE__ */ jsx(
                  Input,
                  {
                    id: "email",
                    type: "email",
                    name: "email",
                    autoComplete: "email",
                    value: email,
                    className: "mt-1 block w-full",
                    readOnly: true
                  }
                ),
                /* @__PURE__ */ jsx(
                  InputError,
                  {
                    message: errors.email,
                    className: "mt-2"
                  }
                )
              ] }),
              /* @__PURE__ */ jsxs("div", { className: "grid gap-2", children: [
                /* @__PURE__ */ jsx(Label, { htmlFor: "password", children: "Senha" }),
                /* @__PURE__ */ jsx(
                  Input,
                  {
                    id: "password",
                    type: "password",
                    name: "password",
                    autoComplete: "new-password",
                    className: "mt-1 block w-full",
                    autoFocus: true,
                    placeholder: "Nova senha"
                  }
                ),
                /* @__PURE__ */ jsx(InputError, { message: errors.password })
              ] }),
              /* @__PURE__ */ jsxs("div", { className: "grid gap-2", children: [
                /* @__PURE__ */ jsx(Label, { htmlFor: "password_confirmation", children: "Confirmar senha" }),
                /* @__PURE__ */ jsx(
                  Input,
                  {
                    id: "password_confirmation",
                    type: "password",
                    name: "password_confirmation",
                    autoComplete: "new-password",
                    className: "mt-1 block w-full",
                    placeholder: "Confirme a nova senha"
                  }
                ),
                /* @__PURE__ */ jsx(
                  InputError,
                  {
                    message: errors.password_confirmation,
                    className: "mt-2"
                  }
                )
              ] }),
              /* @__PURE__ */ jsxs(
                Button,
                {
                  type: "submit",
                  className: "mt-4 w-full",
                  disabled: processing,
                  "data-test": "reset-password-button",
                  children: [
                    processing && /* @__PURE__ */ jsx(Spinner, {}),
                    "Redefinir senha"
                  ]
                }
              )
            ] })
          }
        )
      ]
    }
  );
}
export {
  ResetPassword as default
};
