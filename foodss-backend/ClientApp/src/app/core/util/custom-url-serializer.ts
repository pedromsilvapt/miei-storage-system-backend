import { DefaultUrlSerializer, UrlSerializer, UrlTree } from '@angular/router';

export default class CustomUrlSerializer implements UrlSerializer {
  private defaultUrlSerializer: DefaultUrlSerializer = new DefaultUrlSerializer();

  parse(url: string): UrlTree {
    // Encode parentheses
    url = url.replace(/;/g, '%3B').replace(/=/g, '%3D');
    // Use the default serializer.
    return this.defaultUrlSerializer.parse(url);
  }

  serialize(tree: UrlTree): string {
    return this.defaultUrlSerializer.serialize(tree).replace(/%3B/g, ';').replace(/%3D/g, '=');
  }
}
