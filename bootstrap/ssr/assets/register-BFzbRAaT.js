import { jsxs, jsx } from "react/jsx-runtime";
import { l as login } from "./app-logo-icon-DzE24oHT.js";
import { useForm, Head } from "@inertiajs/react";
import { useState, useEffect } from "react";
import { I as InputError } from "./input-error-Dyl9750B.js";
import { T as TextLink } from "./text-link-BhKQWCP2.js";
import { B as Button } from "./button-DRMeR9Ma.js";
import { I as Input } from "./input-M0YOvWWM.js";
import { L as Label } from "./label-DRUcbYUF.js";
import { S as Spinner } from "./spinner-qShBjBDb.js";
import { A as AuthLayout } from "./auth-layout-DxCujAvd.js";
import { EyeOff, Eye } from "lucide-react";
import "clsx";
import "tailwind-merge";
import "@radix-ui/react-slot";
import "class-variance-authority";
import "@radix-ui/react-label";
function Register() {
  const [mounted, setMounted] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showPasswordConfirmation, setShowPasswordConfirmation] = useState(false);
  const { data, setData, post, processing, errors, reset } = useForm({
    name: "",
    email: "",
    password: "",
    password_confirmation: ""
  });
  useEffect(() => {
    setMounted(true);
    const queryParams = new URLSearchParams(window.location.search);
    const emailFromUrl = queryParams.get("email");
    if (emailFromUrl) {
      setData("email", emailFromUrl);
    }
  }, []);
  const handleSubmit = (e) => {
    e.preventDefault();
    post("/register", {
      onFinish: () => reset("password", "password_confirmation")
    });
  };
  return /* @__PURE__ */ jsxs(
    AuthLayout,
    {
      title: "Criar uma conta",
      description: "Insira seus dados abaixo para criar sua conta",
      children: [
        /* @__PURE__ */ jsx(Head, { title: "Cadastro" }),
        /* @__PURE__ */ jsxs("form", { onSubmit: handleSubmit, className: "flex flex-col gap-6", children: [
          /* @__PURE__ */ jsxs("div", { className: "grid gap-6", children: [
            /* @__PURE__ */ jsxs("div", { className: "grid gap-2", children: [
              /* @__PURE__ */ jsx(Label, { htmlFor: "name", children: "Nome" }),
              /* @__PURE__ */ jsx(
                Input,
                {
                  id: "name",
                  type: "text",
                  value: data.name,
                  onChange: (e) => setData("name", e.target.value),
                  required: true,
                  autoFocus: !data.email,
                  autoComplete: "name",
                  placeholder: "Nome completo"
                }
              ),
              /* @__PURE__ */ jsx(InputError, { message: errors.name, className: "mt-2" })
            ] }),
            /* @__PURE__ */ jsxs("div", { className: "grid gap-2", children: [
              /* @__PURE__ */ jsx(Label, { htmlFor: "email", children: "Endereço de e-mail" }),
              /* @__PURE__ */ jsx(
                Input,
                {
                  id: "email",
                  type: "email",
                  value: data.email,
                  onChange: (e) => setData("email", e.target.value),
                  required: true,
                  autoComplete: "email",
                  readOnly: mounted && !!new URLSearchParams(window.location.search).get("email"),
                  className: mounted && new URLSearchParams(window.location.search).get("email") ? "bg-muted cursor-not-allowed" : "",
                  placeholder: "email@exemplo.com"
                }
              ),
              /* @__PURE__ */ jsx(InputError, { message: errors.email }),
              mounted && new URLSearchParams(window.location.search).get("email") && /* @__PURE__ */ jsx("p", { className: "text-[11px] text-muted-foreground italic", children: "Este e-mail está vinculado ao seu convite de acesso." })
            ] }),
            /* @__PURE__ */ jsxs("div", { className: "grid gap-2", children: [
              /* @__PURE__ */ jsx(Label, { htmlFor: "password", children: "Senha" }),
              /* @__PURE__ */ jsxs("div", { className: "relative", children: [
                /* @__PURE__ */ jsx(
                  Input,
                  {
                    id: "password",
                    type: showPassword ? "text" : "password",
                    value: data.password,
                    onChange: (e) => setData("password", e.target.value),
                    required: true,
                    autoComplete: "new-password",
                    placeholder: "Sua senha",
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
            /* @__PURE__ */ jsxs("div", { className: "grid gap-2", children: [
              /* @__PURE__ */ jsx(Label, { htmlFor: "password_confirmation", children: "Confirmar senha" }),
              /* @__PURE__ */ jsxs("div", { className: "relative", children: [
                /* @__PURE__ */ jsx(
                  Input,
                  {
                    id: "password_confirmation",
                    type: showPasswordConfirmation ? "text" : "password",
                    value: data.password_confirmation,
                    onChange: (e) => setData("password_confirmation", e.target.value),
                    required: true,
                    autoComplete: "new-password",
                    placeholder: "Confirme sua senha",
                    className: "pr-10"
                  }
                ),
                /* @__PURE__ */ jsx(
                  "button",
                  {
                    type: "button",
                    onClick: () => setShowPasswordConfirmation(!showPasswordConfirmation),
                    className: "absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground focus:outline-none",
                    tabIndex: -1,
                    children: showPasswordConfirmation ? /* @__PURE__ */ jsx(EyeOff, { className: "size-4" }) : /* @__PURE__ */ jsx(Eye, { className: "size-4" })
                  }
                )
              ] }),
              /* @__PURE__ */ jsx(InputError, { message: errors.password_confirmation })
            ] }),
            /* @__PURE__ */ jsxs(
              Button,
              {
                type: "submit",
                className: "mt-2 w-full",
                disabled: processing,
                children: [
                  processing && /* @__PURE__ */ jsx(Spinner, { className: "mr-2" }),
                  "Criar conta"
                ]
              }
            )
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "text-center text-sm text-muted-foreground", children: [
            "Já tem uma conta?",
            " ",
            /* @__PURE__ */ jsx(TextLink, { href: login(), children: "Entrar" })
          ] })
        ] })
      ]
    }
  );
}
export {
  Register as default
};
