import { Injectable } from '@angular/core';
import * as CryptoJS from 'crypto-js';
import { environment } from '../../environments/environment.development';

@Injectable({
  providedIn: 'root'
})
export class JwtVerifyService {
  private readonly haha = environment.client+'gXXjLL9M9P1lyTg49nJ32GvwMT09rl30IgJWoo712T4IL8CREV';
  private base64UrlDecode(input: string): string {
    input = input.replace(/-/g, '+').replace(/_/g, '/');
    while (input.length % 4) {
      input += '=';
    }
    return atob(input);
  }

  verifyToken(token: string): boolean {
    const parts = token.split('.');
    if (parts.length !== 3) {
      return false;
    }

    const [headerB64, payloadB64, signatureB64] = parts;
    const data = `${headerB64}.${payloadB64}`;
    const expectedSignature = this.sign(data);

    return signatureB64 === expectedSignature;
  }

  decodePayload(token: string): any | null {
    const parts = token.split('.');
    if (parts.length < 2) {
      return null;
    }

    const payloadB64 = parts[1];
    try {
      const json = this.base64UrlDecode(payloadB64);
      return JSON.parse(json);
    } catch {
      return null;
    }
  }

  private sign(data: string): string {
    const hash = CryptoJS.HmacSHA256(data, this.haha);
    const base64 = hash.toString(CryptoJS.enc.Base64);
    return base64
      .replace(/\+/g, '-')
      .replace(/\//g, '_')
      .replace(/=+$/, '');
  }
}
