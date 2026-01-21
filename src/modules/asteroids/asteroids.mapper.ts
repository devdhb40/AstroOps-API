/** biome-ignore-all lint/complexity/noStaticOnlyClass: <explanation> */
import type {
  NasaAsteroidsResponse,
  NasaAsteroid,
} from './interfaces/nasa-asteroids.interface';
import type { AsteroidResponseDto } from './dtos/asteroid-response.dto';

export class AsteroidsMapper {
  static toDto(data: NasaAsteroidsResponse): AsteroidResponseDto[] {
    const asteroids: AsteroidResponseDto[] = [];

    for (const [currentDate, asteroidsArray] of Object.entries(
      data.near_earth_objects,
    )) {
      for (const asteroid of asteroidsArray) {
        asteroids.push(this.mapSingleAsteroid(asteroid, currentDate));
      }
    }

    return asteroids;
  }

  private static mapSingleAsteroid(
    asteroid: NasaAsteroid,
    date: string,
  ): AsteroidResponseDto {
    const closeApproach = asteroid.close_approach_data[0];

    return {
      id: asteroid.id,
      name: asteroid.name,
      date: date,
      estimatedDiameterKm: {
        min: asteroid.estimated_diameter.kilometers.estimated_diameter_min,
        max: asteroid.estimated_diameter.kilometers.estimated_diameter_max,
      },
      isPotentiallyHazardous: asteroid.is_potentially_hazardous_asteroid,
      closeApproach: {
        distanceKm: closeApproach.miss_distance.kilometers,
        velocityKmh: closeApproach.relative_velocity.kilometers_per_hour,
      },
    };
  }
}
