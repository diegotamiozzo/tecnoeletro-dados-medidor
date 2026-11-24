import { jsxs, jsx } from "react/jsx-runtime";
import { I as InputError } from "./input-error-Dyl9750B.js";
import { B as Badge } from "./badge-CGdczzvr.js";
import { B as Button } from "./button-DRMeR9Ma.js";
import { D as Dialog, a as DialogContent, b as DialogHeader, c as DialogTitle, d as DialogDescription, e as DialogFooter } from "./dialog-BWgP0n_o.js";
import { I as Input } from "./input-M0YOvWWM.js";
import { L as Label } from "./label-DRUcbYUF.js";
import { S as Spinner } from "./spinner-qShBjBDb.js";
import { A as AppLayout } from "./app-layout-DZbn1Lk-.js";
import { usePage, useForm, Head, Link } from "@inertiajs/react";
import { CheckCircle2, Plus, EyeOff, Eye, LayoutDashboard, Pencil, Trash2, UserCheck, UserX, Zap, ZapOff, CircleDashed, AlertTriangle } from "lucide-react";
import { useState } from "react";
import "./app-logo-icon-DzE24oHT.js";
import "clsx";
import "tailwind-merge";
import "@radix-ui/react-slot";
import "class-variance-authority";
import "@radix-ui/react-dialog";
import "@radix-ui/react-label";
import "@radix-ui/react-tooltip";
import "@radix-ui/react-dropdown-menu";
import "@radix-ui/react-avatar";
const breadcrumbs = [
  { title: "Admin", href: "/admin" },
  { title: "Equipamentos", href: "/admin/devices" }
];
function AdminDevices({ devices }) {
  const { props } = usePage();
  const flash = props.flash ?? {};
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [editingDevice, setEditingDevice] = useState(null);
  const [deletingDevice, setDeletingDevice] = useState(null);
  const [showPin, setShowPin] = useState({});
  const [showCreatePin, setShowCreatePin] = useState(false);
  const [showEditPin, setShowEditPin] = useState(false);
  const createForm = useForm({
    mac_address: "",
    pin: "",
    name: "Medidor 01",
    is_generate: true
  });
  const editForm = useForm({
    name: "",
    pin: "",
    is_active: true,
    is_generate: true
  });
  const deleteForm = useForm({});
  const submitCreate = (e) => {
    e.preventDefault();
    createForm.post("/admin/devices", {
      onSuccess: () => {
        setIsCreateOpen(false);
        createForm.reset();
      }
    });
  };
  const openEdit = (device) => {
    setEditingDevice(device);
    setShowEditPin(false);
    editForm.setData({
      name: device.name,
      pin: device.pin,
      is_active: device.is_active,
      is_generate: device.is_generate
    });
  };
  const submitEdit = (e) => {
    e.preventDefault();
    if (!editingDevice) return;
    editForm.put(`/admin/devices/${editingDevice.id}`, {
      onSuccess: () => setEditingDevice(null)
    });
  };
  const confirmDelete = () => {
    if (!deletingDevice) return;
    deleteForm.delete(`/admin/devices/${deletingDevice.id}`, {
      onSuccess: () => setDeletingDevice(null)
    });
  };
  const togglePinVisibility = (id) => {
    setShowPin((prev) => ({ ...prev, [id]: !prev[id] }));
  };
  return /* @__PURE__ */ jsxs(AppLayout, { breadcrumbs, children: [
    /* @__PURE__ */ jsx(Head, { title: "Admin · Equipamentos" }),
    /* @__PURE__ */ jsxs("div", { className: "flex h-full flex-1 flex-col gap-6 p-4 lg:p-8", children: [
      flash.success && /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2 rounded-lg border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-700 dark:border-green-800 dark:bg-green-950/30 dark:text-green-400", children: [
        /* @__PURE__ */ jsx(CheckCircle2, { className: "size-4 shrink-0" }),
        flash.success
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between", children: [
        /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsx("h1", { className: "text-xl font-semibold", children: "Equipamentos" }),
          /* @__PURE__ */ jsxs("p", { className: "text-sm text-muted-foreground", children: [
            devices.length,
            " ",
            devices.length === 1 ? "dispositivo cadastrado" : "dispositivos cadastrados"
          ] })
        ] }),
        /* @__PURE__ */ jsxs(
          Button,
          {
            onClick: () => {
              createForm.reset();
              setIsCreateOpen(true);
            },
            className: "w-full sm:w-auto",
            children: [
              /* @__PURE__ */ jsx(Plus, { className: "size-4 mr-1" }),
              "Novo Equipamento"
            ]
          }
        )
      ] }),
      /* @__PURE__ */ jsx("div", { className: "grid gap-4 md:hidden", children: devices.length === 0 ? /* @__PURE__ */ jsx("div", { className: "rounded-xl border border-dashed p-12 text-center text-muted-foreground", children: "Nenhum equipamento cadastrado." }) : devices.map((device) => /* @__PURE__ */ jsxs(
        "div",
        {
          className: "rounded-xl border bg-card p-4 shadow-sm space-y-4",
          children: [
            /* @__PURE__ */ jsxs("div", { className: "flex items-start justify-between", children: [
              /* @__PURE__ */ jsxs("div", { className: "space-y-1", children: [
                /* @__PURE__ */ jsx("h3", { className: "font-bold leading-none", children: device.name }),
                /* @__PURE__ */ jsx("p", { className: "font-mono text-[10px] uppercase tracking-wider text-muted-foreground", children: device.mac_address })
              ] }),
              /* @__PURE__ */ jsxs("div", { className: "flex flex-col items-end gap-1", children: [
                /* @__PURE__ */ jsx(
                  Badge,
                  {
                    className: device.is_active ? "bg-green-600 hover:bg-green-600 text-white" : "bg-secondary text-secondary-foreground",
                    children: device.is_active ? "Ativo" : "Inativo"
                  }
                ),
                /* @__PURE__ */ jsx(
                  Badge,
                  {
                    className: device.is_generate ? "bg-green-600 hover:bg-green-600 text-white" : "bg-secondary text-secondary-foreground",
                    children: device.is_generate ? "Própria" : "Nenhuma"
                  }
                )
              ] })
            ] }),
            /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-2 gap-4 text-sm", children: [
              /* @__PURE__ */ jsxs("div", { children: [
                /* @__PURE__ */ jsx("span", { className: "text-[10px] font-bold uppercase text-muted-foreground block", children: "PIN" }),
                /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2 mt-1", children: [
                  /* @__PURE__ */ jsx("span", { className: "font-mono", children: showPin[device.id] ? device.pin : "••••••" }),
                  /* @__PURE__ */ jsx(
                    "button",
                    {
                      onClick: () => togglePinVisibility(device.id),
                      className: "text-muted-foreground cursor-pointer",
                      children: showPin[device.id] ? /* @__PURE__ */ jsx(EyeOff, { className: "size-3" }) : /* @__PURE__ */ jsx(Eye, { className: "size-3" })
                    }
                  )
                ] })
              ] }),
              /* @__PURE__ */ jsxs("div", { children: [
                /* @__PURE__ */ jsx("span", { className: "text-[10px] font-bold uppercase text-muted-foreground block", children: "Dono" }),
                /* @__PURE__ */ jsx("p", { className: "truncate mt-1", children: device.owner?.name || "—" })
              ] })
            ] }),
            /* @__PURE__ */ jsxs("div", { className: "flex gap-2 pt-2 border-t", children: [
              /* @__PURE__ */ jsx(
                Link,
                {
                  href: `/devices/${device.id}/dashboard`,
                  className: "flex-1",
                  children: /* @__PURE__ */ jsxs(
                    Button,
                    {
                      variant: "outline",
                      size: "sm",
                      className: "w-full gap-1.5 text-blue-600 border-blue-200 hover:bg-blue-50 hover:text-blue-700 dark:border-blue-800 dark:text-blue-400 dark:hover:bg-blue-950/30",
                      children: [
                        /* @__PURE__ */ jsx(LayoutDashboard, { className: "size-3" }),
                        "Dashboard"
                      ]
                    }
                  )
                }
              ),
              /* @__PURE__ */ jsxs(
                Button,
                {
                  variant: "outline",
                  size: "sm",
                  className: "flex-1",
                  onClick: () => openEdit(device),
                  children: [
                    /* @__PURE__ */ jsx(Pencil, { className: "size-3 mr-2" }),
                    " Editar"
                  ]
                }
              ),
              /* @__PURE__ */ jsxs(
                Button,
                {
                  variant: "outline",
                  size: "sm",
                  className: "flex-1 text-red-500 hover:text-red-600",
                  onClick: () => setDeletingDevice(device),
                  children: [
                    /* @__PURE__ */ jsx(Trash2, { className: "size-3 mr-2" }),
                    " Excluir"
                  ]
                }
              )
            ] })
          ]
        },
        device.id
      )) }),
      /* @__PURE__ */ jsx("div", { className: "hidden md:block overflow-hidden rounded-xl border bg-card", children: /* @__PURE__ */ jsxs("table", { className: "w-full text-sm", children: [
        /* @__PURE__ */ jsx("thead", { className: "bg-muted/40 border-b", children: /* @__PURE__ */ jsxs("tr", { children: [
          /* @__PURE__ */ jsx("th", { className: "px-4 py-3 text-left font-medium", children: "Equipamento" }),
          /* @__PURE__ */ jsx("th", { className: "px-4 py-3 text-left font-medium", children: "MAC" }),
          /* @__PURE__ */ jsx("th", { className: "px-4 py-3 text-left font-medium", children: "PIN" }),
          /* @__PURE__ */ jsx("th", { className: "px-4 py-3 text-left font-medium", children: "Proprietário" }),
          /* @__PURE__ */ jsx("th", { className: "px-4 py-3 text-left font-medium", children: "Geração" }),
          /* @__PURE__ */ jsx("th", { className: "px-4 py-3 text-left font-medium", children: "Status" }),
          /* @__PURE__ */ jsx("th", { className: "px-4 py-3 text-right font-medium", children: "Ações" })
        ] }) }),
        /* @__PURE__ */ jsx("tbody", { className: "divide-y", children: devices.length === 0 ? /* @__PURE__ */ jsx("tr", { children: /* @__PURE__ */ jsx(
          "td",
          {
            colSpan: 7,
            className: "px-4 py-12 text-center text-muted-foreground italic",
            children: "Nenhum equipamento cadastrado."
          }
        ) }) : devices.map((device) => /* @__PURE__ */ jsxs(
          "tr",
          {
            className: "hover:bg-muted/30 transition-colors",
            children: [
              /* @__PURE__ */ jsx("td", { className: "px-4 py-3 font-medium", children: device.name }),
              /* @__PURE__ */ jsx("td", { className: "px-4 py-3 font-mono text-xs tracking-widest text-muted-foreground", children: device.mac_address }),
              /* @__PURE__ */ jsx("td", { className: "px-4 py-3", children: /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2", children: [
                /* @__PURE__ */ jsx("span", { className: "font-mono text-xs", children: showPin[device.id] ? device.pin : "••••••" }),
                /* @__PURE__ */ jsx(
                  "button",
                  {
                    onClick: () => togglePinVisibility(device.id),
                    className: "text-muted-foreground hover:text-foreground cursor-pointer",
                    children: showPin[device.id] ? /* @__PURE__ */ jsx(EyeOff, { className: "size-4" }) : /* @__PURE__ */ jsx(Eye, { className: "size-4" })
                  }
                )
              ] }) }),
              /* @__PURE__ */ jsx("td", { className: "px-4 py-3", children: device.owner ? /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2", children: [
                /* @__PURE__ */ jsx(UserCheck, { className: "size-4 text-green-500 shrink-0" }),
                /* @__PURE__ */ jsxs("div", { className: "max-w-[150px]", children: [
                  /* @__PURE__ */ jsx("p", { className: "font-medium truncate leading-tight", children: device.owner.name }),
                  /* @__PURE__ */ jsx("p", { className: "text-[10px] text-muted-foreground truncate", children: device.owner.email })
                ] })
              ] }) : /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2 text-muted-foreground/60", children: [
                /* @__PURE__ */ jsx(UserX, { className: "size-4 shrink-0" }),
                /* @__PURE__ */ jsx("span", { className: "text-xs italic", children: "Sem proprietário" })
              ] }) }),
              /* @__PURE__ */ jsx("td", { className: "px-4 py-3", children: device.is_generate ? /* @__PURE__ */ jsxs(Badge, { className: "bg-green-600 hover:bg-green-600 text-white gap-1", children: [
                /* @__PURE__ */ jsx(Zap, { className: "size-3" }),
                " Própria"
              ] }) : /* @__PURE__ */ jsxs(Badge, { variant: "secondary", className: "gap-1", children: [
                /* @__PURE__ */ jsx(ZapOff, { className: "size-3" }),
                " Nenhuma"
              ] }) }),
              /* @__PURE__ */ jsx("td", { className: "px-4 py-3", children: device.is_active ? /* @__PURE__ */ jsxs(Badge, { className: "bg-green-600 hover:bg-green-600 text-white gap-1", children: [
                /* @__PURE__ */ jsx(CheckCircle2, { className: "size-3" }),
                " Ativo"
              ] }) : /* @__PURE__ */ jsxs(Badge, { variant: "secondary", className: "gap-1", children: [
                /* @__PURE__ */ jsx(CircleDashed, { className: "size-3" }),
                " Inativo"
              ] }) }),
              /* @__PURE__ */ jsx("td", { className: "px-4 py-3 text-right", children: /* @__PURE__ */ jsxs("div", { className: "flex justify-end items-center gap-1", children: [
                /* @__PURE__ */ jsx(Link, { href: `/devices/${device.id}/dashboard`, children: /* @__PURE__ */ jsx(
                  Button,
                  {
                    variant: "ghost",
                    size: "icon",
                    title: "Ver Dashboard",
                    className: "text-blue-500 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-950/30",
                    children: /* @__PURE__ */ jsx(LayoutDashboard, { className: "size-4" })
                  }
                ) }),
                /* @__PURE__ */ jsx(
                  Button,
                  {
                    variant: "ghost",
                    size: "icon",
                    onClick: () => openEdit(device),
                    children: /* @__PURE__ */ jsx(Pencil, { className: "size-4" })
                  }
                ),
                /* @__PURE__ */ jsx(
                  Button,
                  {
                    variant: "ghost",
                    size: "icon",
                    onClick: () => setDeletingDevice(device),
                    children: /* @__PURE__ */ jsx(Trash2, { className: "size-4 text-red-500" })
                  }
                )
              ] }) })
            ]
          },
          device.id
        )) })
      ] }) }),
      /* @__PURE__ */ jsx(
        Dialog,
        {
          open: isCreateOpen,
          onOpenChange: (v) => !v && setIsCreateOpen(false),
          children: /* @__PURE__ */ jsxs(DialogContent, { className: "w-[95vw] max-w-md rounded-xl", children: [
            /* @__PURE__ */ jsxs(DialogHeader, { children: [
              /* @__PURE__ */ jsx(DialogTitle, { children: "Novo Equipamento" }),
              /* @__PURE__ */ jsx(DialogDescription, { children: "Cadastre um novo dispositivo medidor no sistema." })
            ] }),
            /* @__PURE__ */ jsxs("form", { onSubmit: submitCreate, className: "space-y-4", children: [
              /* @__PURE__ */ jsxs("div", { className: "grid gap-2", children: [
                /* @__PURE__ */ jsx(Label, { htmlFor: "create-mac", children: "MAC Address" }),
                /* @__PURE__ */ jsx(
                  Input,
                  {
                    id: "create-mac",
                    maxLength: 12,
                    value: createForm.data.mac_address,
                    onChange: (e) => createForm.setData(
                      "mac_address",
                      e.target.value.replace(/[^A-Fa-f0-9]/g, "").toUpperCase().slice(0, 12)
                    ),
                    placeholder: "Ex: D4AD20BD9C0F",
                    className: "font-mono tracking-widest"
                  }
                ),
                /* @__PURE__ */ jsx(InputError, { message: createForm.errors.mac_address })
              ] }),
              /* @__PURE__ */ jsxs("div", { className: "grid gap-2", children: [
                /* @__PURE__ */ jsx(Label, { htmlFor: "create-pin", children: "PIN de Segurança" }),
                /* @__PURE__ */ jsxs("div", { className: "relative", children: [
                  /* @__PURE__ */ jsx(
                    Input,
                    {
                      id: "create-pin",
                      type: showCreatePin ? "text" : "password",
                      inputMode: "numeric",
                      maxLength: 6,
                      value: createForm.data.pin,
                      onChange: (e) => createForm.setData(
                        "pin",
                        e.target.value.replace(/[^0-9]/g, "").slice(0, 6)
                      ),
                      placeholder: "6 dígitos",
                      className: "pr-9 font-mono tracking-widest"
                    }
                  ),
                  /* @__PURE__ */ jsx(
                    "button",
                    {
                      type: "button",
                      onClick: () => setShowCreatePin(!showCreatePin),
                      className: "absolute right-2.5 top-1/2 -translate-y-1/2 text-muted-foreground cursor-pointer",
                      children: showCreatePin ? /* @__PURE__ */ jsx(EyeOff, { className: "size-4" }) : /* @__PURE__ */ jsx(Eye, { className: "size-4" })
                    }
                  )
                ] }),
                /* @__PURE__ */ jsx(InputError, { message: createForm.errors.pin })
              ] }),
              /* @__PURE__ */ jsxs("div", { className: "grid gap-2", children: [
                /* @__PURE__ */ jsx(Label, { htmlFor: "create-name", children: "Nome Exibição" }),
                /* @__PURE__ */ jsx(
                  Input,
                  {
                    id: "create-name",
                    value: createForm.data.name,
                    onChange: (e) => createForm.setData("name", e.target.value)
                  }
                ),
                /* @__PURE__ */ jsx(InputError, { message: createForm.errors.name })
              ] }),
              /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between rounded-lg border p-4 bg-muted/20", children: [
                /* @__PURE__ */ jsxs("div", { className: "space-y-0.5", children: [
                  /* @__PURE__ */ jsx("span", { className: "text-sm font-medium", children: "Geração Própria" }),
                  /* @__PURE__ */ jsx("p", { className: "text-xs text-muted-foreground", children: createForm.data.is_generate ? "Equipamento possui painéis/geração" : "Apenas consumo da rede" })
                ] }),
                /* @__PURE__ */ jsx(
                  "button",
                  {
                    type: "button",
                    onClick: () => createForm.setData(
                      "is_generate",
                      !createForm.data.is_generate
                    ),
                    className: `relative inline-flex cursor-pointer h-6 w-11 items-center rounded-full transition-colors ${createForm.data.is_generate ? "bg-green-600" : "bg-gray-300 dark:bg-gray-600"}`,
                    children: /* @__PURE__ */ jsx(
                      "span",
                      {
                        className: `inline-block h-4 w-4 transform rounded-full bg-white shadow transition-transform ${createForm.data.is_generate ? "translate-x-6" : "translate-x-1"}`
                      }
                    )
                  }
                )
              ] }),
              /* @__PURE__ */ jsxs(DialogFooter, { className: "flex-col-reverse sm:flex-row gap-2", children: [
                /* @__PURE__ */ jsx(
                  Button,
                  {
                    type: "button",
                    variant: "outline",
                    onClick: () => setIsCreateOpen(false),
                    children: "Cancelar"
                  }
                ),
                /* @__PURE__ */ jsx(
                  Button,
                  {
                    type: "submit",
                    disabled: createForm.processing || createForm.data.mac_address.length !== 12 || createForm.data.pin.length !== 6,
                    children: createForm.processing ? /* @__PURE__ */ jsx(Spinner, { className: "size-4" }) : "Cadastrar"
                  }
                )
              ] })
            ] })
          ] })
        }
      ),
      /* @__PURE__ */ jsx(
        Dialog,
        {
          open: !!editingDevice,
          onOpenChange: (v) => !v && setEditingDevice(null),
          children: /* @__PURE__ */ jsxs(DialogContent, { className: "w-[95vw] max-w-md rounded-xl", children: [
            /* @__PURE__ */ jsxs(DialogHeader, { children: [
              /* @__PURE__ */ jsx(DialogTitle, { children: "Editar Equipamento" }),
              /* @__PURE__ */ jsxs(DialogDescription, { className: "font-mono text-xs opacity-70", children: [
                "MAC: ",
                editingDevice?.mac_address
              ] })
            ] }),
            /* @__PURE__ */ jsxs("form", { onSubmit: submitEdit, className: "space-y-4", children: [
              /* @__PURE__ */ jsxs("div", { className: "grid gap-2", children: [
                /* @__PURE__ */ jsx(Label, { children: "Nome" }),
                /* @__PURE__ */ jsx(
                  Input,
                  {
                    value: editForm.data.name,
                    onChange: (e) => editForm.setData("name", e.target.value)
                  }
                ),
                /* @__PURE__ */ jsx(InputError, { message: editForm.errors.name })
              ] }),
              /* @__PURE__ */ jsxs("div", { className: "grid gap-2", children: [
                /* @__PURE__ */ jsx(Label, { children: "PIN" }),
                /* @__PURE__ */ jsxs("div", { className: "relative", children: [
                  /* @__PURE__ */ jsx(
                    Input,
                    {
                      type: showEditPin ? "text" : "password",
                      inputMode: "numeric",
                      maxLength: 6,
                      value: editForm.data.pin,
                      onChange: (e) => editForm.setData(
                        "pin",
                        e.target.value.replace(/[^0-9]/g, "").slice(0, 6)
                      ),
                      className: "pr-9 font-mono tracking-widest"
                    }
                  ),
                  /* @__PURE__ */ jsx(
                    "button",
                    {
                      type: "button",
                      onClick: () => setShowEditPin(!showEditPin),
                      className: "absolute right-2.5 top-1/2 -translate-y-1/2 text-muted-foreground cursor-pointer",
                      children: showEditPin ? /* @__PURE__ */ jsx(EyeOff, { className: "size-4" }) : /* @__PURE__ */ jsx(Eye, { className: "size-4" })
                    }
                  )
                ] }),
                /* @__PURE__ */ jsx(InputError, { message: editForm.errors.pin })
              ] }),
              /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between rounded-lg border p-4 bg-muted/20", children: [
                /* @__PURE__ */ jsxs("div", { className: "space-y-0.5", children: [
                  /* @__PURE__ */ jsx("span", { className: "text-sm font-medium", children: "Geração Própria" }),
                  /* @__PURE__ */ jsx("p", { className: "text-xs text-muted-foreground", children: "Define se o medidor contabiliza geração" })
                ] }),
                /* @__PURE__ */ jsx(
                  "button",
                  {
                    type: "button",
                    onClick: () => editForm.setData(
                      "is_generate",
                      !editForm.data.is_generate
                    ),
                    className: `relative inline-flex cursor-pointer h-6 w-11 items-center rounded-full transition-colors ${editForm.data.is_generate ? "bg-green-600" : "bg-gray-300 dark:bg-gray-600"}`,
                    children: /* @__PURE__ */ jsx(
                      "span",
                      {
                        className: `inline-block h-4 w-4 transform rounded-full bg-white shadow transition-transform ${editForm.data.is_generate ? "translate-x-6" : "translate-x-1"}`
                      }
                    )
                  }
                )
              ] }),
              /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between rounded-lg border p-4 bg-muted/20", children: [
                /* @__PURE__ */ jsxs("div", { className: "space-y-0.5", children: [
                  /* @__PURE__ */ jsx("span", { className: "text-sm font-medium", children: "Status do Equipamento" }),
                  /* @__PURE__ */ jsx("p", { className: "text-xs text-muted-foreground", children: "Ative ou desative o acesso" })
                ] }),
                /* @__PURE__ */ jsx(
                  "button",
                  {
                    type: "button",
                    onClick: () => editForm.setData(
                      "is_active",
                      !editForm.data.is_active
                    ),
                    className: `relative inline-flex cursor-pointer h-6 w-11 items-center rounded-full transition-colors ${editForm.data.is_active ? "bg-green-600" : "bg-gray-300 dark:bg-gray-600"}`,
                    children: /* @__PURE__ */ jsx(
                      "span",
                      {
                        className: `inline-block h-4 w-4 transform rounded-full bg-white shadow transition-transform ${editForm.data.is_active ? "translate-x-6" : "translate-x-1"}`
                      }
                    )
                  }
                )
              ] }),
              /* @__PURE__ */ jsxs(DialogFooter, { className: "flex-col-reverse sm:flex-row gap-2", children: [
                /* @__PURE__ */ jsx(
                  Button,
                  {
                    type: "button",
                    variant: "outline",
                    onClick: () => setEditingDevice(null),
                    children: "Cancelar"
                  }
                ),
                /* @__PURE__ */ jsx(
                  Button,
                  {
                    type: "submit",
                    disabled: editForm.processing || editForm.data.pin.length !== 6,
                    children: editForm.processing ? /* @__PURE__ */ jsx(Spinner, { className: "size-4" }) : "Salvar"
                  }
                )
              ] })
            ] })
          ] })
        }
      ),
      /* @__PURE__ */ jsx(
        Dialog,
        {
          open: !!deletingDevice,
          onOpenChange: (v) => !v && setDeletingDevice(null),
          children: /* @__PURE__ */ jsxs(DialogContent, { className: "w-[95vw] max-w-sm rounded-xl", children: [
            /* @__PURE__ */ jsxs("div", { className: "flex flex-col items-center gap-4 text-center py-4", children: [
              /* @__PURE__ */ jsx("div", { className: "flex h-12 w-12 items-center justify-center rounded-full bg-red-100 dark:bg-red-950/40 text-red-600", children: /* @__PURE__ */ jsx(AlertTriangle, { className: "size-6" }) }),
              /* @__PURE__ */ jsxs("div", { children: [
                /* @__PURE__ */ jsx(DialogTitle, { className: "text-lg", children: "Excluir equipamento?" }),
                /* @__PURE__ */ jsxs(DialogDescription, { className: "mt-2", children: [
                  /* @__PURE__ */ jsx("strong", { children: deletingDevice?.name }),
                  " será removido permanentemente. Esta ação não pode ser desfeita."
                ] })
              ] })
            ] }),
            /* @__PURE__ */ jsxs(DialogFooter, { className: "flex-col sm:flex-row gap-2", children: [
              /* @__PURE__ */ jsx(
                Button,
                {
                  variant: "outline",
                  className: "flex-1",
                  onClick: () => setDeletingDevice(null),
                  children: "Voltar"
                }
              ),
              /* @__PURE__ */ jsx(
                Button,
                {
                  variant: "destructive",
                  className: "flex-1",
                  onClick: confirmDelete,
                  disabled: deleteForm.processing,
                  children: deleteForm.processing ? /* @__PURE__ */ jsx(Spinner, { className: "size-4" }) : "Confirmar Exclusão"
                }
              )
            ] })
          ] })
        }
      )
    ] })
  ] });
}
export {
  AdminDevices as default
};
