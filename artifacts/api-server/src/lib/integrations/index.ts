export function integrationEnabled(flag: string): boolean {
  return process.env[flag] === "1" || process.env[flag] === "true";
}

export function getIntegrationStatus() {
  return {
    zoho: integrationEnabled("ZOHO_SYNC_ENABLED") ? "Connected" : "Disabled",
    complianceConnect: integrationEnabled("COMPLIANCE_CONNECT_ENABLED") ? "Connected" : "Disabled",
    docCollect: integrationEnabled("DOC_COLLECT_ENABLED") ? "Connected" : "Disabled",
    workdrive: integrationEnabled("WORKDRIVE_ENABLED") ? "Connected" : "Disabled",
  };
}
