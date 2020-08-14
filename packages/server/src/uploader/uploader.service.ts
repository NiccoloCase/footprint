import { Injectable } from '@nestjs/common';
import { GenerateCloudinarySignatureResponse } from './uploader.types';
import * as cloudinary from 'cloudinary';
import { keys } from '@footprint/config';

@Injectable()
export class UploaderService {
  /**
   * Genera la firma per autorizzare il caricamento di una risorsa in cloudinary
   */
  generateCloudinarySignature(): GenerateCloudinarySignatureResponse {
    const timestamp = +new Date();
    const upload_preset = keys.cloudinary.UPLOAD_PRESENT;

    const signature = cloudinary.v2.utils.api_sign_request(
      { timestamp, upload_preset },
      keys.cloudinary.API_SECRET,
    );

    return { timestamp, signature, upload_preset };
  }
}
