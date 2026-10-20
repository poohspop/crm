import { describe, expect, it } from "bun:test";
import { DISABLE_VARIABLES, telemetryDisabled } from "../src/disabled";

describe("telemetryDisabled", () => {
	it("requires explicit consent and respects disable overrides", () => {
		expect(telemetryDisabled({ CRM_TELEMETRY_ENABLED: "1" })).toBe(false);
		for (const CRM_TELEMETRY_ENABLED of ["", "0", "false", "invalid"]) {
			expect(telemetryDisabled({ CRM_TELEMETRY_ENABLED })).toBe(true);
		}
		for (const name of DISABLE_VARIABLES) {
			expect(
				telemetryDisabled({ CRM_TELEMETRY_ENABLED: "1", [name]: "1" }),
			).toBe(true);
		}
	});
	it("is off by default", () => {
		expect(telemetryDisabled({})).toBe(true);
	});

	it("sends nothing from a test run, whatever else is set", () => {
		expect(telemetryDisabled({ NODE_ENV: "test" })).toBe(true);
	});

	it("honours CRM_TELEMETRY_DISABLED", () => {
		expect(telemetryDisabled({ CRM_TELEMETRY_DISABLED: "1" })).toBe(true);
	});

	it("honours DO_NOT_TRACK", () => {
		expect(telemetryDisabled({ DO_NOT_TRACK: "1" })).toBe(true);
	});

	it("takes any of the obvious ways to say yes", () => {
		for (const value of ["1", "true", "TRUE", " yes ", "on"]) {
			expect(telemetryDisabled({ DO_NOT_TRACK: value })).toBe(true);
		}
	});

	it("does not read an empty or negative value as a yes", () => {
		for (const value of ["", " ", "0", "false", "no"]) {
			expect(
				telemetryDisabled({
					CRM_TELEMETRY_ENABLED: "1",
					CRM_TELEMETRY_DISABLED: value,
				}),
			).toBe(false);
		}
	});

	it("names both variables so the docs and the code cannot drift", () => {
		expect(DISABLE_VARIABLES).toEqual([
			"CRM_TELEMETRY_DISABLED",
			"DO_NOT_TRACK",
		]);
	});
});
