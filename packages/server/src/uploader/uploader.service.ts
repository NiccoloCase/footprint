import { Injectable } from '@nestjs/common';
import { GenerateCloudinarySignatureResponse } from './uploader.types';
import * as cloudinary from 'cloudinary';
import config from '@footprint/config';

@Injectable()
export class UploaderService {
  /**
   * Genera la firma per autorizzare il caricamento di una risorsa in cloudinary
   */
  generateCloudinarySignature(): GenerateCloudinarySignatureResponse {
    const timestamp = +new Date();
    const upload_preset = config.cloudinary.UPLOAD_PRESENT;

    const signature = cloudinary.v2.utils.api_sign_request(
      { timestamp, upload_preset },
      config.cloudinary.API_SECRET,
    );

    return { timestamp, signature, upload_preset };
  }
}
