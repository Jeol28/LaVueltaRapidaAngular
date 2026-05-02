import { Component, Input } from '@angular/core';
import { HitoTimeline } from '../nuestra-historia/nuestra-historia.component';

@Component({
  selector: 'app-nh-timeline',
  templateUrl: './nh-timeline.component.html',
  styleUrls: ['./nh-timeline.component.css']
})
export class NhTimelineComponent {
  @Input() hitos: HitoTimeline[] = [];
}
