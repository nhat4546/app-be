import { Body, Controller, Get, Post, Query, UseGuards } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { AuthGuard } from 'src/modules/auth/auth.guard';
import { ProjectService } from '../services/project.service';
import { CreateProjectInput } from '../dtos/create-project-input.dto';
import { ListProjectParams } from '../dtos/list-project-params';

@ApiTags('project')
@Controller('project')
export class ProjectController {
  constructor(private projectService: ProjectService) {}
  @Post()
  @UseGuards(AuthGuard)
  async createProject(@Body() input: CreateProjectInput) {
    return this.projectService.createProject(input);
  }

  @Get()
  @UseGuards(AuthGuard)
  async listProject(@Query() input: ListProjectParams) {
    const page = (input?.page || 1) - 1;
    const limit = input?.limit || 10;

    return await this.projectService.listProject({
      projectName: input.projectName,
      limit,
      page,
    });
  }
}
