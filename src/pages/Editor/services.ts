import { rootServiceApi } from "@/store/service";

export const { useSaveTemplateMutation } = rootServiceApi.injectEndpoints({
  endpoints: (build) => ({
    saveTemplate: build.mutation({
      query: (template) => ({
        url: "/save-template",
        method: "POST",
        data: template,
      }),
      invalidatesTags: ["get-templates"],
    }),
  }),
  overrideExisting: true,
});
