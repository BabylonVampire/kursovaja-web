import { Injectable } from '@nestjs/common';
import { ensureDir, writeFile } from 'fs-extra';
import { join } from 'path';
import * as uuid from 'uuid';

@Injectable()
export class FilesService {
  async uploadFile(file): Promise<string> {
    const uploadFolder = join(process.cwd(), 'static', 'uploads');
    await ensureDir(uploadFolder);

    const fileExt = file.originalname.split('.').pop();
    const fileName = `${uuid.v4()}.${fileExt}`;
    const filePath = join(uploadFolder, fileName);

    await writeFile(filePath, file.buffer);

    return `/uploads/${fileName}`;
  }
}
