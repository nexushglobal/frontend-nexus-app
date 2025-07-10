import { useState, useTransition } from "react";
import { toast } from "sonner";
import { updateContactInfoAction } from "../actions/update-contact-info";
import { updateBillingInfoAction } from "../actions/update-billing-info";
import { updateBankInfoAction } from "../actions/update-bank-info";
import { uploadPhotoAction } from "../actions/upload-photo";

export const useProfileActions = (onSuccess?: () => void) => {
  const [isPending, startTransition] = useTransition();
  const [actionLoading, setActionLoading] = useState(false);

  const updateContactInfo = async (formData: FormData) => {
    setActionLoading(true);
    startTransition(async () => {
      try {
        const result = await updateContactInfoAction(formData);

        if (result.success) {
          toast.success("Éxito", { description: result.message });
          onSuccess?.();
        } else {
          toast.error("Error", { description: result.message });
        }
      } catch (error) {
        toast.error("Error", { description: "Error inesperado" });
      } finally {
        setActionLoading(false);
      }
    });
  };

  const updateBillingInfo = async (formData: FormData) => {
    setActionLoading(true);
    startTransition(async () => {
      try {
        const result = await updateBillingInfoAction(formData);

        if (result.success) {
          toast.success("Éxito", { description: result.message });
          onSuccess?.();
        } else {
          toast.error("Error", { description: result.message });
        }
      } catch (error) {
        toast.error("Error", { description: "Error inesperado" });
      } finally {
        setActionLoading(false);
      }
    });
  };

  const updateBankInfo = async (formData: FormData) => {
    setActionLoading(true);
    startTransition(async () => {
      try {
        const result = await updateBankInfoAction(formData);

        if (result.success) {
          toast.success("Éxito", { description: result.message });
          onSuccess?.();
        } else {
          toast.error("Error", { description: result.message });
        }
      } catch (error) {
        toast.error("Error", { description: "Error inesperado" });
      } finally {
        setActionLoading(false);
      }
    });
  };

  const uploadPhoto = async (formData: FormData) => {
    setActionLoading(true);
    startTransition(async () => {
      try {
        const result = await uploadPhotoAction(formData);

        if (result.success) {
          toast.success("Éxito", { description: result.message });
          onSuccess?.();
        } else {
          toast.error("Error", { description: result.message });
        }
      } catch (error) {
        toast.error("Error", { description: "Error inesperado" });
      } finally {
        setActionLoading(false);
      }
    });
  };

  return {
    updateContactInfo,
    updateBillingInfo,
    updateBankInfo,
    uploadPhoto,
    isLoading: isPending || actionLoading,
  };
};
