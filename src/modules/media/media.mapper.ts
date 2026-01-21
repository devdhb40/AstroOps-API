/** biome-ignore-all lint/complexity/noThisInStatic: <explanation> */
import type {
  NasaSearchResponse,
  NasaMediaItem,
  NasaMediaData,
} from './interfaces/nasa-media-search.interface';
import type {
  MediaSearchResponseDto,
  MediaItemDto,
} from './dtos/media-response.dto';

export class MediaMapper {
  static toDto(
    raw: NasaSearchResponse,
    page: number,
    limit: number,
  ): Omit<MediaSearchResponseDto, 'cached'> {
    const items: MediaItemDto[] = raw.collection.items.map(
      (item: NasaMediaItem) => this.toMediaItemDto(item),
    );

    const totalHits = raw.collection.metadata?.total_hits ?? 0;
    const totalPages = Math.ceil(totalHits / limit);

    return {
      totalHits,
      entities: items,
      pagination: {
        page,
        limit,
        total: totalHits,
        totalPages,
      },
    };
  }

  private static toMediaItemDto(item: NasaMediaItem): MediaItemDto {
    const data: NasaMediaData = item.data[0];

    const thumbnailLink = item.links?.find(
      (link) => link.rel === 'preview' || link.render === 'image',
    );

    const mediaLink =
      item.links?.find(
        (link) => link.render === 'image' || link.render === 'video',
      ) || item.links?.[0];

    return {
      mediaType: data.media_type as 'image' | 'video',
      nasaId: data.nasa_id,
      title: data.title,
      description: data.description || '',
      dateCreated: data.date_created,
      thumbnailUrl: thumbnailLink?.href,
      url: mediaLink?.href || '',
      center: data.center,
      keywords: data.keywords,
      photographer: data.photographer,
      location: data.location,
    };
  }
}
