# Security Specification — Chiron Investigations Firestore Rules

## 1. Data Invariants
1. **PII Isolation**: Client contact details (`contactName`, `contactEmail`, `contactPhone`, `narrativeSummary`) live strictly in `/case_intakes/{intakeId}` and can NEVER be read or listed by unauthenticated users or non-owners.
2. **Non-Enumerable Portal Lookup**: `/case_lookups/{lookupToken}` contains zero PII, uses a 64-character SHA-256 hex token (`caseRef:accessCode`) as its document ID, and explicitly disables collection listing (`allow list: if false;`).
3. **Master Gate on Subcollections**: `/case_lookups/{lookupToken}/updates/{updateId}` validates parent existence via `exists(/databases/$(database)/documents/case_lookups/$(lookupToken))` and checks `caseRef` matches the parent document.
4. **Atomic Creation & Initial State Integrity**: On creation, both `CaseIntake` and `CaseLookup` must start with `status == 'intake_received'`, timestamps must match `request.time`, and `consentAcknowledged == true` is enforced on `CaseIntake`.
5. **Terminal State Locking**: Once a `CaseLookup` reaches `status == 'dossier_ready'`, non-admin updates are blocked.
6. **Immutability**: `createdAt`, `caseRef`, `lookupToken`, and `ownerUid` cannot be altered after creation.
7. **Staff Admin Registry & Bootstrap Lock**: `/admins/{adminUid}` stores staff accounts created only by existing admins or via a single atomic one-time bootstrap tied to `/system_meta/admin_bootstrap` (`existsAfter` + `!exists`). Once `admin_bootstrap` exists, self-promotion to admin is permanently blocked.

## 2. The "Dirty Dozen" Adversarial Payloads (Expected: PERMISSION_DENIED)
1. **Shadow Field Injection on Intake**: `CaseIntake` create payload with extra `isVerified: true` or `role: "admin"` field.
2. **Client-Spoofed Initial Status**: `CaseIntake` or `CaseLookup` create payload attempting `status: "dossier_ready"` to skip triage.
3. **Timestamp Tampering**: `CaseIntake` create with backdated `createdAt` not equal to `request.time`.
4. **PII Blanket Read / Scrape**: Unauthenticated `list` or `get` on `/case_intakes`.
5. **Lookup Collection Enumeration**: Unauthenticated `list` on `/case_lookups` to harvest active Case Reference IDs.
6. **ID Poisoning**: Document ID > 128 chars or containing invalid path characters (`$`, `.`, spaces) on `case_intakes` or `updates`.
7. **Token Format Bypass**: Creating a `case_lookups` document with a short/guessable ID (`"CHR-2026-1234"`) instead of a 64-char hex SHA-256 token.
8. **Unbounded Array / Denial of Wallet**: `walletAddresses` or `transactionHashes` array with > 15 items or non-string first element `[12345]`.
9. **Identity Spoofing on Authenticated Intake**: Signed-in user submitting `ownerUid: "another-user-uid"` instead of their own `request.auth.uid`.
10. **Analyst Impersonation on Update**: Client creating a `CaseUpdate` with `submittedByRole: "analyst"` without admin privileges.
11. **Orphaned Subcollection Write**: Writing to `/case_lookups/{nonexistentToken}/updates/{id}` when parent `case_lookups` document does not exist.
12. **Terminal State Override & Self-Admin Escalation**: Non-admin attempting to update `status` after `dossier_ready`, or attempting to create `/admins/{uid}` after `/system_meta/admin_bootstrap` already exists.
