import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';

import { Document } from './models/document.model';
import { DocumentsService } from './document.service';
import { DocumentsController } from './document.controller';

@Module({
  imports: [SequelizeModule.forFeature([Document])],
  providers: [DocumentsService],
  controllers: [DocumentsController],
  exports: [DocumentsService],
})
export class DocumentModule {}
