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
import { CreateManuafactureDto } from 'src/common/dtos/manufacture/create/create-manufacture.dto';
import { ManufactureSearchDto } from 'src/common/dtos/manufacture/manufacture.dto';
import { SUPERADMIN_ADMIN } from 'src/common/enums/role-name.enum';
import { AuthWithRoles } from '../../common/decorators/auth-guard.decorator';
import { PaginationDecorator } from '../../common/decorators/pagination.decorator';
import { PaginationDTO } from '../../common/dtos/pagination/pagination.dto';
import { ResponseDto } from '../../common/dtos/reponse/response.dto';
import { DtoValidationPipe } from '../../common/pipes/dto-validation.pipe';
import { UuidValidationPipe } from '../../common/pipes/uuid-validation.pipe';
import { RequestService } from '../../common/services/request.service';
import { ResponseService } from '../../common/services/response.service';
import { ManufactureService } from '../services/manufacture.service';

@ApiTags('manufactures')
@Controller('manufacture')
export class ManufactureController {
  constructor(
    private manufactureService: ManufactureService,
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
    const manufactures = this.manufactureService.findAll();
    return this.responseService.toDtosResponse(
      HttpStatus.OK,
      null,
      manufactures,
    );
  }

  @ApiOkResponse({
    status: HttpStatus.OK,
    description: 'Manufactures list in pagination',
  })
  @HttpCode(HttpStatus.OK)
  @AuthWithRoles([...SUPERADMIN_ADMIN])
  @Get('pagination')
  pagination(
    @PaginationDecorator() pagination: PaginationDTO,
    @Query() manufactureSearchDto: ManufactureSearchDto,
  ): Promise<ResponseDto> {
    const manufactures = this.manufactureService.pagination(
      pagination.page,
      pagination.limit,
      pagination.sort as 'DESC' | 'ASC',
      pagination.order,
      manufactureSearchDto,
    );
    return this.responseService.toPaginationResponse(
      HttpStatus.OK,
      'Manufactures list in pagination',
      pagination.page,
      pagination.limit,
      manufactures,
    );
  }

  // @UseGuards(new EditorGuard())
  @ApiCreatedResponse({
    description: 'A new manufacture is created',
  })
  @AuthWithRoles([...SUPERADMIN_ADMIN])
  @ApiBody({ type: CreateManuafactureDto })
  @HttpCode(HttpStatus.CREATED)
  @Post()
  create(
    @Body(
      new DtoValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: true,
      }),
    )
    createManuafactureDto: CreateManuafactureDto,
  ): Promise<ResponseDto> {
    const modifiedDto = this.requestService.forCreate(createManuafactureDto);
    const manufacture = this.manufactureService.create(modifiedDto);
    return this.responseService.toDtoResponse(
      HttpStatus.CREATED,
      'A new manufacture is created',
      manufacture,
    );
  }

  // @UseGuards(new EditorGuard())
  @ApiOkResponse({
    description: 'Manufacture has been updated',
  })
  @ApiBody({ type: CreateManuafactureDto })
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
    createManuafactureDto: CreateManuafactureDto,
  ): Promise<ResponseDto> {
    const modifiedDto = this.requestService.forUpdate(createManuafactureDto);
    const manufacture = this.manufactureService.update(id, modifiedDto);
    return this.responseService.toDtoResponse(
      HttpStatus.OK,
      'Manufacture has been updated',
      manufacture,
    );
  }

  // @UseGuards(new EditorGuard())
  @ApiOkResponse({
    status: HttpStatus.OK,
    description: 'Manufacture successfully deleted!',
  })
  @HttpCode(HttpStatus.OK)
  @AuthWithRoles([...SUPERADMIN_ADMIN])
  @Delete(':id')
  remove(
    @Param('id', new UuidValidationPipe()) id: string,
  ): Promise<ResponseDto> {
    const deleted = this.manufactureService.remove(id);
    return this.responseService.toResponse(
      HttpStatus.OK,
      'Manufactures successfully deleted!',
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
    const manufacture = this.manufactureService.findById(id);
    return this.responseService.toDtoResponse(HttpStatus.OK, null, manufacture);
  }
}
