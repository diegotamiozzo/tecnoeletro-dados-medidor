import { jsxs, Fragment, jsx } from "react/jsx-runtime";
import { r as register, A as AppLogoIcon, e as dashboard, l as login } from "./app-logo-icon-DzE24oHT.js";
import { usePage, Head, Link } from "@inertiajs/react";
import { T as TextLink } from "./text-link-BhKQWCP2.js";
import "clsx";
import "tailwind-merge";
function Welcome({ canRegister = true }) {
  const { auth } = usePage().props;
  return /* @__PURE__ */ jsxs(Fragment, { children: [
    /* @__PURE__ */ jsx(Head, { title: "Bem-vindo" }),
    /* @__PURE__ */ jsxs("div", { className: "relative flex min-h-screen flex-col items-center justify-center bg-background text-foreground dark:bg-[#0a0a0a]", children: [
      /* @__PURE__ */ jsx("div", { className: "absolute top-0 right-0 p-6", children: auth.user ? /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-4 animate-fade-in", children: [
        /* @__PURE__ */ jsxs("span", { className: "text-sm text-muted-foreground", children: [
          "Olá, ",
          /* @__PURE__ */ jsx("span", { className: "font-semibold text-foreground", children: auth.user.name })
        ] }),
        /* @__PURE__ */ jsx("div", { className: "h-4 w-px bg-border" }),
        /* @__PURE__ */ jsxs(
          Link,
          {
            href: "/logout",
            method: "post",
            as: "button",
            className: "group flex items-center gap-2 rounded-full border border-transparent px-3 py-1.5 text-sm font-medium text-muted-foreground transition-all hover:bg-accent hover:text-accent-foreground focus:outline-none dark:hover:bg-neutral-800",
            children: [
              /* @__PURE__ */ jsx(
                "svg",
                {
                  xmlns: "http://www.w3.org/2000/svg",
                  fill: "none",
                  viewBox: "0 0 24 24",
                  strokeWidth: 1.5,
                  stroke: "currentColor",
                  className: "h-4 w-4 transition-transform group-hover:translate-x-0.5",
                  children: /* @__PURE__ */ jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", d: "M15.75 9V5.25A2.25 2.25 0 0 0 13.5 3h-6a2.25 2.25 0 0 0-2.25 2.25v13.5A2.25 2.25 0 0 0 7.5 21h6a2.25 2.25 0 0 0 2.25-2.25V15m3 0 3-3m0 0-3-3m3 3H9" })
                }
              ),
              "Sair"
            ]
          }
        )
      ] }) : canRegister && /* @__PURE__ */ jsxs("div", { className: "text-sm text-muted-foreground", children: [
        "Não tem uma conta?",
        " ",
        /* @__PURE__ */ jsx(TextLink, { href: register(), children: "Cadastre-se" })
      ] }) }),
      /* @__PURE__ */ jsxs("main", { className: "flex w-full max-w-3xl flex-col items-center px-6 text-center", children: [
        /* @__PURE__ */ jsx(AppLogoIcon, { className: "mb-8 h-60 w-auto" }),
        /* @__PURE__ */ jsx("h1", { className: "text-4xl font-bold tracking-tight sm:text-6xl text-foreground", children: "Tecnoeletro" }),
        /* @__PURE__ */ jsxs("p", { className: "mt-6 text-lg leading-relaxed text-muted-foreground", children: [
          "Solução completa para monitoramento e análise de grandezas elétricas.",
          /* @__PURE__ */ jsx("br", { className: "hidden sm:inline" }),
          "Desenvolvida com robustez e desempenho."
        ] }),
        /* @__PURE__ */ jsx("div", { className: "mt-10 flex items-center justify-center gap-x-6", children: auth.user ? /* @__PURE__ */ jsx(
          Link,
          {
            href: dashboard(),
            className: "inline-flex items-center justify-center rounded-md bg-primary px-8 py-3 text-sm font-semibold text-primary-foreground shadow transition-all hover:bg-primary/90 focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 active:scale-95",
            children: "Acessar Painel"
          }
        ) : /* @__PURE__ */ jsx(
          Link,
          {
            href: login(),
            className: "inline-flex items-center justify-center rounded-md bg-primary px-8 py-3 text-sm font-semibold text-primary-foreground shadow transition-all hover:bg-primary/90 focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 active:scale-95",
            children: "Entrar no Sistema"
          }
        ) })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "fixed bottom-8 right-8 z-50 flex items-center group", children: [
        /* @__PURE__ */ jsxs("div", { className: "absolute right-full mr-3 whitespace-nowrap rounded-lg bg-white px-4 py-2 text-sm font-medium text-slate-700 shadow-xl opacity-0 translate-x-4 transition-all group-hover:opacity-100 group-hover:translate-x-0 dark:bg-neutral-800 dark:text-white border border-slate-100 dark:border-neutral-700", children: [
          "Gostaria de um teste grátis?",
          /* @__PURE__ */ jsx("div", { className: "absolute top-1/2 -right-1 h-2 w-2 -translate-y-1/2 rotate-45 bg-white dark:bg-neutral-800 border-r border-t border-slate-100 dark:border-neutral-700" })
        ] }),
        /* @__PURE__ */ jsx(
          "a",
          {
            href: "https://wa.me/5548988350949?text=Olá!%20Gostaria%20de%20um%20teste%20grátis%20na%20plataforma%20de%20monitoramento%20de%20energia%20da%20Tecnoeletro",
            target: "_blank",
            rel: "noopener noreferrer",
            className: "flex h-16 w-16 animate-bounce items-center justify-center rounded-full bg-[#25D366] text-white shadow-2xl transition-all hover:scale-110 hover:bg-[#20ba5a] active:scale-95",
            style: { animationDuration: "3s" },
            children: /* @__PURE__ */ jsx("svg", { viewBox: "0 0 24 24", className: "h-9 w-9 fill-current", xmlns: "http://www.w3.org/2000/svg", children: /* @__PURE__ */ jsx("path", { d: "M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L0 24l6.335-1.662c1.72.94 3.659 1.437 5.63 1.437h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" }) })
          }
        )
      ] }),
      /* @__PURE__ */ jsxs("footer", { className: "absolute bottom-6 text-sm text-muted-foreground/60", children: [
        "© ",
        (/* @__PURE__ */ new Date()).getFullYear(),
        " Tecnoeletro. Todos os direitos reservados."
      ] })
    ] })
  ] });
}
export {
  Welcome as default
};
