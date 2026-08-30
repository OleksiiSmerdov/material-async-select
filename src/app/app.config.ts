import { ApplicationConfig, provideBrowserGlobalErrorListeners } from '@angular/core';
import { provideHttpClient } from '@angular/common/http';
import { MAT_FORM_FIELD_DEFAULT_OPTIONS, MatFormFieldDefaultOptions } from '@angular/material/form-field';
import { MAT_BUTTON_CONFIG, MatButtonConfig } from '@angular/material/button';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideHttpClient(),
    {
      provide: MAT_FORM_FIELD_DEFAULT_OPTIONS,
      useValue: {
        subscriptSizing: 'dynamic'
      } as MatFormFieldDefaultOptions
    },
    {
      provide: MAT_BUTTON_CONFIG,
      useValue: {
        defaultAppearance: 'filled'
      } as MatButtonConfig
    }
  ]
};
