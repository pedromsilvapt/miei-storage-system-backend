import {Directive, ElementRef, HostListener, Input, OnInit} from '@angular/core';

@Directive({
  selector: '[appLineSeparator]'
})
export class LineSeparatorDirective implements OnInit {

  constructor(private elementRef: ElementRef) { }

  @Input() size: number;

  ngOnInit(): void {
    this.elementRef.nativeElement.style.flex = 'auto';
    this.elementRef.nativeElement.style.margin = '10px';
    this.elementRef.nativeElement.style.height = 1;
    this.elementRef.nativeElement.style.borderTop = '1px solid';
    this.elementRef.nativeElement.style.borderColor = 'rgba(0,0,0,0.25)';
    this.elementRef.nativeElement.style.marginTop = (this.size / 2) + 'px';
  }

}
