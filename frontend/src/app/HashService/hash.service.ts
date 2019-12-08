import { Injectable } from '@angular/core';

  @Injectable({
  providedIn: 'root'
})
export class HashService {

  constructor() { }

    /**
     * hash function using @jshashes and SHA 256
     * used to hash password
     * @param plainTextPw
     */
  static hashPassword(plainTextPw: string){

    var Hashes= require('jshashes');
    let newPWHash= new Hashes.SHA256().b64(plainTextPw);
    return newPWHash;
  }


  }
