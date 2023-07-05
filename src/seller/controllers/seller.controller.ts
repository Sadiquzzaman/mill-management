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
import { SUPERADMIN_ADMIN } from 'src/common/enums/role-name.enum';
import { AuthWithRoles } from '../../common/decorators/auth-guard.decorator';
import { PaginationDecorator } from '../../common/decorators/pagination.decorator';
import { PaginationDTO } from '../../common/dtos/pagination/pagination.dto';
import { ResponseDto } from '../../common/dtos/reponse/response.dto';
import { DtoValidationPipe } from '../../common/pipes/dto-validation.pipe';
import { UuidValidationPipe } from '../../common/pipes/uuid-validation.pipe';
import { RequestService } from '../../common/services/request.service';
import { ResponseService } from '../../common/services/response.service';
import { SellerDto, SellerSearchDto } from 'src/common/dtos/seller/seller.dto';
import { SellerService } from '../services/seller.service';

@ApiTags('sellers')
@Controller('seller')
export class SellerController {
  constructor(
    private sellerService: SellerService,
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
    const sellers = this.sellerService.findAll();
    return this.responseService.toDtosResponse(HttpStatus.OK, null, sellers);
  }

  @ApiOkResponse({
    status: HttpStatus.OK,
    description: 'Seller list in pagination',
  })
  @HttpCode(HttpStatus.OK)
  @AuthWithRoles([...SUPERADMIN_ADMIN])
  @Get('pagination')
  pagination(
    @PaginationDecorator() pagination: PaginationDTO,
    @Query() sellerSearchDto: SellerSearchDto,
  ): Promise<ResponseDto> {
    const sellers = this.sellerService.pagination(
      pagination.page,
      pagination.limit,
      pagination.sort as 'DESC' | 'ASC',
      pagination.order,
      sellerSearchDto,
    );
    return this.responseService.toPaginationResponse(
      HttpStatus.OK,
      'Seller list in pagination',
      pagination.page,
      pagination.limit,
      sellers,
    );
  }

  // @UseGuards(new EditorGuard())
  @ApiCreatedResponse({
    description: 'A new seller is created',
  })
  @AuthWithRoles([...SUPERADMIN_ADMIN])
  @ApiBody({ type: SellerDto })
  @HttpCode(HttpStatus.CREATED)
  @Post()
  create(
    @Body(
      new DtoValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: true,
      }),
    )
    sellerDto: SellerDto,
  ): Promise<ResponseDto> {
    const modifiedDto = this.requestService.forCreate(sellerDto);
    const seller = this.sellerService.create(modifiedDto);
    return this.responseService.toDtoResponse(
      HttpStatus.CREATED,
      'A new seller is created',
      seller,
    );
  }

  // @UseGuards(new EditorGuard())
  @ApiOkResponse({
    description: 'Seller has been updated',
  })
  @ApiBody({ type: SellerDto })
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
    sellerDto: SellerDto,
  ): Promise<ResponseDto> {
    const modifiedDto = this.requestService.forUpdate(sellerDto);
    const seller = this.sellerService.update(id, modifiedDto);
    return this.responseService.toDtoResponse(
      HttpStatus.OK,
      'Seller has been updated',
      seller,
    );
  }

  // @UseGuards(new EditorGuard())
  @ApiOkResponse({
    status: HttpStatus.OK,
    description: 'Seller successfully deleted!',
  })
  @HttpCode(HttpStatus.OK)
  @AuthWithRoles([...SUPERADMIN_ADMIN])
  @Delete(':id')
  remove(
    @Param('id', new UuidValidationPipe()) id: string,
  ): Promise<ResponseDto> {
    const deleted = this.sellerService.remove(id);
    return this.responseService.toResponse(
      HttpStatus.OK,
      'Seller successfully deleted!',
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
    const seller = this.sellerService.findById(id);
    return this.responseService.toDtoResponse(HttpStatus.OK, null, seller);
  }
}
