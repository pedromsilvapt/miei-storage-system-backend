import {Directive, ElementRef, HostListener, Input, OnInit} from '@angular/core';

@Directive({
  selector: '[appLineSeparator]'
})
export class LineSeparatorDirective implements OnInit {

  constructor(private elementRef: ElementRef) { }

  @Input() stepsLength: number;
  @Input() size: number;
  @Input() padding: number;

  @HostListener('window:resize') onResize() {
    this.elementRef.nativeElement.style.width = this.calculateLineSeparatorWidth() + 'px';
  }

  ngOnInit(): void {
    this.elementRef.nativeElement.style.width = this.calculateLineSeparatorWidth() + 'px';
    this.elementRef.nativeElement.style.height = 1;
    this.elementRef.nativeElement.style.borderTop = '1px solid';
    this.elementRef.nativeElement.style.borderColor = '#0e2549';
    this.elementRef.nativeElement.style.marginTop = (this.size / 2) + 'px';
  }

  private calculateLineSeparatorWidth(): number {
    const parentWidth = this.elementRef.nativeElement.parentElement.offsetWidth;
    const emptySpace = parentWidth - (this.stepsLength * this.size);
    return (emptySpace / (this.stepsLength - 1)) - this.padding;
  }

}
