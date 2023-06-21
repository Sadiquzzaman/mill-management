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
import {
  PurchaseDto,
  PurchaseSearchDto,
} from 'src/common/dtos/purchase/purchase.dto';
import { SUPERADMIN_ADMIN } from 'src/common/enums/role-name.enum';
import { AuthWithRoles } from '../../common/decorators/auth-guard.decorator';
import { PaginationDecorator } from '../../common/decorators/pagination.decorator';
import { PaginationDTO } from '../../common/dtos/pagination/pagination.dto';
import { ResponseDto } from '../../common/dtos/reponse/response.dto';
import { DtoValidationPipe } from '../../common/pipes/dto-validation.pipe';
import { UuidValidationPipe } from '../../common/pipes/uuid-validation.pipe';
import { RequestService } from '../../common/services/request.service';
import { ResponseService } from '../../common/services/response.service';
import { PurchaseService } from '../services/purchase.service';

@ApiTags('purchases')
@Controller('purchase')
export class PurchaseController {
  constructor(
    private purchaseService: PurchaseService,
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
    const purchases = this.purchaseService.findAll();
    return this.responseService.toDtosResponse(HttpStatus.OK, null, purchases);
  }

  @ApiOkResponse({
    status: HttpStatus.OK,
    description: 'Purchase list in pagination',
  })
  @HttpCode(HttpStatus.OK)
  @AuthWithRoles([...SUPERADMIN_ADMIN])
  @Get('pagination')
  pagination(
    @PaginationDecorator() pagination: PaginationDTO,
    @Query() purchaseSearchDto: PurchaseSearchDto,
  ): Promise<ResponseDto> {
    const purchases = this.purchaseService.pagination(
      pagination.page,
      pagination.limit,
      pagination.sort as 'DESC' | 'ASC',
      pagination.order,
      purchaseSearchDto,
    );
    return this.responseService.toPaginationResponse(
      HttpStatus.OK,
      'Purchase list in pagination',
      pagination.page,
      pagination.limit,
      purchases,
    );
  }

  // @UseGuards(new EditorGuard())
  @ApiCreatedResponse({
    description: 'A new purchase is created',
  })
  @AuthWithRoles([...SUPERADMIN_ADMIN])
  @ApiBody({ type: PurchaseDto })
  @HttpCode(HttpStatus.CREATED)
  @Post()
  create(
    @Body(
      new DtoValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: true,
      }),
    )
    purchaseDto: PurchaseDto,
  ): Promise<ResponseDto> {
    const modifiedDto = this.requestService.forCreate(purchaseDto);
    const purchase = this.purchaseService.create(modifiedDto);
    return this.responseService.toDtoResponse(
      HttpStatus.CREATED,
      'A new purchase is created',
      purchase,
    );
  }

  // @UseGuards(new EditorGuard())
  @ApiOkResponse({
    description: 'Purchase has been updated',
  })
  @ApiBody({ type: PurchaseDto })
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
    purchaseDto: PurchaseDto,
  ): Promise<ResponseDto> {
    const modifiedDto = this.requestService.forUpdate(purchaseDto);
    const purchase = this.purchaseService.update(id, modifiedDto);
    return this.responseService.toDtoResponse(
      HttpStatus.OK,
      'Purchase has been updated',
      purchase,
    );
  }

  // @UseGuards(new EditorGuard())
  @ApiOkResponse({
    status: HttpStatus.OK,
    description: 'Purchase successfully deleted!',
  })
  @HttpCode(HttpStatus.OK)
  @AuthWithRoles([...SUPERADMIN_ADMIN])
  @Delete(':id')
  remove(
    @Param('id', new UuidValidationPipe()) id: string,
  ): Promise<ResponseDto> {
    const deleted = this.purchaseService.remove(id);
    return this.responseService.toResponse(
      HttpStatus.OK,
      'Purchase successfully deleted!',
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
    const purchase = this.purchaseService.findById(id);
    return this.responseService.toDtoResponse(HttpStatus.OK, null, purchase);
  }
}
