import { patchState, signalStore, withComputed, withMethods, withState } from '@ngrx/signals';
import { httpResource } from '@angular/common/http';
import { withEntityResources } from '@angular-architects/ngrx-toolkit';
import { computed } from '@angular/core';
import { z } from 'zod';

import { UserSchema } from './user-schema';
import { simulateHttp } from './http-simulation-context';

export const UsersResponseSchema = z.object({
  users: z.array(UserSchema),
});

type LoadCriteria = {
  latency?: number;
  errorStatus?: number | null;
};

export const UsersStore = signalStore(
  { providedIn: 'root' },

  withState({
    _requestCount: 0,
    _criteria: {} as LoadCriteria,
  }),

  withEntityResources((store) =>
    httpResource(
      () => {
        const count = store._requestCount();

        if (count === 0) {
          return undefined;
        }

        return {
          url: '/api/users',
          params: { limit: 10 },
          context: simulateHttp(store._criteria()),
        };
      },
      {
        parse: (raw) => UsersResponseSchema.parse(raw).users,
        defaultValue: [],
      },
    ),
  ),

  withComputed((store) => ({
    _isEmptyOrErrored: computed(
      () => !store.isLoading() && (store.entities().length === 0 || !!store.error()),
    ),
  })),

  withMethods((store) => ({
    load(criteria: LoadCriteria = {}): void {
      if (store._isEmptyOrErrored()) {
        patchState(store, {
          _requestCount: store._requestCount() + 1,
          _criteria: criteria,
        });
      }
    },

    clear(): void {
      patchState(store, {
        _requestCount: 0,
        _criteria: {},
      });
    },
  })),
);
