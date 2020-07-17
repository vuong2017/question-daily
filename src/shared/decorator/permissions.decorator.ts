import { SetMetadata } from '@nestjs/common';

export const Permissions = (roles: number[]) => SetMetadata('roles', roles);