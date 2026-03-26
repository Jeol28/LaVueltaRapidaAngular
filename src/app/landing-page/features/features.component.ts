import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-features',
  templateUrl: './features.component.html',
  styleUrls: ['./features.component.css']
})
export class FeaturesComponents {
  @Input()
    title!:String
  @Input()
    description!:String
  @Input()
    image!: String
}
