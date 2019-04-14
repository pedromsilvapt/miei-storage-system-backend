import {Directive, ElementRef, Input, OnInit} from '@angular/core';

@Directive({
  selector: '[appFilledCircle]'
})
export class FilledCircleDirective implements OnInit {

  @Input() size: number;
  @Input() isLast: boolean;

  constructor(private elementRef: ElementRef) { }

  ngOnInit(): void {
    this.elementRef.nativeElement.style.width = this.size ? this.size + 'px' : '30px';
    this.elementRef.nativeElement.style.height = this.size ? this.size + 'px' : '30px';
    this.elementRef.nativeElement.style.lineHeight = this.size ? this.size * 0.8666667 + 'px' : '26px';
    this.elementRef.nativeElement.style.border = '1px solid';
    this.elementRef.nativeElement.style.borderRadius = this.size ? this.size / 2 + 'px' : '15px';
    this.elementRef.nativeElement.style.borderColor = this.isLast ? '#0a8007' : '#10376b';
    this.elementRef.nativeElement.style.color = this.isLast ? '#0a8007' : '#10376b';
    this.elementRef.nativeElement.style.backgroundColor = this.isLast ? '#27da45' : '#397ef4';
  }

}
