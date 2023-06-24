import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  Put,
  Query,
} from '@nestjs/common';
import {
  ApiBody,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiTags,
} from '@nestjs/swagger';
import { CreateSellDto } from 'src/common/dtos/sell/create/create-sell.dto';
import { SellSearchDto } from 'src/common/dtos/sell/sell.dto';
import { SUPERADMIN_ADMIN } from 'src/common/enums/role-name.enum';
import { AuthWithRoles } from '../../common/decorators/auth-guard.decorator';
import { PaginationDecorator } from '../../common/decorators/pagination.decorator';
import { PaginationDTO } from '../../common/dtos/pagination/pagination.dto';
import { ResponseDto } from '../../common/dtos/reponse/response.dto';
import { DtoValidationPipe } from '../../common/pipes/dto-validation.pipe';
import { UuidValidationPipe } from '../../common/pipes/uuid-validation.pipe';
import { RequestService } from '../../common/services/request.service';
import { ResponseService } from '../../common/services/response.service';
import { SellService } from '../services/sell.service';

@ApiTags('sells')
@Controller('sell')
export class SellController {
  constructor(
    private sellService: SellService,
    private readonly responseService: ResponseService,
    private readonly requestService: RequestService,
  ) {}

  @ApiOkResponse({
    status: HttpStatus.OK,
    description: '',
  })
  @HttpCode(HttpStatus.OK)
  @Get()
  // @AuthWithRoles([...SUPERADMIN_ADMIN])
  findAll(): Promise<ResponseDto> {
    const sells = this.sellService.findAll();
    return this.responseService.toDtosResponse(HttpStatus.OK, null, sells);
  }

  @ApiOkResponse({
    status: HttpStatus.OK,
    description: 'Sell list in pagination',
  })
  @HttpCode(HttpStatus.OK)
  @AuthWithRoles([...SUPERADMIN_ADMIN])
  @Get('pagination')
  pagination(
    @PaginationDecorator() pagination: PaginationDTO,
    @Query() sellSearchDto: SellSearchDto,
  ): Promise<ResponseDto> {
    const sells = this.sellService.pagination(
      pagination.page,
      pagination.limit,
      pagination.sort as 'DESC' | 'ASC',
      pagination.order,
      sellSearchDto,
    );
    return this.responseService.toPaginationResponse(
      HttpStatus.OK,
      'Sell list in pagination',
      pagination.page,
      pagination.limit,
      sells,
    );
  }

  // @UseGuards(new EditorGuard())
  @ApiCreatedResponse({
    description: 'A new sell is created',
  })
  @AuthWithRoles([...SUPERADMIN_ADMIN])
  @ApiBody({ type: CreateSellDto })
  @HttpCode(HttpStatus.CREATED)
  @Post()
  create(
    @Body(
      new DtoValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: true,
      }),
    )
    createSellDto: CreateSellDto,
  ): Promise<ResponseDto> {
    const modifiedDto = this.requestService.forCreate(createSellDto);
    const sell = this.sellService.create(modifiedDto);
    return this.responseService.toDtoResponse(
      HttpStatus.CREATED,
      'A new sell is created',
      sell,
    );
  }

  // @UseGuards(new EditorGuard())
  @ApiOkResponse({
    description: 'Sell has been updated',
  })
  @ApiBody({ type: CreateSellDto })
  @HttpCode(HttpStatus.OK)
  @Put(':id')
  @AuthWithRoles([...SUPERADMIN_ADMIN])
  update(
    @Param('id', new UuidValidationPipe()) id: string,
    @Body(
      new DtoValidationPipe({
        skipMissingProperties: true,
        whitelist: true,
        forbidNonWhitelisted: true,
      }),
    )
    createSellDto: CreateSellDto,
  ): Promise<ResponseDto> {
    const modifiedDto = this.requestService.forUpdate(createSellDto);
    const sell = this.sellService.update(id, modifiedDto);
    return this.responseService.toDtoResponse(
      HttpStatus.OK,
      'Sell has been updated',
      sell,
    );
  }

  // @UseGuards(new EditorGuard())
  @ApiOkResponse({
    status: HttpStatus.OK,
    description: 'Sell successfully deleted!',
  })
  @HttpCode(HttpStatus.OK)
  @AuthWithRoles([...SUPERADMIN_ADMIN])
  @Delete(':id')
  remove(
    @Param('id', new UuidValidationPipe()) id: string,
  ): Promise<ResponseDto> {
    const deleted = this.sellService.remove(id);
    return this.responseService.toResponse(
      HttpStatus.OK,
      'Sell successfully deleted!',
      deleted,
    );
  }

  @ApiOkResponse({
    status: HttpStatus.OK,
    description: '',
  })
  @HttpCode(HttpStatus.OK)
  @AuthWithRoles([...SUPERADMIN_ADMIN])
  @Get(':id')
  findById(
    @Param('id', new UuidValidationPipe()) id: string,
  ): Promise<ResponseDto> {
    const sell = this.sellService.findById(id);
    return this.responseService.toDtoResponse(HttpStatus.OK, null, sell);
  }
}
