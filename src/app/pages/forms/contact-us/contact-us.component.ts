import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormsService } from '../../service/forms.service';

@Component({
  selector: 'app-contact-us',
  templateUrl: './contact-us.component.html',
  styleUrls: ['./contact-us.component.css']
})
export class ContactUsComponent {

  contactus:any

  constructor(
    private contactService:FormsService,
    private route:ActivatedRoute,
    private router:Router
    ){}
  ngOnInit():void{

    this.getContactUs();
  }

  getContactUs(){
    this.contactService.getContactUs().subscribe((res)=>{
      this.contactus=res;
     
    })

  }
}
