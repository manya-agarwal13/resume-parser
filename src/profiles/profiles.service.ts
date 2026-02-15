import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class ProfilesService {
  constructor(private readonly prisma: PrismaService) {}

  // 🔹 Extract Email
  private extractEmail(text: string): string | null {
    const match = text.match(
      /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-z]{2,}/,
    );
    return match ? match[0] : null;
  }

  // 🔹 Extract Phone
  private extractPhone(text: string): string | null {
    const match = text.match(
      /(\+?\d{1,3}[-.\s]?)?\d{10}/,
    );
    return match ? match[0] : null;
  }

  // 🔹 Extract Skills
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

    return skillsList.filter(skill =>
      text.toLowerCase().includes(skill.toLowerCase()),
    );
  }

  // 🔹 Extract Education
  private extractEducation(text: string): string[] {
    const degrees = ['B.Tech', 'M.Tech', 'BSc', 'MSc', 'MBA', 'PhD'];
    return degrees.filter(degree =>
      text.includes(degree),
    );
  }

  // 🔹 Extract Experience
  private extractExperience(text: string) {
    const match = text.match(/(\d+)\+?\s*years?/i);
    return match
      ? [{ role: 'Unknown', years: parseInt(match[1], 10) }]
      : [];
  }

  // 🔹 Extract Certifications
  private extractCertifications(text: string): string[] {
    const certifications: string[] = [];

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

    lines.forEach(line => {
      certificationKeywords.forEach(keyword => {
        if (line.toLowerCase().includes(keyword.toLowerCase())) {
          certifications.push(line.trim());
        }
      });
    });

    // Remove duplicates
    return [...new Set(certifications)];
  }

  // 🔹 Main Extract Function
  extractProfile(text: string) {
    return {
      email: this.extractEmail(text),
      phone: this.extractPhone(text),
      skills: this.extractSkills(text),
      education: this.extractEducation(text),
      certifications: this.extractCertifications(text),
      experience: this.extractExperience(text),
    };
  }

  // 🔹 Store Profile
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
}
