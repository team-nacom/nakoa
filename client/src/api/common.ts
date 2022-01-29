export const authValidateStatus = (status: number) => ((200 <= status && status < 300) || status === 401);
