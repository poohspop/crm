import { describe, expect, it } from "bun:test";
import { analyticsAllowed } from "../lib/analytics";

describe("analyticsAllowed", () => {
	it("requires consent and respects browser Do Not Track", () => {
		expect(analyticsAllowed("trycrm.ai", "0", "0")).toBe(false);
		expect(analyticsAllowed("trycrm.ai", "1", "1")).toBe(false);
		expect(analyticsAllowed("trycrm.ai", "", "0")).toBe(false);
	});
	it("allows the two hosts the landing page is served from", () => {
		expect(analyticsAllowed("trycrm.ai", "1", "0")).toBe(true);
		expect(analyticsAllowed("www.trycrm.ai", "1", "0")).toBe(true);
	});

	it("ignores case and surrounding whitespace", () => {
		expect(analyticsAllowed(" TryCRM.ai ", "1", "0")).toBe(true);
	});

	it("refuses a self-hosted install serving the same page", () => {
		expect(analyticsAllowed("crm.acme.com")).toBe(false);
		expect(analyticsAllowed("localhost")).toBe(false);
	});

	it("refuses a preview deployment", () => {
		expect(analyticsAllowed("crm-git-lewis-telemetry.vercel.app")).toBe(false);
	});

	it("refuses a host that merely ends in the marketing domain", () => {
		expect(analyticsAllowed("evil-trycrm.ai")).toBe(false);
		expect(analyticsAllowed("trycrm.ai.attacker.com")).toBe(false);
	});
});
