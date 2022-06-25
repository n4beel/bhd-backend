import { Body, Controller, Post, Req } from '@nestjs/common';
import { UserService } from './user.service';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post('/isInitial')
  async isInitial(@Body('address') address: string) {
    try {
      const res = await this.userService.isInitial(address);
      return { result: res };
    } catch (error) {
      return error;
    }
  }

  @Post('/createUser')
  async createUser(@Req() req: any) {
    try {
      const res = await this.userService.createUser(req.body);
      return { result: res };
    } catch (error) {
      return error;
    }
  }

  @Post('/updateUser')
  async updateUser(@Req() req: any) {
    try {
      const res = await this.userService.updateUser(req.body);
      return { result: res };
    } catch (error) {
      return error;
    }
  }
}
