import { jsxs, jsx, Fragment } from "react/jsx-runtime";
import { B as Button } from "./button-DRMeR9Ma.js";
import { Link, usePage, useForm, Head } from "@inertiajs/react";
import { ShieldCheck, Eye, Info, Settings2, Trash2, LayoutDashboard, Plus, AlertTriangle } from "lucide-react";
import { I as InputError } from "./input-error-Dyl9750B.js";
import { D as Dialog, a as DialogContent, b as DialogHeader, c as DialogTitle, d as DialogDescription, e as DialogFooter } from "./dialog-BWgP0n_o.js";
import { I as Input } from "./input-M0YOvWWM.js";
import { L as Label } from "./label-DRUcbYUF.js";
import { S as Spinner } from "./spinner-qShBjBDb.js";
import { A as AppLayout } from "./app-layout-DZbn1Lk-.js";
import { useState, useEffect } from "react";
import { toast } from "sonner";
import "@radix-ui/react-slot";
import "class-variance-authority";
import "./app-logo-icon-DzE24oHT.js";
import "clsx";
import "tailwind-merge";
import "@radix-ui/react-dialog";
import "@radix-ui/react-label";
import "@radix-ui/react-tooltip";
import "@radix-ui/react-dropdown-menu";
import "@radix-ui/react-avatar";
function DeviceCard({ device, onEdit, onDelete }) {
  const isOwner = device.pivot.role === "owner";
  return /* @__PURE__ */ jsxs("div", { className: "group relative flex flex-col justify-between rounded-xl border border-border p-6 transition-all bg-card hover:border-primary/40 shadow-sm", children: [
    /* @__PURE__ */ jsxs("div", { className: "flex justify-between items-start", children: [
      /* @__PURE__ */ jsxs("div", { children: [
        /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2 mb-1", children: [
          /* @__PURE__ */ jsx("h3", { className: "font-semibold text-lg", children: device.name }),
          isOwner ? /* @__PURE__ */ jsx("span", { title: "Proprietário", className: "text-primary", children: /* @__PURE__ */ jsx(ShieldCheck, { className: "size-4" }) }) : /* @__PURE__ */ jsx("span", { title: "Acesso Convidado", className: "text-muted-foreground", children: /* @__PURE__ */ jsx(Eye, { className: "size-4" }) })
        ] }),
        /* @__PURE__ */ jsxs("p", { className: "text-xs font-mono text-muted-foreground", children: [
          "MAC: ",
          device.mac_address
        ] }),
        /* @__PURE__ */ jsx("div", { className: "mt-3 flex items-center gap-1.5 min-h-[20px]", children: !isOwner ? /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-1.5 text-muted-foreground", children: [
          /* @__PURE__ */ jsx(Info, { className: "size-3" }),
          /* @__PURE__ */ jsx("span", { className: "text-[11px] font-medium uppercase tracking-tight", children: "Somente Visualização" })
        ] }) : /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-1.5 text-primary/80", children: [
          /* @__PURE__ */ jsx(ShieldCheck, { className: "size-3" }),
          /* @__PURE__ */ jsx("span", { className: "text-[11px] font-medium uppercase tracking-tight", children: "Administrador" })
        ] }) })
      ] }),
      /* @__PURE__ */ jsx("div", { className: "flex gap-1 min-h-[36px]", children: isOwner && /* @__PURE__ */ jsxs(Fragment, { children: [
        /* @__PURE__ */ jsx(Button, { variant: "ghost", size: "icon", onClick: () => onEdit(device), children: /* @__PURE__ */ jsx(Settings2, { className: "size-4" }) }),
        /* @__PURE__ */ jsx(
          Button,
          {
            variant: "ghost",
            size: "icon",
            className: "text-destructive hover:text-destructive",
            onClick: () => onDelete(device),
            children: /* @__PURE__ */ jsx(Trash2, { className: "size-4" })
          }
        )
      ] }) })
    ] }),
    /* @__PURE__ */ jsx("div", { className: "mt-6", children: /* @__PURE__ */ jsx(Link, { href: `/devices/${device.id}/dashboard`, children: /* @__PURE__ */ jsxs(Button, { className: "w-full", variant: "secondary", children: [
      /* @__PURE__ */ jsx(LayoutDashboard, { className: "mr-2 size-4" }),
      " Dashboard"
    ] }) }) })
  ] });
}
function DeviceFormModal({
  open,
  onClose,
  editingDevice,
  form,
  onSubmit
}) {
  const { data, setData, processing, errors } = form;
  const isInvalid = editingDevice ? data.pin.length > 0 && data.pin.length !== 6 || data.name.trim() === "" : data.mac_address.length !== 12 || data.pin.length !== 6 || data.name.trim() === "";
  return /* @__PURE__ */ jsx(Dialog, { open, onOpenChange: (v) => !v && onClose(), children: /* @__PURE__ */ jsxs(DialogContent, { className: "sm:max-w-md", children: [
    /* @__PURE__ */ jsxs(DialogHeader, { children: [
      /* @__PURE__ */ jsx(DialogTitle, { children: editingDevice ? "Editar Equipamento" : "Novo Equipamento" }),
      /* @__PURE__ */ jsx(DialogDescription, { children: editingDevice ? "Atualize as informações do seu ativo industrial." : "Informe o MAC e o PIN para vincular um novo hardware." })
    ] }),
    /* @__PURE__ */ jsxs("form", { onSubmit, className: "space-y-4", children: [
      !editingDevice && /* @__PURE__ */ jsxs("div", { className: "grid gap-2", children: [
        /* @__PURE__ */ jsx(Label, { htmlFor: "mac", children: "MAC Address" }),
        /* @__PURE__ */ jsx(
          Input,
          {
            id: "mac",
            maxLength: 12,
            value: data.mac_address,
            onChange: (e) => setData(
              "mac_address",
              e.target.value.replace(/[^A-Fa-f0-9]/g, "").toUpperCase().slice(0, 12)
            ),
            placeholder: "Ex: D4AD20BD9C0F"
          }
        ),
        /* @__PURE__ */ jsx(InputError, { message: errors.mac_address })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "grid gap-2", children: [
        /* @__PURE__ */ jsx(Label, { htmlFor: "pin", children: editingDevice ? "Alterar PIN (Opcional)" : "PIN de Segurança" }),
        /* @__PURE__ */ jsx(
          Input,
          {
            id: "pin",
            maxLength: 6,
            inputMode: "numeric",
            value: data.pin,
            onChange: (e) => setData(
              "pin",
              e.target.value.replace(/[^0-9]/g, "").slice(0, 6)
            ),
            placeholder: editingDevice ? "Deixe em branco para manter" : "6 dígitos"
          }
        ),
        /* @__PURE__ */ jsx(InputError, { message: errors.pin })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "grid gap-2", children: [
        /* @__PURE__ */ jsx(Label, { htmlFor: "name", children: "Nome do Dispositivo" }),
        /* @__PURE__ */ jsx(
          Input,
          {
            id: "name",
            value: data.name,
            onChange: (e) => setData("name", e.target.value),
            onFocus: (e) => e.target.select(),
            autoFocus: !!editingDevice,
            placeholder: "Ex: Medidor 01"
          }
        ),
        /* @__PURE__ */ jsx(InputError, { message: errors.name })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "space-y-3 border-t pt-4", children: [
        /* @__PURE__ */ jsx(Label, { className: "text-xs font-bold text-muted-foreground uppercase", children: "Compartilhar Acesso (E-mail)" }),
        /* @__PURE__ */ jsxs("div", { className: "space-y-2", children: [
          (data.share_emails || []).map((email, idx) => {
            const err = errors[`share_emails.${idx}`] ?? errors.share_emails?.[idx];
            return /* @__PURE__ */ jsxs("div", { className: "flex items-start gap-2", children: [
              /* @__PURE__ */ jsx(
                Input,
                {
                  type: "email",
                  value: email,
                  onChange: (e) => {
                    const arr = [...data.share_emails || []];
                    arr[idx] = e.target.value;
                    setData("share_emails", arr);
                  },
                  placeholder: `Convidado ${idx + 1}`
                }
              ),
              /* @__PURE__ */ jsx(Button, { type: "button", variant: "outline", onClick: () => {
                const arr = [...data.share_emails || []];
                arr.splice(idx, 1);
                setData("share_emails", arr);
              }, children: "Remover" }),
              err && /* @__PURE__ */ jsx(InputError, { message: err })
            ] }, idx);
          }),
          /* @__PURE__ */ jsx(Button, { type: "button", onClick: () => setData("share_emails", [...data.share_emails || [], ""]), children: "+ Adicionar" })
        ] })
      ] }),
      /* @__PURE__ */ jsxs(DialogFooter, { className: "mt-6 flex justify-between", children: [
        /* @__PURE__ */ jsx(
          Button,
          {
            type: "button",
            variant: "ghost",
            onClick: onClose,
            children: "Cancelar"
          }
        ),
        /* @__PURE__ */ jsx(
          Button,
          {
            type: "submit",
            disabled: processing || isInvalid,
            className: "min-w-[120px]",
            children: processing ? /* @__PURE__ */ jsx(Spinner, { className: "mr-2 size-4" }) : editingDevice ? "Salvar" : "Vincular"
          }
        )
      ] })
    ] })
  ] }) });
}
const breadcrumbs = [{ title: "Meus Equipamentos", href: "/devices" }];
function Devices({ devices = [] }) {
  const { flash } = usePage().props;
  const appUrl = usePage().props.appUrl;
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingDevice, setEditingDevice] = useState(null);
  const [deviceToDelete, setDeviceToDelete] = useState(null);
  const form = useForm({
    mac_address: "",
    pin: "",
    name: "",
    share_emails: []
  });
  useEffect(() => {
    if (flash?.success) {
      toast.success(flash.success);
    }
    if (flash?.error) {
      toast.error(flash.error);
    }
  }, [flash]);
  const hasOwnedDevices = devices.some((d) => d.pivot.role === "owner");
  const hasGuestDevices = devices.some((d) => d.pivot.role === "viewer");
  const openCreateModal = () => {
    setEditingDevice(null);
    form.reset();
    form.clearErrors();
    setIsModalOpen(true);
  };
  const openEditModal = (device) => {
    setEditingDevice(device);
    form.clearErrors();
    const guests = device.users?.filter((u) => u.pivot.role !== "owner") || [];
    form.setData({
      mac_address: device.mac_address,
      pin: "",
      // ✅ Enviado vazio para não sobrescrever nem falhar validação
      name: device.name,
      share_emails: guests.map((u) => u.email)
    });
    setIsModalOpen(true);
  };
  const submitForm = (e) => {
    e.preventDefault();
    const options = {
      onSuccess: () => {
        setIsModalOpen(false);
        form.reset();
      },
      onError: () => {
        toast.error("Verifique os dados informados.");
      }
    };
    if (editingDevice) {
      form.put(`${appUrl}/devices/${editingDevice.id}`, options);
    } else {
      form.post(`${appUrl}/devices`, options);
    }
  };
  const confirmDelete = () => {
    if (deviceToDelete) {
      form.delete(`${appUrl}/devices/${deviceToDelete.id}`, {
        onSuccess: () => setDeviceToDelete(null),
        onFinish: () => {
          setDeviceToDelete(null);
          form.reset();
        },
        preserveScroll: true
      });
    }
  };
  return /* @__PURE__ */ jsxs(AppLayout, { breadcrumbs, children: [
    /* @__PURE__ */ jsx(Head, { title: "Meus Equipamentos" }),
    /* @__PURE__ */ jsxs("div", { className: "flex h-full flex-1 flex-col gap-6 p-4", children: [
      /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between", children: [
        /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsx("h2", { className: "text-2xl font-semibold tracking-tight", children: "Ativos Conectados" }),
          /* @__PURE__ */ jsx("p", { className: "text-sm text-muted-foreground", children: hasOwnedDevices && hasGuestDevices ? "Gerencie seus equipamentos e monitore seus acessos compartilhados." : hasOwnedDevices ? "Gerencie seus equipamentos e acessos." : "Monitore suas aplicações." })
        ] }),
        /* @__PURE__ */ jsxs(Button, { onClick: openCreateModal, children: [
          /* @__PURE__ */ jsx(Plus, { className: "mr-2 size-4" }),
          " Adicionar"
        ] })
      ] }),
      devices.length === 0 ? /* @__PURE__ */ jsxs("div", { className: "flex flex-1 flex-col items-center justify-center rounded-xl border border-dashed p-8 text-center bg-card", children: [
        /* @__PURE__ */ jsx("h3", { className: "mt-4 text-lg font-semibold", children: "Nenhum equipamento" }),
        /* @__PURE__ */ jsx(Button, { variant: "link", onClick: openCreateModal, children: "Vincular primeiro dispositivo" })
      ] }) : /* @__PURE__ */ jsx("div", { className: "grid gap-4 md:grid-cols-2 lg:grid-cols-3", children: devices.map((device) => /* @__PURE__ */ jsx(
        DeviceCard,
        {
          device,
          onEdit: openEditModal,
          onDelete: setDeviceToDelete
        },
        device.id
      )) }),
      /* @__PURE__ */ jsx(
        DeviceFormModal,
        {
          open: isModalOpen,
          onClose: () => setIsModalOpen(false),
          editingDevice,
          form,
          onSubmit: submitForm
        }
      ),
      /* @__PURE__ */ jsx(Dialog, { open: !!deviceToDelete, onOpenChange: (open) => !open && setDeviceToDelete(null), children: /* @__PURE__ */ jsxs(DialogContent, { className: "sm:max-w-md", children: [
        /* @__PURE__ */ jsxs(DialogHeader, { className: "flex flex-col items-center text-center gap-4", children: [
          /* @__PURE__ */ jsx("div", { className: "flex h-12 w-12 items-center justify-center rounded-full bg-destructive/10", children: /* @__PURE__ */ jsx(AlertTriangle, { className: "size-6 text-destructive" }) }),
          /* @__PURE__ */ jsx(DialogTitle, { children: "Desvincular Equipamento?" }),
          /* @__PURE__ */ jsxs(DialogDescription, { children: [
            "Você perderá o acesso ao dispositivo ",
            /* @__PURE__ */ jsx("strong", { children: deviceToDelete?.name }),
            ". Esta ação não exclui os dados da placa."
          ] })
        ] }),
        /* @__PURE__ */ jsxs(DialogFooter, { className: "flex w-full gap-3 sm:justify-center mt-2", children: [
          /* @__PURE__ */ jsx(Button, { variant: "outline", className: "flex-1", onClick: () => setDeviceToDelete(null), children: "Cancelar" }),
          /* @__PURE__ */ jsx(Button, { variant: "destructive", className: "flex-1", onClick: confirmDelete, disabled: form.processing, children: form.processing ? /* @__PURE__ */ jsx(Spinner, { className: "size-4" }) : "Confirmar" })
        ] })
      ] }) })
    ] })
  ] });
}
export {
  Devices as default
};
