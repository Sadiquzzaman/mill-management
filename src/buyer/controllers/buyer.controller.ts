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
import { BuyerDto, BuyerSearchDto } from 'src/common/dtos/buyer/buyer.dto';
import { SUPERADMIN_ADMIN } from 'src/common/enums/role-name.enum';
import { AuthWithRoles } from '../../common/decorators/auth-guard.decorator';
import { PaginationDecorator } from '../../common/decorators/pagination.decorator';
import { PaginationDTO } from '../../common/dtos/pagination/pagination.dto';
import { ResponseDto } from '../../common/dtos/reponse/response.dto';
import { DtoValidationPipe } from '../../common/pipes/dto-validation.pipe';
import { UuidValidationPipe } from '../../common/pipes/uuid-validation.pipe';
import { RequestService } from '../../common/services/request.service';
import { ResponseService } from '../../common/services/response.service';
import { BuyerService } from '../services/buyer.service';

@ApiTags('buyers')
@Controller('buyer')
export class BuyerController {
  constructor(
    private buyerService: BuyerService,
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
    const buyers = this.buyerService.findAll();
    return this.responseService.toDtosResponse(HttpStatus.OK, null, buyers);
  }

  @ApiOkResponse({
    status: HttpStatus.OK,
    description: 'Buyer list in pagination',
  })
  @HttpCode(HttpStatus.OK)
  @AuthWithRoles([...SUPERADMIN_ADMIN])
  @Get('pagination')
  pagination(
    @PaginationDecorator() pagination: PaginationDTO,
    @Query() buyerSearchDto: BuyerSearchDto,
  ): Promise<ResponseDto> {
    const buyers = this.buyerService.pagination(
      pagination.page,
      pagination.limit,
      pagination.sort as 'DESC' | 'ASC',
      pagination.order,
      buyerSearchDto,
    );
    return this.responseService.toPaginationResponse(
      HttpStatus.OK,
      'Buyer list in pagination',
      pagination.page,
      pagination.limit,
      buyers,
    );
  }

  // @UseGuards(new EditorGuard())
  @ApiCreatedResponse({
    description: 'A new buyer is created',
  })
  @AuthWithRoles([...SUPERADMIN_ADMIN])
  @ApiBody({ type: BuyerDto })
  @HttpCode(HttpStatus.CREATED)
  @Post()
  create(
    @Body(
      new DtoValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: true,
      }),
    )
    buyerDto: BuyerDto,
  ): Promise<ResponseDto> {
    const modifiedDto = this.requestService.forCreate(buyerDto);
    const buyer = this.buyerService.create(modifiedDto);
    return this.responseService.toDtoResponse(
      HttpStatus.CREATED,
      'A new buyer is created',
      buyer,
    );
  }

  // @UseGuards(new EditorGuard())
  @ApiOkResponse({
    description: 'Buyer has been updated',
  })
  @ApiBody({ type: BuyerDto })
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
    buyerDto: BuyerDto,
  ): Promise<ResponseDto> {
    const modifiedDto = this.requestService.forUpdate(buyerDto);
    const buyer = this.buyerService.update(id, modifiedDto);
    return this.responseService.toDtoResponse(
      HttpStatus.OK,
      'Buyer has been updated',
      buyer,
    );
  }

  // @UseGuards(new EditorGuard())
  @ApiOkResponse({
    status: HttpStatus.OK,
    description: 'Buyer successfully deleted!',
  })
  @HttpCode(HttpStatus.OK)
  @AuthWithRoles([...SUPERADMIN_ADMIN])
  @Delete(':id')
  remove(
    @Param('id', new UuidValidationPipe()) id: string,
  ): Promise<ResponseDto> {
    const deleted = this.buyerService.remove(id);
    return this.responseService.toResponse(
      HttpStatus.OK,
      'Buyer successfully deleted!',
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
    const buyer = this.buyerService.findById(id);
    return this.responseService.toDtoResponse(HttpStatus.OK, null, buyer);
  }
}
