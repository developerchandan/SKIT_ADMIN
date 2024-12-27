import { Component, Input } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { UserService } from 'src/app/pages/service/user.service';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css'],
})
export class SidebarComponent {

  isLoggedIn: boolean = false;
  userId!: string;
  user: any;
  @Input() userProfileId!: string;
  id: any;

  constructor(private userService: UserService, private route: ActivatedRoute, private router: Router) {}
  ngOnInit(): void {
    const userData = JSON.parse(localStorage.getItem('usersdata')!);
    this.userId = userData.userId;
    this.route.params.subscribe((params) => {
      // this.userId = params['userId'];
      this.userId = userData.userId;
      this.userProfileId = params['userProfileId'];
    });
    this._getAdmin();
  }
  checkIfLoggedIn() {
    // check if user is logged in
    const usersData = localStorage.getItem('usersdata');
    if (usersData) {
      this.isLoggedIn = true;
    } else {
      this.isLoggedIn = false;
    }
  }

  private _getAdmin() {
    this.userService.getUserAdmin(this.userId).subscribe(
      (user: any) => {
        this.user = user;
      },
      (error: any) => {
        console.error(error);
      }
    );
  }

  logout() {
    // clear user session data
    localStorage.removeItem('usersdata');
    // update login status
    this.isLoggedIn = false;
    // navigate to login page
    this.router.navigate(['/']);
  }
}
