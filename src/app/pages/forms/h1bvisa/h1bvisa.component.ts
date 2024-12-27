import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormsService } from '../../service/forms.service';

@Component({
  selector: 'app-h1bvisa',
  templateUrl: './h1bvisa.component.html',
  styleUrls: ['./h1bvisa.component.css']
})
export class H1bvisaComponent {
  h1bVisa:any

  constructor(
    private h1bVisaService:FormsService,
    private route:ActivatedRoute,
    private router:Router
    ){}
  ngOnInit():void{

    this.getCorporateTraining();
  }

  getCorporateTraining(){
    this.h1bVisaService.getH1bvisa().subscribe((res)=>{
      this.h1bVisa=res;
  

    })

  }

}
