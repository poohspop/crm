export function agentEmailAllowed(): boolean {
	return process.env.CRM_AGENT_EMAIL_ACCESS === "full";
}
