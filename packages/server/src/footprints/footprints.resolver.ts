import {
  Resolver,
  Mutation,
  Query,
  Args,
  ResolveField,
  Parent,
} from '@nestjs/graphql';
import { AddFootprintDTO, GetNearFootprintsDTO } from './footprints.dto';
import { FootprintsService } from './footprints.service';
import { Private } from '../auth/auth.guard';
import { CurrentUser } from '../users/user.decorator';
import { IUser } from '../users/users.schema';
import { Footprint } from '../graphql';
import { UsersService } from '../users/users.service';
import { NotFoundException } from '@nestjs/common';

@Resolver('Footprint')
export class FootprintsResolver {
  constructor(
    private readonly footprintsService: FootprintsService,
    private readonly userService: UsersService,
  ) {}

  // RESTITUISCE IL FOOTPRINT ASSOCIATOA UN DETERMINATO ID
  @Query()
  async getFootprintById(@Args('id') id: string) {
    const footprint = await this.footprintsService.findFootprintById(id);
    if (!footprint) throw new NotFoundException('Footprint does not exist');
    return footprint;
  }

  // RESTITUISCE IL FOOPRINT VICINI A UN PUNTO GEOGRAFICO
  @Query()
  getNearFootprints(@Args() payload: GetNearFootprintsDTO) {
    return this.footprintsService.findNearFootprints(payload);
  }

  // RESTITUISCE I FOOTPRINT DI UN UTENTE
  @Query()
  getFootprintsByUser(@Args('userId') user: string) {
    return this.footprintsService.findFootprintsByAuthor(user);
  }

  // CREA UN NOVO FOOTPRINT
  @Mutation()
  @Private()
  async addFootprint(
    @Args() args: AddFootprintDTO,
    @CurrentUser() user: IUser,
  ) {
    return await this.footprintsService.createNew(args, user);
  }

  // RECUPERA L'AUTORE DI UN FOOTPRINT
  @ResolveField('author')
  author(@Parent() footprint: Footprint) {
    // TODO -> limitare il doc
    return this.userService.getUserById(footprint.authorId);
  }
}
