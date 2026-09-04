import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ClubesModule } from './clubes/clubes.module';

@Module({
  imports: [ClubesModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
