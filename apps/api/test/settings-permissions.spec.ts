import "reflect-metadata";
import { describe, expect, it, mock } from "bun:test";
import { ForbiddenException } from "@nestjs/common";
import { Test } from "@nestjs/testing";
import { ResearchKeyService } from "../src/agent/research-key.service";
import { BackfillService } from "../src/backfill/backfill.service";
import { DATABASE } from "../src/database/database.constants";
import { ModelCatalogService } from "../src/settings/model-catalog.service";
import { SettingsService } from "../src/settings/settings.service";

async function fixture(role: string | null) {
	const write = mock(async () => ({}));
	const verify = mock(async () => ({ outcome: "valid" }));
	const catalog = mock(async () => []);
	const module = await Test.createTestingModule({
		providers: [
			{
				provide: SettingsService,
				useFactory: (
					database: ConstructorParameters<typeof SettingsService>[0],
					modelCatalog: ModelCatalogService,
					researchKeys: ResearchKeyService,
					backfill: BackfillService,
				) =>
					new SettingsService(database, modelCatalog, researchKeys, backfill),
				inject: [
					DATABASE,
					ModelCatalogService,
					ResearchKeyService,
					BackfillService,
				],
			},
			{
				provide: DATABASE,
				useValue: {
					member: { findUnique: async () => (role === null ? null : { role }) },
					appSetting: {
						upsert: write,
						findUnique: async () => null,
						findFirst: async () => null,
					},
				},
			},
			{
				provide: ModelCatalogService,
				useValue: { models: catalog, find: async () => null },
			},
			{ provide: ResearchKeyService, useValue: { verify } },
			{
				provide: BackfillService,
				useValue: { run: async () => ({ queued: 0, remaining: 0 }) },
			},
		],
	}).compile();
	return {
		settings: module.get(SettingsService),
		module,
		write,
		verify,
		catalog,
	};
}

describe("settings authorization", () => {
	for (const role of ["member", "unexpected", null]) {
		it(`rejects ${role} before writes and vendor calls`, async () => {
			const f = await fixture(role);
			try {
				await expect(
					f.settings.setAgentModel("actor", null),
				).rejects.toBeInstanceOf(ForbiddenException);
				await expect(
					f.settings.setResearchKey("actor", "test-key"),
				).rejects.toBeInstanceOf(ForbiddenException);
				await expect(
					f.settings.setArchiveRetention("actor", 30),
				).rejects.toBeInstanceOf(ForbiddenException);
				expect(f.write).not.toHaveBeenCalled();
				expect(f.verify).not.toHaveBeenCalled();
				expect(f.catalog).not.toHaveBeenCalled();
			} finally {
				await f.module.close();
			}
		});
	}
	for (const role of ["owner", "admin"]) {
		it(`allows ${role} to change model, retention, and research keys`, async () => {
			const f = await fixture(role);
			try {
				await f.settings.setAgentModel("actor", null);
				await f.settings.setArchiveRetention("actor", 30);
				await f.settings.setResearchKey("actor", "test-key");
				expect(f.write).toHaveBeenCalledTimes(3);
				expect(f.verify).toHaveBeenCalledTimes(1);
			} finally {
				await f.module.close();
			}
		});
	}
});
