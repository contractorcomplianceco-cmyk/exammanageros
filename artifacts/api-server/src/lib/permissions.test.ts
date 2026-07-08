import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { permissionsForRole, hasPermission } from "../lib/permissions";

describe("permissions", () => {
  it("admin has seed permission", () => {
    assert.equal(hasPermission("admin", "admin:seed"), true);
  });
  it("operator cannot approve client updates", () => {
    assert.equal(hasPermission("operator", "client-updates:approve"), false);
  });
  it("reviewer can approve client updates", () => {
    assert.equal(hasPermission("reviewer", "client-updates:approve"), true);
  });
  it("returns permissions list", () => {
    assert.ok(permissionsForRole("operator").includes("exams:read"));
  });
});
