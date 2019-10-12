/**
 * User class
 * Stores all information about a User
 * Initialized by SignupPage
 */

export class User {
  id: number;
  token?: string;

  constructor(
    private email: string,
    private password: string,
    private valid: boolean) {}
}
