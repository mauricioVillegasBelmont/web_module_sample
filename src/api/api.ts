type HTTPMethods =
  | string
  | "GET"
  | "POST"
  | "PUT"
  | "HEAD"
  | "DELETE"
  | "PATCH"
  | "OPTIONS"
  | "CONNECT"
  | "TRACE";

export interface select {
  VALUE: string;
  NAME?: string;
}

export interface FormResponse {
  ok:boolean;
  status: string;
  msg?: string;
  redirect?: string;
}

export default class FormSumbiterApi {

  static async submit(
    path: URL | string,
    method: HTTPMethods,
    formData: FormData
  ) {
    return new Promise<FormResponse>((resolve, reject) => {
      if (!path || !method || !formData) {
        reject("uncompleete args");
      }
      fetch(path, {
        method: method,
        headers: {
          "Cache-Control": "no-cache",
        },
        body: formData,
      })
        .then((response) => {
          return response.json();
        })
        .then((response) => {
          resolve(response);
        })
        .catch((error) => {
          reject(error);
        });
    });
  }
}
