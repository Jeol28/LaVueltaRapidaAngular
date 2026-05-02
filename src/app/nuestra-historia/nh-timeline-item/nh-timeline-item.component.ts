import { Component, Input } from '@angular/core';
import { HitoTimeline } from '../nuestra-historia/nuestra-historia.component';

@Component({
  selector: 'app-nh-timeline-item',
  templateUrl: './nh-timeline-item.component.html',
  styleUrls: ['./nh-timeline-item.component.css']
})
export class NhTimelineItemComponent {
  @Input() hito!: HitoTimeline;
  @Input() index = 0;

  get esPar(): boolean {
    return this.index % 2 === 0;
  }
}
