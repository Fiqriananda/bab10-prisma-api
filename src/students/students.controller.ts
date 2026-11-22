import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import {
  CreateStudentDto,
  StudentsService,
  UpdateStudentDto,
} from './students.service';

@Controller('api/students')
export class StudentsController {
  constructor(private readonly studentsService: StudentsService) {}

  @Get()
  async findAll(
    @Query('major') major?: string,
    @Query('search') search?: string,
  ) {
    const data = await this.studentsService.findAll(major, search);
    return { data };
  }

  @Get('stats')
  getStats() {
    return this.studentsService.getStats();
  }

  @Get(':id')
  async findOne(@Param('id', ParseIntPipe) id: number) {
    const data = await this.studentsService.findOne(id);
    return { data };
  }

  @Post()
  async create(@Body() body: CreateStudentDto) {
    const data = await this.studentsService.create(body);
    return { data };
  }

  @Patch(':id')
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() body: UpdateStudentDto,
  ) {
    const data = await this.studentsService.update(id, body);
    return { data };
  }

  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.studentsService.remove(id);
  }
}
