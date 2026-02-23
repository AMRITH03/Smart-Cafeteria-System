/**
 * Returns the current date and time in IST (UTC+5:30) as an ISO string.
 * Format: YYYY-MM-DDTHH:mm:ss.sss+05:30
 */
export const getCurrentISOStringIST = (): string => {
	const date = new Date();
	const istOffset = 5.5 * 60 * 60 * 1000;
	const istDate = new Date(date.getTime() + istOffset);
	return istDate.toISOString().replace("Z", "+05:30");
};
