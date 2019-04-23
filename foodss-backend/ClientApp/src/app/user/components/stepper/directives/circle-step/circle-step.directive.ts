import {Directive, ElementRef, Input, OnInit} from '@angular/core';

@Directive({
  selector: '[appCircleStep]'
})
export class CircleStepDirective implements OnInit {

  @Input() size: number;
  @Input() isLast: boolean;
  @Input() isActive: boolean;

  constructor(private elementRef: ElementRef) { }

  ngOnInit(): void {
    this.buildCircleStepShape();
    Promise.resolve(null).then(() => {
      if (this.isActive) {
        this.buildCircleStepAppearenceWhenActive();
      } else {
        this.buildCircleStepAppearenceWhenNotActive();
      }
    });
  }

  private buildCircleStepShape(): void {
    this.elementRef.nativeElement.style.width = this.size ? this.size + 'px' : '30px';
    this.elementRef.nativeElement.style.height = this.size ? this.size + 'px' : '30px';
    this.elementRef.nativeElement.style.lineHeight = this.size ? this.size * 0.8666667 + 'px' : '26px';
    this.elementRef.nativeElement.style.border = '1px solid';
    this.elementRef.nativeElement.style.borderRadius = this.size ? this.size / 2 + 'px' : '15px';
  }

  private buildCircleStepAppearenceWhenActive(): void {
    this.elementRef.nativeElement.style.borderColor = this.isLast ? '#00d14a' : '#00CED1';
    this.elementRef.nativeElement.style.backgroundColor = this.isLast ? '#00d14a' : '#00CED1';
    this.elementRef.nativeElement.style.color = this.isLast ? '#FFFFFF' : '#FFFFFF';
  }

  private buildCircleStepAppearenceWhenNotActive(): void {
    this.elementRef.nativeElement.style.borderColor = this.isLast ? '#757575' : '#757575';
    this.elementRef.nativeElement.style.backgroundColor = this.isLast ? '#757575' : '#757575';
    this.elementRef.nativeElement.style.color = this.isLast ? '#FFFFFF' : '#FFFFFF';
  }
}
