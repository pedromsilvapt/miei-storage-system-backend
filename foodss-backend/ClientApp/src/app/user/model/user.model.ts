export class User {

  id: number;
  name: string;
  // TODO remover '?' depois do REST ser implementado. Utilizado para fins de teste
  email?: string;
  password?: string;
  isEmailVerified?: boolean;
  salt?: string;
}
