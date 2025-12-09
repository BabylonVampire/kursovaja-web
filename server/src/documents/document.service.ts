import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import * as pdf from 'html-pdf';
import * as htmlDocx from 'html-docx-js';
import { CreateDocumentDto } from './dto/CreateDocument.dto';
import { Document } from './models/document.model';
import { UpdateDocumentDto } from './dto/UpdateDocument.dto';

@Injectable()
export class DocumentsService {
  constructor(@InjectModel(Document) private documentModel: typeof Document) {}

  async create(createDocumentDto: CreateDocumentDto) {
    return this.documentModel.create({
      ...createDocumentDto,
    });
  }

  async findAll() {
    return this.documentModel.findAll({});
  }

  async getAllCurrentUserDocuments(userId: string) {
    return this.documentModel.findAll({
      where: {
        userId,
      },
    });
  }

  async findOne(id: string) {
    return this.documentModel.findOne({
      where: { id },
    });
  }

  async update(id: string, updateDocumentDto: UpdateDocumentDto) {
    const [affectedCount] = await this.documentModel.update(updateDocumentDto, {
      where: { id },
    });
    if (affectedCount === 0) {
      return null;
    }
    return this.documentModel.findByPk(id);
  }

  async remove(id: number) {
    const document = await this.documentModel.findOne({
      where: { id },
    });
    if (!document) {
      return null;
    }
    await document.destroy();
    return document;
  }

  private async validateHtml(html: string): Promise<string> {
    // Удаляем все опасные/неподдерживаемые теги и атрибуты
    const sanitized = html
      .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
      .replace(/ style="[^"]*"/g, '')
      .replace(/ data-[^=]+="[^"]*"/g, '')
      .replace(/<mark\b[^>]*>/g, '<span style="background-color: yellow">')
      .replace(/<\/mark>/g, '</span>')
      .replace(/var\([^)]*\)/g, '');

    // Добавляем базовую HTML-структуру
    return `<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <style>
    body { font-family: Arial, sans-serif; line-height: 1.6; padding: 20px; }
    h1, h2, h3 { color: #2c3e50; margin-top: 1.5em; }
    p { margin: 0.5em 0; }
    code { background: #f4f4f4; padding: 2px 5px; border-radius: 3px; }
    img { max-width: 100%; height: auto; }
    blockquote { 
      border-left: 3px solid #eee;
      padding-left: 15px;
      color: #666;
      margin-left: 0;
    }
  </style>
</head>
<body>
  ${sanitized}
</body>
</html>`;
  }

  async convertToPdf(html: string): Promise<Buffer> {
    try {
      const cleanedHtml = await this.validateHtml(html);

      //   const options = {
      //     format: 'A4',
      //     border: '20mm',
      //     timeout: 30000,
      //     phantomPath: process.env.PHANTOMJS_PATH || undefined,
      //   };

      const document: Buffer<ArrayBufferLike> = await new Promise((resolve, reject) => {
        pdf.create(cleanedHtml).toBuffer((err, buffer) => {
          if (err) {
            console.error('PDF generation error:', err);
            reject(new HttpException('Failed to generate PDF', HttpStatus.BAD_REQUEST));
          } else {
            // Валидация PDF
            if (buffer.length < 100) {
              reject(new HttpException('Invalid PDF generated', HttpStatus.BAD_REQUEST));
            } else {
              resolve(buffer);
            }
          }
        });
      });

      console.log(document);

      return document;
    } catch (error) {
      console.error('PDF conversion error:', error);
      throw new Error('Failed to convert to PDF');
    }
  }

  async convertToDocx(html: string): Promise<Buffer> {
    try {
      const cleanedHtml = await this.validateHtml(html);

      const docx = htmlDocx.asBlob(cleanedHtml, {
        orientation: 'portrait',
        margins: { top: 1000, right: 1000, bottom: 1000, left: 1000 },
      });

      const buffer = Buffer.from(await docx.arrayBuffer());

      // Простая валидация DOCX
      if (buffer.length < 100) {
        throw new Error('Invalid DOCX generated');
      }

      return buffer;
    } catch (error) {
      console.error('DOCX conversion error:', error);
      throw new Error('Failed to convert to DOCX');
    }
  }

  async convertToLatex(html: string): Promise<string> {
    return `\\documentclass{article}
\\begin{document}
${this.htmlToLatex(html)}
\\end{document}`;
  }

  private htmlToLatex(html: string): string {
    let latex = html;

    // Заголовки
    latex = latex.replace(/<h1[^>]*>(.*?)<\/h1>/g, '\\section{$1}');
    latex = latex.replace(/<h2[^>]*>(.*?)<\/h2>/g, '\\subsection{$1}');
    latex = latex.replace(/<h3[^>]*>(.*?)<\/h3>/g, '\\subsubsection{$1}');

    // Жирный и курсив
    latex = latex.replace(/<strong[^>]*>(.*?)<\/strong>/g, '\\textbf{$1}');
    latex = latex.replace(/<b[^>]*>(.*?)<\/b>/g, '\\textbf{$1}');
    latex = latex.replace(/<em[^>]*>(.*?)<\/em>/g, '\\emph{$1}');
    latex = latex.replace(/<i[^>]*>(.*?)<\/i>/g, '\\emph{$1}');

    // Списки
    latex = latex.replace(/<ul[^>]*>(.*?)<\/ul>/gs, '\\begin{itemize}\n$1\\end{itemize}');
    latex = latex.replace(/<ol[^>]*>(.*?)<\/ol>/gs, '\\begin{enumerate}\n$1\\end{enumerate}');
    latex = latex.replace(/<li[^>]*>(.*?)<\/li>/g, '  \\item $1\n');

    // Картинки
    latex = latex.replace(
      /<img[^>]*src="([^"]*)"[^>]*>/g,
      '\\includegraphics[width=\\textwidth]{$1}',
    );

    // Ссылки
    latex = latex.replace(/<a[^>]*href="([^"]*)"[^>]*>(.*?)<\/a>/g, '\\href{$1}{$2}');

    // Удаление остальных тегов
    latex = latex.replace(/<[^>]*>/g, '');

    // Экранирование специальных символов LaTeX
    const specialChars = ['#', '$', '%', '&', '~', '_', '^', '{', '}', '\\'];
    specialChars.forEach((char) => {
      latex = latex.split(char).join(`\\${char}`);
    });

    return latex;
  }
}
