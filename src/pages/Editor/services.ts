import { rootServiceApi } from "@/store/service";
import type { Template } from "@/types/types";

export const {
  useSaveTemplateMutation,
  useGetSingleTemplateQuery,
  useGetPublicTemplateQuery,
  useDuplicateTemplateMutation,
} = rootServiceApi.injectEndpoints({
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
      providesTags: ["get-single-template"],
    }),
    getPublicTemplate: build.query<
      Template,
      { templateId: string; token: string }
    >({
      query: ({ templateId, token }) => ({
        url: `/public-template/${templateId}`,
        method: "GET",
        params: { token },
      }),
      providesTags: ["get-single-template"],
    }),
    duplicateTemplate: build.mutation<Template, string>({
      query: (templateId) => ({
        url: `/duplicate-template`,
        method: "POST",
        data: {
          templateId,
        },
      }),
      invalidatesTags: ["get-single-template"],
    }),
  }),
  overrideExisting: true,
});
