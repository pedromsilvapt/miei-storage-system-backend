export class StringUtil {

  public static getInitials(name: string): string {
    let avatarInitials: string;
    const nameInitials: Array<string> = name.split(' ');
    if (nameInitials.length > 1) {
      avatarInitials = nameInitials[0] + ' ' + nameInitials[nameInitials.length - 1];
    } else {
      avatarInitials = name
    }
    return avatarInitials;
  }
}
