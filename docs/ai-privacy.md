# AI email privacy

AI email access is disabled by default. The agent reads no email threads, subjects, bodies, snippets, senders, or reply statistics.
The control applies to contact, company, and deal readers, including custom agent runs and background research.
The readers enforce the control before database queries. Tool input and manifest permissions cannot override it.
Results report `emailAccess: disabled`. Missing email evidence does not prove that correspondence does not exist.

An operator explicitly enables access with `CRM_AGENT_EMAIL_ACCESS="full"` in the root `.env` or deployment environment.
Only this exact value enables access. Missing values and invalid values disable access.
Restart the agent after changes. Stop active runs before disabling access.
Custom agent source permissions still apply after enablement. A source exclusion continues to block email reads.

## Remaining limits

This control blocks new email reads through these agent readers. It does not stop mailbox synchronization or human CRM access.
Mailbox OAuth grants still allow provider mailbox reads. Disconnect providers and revoke provider consent to remove that access.
This change does not connect a mailbox or request consent.

Enabling full access exposes stored, CRM-linked correspondence across the shared workspace. This is not per-mailbox authorization.
Do not enable access for mailboxes that require individual isolation.
Contacts, company data, CRM notes, calendar data, and existing derived facts remain available to the agent.
Users can also paste sensitive information into chats or notes. The email control does not remove that information.

Existing conversations, durable tool results, audit events, model requests, logs, backups, and derived facts can already contain email data.
Disabling access does not erase that data or retract an in-flight request.
Stop existing sessions and start new conversations after changing the policy.
Review and remove retained transcripts, logs, backups, and derived facts through your retention process.
Ask model and research providers about their retention and deletion controls.

The trusted agent process still holds database credentials. This control does not defend against compromised application code or credentials.
For stronger isolation, give a separate agent database role access only to approved views and remove access to mailbox tables.
Review every new tool before enabling it. New database readers need the same policy enforcement.

## Local database transition

Docker binds PostgreSQL to `127.0.0.1`. Docker requires an explicit `POSTGRES_PASSWORD`.
Generate a password with `openssl rand -hex 32` and place it in the root `.env`.
Set matching `DATABASE_URL` and `TEST_DATABASE_URL` values. The test database name must end in `_test`.
Example URL shape: `postgresql://postgres:<password>@127.0.0.1:5432/crm?schema=public`.

Changing Docker environment variables does not rotate credentials in an existing PostgreSQL volume.
For existing volumes, rotate the database role password through PostgreSQL administration and update both URLs.
Do not delete an existing volume to rotate credentials.

## Telemetry

Server telemetry requires `CRM_TELEMETRY_ENABLED="1"`.
`CRM_TELEMETRY_DISABLED=1`, `DO_NOT_TRACK=1`, and test mode override consent.
Official marketing-host analytics separately require build-time `NEXT_PUBLIC_CRM_TELEMETRY_ENABLED="1"` and respect browser Do Not Track.
Both consent settings default to off. Marketing analytics never run on self-hosted domains.
Rebuild the app after changing marketing consent. The public consent value participates in the build cache key.
