import { applyDecorators, UseGuards } from '@nestjs/common';
import { AuthGuard } from './auth.guard';

export function Secured() {
  return applyDecorators(UseGuards(AuthGuard));
}
