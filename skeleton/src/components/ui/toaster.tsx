import { useToast } from "@/hooks/use-toast";
import {
  Toast,
  ToastClose,
  ToastDescription,
  ToastTitle,
  ToastViewport,
} from "@/components/ui/toast";

export function Toaster() {
  const { toasts } = useToast();

  return (
    <>
      {toasts.map(
        ({
          id,
          title,
          description,
          action,
          open,
          onOpenChange,
          variant,
          ...props
        }) => (
          <Toast
            key={id}
            open={open}
            onOpenChange={onOpenChange}
            variant={variant}
            {...props}
          >
            <div className="grid gap-1">
              {title && <ToastTitle>{title}</ToastTitle>}
              {description && (
                <ToastDescription>{description}</ToastDescription>
              )}
            </div>
            {action}
            <ToastClose />
          </Toast>
        )
      )}

      {/* ✅ This must live inside a ToastProvider (provided at root) */}
      <ToastViewport className="fixed top-4 right-4 z-[99999]" />
    </>
  );
}
