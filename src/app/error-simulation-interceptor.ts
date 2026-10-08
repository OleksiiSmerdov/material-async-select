import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { throwError } from 'rxjs';

import { SIMULATED_ERROR_STATUS } from './http-simulation-context';

export const errorSimulationInterceptor: HttpInterceptorFn = (req, next) => {
  const status = req.context.get(SIMULATED_ERROR_STATUS);

  if (status === null) {
    return next(req);
  }

  return throwError(
    () =>
      new HttpErrorResponse({
        status,
        statusText: 'Simulated Error',
        url: req.urlWithParams,
        error: {
          message: `Simulated HTTP ${status} error`,
        },
      }),
  );
};
