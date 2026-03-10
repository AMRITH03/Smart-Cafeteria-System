"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { completeProfileSchema, type CompleteProfileFormValues } from "@/validations/auth.schemas";
import { useCompleteProfile } from "@/hooks/auth/useCompleteProfile";
import { RegisterForm } from "./RegisterForm";

export function RegisterFormContainer() {
	const { mutate, isPending } = useCompleteProfile();

	const {
		register,
		handleSubmit,
		formState: { errors },
	} = useForm<CompleteProfileFormValues>({
		resolver: zodResolver(completeProfileSchema),
	});

	return (
		<RegisterForm
			register={register}
			isLoading={isPending}
			errors={errors}
			onSubmit={handleSubmit((data) => mutate(data))}
		/>
	);
}
