import {
  ChangeDetectionStrategy,
  Component,
  effect,
  inject,
  signal,
  viewChild,
} from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelect, MatSelectModule } from '@angular/material/select';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatButtonModule } from '@angular/material/button';

import { UsersStore } from './users-store';
import { MatIconModule } from '@angular/material/icon';
import { MatSlider, MatSliderThumb } from '@angular/material/slider';
import { form, FormField, max, min } from '@angular/forms/signals';

@Component({
  selector: 'app-root',
  imports: [
    ReactiveFormsModule,
    MatFormFieldModule,
    MatProgressSpinnerModule,
    MatSelectModule,
    MatButtonModule,
    MatIconModule,
    MatSlider,
    MatSliderThumb,
    FormField,
  ],
  templateUrl: './app.html',
  styleUrl: './app.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class App {
  readonly usersStore = inject(UsersStore);

  readonly userSelect = viewChild<MatSelect>('userSelect');

  readonly errorStatuses = [
    { value: '', label: 'None' },
    { value: '400', label: '400 — Bad Request' },
    { value: '401', label: '401 — Unauthorized' },
    { value: '403', label: '403 — Forbidden' },
    { value: '404', label: '404 — Not Found' },
    { value: '429', label: '429 — Too Many Requests' },
    { value: '500', label: '500 — Internal Server Error' },
    { value: '503', label: '503 — Service Unavailable' },
    { value: '504', label: '504 — Gateway Timeout' },
  ];

  readonly model = signal({
    userId: '',
    httpContext: {
      latency: 0,
      errorStatus: 500,
    },
  });

  readonly userForm = form(this.model, (path) => {
    min(path.httpContext.latency, 0);
    max(path.httpContext.latency, 10000);
  });

  constructor() {
    /**
     * Closes the user select dropdown if the users request fails,
     * preventing the user from interacting with a popup that has no valid options.
     */
    effect(() => {
      if (this.usersStore.error()) {
        this.userSelect()?.close();
      }
    });
  }

  loadUsers(): void {
    const { latency, errorStatus } = this.model().httpContext;

    this.usersStore.load({
      latency,
      errorStatus: errorStatus ? Number(errorStatus) : null,
    });
  }

  reset(): void {
    this.usersStore.clear();
    this.model.set({
      userId: '',
      httpContext: {
        latency: 0,
        errorStatus: 500,
      },
    });
  }
}
