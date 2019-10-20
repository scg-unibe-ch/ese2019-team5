import { Injectable } from '@angular/core';
import * as bcrypt from 'bcrypt';

  @Injectable({
  providedIn: 'root'
})
export class HashService {

  constructor() { }

  /**
   * Hashes a given plain text password with 2 rounds of salt
   * @param plainTextPw
   */
  static hashPassword(plainTextPw: string){
    return bcrypt.hash(plainTextPw,2);
  }


  }
