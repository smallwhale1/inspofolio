// Basic API error handling objects and type checking

export interface ErrorResponse {
  status: "error";
  message: string;
  code?: number;
}

export interface SuccessResponse {
  status: "success";
}

export const isErrorRes = (obj: any): obj is ErrorResponse => {
  return (
    typeof obj === "object" &&
    "status" in obj &&
    obj.status === "error" &&
    "message" in obj
  );
};

export const isSuccessRes = (obj: any): obj is SuccessResponse => {
  return typeof obj === "object" && "status" in obj && obj.status === "success";
};
