import { Body, Controller, Delete, Get, Param, ParseIntPipe, Post, Put, Res } from '@nestjs/common';
import { Response } from 'express';
import { DocumentsService } from './document.service';
import { CreateDocumentDto } from './dto/CreateDocument.dto';
import { UpdateDocumentDto } from './dto/UpdateDocument.dto';

@Controller('/documents')
export class DocumentsController {
  constructor(private readonly documentsService: DocumentsService) {}

  @Post()
  async create(@Body() createDocumentDto: CreateDocumentDto) {
    return this.documentsService.create(createDocumentDto);
  }

  @Get()
  async findAll() {
    return this.documentsService.findAll();
  }

  @Get('/by-user/:userId')
  async getAllCurrentUserDocuments(@Param('userId') userId: string) {
    return this.documentsService.getAllCurrentUserDocuments(userId);
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.documentsService.findOne(id);
  }

  @Put(':id')
  async update(@Param('id') id: string, @Body() updateDocumentDto: UpdateDocumentDto) {
    return this.documentsService.update(id, updateDocumentDto);
  }

  @Delete(':id')
  async remove(@Param('id', ParseIntPipe) id: number) {
    return this.documentsService.remove(id);
  }

  @Post('convert')
  async convert(@Body() body: { content: string; format: 'pdf' | 'docx' }, @Res() res: Response) {
    try {
      let buffer: Buffer;
      let contentType: string;
      let filename: string;

      if (body.format === 'pdf') {
        buffer = await this.documentsService.convertToPdf(body.content);
        contentType = 'application/pdf';
        filename = 'document.pdf';
      } else {
        buffer = await this.documentsService.convertToDocx(body.content);
        contentType = 'application/vnd.openxmlformats-officedocument.wordprocessingml.document';
        filename = 'document.docx';
      }

      // Правильная отправка файла
      res.setHeader('Content-Type', contentType);
      res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
      res.setHeader('Content-Length', buffer.length);

      // Отправляем буфер напрямую
      res.end(buffer);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
}
