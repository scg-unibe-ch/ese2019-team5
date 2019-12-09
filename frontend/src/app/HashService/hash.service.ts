import { Injectable } from '@angular/core';

/* For comments */
import {LoginPage} from "../start/login/login.page";
import {SignupPage} from "../start/signup/signup.page";
import {UpdatePasswordPage} from "../start/login/update-password/update-password.page";

/**
 * Used by {@link LoginPage}, {@link SignupPage} and {@link UpdatePasswordPage}
 * to hash the password before sending it to backend.
 */

  @Injectable({
  providedIn: 'root'
})
export class HashService {

  constructor() { }

    /**
     * Hash function using @jshashes and SHA 256
     * Hashes the password and returns it.
     * @param plainTextPw, the password entered by the user
     */
  static hashPassword(plainTextPw: string){

    // @ts-ignore
      var Hashes= require('jshashes');
    let newPWHash= new Hashes.SHA256().b64(plainTextPw);
    return newPWHash;
  }

  }
