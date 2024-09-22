import { MiddlewareConsumer, Module, NestModule, RequestMethod } from '@nestjs/common';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { PrismaModule } from 'src/prsima/prisma.module';
import { JwtTokenModule } from 'src/jwt/jwt.module';
import { SuperAdminMiddleware } from 'src/middleware/superadmin.middleware';
import { AdminMiddleware } from 'src/middleware/admin.middleware';
import { AuthMiddleware } from 'src/middleware/auth.middleware';

@Module({
  imports: [PrismaModule, JwtTokenModule],
  controllers: [UsersController],
  providers: [UsersService],
})
export class UsersModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer

      .apply(AuthMiddleware)
      .exclude({ path: '/users/auth/login', method: RequestMethod.ALL })
      .exclude({ path: '/users/auth/register', method: RequestMethod.ALL })
      .exclude({ path: '/users/auth/logout', method: RequestMethod.ALL })

      .forRoutes({ path: '/users/*', method: RequestMethod.ALL })

      .apply(SuperAdminMiddleware)
      .forRoutes({ path: '/users/superadmin', method: RequestMethod.GET })

      .apply(AdminMiddleware)
      .forRoutes({ path: '/users/admin', method: RequestMethod.GET });
  }
}
