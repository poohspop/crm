import { afterEach, describe, expect, it } from "bun:test";
import { agentEmailAllowed } from "../agent/lib/email-privacy";

const original = process.env.CRM_AGENT_EMAIL_ACCESS;
afterEach(() => {
	if (original === undefined) delete process.env.CRM_AGENT_EMAIL_ACCESS;
	else process.env.CRM_AGENT_EMAIL_ACCESS = original;
});

describe("agent email privacy", () => {
	it("fails closed without explicit full access", () => {
		delete process.env.CRM_AGENT_EMAIL_ACCESS;
		expect(agentEmailAllowed()).toBe(false);
		for (const value of [
			"",
			"disabled",
			"true",
			"1",
			"FULL",
			"full ",
			"invalid",
		]) {
			process.env.CRM_AGENT_EMAIL_ACCESS = value;
			expect(agentEmailAllowed()).toBe(false);
		}
	});
	it("requires exact operator consent", () => {
		process.env.CRM_AGENT_EMAIL_ACCESS = "full";
		expect(agentEmailAllowed()).toBe(true);
	});
});
