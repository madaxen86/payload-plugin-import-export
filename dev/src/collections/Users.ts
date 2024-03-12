import { CollectionConfig, FieldHookArgs } from "payload/types";
import { isAdmin, isSelfOrAdmin } from "../utils/roles";

const Users: CollectionConfig = {
  slug: "users",
  auth: true,
  admin: {
    useAsTitle: "email",
  },
  fields: [
    {
      name: "roles",
      type: "select",
      hasMany: true,
      defaultValue: ["customer"],
      options: [
        {
          label: "admin",
          value: "admin",
        },
        {
          label: "customer",
          value: "customer",
        },
      ],
      hooks: {
        beforeChange: [ensureFirstUserIsAdmin],
      },
      access: {
        read: isSelfOrAdmin,
        create: isAdmin,
        update: isAdmin,
      },
    },
  ],
};

export default Users;

async function ensureFirstUserIsAdmin({ req, operation, value }: FieldHookArgs) {
  if (operation === "create") {
    const users = await req.payload.find({ collection: "users", limit: 0, depth: 0 });
    if (users.totalDocs === 0) {
      // if `admin` not in array of values, add it
      if (!(value || []).includes("admin")) {
        return [...(value || []), "admin"];
      }
    }
  }

  return value;
}
