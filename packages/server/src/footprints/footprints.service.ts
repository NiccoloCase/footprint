import { Injectable, BadRequestException } from '@nestjs/common';
import { AddFootprintDTO, GetNearFootprintsDTO } from './footprints.dto';
import { LocationType } from '../graphql';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { IFootprintModel, IFootprint } from './footprints.schema';
import { IUser } from '../users/users.schema';

@Injectable()
export class FootprintsService {
  constructor(
    @InjectModel('Footprint')
    private readonly footprintModel: Model<IFootprintModel>,
  ) {}

  async findFootprintById(id: string): Promise<IFootprint> {
    try {
      const footprint = await this.footprintModel.findById(id);
      return footprint;
    } catch (err) {
      throw new BadRequestException();
    }
  }

  async createNew(
    payload: AddFootprintDTO,
    author: IUser,
  ): Promise<IFootprint> {
    const { title, body, coordinates, media } = payload;

    const data = {
      authorId: author.id,
      title,
      body,
      media,
      location: { coordinates, type: LocationType.Point },
    };

    try {
      const newFootprint = await this.footprintModel.create(data);
      return newFootprint;
    } catch (err) {
      throw new BadRequestException(err);
    }
  }

  async findNearFootprints(
    payload: GetNearFootprintsDTO,
  ): Promise<IFootprint[]> {
    const { lat, lng } = payload;
    const maxDistance = payload.maxDistance || 50;
    const minDistance = payload.minDistance || 0;

    const query = {
      location: {
        $nearSphere: {
          $geometry: {
            type: 'Point',
            coordinates: [lng, lat],
          },
          $minDistance: minDistance,
          $maxDistance: maxDistance,
        },
      },
    };

    return await this.footprintModel.find(query);
  }
}
