import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

type Experience = {
  role: string;
  years: number;
};

@Injectable()
export class ProfilesService {
  constructor(private readonly prisma: PrismaService) {}

  /* ----------------------------- EMAIL ----------------------------- */
  private extractEmail(text: string): string | null {
    const match = text.match(
      /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-z]{2,}/,
    );
    return match ? match[0].trim() : null;
  }

  /* ----------------------------- PHONE ----------------------------- */
  private extractPhone(text: string): string | null {
    const match = text.match(
      /(\+?\d{1,3}[-.\s]?)?\d{10}/,
    );
    return match ? match[0].trim() : null;
  }

  /* ----------------------------- SKILLS ----------------------------- */
  private extractSkills(text: string): string[] {
    const skillsList = [
      'Java',
      'Python',
      'AWS',
      'Docker',
      'Kubernetes',
      'React',
      'Node',
      'SQL',
      'MongoDB',
      'TypeScript',
      'NestJS',
    ];

    const lowerText = text.toLowerCase();

    const detected = skillsList.filter(skill =>
      lowerText.includes(skill.toLowerCase()),
    );

    return [...new Set(detected)];
  }

  /* ----------------------------- EDUCATION ----------------------------- */
  private extractEducation(text: string): string[] {
    const degrees = [
      'B.Tech',
      'M.Tech',
      'BSc',
      'MSc',
      'MBA',
      'PhD',
    ];

    const detected = degrees.filter(degree =>
      text.toLowerCase().includes(degree.toLowerCase()),
    );

    return [...new Set(detected)];
  }

  /* ----------------------------- EXPERIENCE ----------------------------- */
  private extractExperience(text: string): Experience[] {
    const match = text.match(/(\d+)\+?\s*years?/i);

    if (!match) return [];

    return [
      {
        role: 'Unknown',
        years: parseInt(match[1], 10),
      },
    ];
  }

  /* ----------------------------- CERTIFICATIONS ----------------------------- */
  private extractCertifications(text: string): string[] {
    const certificationKeywords = [
      'Certified',
      'Certification',
      'AWS Certified',
      'Google Cloud Certified',
      'Microsoft Certified',
      'Azure',
      'PMP',
      'Scrum Master',
      'CCNA',
      'CCNP',
      'Oracle Certified',
      'Kubernetes Administrator',
      'CKA',
    ];

    const lines = text.split('\n');
    const certifications: string[] = [];

    for (const line of lines) {
      const lowerLine = line.toLowerCase();

      for (const keyword of certificationKeywords) {
        if (lowerLine.includes(keyword.toLowerCase())) {
          certifications.push(line.trim());
          break;
        }
      }
    }

    return [...new Set(certifications)];
  }

  /* ----------------------------- MAIN EXTRACTOR ----------------------------- */
  extractProfile(text: string) {
    const cleanText = text.replace(/\s+/g, ' ').trim();

    return {
      email: this.extractEmail(cleanText),
      phone: this.extractPhone(cleanText),
      skills: this.extractSkills(cleanText),
      education: this.extractEducation(cleanText),
      certifications: this.extractCertifications(text), // use original text for line-based detection
      experience: this.extractExperience(cleanText),
    };
  }

  /* ----------------------------- STORE PROFILE ----------------------------- */
  async create(resumeId: string, text: string) {
    const profileData = this.extractProfile(text);

    return this.prisma.profile.create({
      data: {
        resumeId,
        email: profileData.email,
        phone: profileData.phone,
        skills: profileData.skills,
        education: profileData.education,
        certifications: profileData.certifications,
        experience: profileData.experience,
      },
    });
  }

  /* ----------------------------- FETCH PROFILE ----------------------------- */
  async findByResumeId(resumeId: string) {
    return this.prisma.profile.findUnique({
      where: { resumeId },
    });
  }
}
