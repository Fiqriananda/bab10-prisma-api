import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Prisma, Student } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';

export interface CreateStudentDto {
  nim: string;
  name: string;
  major: string;
  semester: number;
  gpa?: number;
}

export type UpdateStudentDto = Partial<CreateStudentDto>;

@Injectable()
export class StudentsService {
  constructor(private readonly prisma: PrismaService) {}

  findAll(major?: string, search?: string): Promise<Student[]> {
    const where: Prisma.StudentWhereInput = {};
    if (major && major.trim()) {
      where.major = { equals: major.trim(), mode: 'insensitive' };
    }
    if (search && search.trim()) {
      const q = search.trim();
      where.OR = [
        { nim: { contains: q, mode: 'insensitive' } },
        { name: { contains: q, mode: 'insensitive' } },
      ];
    }
    return this.prisma.student.findMany({
      where,
      orderBy: { id: 'asc' },
    });
  }

  async getStats() {
    const [totalStudents, agg, groups] = await Promise.all([
      this.prisma.student.count(),
      this.prisma.student.aggregate({ _avg: { gpa: true } }),
      this.prisma.student.groupBy({
        by: ['major'],
        _count: { id: true },
        orderBy: { major: 'asc' },
      }),
    ]);

    return {
      totalStudents,
      averageGpa: Number((agg._avg.gpa ?? 0).toFixed(2)),
      byMajor: groups.map((g) => ({ major: g.major, count: g._count.id })),
    };
  }

  async findOne(id: number): Promise<Student> {
    const student = await this.prisma.student.findUnique({ where: { id } });
    if (!student) {
      throw new NotFoundException(`Student with id ${id} not found`);
    }
    return student;
  }

  async create(dto: CreateStudentDto): Promise<Student> {
    if (!dto?.nim?.trim() || !dto?.name?.trim() || !dto?.major?.trim()) {
      throw new BadRequestException('nim, name, and major are required');
    }
    const semester = Number(dto.semester);
    const gpa = dto.gpa === undefined ? 0 : Number(dto.gpa);
    if (!Number.isInteger(semester) || semester < 1 || semester > 14) {
      throw new BadRequestException('semester must be an integer between 1 and 14');
    }
    if (Number.isNaN(gpa) || gpa < 0 || gpa > 4) {
      throw new BadRequestException('gpa must be between 0.0 and 4.0');
    }

    try {
      return await this.prisma.student.create({
        data: {
          nim: dto.nim.trim(),
          name: dto.name.trim(),
          major: dto.major.trim(),
          semester,
          gpa,
        },
      });
    } catch (err) {
      this.handlePrismaError(err);
    }
  }

  async update(id: number, dto: UpdateStudentDto): Promise<Student> {
    const data: Prisma.StudentUpdateInput = {};
    if (dto.nim !== undefined) data.nim = dto.nim.trim();
    if (dto.name !== undefined) data.name = dto.name.trim();
    if (dto.major !== undefined) data.major = dto.major.trim();
    if (dto.semester !== undefined) {
      const semester = Number(dto.semester);
      if (!Number.isInteger(semester) || semester < 1 || semester > 14) {
        throw new BadRequestException('semester must be an integer between 1 and 14');
      }
      data.semester = semester;
    }
    if (dto.gpa !== undefined) {
      const gpa = Number(dto.gpa);
      if (Number.isNaN(gpa) || gpa < 0 || gpa > 4) {
        throw new BadRequestException('gpa must be between 0.0 and 4.0');
      }
      data.gpa = gpa;
    }

    try {
      return await this.prisma.student.update({ where: { id }, data });
    } catch (err) {
      this.handlePrismaError(err, id);
    }
  }

  async remove(id: number): Promise<{ deleted: true; id: number }> {
    try {
      await this.prisma.student.delete({ where: { id } });
      return { deleted: true, id };
    } catch (err) {
      this.handlePrismaError(err, id);
    }
  }

  private handlePrismaError(err: unknown, id?: number): never {
    if (err instanceof Prisma.PrismaClientKnownRequestError) {
      if (err.code === 'P2002') {
        throw new ConflictException('NIM already exists');
      }
      if (err.code === 'P2025') {
        throw new NotFoundException(`Student with id ${id} not found`);
      }
    }
    throw err;
  }
}
