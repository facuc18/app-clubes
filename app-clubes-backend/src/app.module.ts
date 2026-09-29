import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { DrizzleTursoModule } from '@knaadh/nestjs-drizzle-turso';
import { AppController } from './app.controller';
import { AuthModule } from './auth/auth.module';
import { AppService } from './app.service';
import { ClubesModule } from './clubes/clubes.module';
import * as schema from './db/schema';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    DrizzleTursoModule.register({
      tag: 'DB_DEV',
      turso: {
        config: {
          url: process.env.TURSO_DATABASE_URL!,
          authToken: process.env.TURSO_AUTH_TOKEN!,
        },
      },
      config: { schema: { ...schema } },
    }),
    ClubesModule,
    AuthModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}