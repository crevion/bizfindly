import type { DocumentTypeConfig } from "@/types/verification";

export const DOC_TYPES: DocumentTypeConfig[] = [
  { key: "tradeLicense", label: "Trade license", required: true },
  { key: "utilityBill", label: "Utility bill", required: false },
  { key: "taxCert", label: "Tax certificate", required: false },
  { key: "registration", label: "Business registration", required: false },
  { key: "businessCard", label: "Branded business card", required: false },
  { key: "storefront", label: "Storefront image", required: true },
  { key: "ownerProof", label: "Proof of ownership", required: false },
];

export const CLAIM_ROLES = ["Owner", "Co-owner", "Manager", "Authorized representative"];
