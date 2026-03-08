"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { AuthHeader } from "./AuthHeader";
import type { UseFormRegister, FieldErrors } from "react-hook-form";
import type { CompleteProfileFormValues } from "@/validations/auth.schemas";

interface RegisterFormProps {
	onSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
	isLoading: boolean;
	register: UseFormRegister<CompleteProfileFormValues>;
	errors: FieldErrors<CompleteProfileFormValues>;
}

export function RegisterForm({ onSubmit, isLoading, register, errors }: RegisterFormProps) {
	return (
		<>
			<AuthHeader
				title="Complete your profile"
				subtitle="We need a few more details to get you started"
				illustrationSrc="/assets/auth/register-illustration.jpg"
			/>

			<form onSubmit={onSubmit} className="space-y-4 sm:space-y-5">
				{/* First + Last name */}
				<div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
					<div className="space-y-1">
						<Label>First Name</Label>
						<Input {...register("first_name")} />
						{errors.first_name && (
							<p className="mt-1 text-sm text-destructive">{errors.first_name.message}</p>
						)}
					</div>

					<div className="space-y-1">
						<Label>Last Name</Label>
						<Input {...register("last_name")} />
						{errors.last_name && (
							<p className="mt-1 text-sm text-destructive">{errors.last_name.message}</p>
						)}
					</div>
				</div>

				{/* College + Mobile */}
				<div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
					<div className="space-y-1">
						<Label>College ID</Label>
						<Input {...register("college_id")} />
						{errors.college_id && (
							<p className="mt-1 text-sm text-destructive">{errors.college_id.message}</p>
						)}
					</div>

					<div className="space-y-1">
						<Label>Mobile</Label>
						<Input {...register("mobile")} />
						{errors.mobile && (
							<p className="mt-1 text-sm text-destructive">{errors.mobile.message}</p>
						)}
					</div>
				</div>

				{/* Department */}
				<div className="space-y-1">
					<Label>Department</Label>
					<Input {...register("department")} />
					{errors.department && (
						<p className="mt-1 text-sm text-destructive">{errors.department.message}</p>
					)}
				</div>

				<Button
					type="submit"
					variant="default"
					className="w-full h-11 sm:h-12 text-base bg-primary text-primary-foreground hover:bg-primary/90 transition"
					disabled={isLoading}
				>
					{isLoading ? "Saving..." : "Complete Registration"}
				</Button>
			</form>

			<p className="mt-6 text-center text-sm sm:text-base text-muted-foreground">
				Already have an account?{" "}
				<Link href="/login" className="text-primary font-medium">
					Login
				</Link>
			</p>
		</>
	);
}
