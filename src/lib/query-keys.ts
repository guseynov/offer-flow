export const dealKeys = {
  all: ["deals"] as const,
  detail: (dealId: string) => ["deal", dealId] as const,
};
