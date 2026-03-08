"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabase";
import { toast } from "sonner";
import { LoginForm } from "./LoginForm";

export function LoginFormContainer() {
	const [isLoading, setIsLoading] = useState(false);

	async function handleGoogleSignIn() {
		setIsLoading(true);
		const { error } = await supabase.auth.signInWithOAuth({
			provider: "google",
			options: {
				redirectTo: `${window.location.origin}/auth/callback`,
			},
		});

		if (error) {
			toast.error("Failed to start Google sign-in");
			setIsLoading(false);
		}
		// If successful, the browser will redirect to Google then back to /auth/callback
	}

	return <LoginForm onGoogleSignIn={handleGoogleSignIn} isLoading={isLoading} />;
}
