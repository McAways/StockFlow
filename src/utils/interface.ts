export interface LoggedUser {
  authorities: UserAuthority[] | Array<string>,
  email: string
}

export interface UserAuthority {
  authority: string;
}