import { Injectable } from '@angular/core';

  @Injectable({
  providedIn: 'root'
})
export class HashService {

  constructor() { }

  /**
   * Hashes a given plain text password with function copied from https://stackoverflow.com/questions/7616461/generate-a-hash-from-string-in-javascript
   * Probably not the safest option but suffices for first attempt
   * @param plainTextPw
   */
  static hashPassword(plainTextPw: string){

    let pwHash= plainTextPw.split("").reduce(function(a,b){a=((a<<5)-a)+b.charCodeAt(0);return a&a},0);
    var Hashes= require('jshashes');
    let newPWHash= new Hashes.SHA1().b64(pwHash);
    return newPWHash;
  }


  }
