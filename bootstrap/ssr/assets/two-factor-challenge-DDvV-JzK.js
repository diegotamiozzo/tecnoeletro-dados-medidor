import { jsxs, jsx, Fragment } from "react/jsx-runtime";
import { I as InputError } from "./input-error-Dyl9750B.js";
import { B as Button } from "./button-DRMeR9Ma.js";
import { I as Input } from "./input-M0YOvWWM.js";
import { I as InputOTP, O as OTP_MAX_LENGTH, a as InputOTPGroup, b as InputOTPSlot } from "./use-two-factor-auth-BcH0RR35.js";
import { A as AuthLayout } from "./auth-layout-DxCujAvd.js";
import { s as store } from "./index-Bx3L4Ye9.js";
import { Head, Form } from "@inertiajs/react";
import { REGEXP_ONLY_DIGITS } from "input-otp";
import { useState, useMemo } from "react";
import "./app-logo-icon-DzE24oHT.js";
import "clsx";
import "tailwind-merge";
import "@radix-ui/react-slot";
import "class-variance-authority";
import "lucide-react";
function TwoFactorChallenge() {
  const [showRecoveryInput, setShowRecoveryInput] = useState(false);
  const [code, setCode] = useState("");
  const authConfigContent = useMemo(() => {
    if (showRecoveryInput) {
      return {
        title: "Código de Recuperação",
        description: "Por favor, confirme o acesso à sua conta inserindo um de seus códigos de recuperação de emergência.",
        toggleText: "entrar usando um código de autenticação"
      };
    }
    return {
      title: "Código de Autenticação",
      description: "Insira o código de autenticação fornecido pelo seu aplicativo autenticador.",
      toggleText: "entrar usando um código de recuperação"
    };
  }, [showRecoveryInput]);
  const toggleRecoveryMode = (clearErrors) => {
    setShowRecoveryInput(!showRecoveryInput);
    clearErrors();
    setCode("");
  };
  return /* @__PURE__ */ jsxs(
    AuthLayout,
    {
      title: authConfigContent.title,
      description: authConfigContent.description,
      children: [
        /* @__PURE__ */ jsx(Head, { title: "Autenticação de Dois Fatores" }),
        /* @__PURE__ */ jsx("div", { className: "space-y-6", children: /* @__PURE__ */ jsx(
          Form,
          {
            ...store.form(),
            className: "space-y-4",
            resetOnError: true,
            resetOnSuccess: !showRecoveryInput,
            children: ({ errors, processing, clearErrors }) => /* @__PURE__ */ jsxs(Fragment, { children: [
              showRecoveryInput ? /* @__PURE__ */ jsxs(Fragment, { children: [
                /* @__PURE__ */ jsx(
                  Input,
                  {
                    name: "recovery_code",
                    type: "text",
                    placeholder: "Insira o código de recuperação",
                    autoFocus: showRecoveryInput,
                    required: true
                  }
                ),
                /* @__PURE__ */ jsx(
                  InputError,
                  {
                    message: errors.recovery_code
                  }
                )
              ] }) : /* @__PURE__ */ jsxs("div", { className: "flex flex-col items-center justify-center space-y-3 text-center", children: [
                /* @__PURE__ */ jsx("div", { className: "flex w-full items-center justify-center", children: /* @__PURE__ */ jsx(
                  InputOTP,
                  {
                    name: "code",
                    maxLength: OTP_MAX_LENGTH,
                    value: code,
                    onChange: (value) => setCode(value),
                    disabled: processing,
                    pattern: REGEXP_ONLY_DIGITS,
                    children: /* @__PURE__ */ jsx(InputOTPGroup, { children: Array.from(
                      { length: OTP_MAX_LENGTH },
                      (_, index) => /* @__PURE__ */ jsx(
                        InputOTPSlot,
                        {
                          index
                        },
                        index
                      )
                    ) })
                  }
                ) }),
                /* @__PURE__ */ jsx(InputError, { message: errors.code })
              ] }),
              /* @__PURE__ */ jsx(
                Button,
                {
                  type: "submit",
                  className: "w-full",
                  disabled: processing,
                  children: "Continuar"
                }
              ),
              /* @__PURE__ */ jsxs("div", { className: "text-center text-sm text-muted-foreground", children: [
                /* @__PURE__ */ jsx("span", { children: "ou você pode " }),
                /* @__PURE__ */ jsx(
                  "button",
                  {
                    type: "button",
                    className: "cursor-pointer text-foreground underline decoration-neutral-300 underline-offset-4 transition-colors duration-300 ease-out hover:decoration-current! dark:decoration-neutral-500",
                    onClick: () => toggleRecoveryMode(clearErrors),
                    children: authConfigContent.toggleText
                  }
                )
              ] })
            ] })
          }
        ) })
      ]
    }
  );
}
export {
  TwoFactorChallenge as default
};
