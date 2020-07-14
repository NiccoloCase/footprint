import {
  Controller,
  Post,
  Res,
  InternalServerErrorException,
} from '@nestjs/common';
import { Response } from 'express';
import { UploaderService } from './uploader.service';

@Controller('uploader')
export class UploaderController {
  constructor(private readonly uploaderService: UploaderService) {}

  // GENERA LA FIRMA PER IL CARICAMENTO DI RISORSE IN CLOUDINARY
  @Post('generate-cloudinary-signature')
  generateCloudinarySignature(@Res() res: Response) {
    const signaturePayload = this.uploaderService.generateCloudinarySignature();

    if (!signaturePayload) throw new InternalServerErrorException();

    res.send(signaturePayload);
  }
}
