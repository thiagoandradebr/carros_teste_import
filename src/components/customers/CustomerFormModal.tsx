import { Customer } from "@/types/customer";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { CustomerForm } from "./CustomerForm";

interface CustomerFormModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (data: Customer) => void | Promise<void>;
  customer?: Customer;
  mode?: "create" | "edit";
}

export function CustomerFormModal({
  open,
  onOpenChange,
  onSubmit,
  customer,
  mode = "create"
}: CustomerFormModalProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl">
        <DialogHeader>
          <DialogTitle>
            {mode === "create" ? "Novo Cliente" : "Editar Cliente"}
          </DialogTitle>
        </DialogHeader>
        <CustomerForm
          customer={customer}
          onSuccess={async (data) => {
            try {
              await onSubmit(data);
              onOpenChange(false);
            } catch (error) {
              console.error("Erro ao salvar cliente:", error);
            }
          }}
        />
      </DialogContent>
    </Dialog>
  );
}
