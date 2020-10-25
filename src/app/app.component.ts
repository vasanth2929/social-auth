import { Component, OnInit ,OnDestroy ,ViewChild, ElementRef } from '@angular/core';
import {
  SocialAuthService,
  FacebookLoginProvider,
  GoogleLoginProvider,
} from 'angularx-social-login';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { UserService } from './services/user.service';
declare var gapi ;

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit, OnDestroy {
  user ;
  destroy$ = new Subject();
  @ViewChild('link', { static: true }) link: ElementRef;
  constructor(
    private socialAuthService: SocialAuthService,
    public userService: UserService
  ) {}

  signInSocialAccount(provider: 'facebook' | 'google'): void {
    let providerId = null;
    if (provider === 'facebook') {
      providerId = FacebookLoginProvider.PROVIDER_ID;
      (this.link.nativeElement as HTMLAnchorElement).href = 'https://facebook.com/login';
    } else {
      providerId = GoogleLoginProvider.PROVIDER_ID;
      (this.link.nativeElement as HTMLAnchorElement).href = 'https://google.com/gmail';
    }
    this.socialAuthService
      .signIn(providerId)
      .then((data) => {
        this.userService.setUserData(data);
        (this.link.nativeElement as HTMLAnchorElement).click();     
      })
      .catch((e) => {
        console.log('authentication failed');
      });
  }

  ngOnInit() {
    this.socialAuthService.authState.pipe(takeUntil(this.destroy$)).subscribe((user) => {
      this.user = user;
      if(!this.user) {
        this.logout();
      }
    });
  }

  logout() {
    if(this.user)
    this.socialAuthService.signOut();
    if(gapi) {
      gapi.auth2.getAuthInstance().signOut().then(()=>{});
      gapi.auth2.getAuthInstance().disconnect();
    }
    this.userService.logout();
  }
  
  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

}
