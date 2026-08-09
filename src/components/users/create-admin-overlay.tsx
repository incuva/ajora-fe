"use client";

import { useState } from "react";
import { useForm, type Resolver } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import OverlaySheet, { OverlayHeader } from "@/components/shared/overlay-sheet";
import {
  FormField,
  TextInput,
  SelectInput,
  PasswordInput,
} from "@/components/shared/form-fields";
import {
  createAdminSchema,
  type CreateAdminFormValues,
} from "@/utils/validators";
import { createAdmin } from "@/lib/api/admin-auth.service";
import type { CreateAdminPayload } from "@/lib/types/admin.types";
import { useAuthStore } from "@/stores/auth-store";
import { useToastStore } from "@/stores/toast-store";

interface CreateAdminOverlayProps {
  isOpen: boolean;
  onClose: () => void;
  /** Called after a successful create so the caller can refresh. */
  onCreated?: () => void;
}

/**
 * Add-an-Admin overlay (super-admin only) → POST /admin/new.
 *
 * The form collects the standard admin fields; the Swagger-required `admin`
 * field is injected at submit time.
 *
 * TODO(confirm): the `admin` field is Swagger-required but its meaning is
 * undocumented (typed as a string). We currently send the acting super-admin's
 * id (`useAuthStore().admin?.id`). If it should be a role flag, a boolean-as-
 * string, or something else, adjust the payload below and the type in
 * src/lib/types/admin.types.ts.
 */
const CreateAdminOverlay = ({
  isOpen,
  onClose,
  onCreated,
}: CreateAdminOverlayProps) => {
  const { toastSuccess, toastError } = useToastStore();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isValid },
  } = useForm<CreateAdminFormValues>({
    // role has a zod .default(), which makes the schema's *input* type differ
    // from its output; cast the resolver to the form's output type so RHF's
    // generics line up.
    resolver: zodResolver(createAdminSchema) as Resolver<CreateAdminFormValues>,
    defaultValues: {
      first_name: "",
      last_name: "",
      email: "",
      phone: "",
      password: "",
      role: "admin",
    },
    mode: "onChange",
  });

  const handleClose = () => {
    reset();
    onClose();
  };

  const onSubmit = async (values: CreateAdminFormValues) => {
    setIsSubmitting(true);
    try {
      // TODO(confirm): `admin` is Swagger-required but undocumented — sending
      // the acting super-admin's id as a best guess.
      const actingAdminId = useAuthStore.getState().admin?.id ?? "";
      const payload: CreateAdminPayload = {
        admin: actingAdminId,
        first_name: values.first_name,
        last_name: values.last_name,
        email: values.email,
        phone: values.phone,
        password: values.password,
        role: values.role,
      };
      await createAdmin(payload);
      toastSuccess(
        "Admin created",
        `${values.first_name} ${values.last_name} can now sign in.`,
      );
      reset();
      onCreated?.();
      onClose();
    } catch (err: unknown) {
      const message =
        (err as { response?: { data?: { message?: string } } })?.response?.data
          ?.message ||
        (err as Error)?.message ||
        "Could not create the admin. Please try again.";
      toastError("Create failed", message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <OverlaySheet isOpen={isOpen} onClose={handleClose}>
      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-5 p-6">
        <OverlayHeader
          title="Add an Admin"
          subtitle="Create a new admin account"
          onClose={handleClose}
        />

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <FormField label="First Name">
            <TextInput
              placeholder="Ada"
              {...register("first_name")}
              className={errors.first_name ? "border-red-500" : ""}
            />
            {errors.first_name && (
              <span className="text-red-500 text-xs font-inter mt-1">
                {errors.first_name.message}
              </span>
            )}
          </FormField>

          <FormField label="Last Name">
            <TextInput
              placeholder="Okoro"
              {...register("last_name")}
              className={errors.last_name ? "border-red-500" : ""}
            />
            {errors.last_name && (
              <span className="text-red-500 text-xs font-inter mt-1">
                {errors.last_name.message}
              </span>
            )}
          </FormField>
        </div>

        <FormField label="Email Address">
          <TextInput
            type="email"
            autoComplete="off"
            placeholder="admin@ajora.ng"
            {...register("email")}
            className={errors.email ? "border-red-500" : ""}
          />
          {errors.email && (
            <span className="text-red-500 text-xs font-inter mt-1">
              {errors.email.message}
            </span>
          )}
        </FormField>

        <FormField label="Phone Number">
          <TextInput
            placeholder="08012345678"
            {...register("phone")}
            className={errors.phone ? "border-red-500" : ""}
          />
          {errors.phone && (
            <span className="text-red-500 text-xs font-inter mt-1">
              {errors.phone.message}
            </span>
          )}
        </FormField>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <FormField label="Password">
            <PasswordInput
              autoComplete="new-password"
              placeholder="At least 8 characters"
              {...register("password")}
              className={errors.password ? "border-red-500" : ""}
            />
            {errors.password && (
              <span className="text-red-500 text-xs font-inter mt-1">
                {errors.password.message}
              </span>
            )}
          </FormField>

          <FormField label="Role">
            <SelectInput {...register("role")}>
              <option value="admin">Admin</option>
            </SelectInput>
          </FormField>
        </div>

        <div className="flex flex-col gap-3 pt-1">
          <button
            type="submit"
            disabled={!isValid || isSubmitting}
            className="w-full h-12 rounded-md bg-green text-primary-foreground text-sm font-semibold font-inter transition-colors hover:bg-green/90 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {isSubmitting ? (
              <>
                <span className="w-4 h-4 rounded-full border-2 border-white/40 border-t-white animate-spin" />
                Creating...
              </>
            ) : (
              "Create Admin"
            )}
          </button>
        </div>
      </form>
    </OverlaySheet>
  );
};

export default CreateAdminOverlay;
