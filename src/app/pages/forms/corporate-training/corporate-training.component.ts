import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormsService } from '../../service/forms.service';

@Component({
  selector: 'app-corporate-training',
  templateUrl: './corporate-training.component.html',
  styleUrls: ['./corporate-training.component.css']
})
export class CorporateTrainingComponent {
  corporateTraining:any

  constructor(
    private corporateTrainingService:FormsService,
    private route:ActivatedRoute,
    private router:Router
    ){}
  ngOnInit():void{

    this.getCorporateTraining();
  }

  getCorporateTraining(){
    this.corporateTrainingService.getCorporateTraining().subscribe((res)=>{
      this.corporateTraining=res;
   

    })

  }

}
