import { http } from "@/utils/http";
import type { Result, PageParams, PageResult } from "./common";

const enum ApplicationAPI {
  Create = "/api/v1/applications/applications_add",
  Update = "/api/v1/applications/applications_edit",
  Delete = "/api/v1/applications/applications_del",
  GetList = "/api/v1/applications/get_applications_list"
}

export function createApplication(data: any) {
  return http.post(ApplicationAPI.Create, {
    data: data
  });
}

export function updateApplication(data: any) {
  return http.put(ApplicationAPI.Update, {
    data: data
  });
}

export function deleteApplication(id: number) {
  return http.delete<Result<any>, { ids: Array<number> }>(
    ApplicationAPI.Delete,
    {
      data: { ids: [id] }
    }
  );
}

export function getApplicationList(params?: PageParams) {
  return http.get<Result<PageResult<any>>, PageParams>(ApplicationAPI.GetList, {
    params
  });
}
