/** biome-ignore-all lint/complexity/noStaticOnlyClass: <explanation> */
import type { ApodResponseDto } from './dtos/response.dto';
import type { ApodInterface } from './interfaces/nasa.apod.interfaces';

export class ApodMapper {
  static toDto(data: ApodInterface): ApodResponseDto {
    return {
      date: data.date,
      title: data.title,
      description: data.explanation,
      mediaType: data.media_type,
      hdUrl: data.hdurl,
      serviceVersion: data.service_version,
      url: data.url,
      copyright: data.copyright,
    };
  }
}
