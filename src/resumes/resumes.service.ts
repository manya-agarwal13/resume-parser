import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { ProfilesService } from '../profiles/profiles.service';
import * as crypto from 'crypto';

// Use require for pdf-parse (stable with NestJS)
const pdfParse = require('pdf-parse');

@Injectable()
export class ResumesService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly profilesService: ProfilesService,
  ) {}

  async upload(file: Express.Multer.File) {
    // 1️⃣ Validate file existence
    if (!file) {
      throw new BadRequestException('No file uploaded');
    }

    // 2️⃣ Validate file type
    if (file.mimetype !== 'application/pdf') {
      throw new BadRequestException('Only PDF files are allowed');
    }

    // 3️⃣ Validate size (5MB limit)
    if (file.size > 5 * 1024 * 1024) {
      throw new BadRequestException('File size exceeds 5MB limit');
    }

    // Generate file hash (prevent duplicates)
    const fileHash = crypto
      .createHash('sha256')
      .update(file.buffer)
      .digest('hex');

    const existing = await this.prisma.resume.findFirst({
      where: { fileHash },
    });

    if (existing) {
      throw new BadRequestException(
        'This resume has already been uploaded',
      );
    }

    // 5️⃣ Parse PDF
    let parsed;
    try {
      parsed = await pdfParse(file.buffer);
    } catch (error) {
      console.error('PDF PARSE ERROR:', error);
      throw new BadRequestException('Failed to parse PDF');
    }

    if (!parsed?.text?.trim()) {
      throw new BadRequestException(
        'PDF contains no readable text. Upload a text-based PDF.',
      );
    }

    const cleanedText = parsed.text.replace(/\s+/g, ' ').trim();

    try {
      // 6️⃣ Save Resume
      const resume = await this.prisma.resume.create({
        data: {
          fileName: file.originalname,
          fileSize: file.size,
          mimeType: file.mimetype,
          rawText: cleanedText,
          pageCount: parsed.numpages ?? 0,
          fileHash,
        },
      });

      // 7️⃣ Extract & Save Profile
      await this.profilesService.create(resume.id, cleanedText);

      return {
        message: 'Resume uploaded and profile extracted successfully',
        resumeId: resume.id,
      };
    } catch (error) {
      console.error('DATABASE ERROR:', error);
      throw new InternalServerErrorException(
        'Failed to save resume to database',
      );
    }
  }
}
