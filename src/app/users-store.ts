import { patchState, signalStore, withMethods, withState } from '@ngrx/signals';
import { httpResource } from '@angular/common/http';
import { withEntityResources } from '@angular-architects/ngrx-toolkit';
import { UserSchema } from './user';
import { z } from 'zod';

export const UsersResponseSchema = z.object({
  users: z.array(UserSchema)
});

export const UsersStore = signalStore(
  { providedIn: 'root' },
  withState({ _requestCount: 0 }),
  withEntityResources((store) =>
    httpResource(
      () => {
        const count = store._requestCount();
        if (count === 0) return undefined;
        return '/api/users1?limit=10';
      },
      {
        parse: (raw) => UsersResponseSchema.parse(raw).users,
        defaultValue: []
      }
    )
  ),
  withMethods((store) => ({
    load(): void {
      const hasEntities = store.entities().length > 0;
      const isLoading = store.isLoading();
      const hasError = !!store.error();

      // Trigger ONLY if not currently loading AND (we have no data OR the previous attempt failed)
      if (!isLoading && (!hasEntities || hasError)) {
        patchState(store, { _requestCount: store._requestCount() + 1 });
      }
    },
    clear(): void {
      patchState(store, { _requestCount: 0 });
    }
  }))
);
