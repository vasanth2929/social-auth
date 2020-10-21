import { Component, OnInit ,OnDestroy } from '@angular/core';
import {
  SocialAuthService,
  FacebookLoginProvider,
  GoogleLoginProvider,
} from 'angularx-social-login';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { UserService } from './services/user.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit, OnDestroy {
  user ;
  destroy$ = new Subject();

  constructor(
    private socialAuthService: SocialAuthService,
    public userService: UserService
  ) {}

  signInSocialAccount(provider: 'facebook' | 'google'): void {
    let providerId = null;
    if (provider === 'facebook') {
      providerId = FacebookLoginProvider.PROVIDER_ID;
    } else {
      providerId = GoogleLoginProvider.PROVIDER_ID;
    }
    this.socialAuthService
      .signIn(providerId)
      .then((data) => {
        this.userService.setUserData(data);
      })
      .catch((e) => {
        console.log('authentication failed');
      });
  }

  ngOnInit() {
    this.socialAuthService.authState.pipe(takeUntil(this.destroy$)).subscribe((user) => {
      this.user = user;
    });
  }

  logout() {
    if(this.user)
    this.socialAuthService.signOut();
    this.userService.logout();
  }
  
  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

}
