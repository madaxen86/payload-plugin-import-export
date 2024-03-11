import type { Endpoint } from "payload/config";
import type { PayloadRequest } from "payload/types";

export const importEndpointConfig: Endpoint = {
  method: "patch",
  path: "/import",
  async handler(req: PayloadRequest, res) {
    const slug = req.collection?.config?.slug;
    const data = req.body;
    const { payload, user } = req;
    const locale = req.query?.locale;

    const results = await Promise.allSettled(
      data?.map(async (item: Record<string, any>) => {
        const data = await payload
          .update({
            collection: slug,
            id: item.id,
            data: item,
            overrideAccess: false,
            user,
            ...(locale && { locale }),
          })
          .catch((err: any) => {
            const data = [...err, { data: item.id }];
            throw data;
          });

        return data;
      }),
    );
    res.json(results);
  },
};
