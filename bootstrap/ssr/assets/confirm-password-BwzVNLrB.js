import { jsxs, jsx } from "react/jsx-runtime";
import { I as InputError } from "./input-error-Dyl9750B.js";
import { B as Button } from "./button-DRMeR9Ma.js";
import { I as Input } from "./input-M0YOvWWM.js";
import { L as Label } from "./label-DRUcbYUF.js";
import { S as Spinner } from "./spinner-qShBjBDb.js";
import { A as AuthLayout } from "./auth-layout-DxCujAvd.js";
import { s as store } from "./index-DQAywWN6.js";
import { Head, Form } from "@inertiajs/react";
import { EyeOff, Eye } from "lucide-react";
import { useState } from "react";
import "./app-logo-icon-DzE24oHT.js";
import "clsx";
import "tailwind-merge";
import "@radix-ui/react-slot";
import "class-variance-authority";
import "@radix-ui/react-label";
function ConfirmPassword() {
  const [showPassword, setShowPassword] = useState(false);
  return /* @__PURE__ */ jsxs(
    AuthLayout,
    {
      title: "Confirme sua senha",
      description: "Esta é uma área segura da aplicação. Por favor, confirme sua senha antes de continuar.",
      children: [
        /* @__PURE__ */ jsx(Head, { title: "Confirmar senha" }),
        /* @__PURE__ */ jsx(Form, { ...store.form(), resetOnSuccess: ["password"], children: ({ processing, errors }) => /* @__PURE__ */ jsxs("div", { className: "space-y-6", children: [
          /* @__PURE__ */ jsxs("div", { className: "grid gap-2", children: [
            /* @__PURE__ */ jsx(Label, { htmlFor: "password", children: "Senha" }),
            /* @__PURE__ */ jsxs("div", { className: "relative", children: [
              /* @__PURE__ */ jsx(
                Input,
                {
                  id: "password",
                  type: showPassword ? "text" : "password",
                  name: "password",
                  placeholder: "Sua senha",
                  autoComplete: "current-password",
                  autoFocus: true,
                  className: "pr-10"
                }
              ),
              /* @__PURE__ */ jsx(
                "button",
                {
                  type: "button",
                  onClick: () => setShowPassword(!showPassword),
                  className: "absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground focus:outline-none",
                  tabIndex: -1,
                  children: showPassword ? /* @__PURE__ */ jsx(EyeOff, { className: "size-4" }) : /* @__PURE__ */ jsx(Eye, { className: "size-4" })
                }
              )
            ] }),
            /* @__PURE__ */ jsx(InputError, { message: errors.password })
          ] }),
          /* @__PURE__ */ jsx("div", { className: "flex items-center", children: /* @__PURE__ */ jsxs(
            Button,
            {
              className: "w-full",
              disabled: processing,
              "data-test": "confirm-password-button",
              children: [
                processing && /* @__PURE__ */ jsx(Spinner, {}),
                "Confirmar senha"
              ]
            }
          ) })
        ] }) })
      ]
    }
  );
}
export {
  ConfirmPassword as default
};
