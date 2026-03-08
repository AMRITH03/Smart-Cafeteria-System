import { getAuthenticatedClient, public_client, service_client } from "../config/supabase";
import type { OAuthCallbackResponse } from "../interfaces/auth.types";
import { type ServiceResponse, STATUS } from "../interfaces/status.types";
import type {
	CompleteProfileData,
	UpdateProfileRequest,
	UserProfile,
} from "../interfaces/user.types";
import { getCurrentISOStringIST } from "../utils/dateUtils";

/**
 * Handle the OAuth callback — validate the session and check if public.users profile exists.
 */
export const handleOAuthCallback = async (
	accessToken: string,
	refreshToken: string
): Promise<ServiceResponse<OAuthCallbackResponse>> => {
	// Validate the tokens by setting a session
	const { data: sessionData, error: sessionError } = await public_client.auth.setSession({
		access_token: accessToken,
		refresh_token: refreshToken,
	});

	if (sessionError || !sessionData.user) {
		return {
			success: false,
			error: sessionError?.message || "Invalid OAuth session",
			statusCode: STATUS.UNAUTHORIZED,
		};
	}

	const user = sessionData.user;

	// Check whether a public.users record exists
	const { data: profile } = await service_client
		.from("users")
		.select("role, email")
		.eq("id", user.id)
		.single();

	if (profile) {
		return {
			success: true,
			statusCode: STATUS.SUCCESS,
			data: {
				profileComplete: true,
				role: profile.role,
				email: profile.email,
			},
		};
	}

	return {
		success: true,
		statusCode: STATUS.SUCCESS,
		data: {
			profileComplete: false,
			email: user.email,
		},
	};
};

/**
 * Create the public.users profile for an OAuth-authenticated user.
 */
export const completeUserProfile = async (
	userId: string,
	email: string,
	profileData: CompleteProfileData
): Promise<ServiceResponse<void>> => {
	const { first_name, last_name, college_id, mobile, department } = profileData;

	const { error: profileError } = await service_client.from("users").insert([
		{
			id: userId,
			email,
			first_name,
			last_name,
			college_id,
			mobile: mobile || null,
			department: department || null,
			role: "user",
			account_status: "active",
			wallet_balance: 0.0,
		},
	]);

	if (profileError) {
		return {
			success: false,
			error: profileError.message,
			statusCode: STATUS.BADREQUEST,
		};
	}

	// Update auth user metadata so middleware can read it
	await service_client.auth.admin.updateUserById(userId, {
		user_metadata: { first_name, last_name, college_id, role: "user" },
	});

	return { success: true, statusCode: STATUS.CREATED };
};

export const logOut = async (accessToken: string): Promise<ServiceResponse<void>> => {
	try {
		const supabase = getAuthenticatedClient(accessToken);
		const { error } = await supabase.auth.signOut();
		if (error)
			return {
				success: false,
				error: error.message,
				statusCode: STATUS.SERVERERROR,
			};
		return { success: true, statusCode: STATUS.ACCEPTED };
	} catch (error: unknown) {
		if (error instanceof Error) {
			return {
				success: false,
				error: error.message,
				statusCode: STATUS.SERVERERROR,
			};
		} else {
			return {
				success: false,
				error: "Unknown Error",
				statusCode: STATUS.SERVERERROR,
			};
		}
	}
};

export const getUserProfile = async (userId: string): Promise<ServiceResponse<UserProfile>> => {
	const { data, error } = await service_client
		.from("users")
		.select(
			"id, email, first_name, last_name, college_id, mobile, department, role, account_status, wallet_balance, created_at"
		)
		.eq("id", userId)
		.single();

	if (error) {
		return {
			success: false,
			error: error.message,
			statusCode: STATUS.NOTFOUND,
		};
	}

	return {
		success: true,
		statusCode: STATUS.SUCCESS,
		data: data as UserProfile,
	};
};

export const updateUserProfile = async (
	userId: string,
	updateData: UpdateProfileRequest
): Promise<ServiceResponse<UserProfile>> => {
	const { data, error } = await service_client
		.from("users")
		.update({
			...updateData,
			updated_at: getCurrentISOStringIST(),
		})
		.eq("id", userId)
		.select(
			"id, email, first_name, last_name, college_id, mobile, department, role, account_status, wallet_balance, created_at"
		)
		.single();

	if (error) {
		return {
			success: false,
			error: error.message,
			statusCode: STATUS.BADREQUEST,
		};
	}

	// Also update auth metadata if first_name or last_name changed
	if (updateData.first_name || updateData.last_name) {
		const metadataUpdate: Record<string, string> = {};
		if (updateData.first_name) metadataUpdate.first_name = updateData.first_name;
		if (updateData.last_name) metadataUpdate.last_name = updateData.last_name;

		await service_client.auth.admin.updateUserById(userId, {
			user_metadata: metadataUpdate,
		});
	}

	return {
		success: true,
		statusCode: STATUS.SUCCESS,
		data: data as UserProfile,
	};
};

/**
 * Get basic user details by userId (for group member display)
 */
export const getUserById = async (
	userId: string
): Promise<
	ServiceResponse<{
		id: string;
		email: string;
		first_name: string;
		last_name: string;
		college_id: string;
	}>
> => {
	const { data, error } = await service_client
		.from("users")
		.select("id, email, first_name, last_name, college_id")
		.eq("id", userId)
		.single();

	if (error) {
		return {
			success: false,
			error: error.message,
			statusCode: STATUS.NOTFOUND,
		};
	}

	return {
		success: true,
		statusCode: STATUS.SUCCESS,
		data: data as {
			id: string;
			email: string;
			first_name: string;
			last_name: string;
			college_id: string;
		},
	};
};
