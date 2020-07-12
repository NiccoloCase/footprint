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

@Resolver('Footprint')
export class FootprintsResolver {
  constructor(
    private readonly footprintsService: FootprintsService,
    private readonly userService: UsersService,
  ) {}

  // RESTITUISCE IL FOOTPRINT ASSOCIATOA UN DETERMINATO ID
  @Query()
  getFootprintById(@Args('id') id: string) {
    return this.footprintsService.findFootprintById(id);
  }

  // RESTITUISCE IL FOOTPRINT ASSOCIATOA UN DETERMINATO ID
  @Query()
  getNearFootprints(@Args() payload: GetNearFootprintsDTO) {
    return this.footprintsService.findNearFootprints(payload);
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
