import { Component, ElementRef, ViewChild, Output, EventEmitter } from '@angular/core';
import * as Quagga from 'quagga';

@Component({
  selector: 'barcode-scanner',
  template: `
  <div #videoOutput class="video-output">
    <video></video>
  </div>`,
  styles: [`
    .video-output video {
      width: 100%;
    }
`]
})
export class BarcodeScannerComponent {
  active: boolean = false;

  @ViewChild( 'video' ) video: ElementRef<HTMLVideoElement>;

  @ViewChild('canvas') canvas: ElementRef<HTMLCanvasElement>;

  @ViewChild('videoOutput') videoOutput: ElementRef;

  @Output('detect') detectEvent: EventEmitter<string> = new EventEmitter();

  public scanner: any = null;

  async ngAfterViewInit() {
    this.scanner = Quagga
      .decoder({ readers: ['ean_reader'] })
      .locator({ patchSize: 'medium' })
      .fromSource({
        target: this.videoOutput.nativeElement,
        constraints: {
          type: "LiveStream",
          width: 800,
          height: 600,
          facingMode: "environment"
        }
      });

    this.scanner.addEventListener('detected', (result) => {
      this.detectEvent.next(result.codeResult.code);
    });

    this.scanner.start();
  }

  ngOnDestroy() {
    this.scanner.stop();

    this.scanner = null;
  }
}
