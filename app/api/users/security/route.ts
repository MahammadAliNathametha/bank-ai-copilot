import { findPrimaryUserId, getUserById, updateUser } from "@/lib/data/banking-data";
import { parseJson, withTenantRoute } from "@/lib/services/api";
import { securitySettingsSchema } from "@/lib/validations/banking";

export async function GET(request: Request) {
  return withTenantRoute(request, async ({ tenantId }) => {
    const userId = await findPrimaryUserId(tenantId);
    const user = await getUserById(tenantId, userId);
    return {
      data: {
        twoFactorEnabled: user.twoFactorEnabled,
        biometricEnabled: user.biometricEnabled
      }
    };
  });
}

export async function PATCH(request: Request) {
  return withTenantRoute(request, async ({ tenantId }) => {
    const body = await parseJson(request, securitySettingsSchema);
    const userId = await findPrimaryUserId(tenantId);
    const updatedUser = await updateUser(tenantId, userId, {
      twoFactorEnabled: body.twoFactorEnabled,
      biometricEnabled: body.biometricEnabled
    });

    return { data: updatedUser };
  });
}
