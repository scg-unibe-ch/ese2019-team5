/**
 * User class
 * Stores all information about a User
 * Initialized by SignupPage
 */

export class User {

  constructor(
    private email: string,
    private password: string,
    private valid: boolean) {}
}
