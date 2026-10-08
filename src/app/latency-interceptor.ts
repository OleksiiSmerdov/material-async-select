import { HttpInterceptorFn } from '@angular/common/http';
import { delay, dematerialize, materialize } from 'rxjs';

import { SIMULATED_LATENCY } from './http-simulation-context';

export const latencyInterceptor: HttpInterceptorFn = (req, next) => {
  const latency = req.context.get(SIMULATED_LATENCY);

  if (latency <= 0) {
    return next(req);
  }

  return next(req).pipe(materialize(), delay(latency), dematerialize());
};
