import { Inject, Injectable, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

@Injectable({
  providedIn: 'root'
})
export class WindowService {
  constructor(@Inject(PLATFORM_ID) private platformId: object) {}

  getNativeWindow(): Window | null {
    return isPlatformBrowser(this.platformId) ? window : null;
  }
}
