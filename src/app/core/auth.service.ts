import { Inject, Injectable, OnDestroy, PLATFORM_ID, signal } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { Router } from '@angular/router';
import {
  getAuth,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
  signOut,
  onAuthStateChanged,
  User,
  Auth,
} from 'firebase/auth';
import { firebaseApp } from '../app.config';

@Injectable({ providedIn: 'root' })
export class AuthService implements OnDestroy {
  private auth: Auth = getAuth(firebaseApp);
  private unsubscribe: (() => void) | undefined;
  private authInitialized = false;
  private authReadyResolver?: (user: User | null) => void;
  private authReady = new Promise<User | null>((resolve) => {
    this.authReadyResolver = resolve;
  });

  currentUser = signal<User | null | undefined>(undefined);

  constructor(
    private router: Router,
    @Inject(PLATFORM_ID) private platformId: object,
  ) {
    if (!isPlatformBrowser(this.platformId)) {
      return;
    }

    this.unsubscribe = onAuthStateChanged(this.auth, (user) => {
      this.currentUser.set(user);

      if (!this.authInitialized) {
        this.authInitialized = true;
        this.authReadyResolver?.(user);
      }
    });
  }

  get isLoggedIn(): boolean {
    return this.currentUser() !== null && this.currentUser() !== undefined;
  }

  async getResolvedUser(): Promise<User | null> {
    if (!isPlatformBrowser(this.platformId)) {
      return null;
    }

    const user = this.currentUser();
    if (user !== undefined) {
      return user;
    }

    return this.authReady;
  }

  async loginWithEmail(email: string, password: string): Promise<void> {
    await signInWithEmailAndPassword(this.auth, email, password);
    await this.router.navigate(['/']);
  }

  async registerWithEmail(email: string, password: string): Promise<void> {
    await createUserWithEmailAndPassword(this.auth, email, password);
    await this.router.navigate(['/']);
  }

  async loginWithGoogle(): Promise<void> {
    const provider = new GoogleAuthProvider();
    await signInWithPopup(this.auth, provider);
    await this.router.navigate(['/']);
  }

  async logout(): Promise<void> {
    await signOut(this.auth);
    await this.router.navigate(['/login']);
  }

  ngOnDestroy(): void {
    this.unsubscribe?.();
  }
}
