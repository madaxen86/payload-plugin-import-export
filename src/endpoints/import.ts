import { Endpoint } from "payload/config";
import { PayloadRequest } from "payload/types";

export const importEndpointConfig: Endpoint = {
  method: "patch",
  path: "/import",
  handler: async function (req: PayloadRequest, res) {
    const slug = req.collection?.config?.slug;
    const data = req.body;
    const { payload, user } = req;
    const locale = req.query?.locale;

    const results = await Promise.allSettled(
      data.map(async (item: any) => {
        // try {
        const res = await payload
          .update({
            collection: slug as any,
            id: item.id,
            data: item,
            overrideAccess: false,
            user,
            ...(locale && { locale }),
          })
          .catch((err: any) => {
            err.data = item.id;
            throw err;
          });

        return res;

        // 	}
      }),
    );

    res.json(results);
  },
};
