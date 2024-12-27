import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormsService } from '../../service/forms.service';

@Component({
  selector: 'app-demo',
  templateUrl: './demo.component.html',
  styleUrls: ['./demo.component.css']
})
export class DemoComponent {
  demoData:any

  constructor(
    private demoService:FormsService,
    private route:ActivatedRoute,
    private router:Router
    ){}
  ngOnInit():void{

    this.getDemo();
  }

  getDemo(){
    this.demoService.getDemo().subscribe((res)=>{
      this.demoData=res;
   

    })

  }
}
