import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

// Use require for pdf-parse (avoids TS issues)
const pdfParse = require('pdf-parse');

@Injectable()
export class ResumesService {
  constructor(private readonly prisma: PrismaService) {}

  async upload(file: Express.Multer.File) {
    // 1️⃣ Validate file
    if (!file) {
      throw new BadRequestException('No file uploaded');
    }

    console.log('BUFFER EXISTS:', !!file.buffer);
    console.log('BUFFER LENGTH:', file.buffer?.length);

    if (file.mimetype !== 'application/pdf') {
      throw new BadRequestException('Only PDF files are allowed');
    }

    if (file.size > 5 * 1024 * 1024) {
      throw new BadRequestException('File size exceeds 5MB limit');
    }

    let parsed;
    try {
      parsed = await pdfParse(file.buffer);
    } catch (error) {
      throw new BadRequestException('Failed to parse PDF');
    }

    if (!parsed?.text?.trim()) {
      throw new BadRequestException('PDF contains no readable text');
    }

    const cleanedText = parsed.text.replace(/\s+/g, ' ').trim();

    try {
      return await this.prisma.resume.create({
        data: {
          fileName: file.originalname,
          fileSize: file.size,
          mimeType: file.mimetype,
          rawText: cleanedText,
          pageCount: parsed.numpages ?? 0,
        },
      });
    } catch (error) {
      throw new InternalServerErrorException(
        'Failed to save resume to database',
      );
    }
  }
}

