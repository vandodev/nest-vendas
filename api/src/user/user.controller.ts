import { Body, Controller, Post, Patch, Get, UsePipes, ValidationPipe, Param } from '@nestjs/common';
import { CreateUserDto } from './dtos/createUser.dto';
import { UserService } from './user.service';
import { UserEntity } from './entities/user.entity';
import { ReturnUserDto } from './dtos/returnUser.dto';
import path from 'path';
import { UserId } from 'src/decorators/user-id.decorator';
import { UpdatePasswordDTO } from './dtos/update-password.dto';

@Controller('user')
export class UserController {
    constructor(private readonly userService: UserService) {}

    @UsePipes(ValidationPipe)
    @Post()
    async createUser(@Body() createUser: CreateUserDto): Promise<UserEntity> {
        return this.userService.createUser(createUser);
    }

    @Get()
    async getAllUser(): Promise<ReturnUserDto[]> {
      return (await this.userService.getAllUser()).map(
        (userEntity) => new ReturnUserDto(userEntity),
      );
    }

    @Get('/:userId')
    async getUserById(@Param('userId') userId: number): Promise<ReturnUserDto> {
      return new ReturnUserDto(
        await this.userService.getUserByIdUsingRelations(userId),
      );
    }

    @Patch()
    @UsePipes(ValidationPipe)
    async updatePasswordUser(
      @Body() updatePasswordDTO: UpdatePasswordDTO,
      @UserId() userId: number,
    ): Promise<UserEntity> {
      return this.userService.updatePasswordUser(updatePasswordDTO, userId);
    }
    
}
