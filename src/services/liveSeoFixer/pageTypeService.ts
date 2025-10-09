import axiosInstance from "@/api/axiosInstance";
import type { PageTypeOption } from "@/modules/live-seo-fixer/types";

const BASE_PATH = "/live-seo-fixer";

export const pageTypeService = {
  async getSupportedPageTypes(): Promise<PageTypeOption[]> {
    const { data } = await axiosInstance.get(`${BASE_PATH}/supported-page-types`);
    return this.transformToPageTypeOptions(data.data);
  },

  transformToPageTypeOptions(data: any[]): PageTypeOption[] {
    return data.map((item) => ({
      value: item.value || item.type || item,
      label: item.label || item.name || item,
    }));
  },
};
