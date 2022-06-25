import { Body, Controller, Get, Post, Query, Req } from '@nestjs/common';
import { CommentService } from './comment.service';

@Controller('comment')
export class CommentController {
  constructor(private readonly commentService: CommentService) {}

  @Get('')
  async getComments(@Query('report') report: string) {
    try {
      const res = await this.commentService.getComments(report);
      return { result: res };
    } catch (error) {
      return error;
    }
  }

  @Post('/createComment')
  async createComment(@Req() req: any) {
    try {
      const res = await this.commentService.createComment(req.body);
      return { result: res };
    } catch (error) {
      return error;
    }
  }

  @Post('/updateComment')
  async updateComment(@Req() req: any) {
    try {
      const res = await this.commentService.updateComment(req.body);
      return { result: res };
    } catch (error) {
      return error;
    }
  }

  @Post('/deleteComment')
  async deleteComment(@Body('id') id: string) {
    try {
      const res = await this.commentService.deleteComment(id);
      return { result: res };
    } catch (error) {
      return error;
    }
  }
}
