import { CollectionConfig } from "payload/types";
import { isAdmin } from "../utils/roles";

// Example Collection - For reference only, this must be added to payload.config.ts to be used.
const Examples: CollectionConfig = {
  slug: "examples",
  admin: {
    useAsTitle: "title",
  },

  fields: [
    {
      name: "title",
      type: "text",
      required: true,
    },
    {
      name: "content",
      type: "text",
      localized: true,
    },
    {
      name: "access",
      type: "text",
      localized: true,
      access: {
        read: isAdmin,
        create: isAdmin,
        update: isAdmin,
      },
    },
    {
      name: "array",
      type: "array",
      fields: [
        {
          name: "title",
          type: "text",
        },
        {
          name: "name",
          type: "text",
        },
      ],
    },
    {
      type: "row",
      fields: [
        {
          name: "titlerow",
          type: "text",
        },
        {
          name: "namerow",
          type: "text",
        },
      ],
    },
    {
      type: "tabs",
      tabs: [
        {
          name: "tab1",
          label: "Tab 1",
          fields: [
            {
              name: "titletab1",
              type: "text",
            },
            {
              name: "nametab1",
              type: "text",
            },
          ],
        },
        {
          name: "tab2",
          label: "Tab 2",
          fields: [
            {
              name: "titletab2",
              type: "text",
            },
            {
              name: "nametab2",
              type: "text",
            },
          ],
        },
      ],
    },
  ],
};

export default Examples;
