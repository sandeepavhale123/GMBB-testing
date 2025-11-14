import * as React from "react";
import { getToastIcon } from "@/components/ui/toast";
import { Toast, ToasterToast } from "./types";
import { dispatch } from "./reducer";

let count = 0;

function genId() {
  count = (count + 1) % Number.MAX_SAFE_INTEGER;
  return count.toString();
}

function toast({ ...props }: Toast) {
  const id = genId();

  const update = (props: ToasterToast) =>
    dispatch({
      type: "UPDATE_TOAST",
      toast: { ...props, id },
    });
  const dismiss = () => dispatch({ type: "DISMISS_TOAST", toastId: id });

  // Add icon to title if variant is specified
  const enhancedProps = {
    ...props,
    title:
      props.variant && props.title ? (
        <div className="flex items-center gap-2">
          {getToastIcon(props.variant)}
          {props.title}
        </div>
      ) : (
        props.title
      ),
  };

  try {
    dispatch({
      type: "ADD_TOAST",
      toast: {
        ...enhancedProps,
        id,
        open: true,
        onOpenChange: (open) => {
          if (!open) dismiss();
        },
      },
    });
  } catch (error) {
    console.error("Toast error:", error);
    // Fallback to console log if toast system fails
  }

  return {
    id: id,
    dismiss,
    update,
  };
}

// Helper functions for different toast types
toast.success = (props: Omit<Toast, "variant">) =>
  toast({ ...props, variant: "success" });
toast.warning = (props: Omit<Toast, "variant">) =>
  toast({ ...props, variant: "warning" });
toast.error = (props: Omit<Toast, "variant">) =>
  toast({ ...props, variant: "error" });
toast.info = (props: Omit<Toast, "variant">) =>
  toast({ ...props, variant: "info" });

export { toast };
