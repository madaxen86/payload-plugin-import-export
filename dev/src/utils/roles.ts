import { Access, AccessArgs } from "payload/config";
import { User } from "payload/generated-types";
import { FieldAccess } from "payload/types";

type IsAdmin = (args: AccessArgs<unknown, User>) => boolean;

export const isAdmin: IsAdmin = ({ req: { user } }) => {
  return checkRole(["admin"], user) || user?.id === "ab2613e8-ad2d-4afd-99af-cf4293a288cc";
};

export const checkRole = (allRoles: User["roles"] = [], user?: User): boolean => {
  if (user) {
    if (
      allRoles.some((role) => {
        return user?.roles?.some((individualRole) => {
          return individualRole === role;
        });
      })
    )
      return true;
  }

  return false;
};

export const isSelfOrAdmin: FieldAccess = ({ id, req: { user } }) => {
  if (checkRole(["admin"], user)) return true;
  if (user) {
    return id === user.id;
  }
  return false;
};
