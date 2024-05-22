import KeycloakAdminClient from "@keycloak/keycloak-admin-client";

export const keycloakConfig = {
  baseUrl: process.env.KEY_CLOAK_BASE_URL,
  realmName: process.env.KEY_CLOAK_REALM,
  clientId: `${process.env.KEY_CLOAK_CLIENT_ID}`,
  clientSecret: process.env.KEY_CLOAK_CLIENT_SECRET,
};

export const keycloakAdmin = new KeycloakAdminClient({
  baseUrl: keycloakConfig.baseUrl,
  realmName: keycloakConfig.realmName,
});
