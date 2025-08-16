import { rootServiceApi } from "@/store/service";
import type { Template } from "@/types/types";

export const { useSaveTemplateMutation, useGetSingleTemplateQuery } =
  rootServiceApi.injectEndpoints({
    endpoints: (build) => ({
      saveTemplate: build.mutation<Template, Partial<Template>>({
        query: (template) => ({
          url: "/save-template",
          method: "POST",
          data: template,
        }),
        invalidatesTags: ["get-templates"],
      }),
      // updateTemplate: build.mutation<Template, Template>({
      //   query: (template) => ({
      //     url: `/update-template/${template.id}`,
      //     method: "PUT",
      //     data: template,
      //   }),
      //   invalidatesTags: ["get-templates"],
      // }),
      getSingleTemplate: build.query<Template, string>({
        query: (templateId) => ({
          url: `/get-template/${templateId}`,
          method: "GET",
        }),
        providesTags: ["get-templates"],
      }),
    }),
    overrideExisting: true,
  });
