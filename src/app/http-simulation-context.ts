import { HttpContext, HttpContextToken } from '@angular/common/http';

export const SIMULATED_LATENCY = new HttpContextToken<number>(() => 0);

export const SIMULATED_ERROR_STATUS = new HttpContextToken<number | null>(() => null);

export function simulateHttp(options: {
  latency?: number;
  errorStatus?: number | null;
}): HttpContext {
  return new HttpContext()
    .set(SIMULATED_LATENCY, options.latency ?? 0)
    .set(SIMULATED_ERROR_STATUS, options.errorStatus ?? null);
}
