import { HttpException, Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { FileUpload } from 'graphql-upload';
import { createWriteStream, existsSync, mkdirSync } from 'fs';
import { join } from 'path';
import * as dayjs from 'dayjs';

@Injectable()
export abstract class UploadFileService<T> {
  private readonly tableName: string;

  protected constructor(private readonly repository: Repository<T>) {
    this.tableName = repository.metadata.tableName;
  }

  async uploadImage(targetId: string, file: FileUpload) {
    try {
      const path = join(
        __dirname,
        '..',
        '..',
        '..',
        'public',
        'images',
        `${this.tableName}`,
      );
      const findDir = existsSync(path);
      if (!findDir) {
        mkdirSync(path);
      }
      const imageUrl = `${this.tableName}${targetId}_${dayjs().unix()}.${
        file.mimetype.split('/')[1]
      }`;
      await file
        .createReadStream()
        .pipe(createWriteStream(join(path, imageUrl)));
      return imageUrl;
    } catch (e) {
      console.error(e);
      throw new HttpException(e.message, e.status);
    }
  }
}
