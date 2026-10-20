export const ANALYTICS_HOSTS: readonly string[] = [
	"trycrm.ai",
	"www.trycrm.ai",
];

export function analyticsAllowed(
	hostname: string,
	consent = process.env.NEXT_PUBLIC_CRM_TELEMETRY_ENABLED,
	doNotTrack = globalThis.navigator?.doNotTrack,
): boolean {
	return (
		consent === "1" &&
		doNotTrack !== "1" &&
		ANALYTICS_HOSTS.includes(hostname.trim().toLowerCase())
	);
}
