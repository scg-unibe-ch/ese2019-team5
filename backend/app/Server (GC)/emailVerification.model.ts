// TODO wo gehört das hin
// noch keine Ahnung aber das brauchts für E-Mail verifikation

import * as fs from 'fs';
import {Token} from 'nodemailer/lib/xoauth2';
import jwt, {decode, verify} from 'jsonwebtoken';

let payload: { data1: string };
payload = {
  data1: 'data 1',
};

const privateKEY = fs.readFileSync('./private.key', 'utf8');
const publicKEY = fs.readFileSync('./public.key', 'utf8' );

/*const sender = 'ESETeam5';
const subject = 'some@user.com';
const audience = 'http://mysoftcorp.in'; // TODO was sind die drei hier genau??*/

/*
// Signing Options  kann das const sein?? Wieso auch bei token wieder ein Problem!!auch wenn sich audience oder so ändern könnte?
const signOptions = {
  issuer: sender,
  subject: subject,
  audience: audience,
  expiresIn: '24h',
  algorithm: 'RS256'
};



const verifyOptions = {
  issuer: sender,
  subject: subject,
  audience: audience,
  expiresIn: '24h',
  algorithm: ['RS256']
};
*/

// gibt das wirklich boolean
//let legitimate: boolean = jwt.verify(token, publicKEY, verifyOptions);


// und nun das ganze als Funktionen glaubs
async function sign(payload,$Options) => {
  // Signing Options  kann das const sein?? Wieso auch bei token wieder ein Problem!!auch wenn sich audience oder so ändern könnte?
  let signOptions = {
    issuer: $Options.issuer,
    subject: $Options.subject,
    audience: $Options.audience,
    expiresIn: '24h',
    algorithm: 'RS256'
  };
  return jwt.sign(payload, privateKEY, signOptions) ;
};

verify(token, $Option) => {
  const verifyOptions = {
    issuer: $Options.issuer,
    subject: $Options.subject,
    audience: $Options.audience,
    expiresIn: '24h',
    algorithm: ['RS256']
    };
  try {
    return jwt.verify(token, publicKEY, verifyOptions);
  } catch (error) {
    return false;
  }
};

// will return null if token is invalid!!!
decode(token)=>{
  return jwt.decode(token, {complete: true});
};
