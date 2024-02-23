import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { AuthGuard } from 'src/modules/auth/auth.guard';
import { ProjectService } from '../services/project.service';
import { CreateProjectInput } from '../dtos/create-project-input.dto';

@ApiTags('project')
@Controller('project')
export class ProjectController {
  constructor(private projectService: ProjectService) {}
  @Post()
  @UseGuards(AuthGuard)
  async createProject(@Body() input: CreateProjectInput) {
    return this.projectService.createProject(input);
  }
}
