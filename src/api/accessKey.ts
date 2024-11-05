import { http } from "@/utils/http";

const enum AccessKeyApi {
  Create = "/api/v1/user/access_key_create",
  Update = "/api/v1/user/access_key_edit",
  List = "/api/v1/user/access_key_list",
  Delete = "/api/v1/user/access_key_del",
  Get = "/api/v1/user/access_key_view"
}

export type createAccessKeyParams = {
  app_name: string;
  app_icon: string;
  app_description: string;
};

export function createAccessKey(data: createAccessKeyParams) {
  return http.post(AccessKeyApi.Create, {
    data: data
  });
}

export function updateAccessKey(data: any) {
  return http.post(AccessKeyApi.Update, data);
}

export function listAccessKeys() {
  return http.get(AccessKeyApi.List);
}

export function deleteAccessKey(id: number) {
  return http.delete(AccessKeyApi.Delete, { data: { id } });
}
