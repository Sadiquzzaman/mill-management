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
import { CreateLedgerDto } from 'src/common/dtos/ledger/create/create-ledger.dto';
import { LedgerSearchDto } from 'src/common/dtos/ledger/ledger.dto';
import { SUPERADMIN_ADMIN } from 'src/common/enums/role-name.enum';
import { AuthWithRoles } from '../../common/decorators/auth-guard.decorator';
import { PaginationDecorator } from '../../common/decorators/pagination.decorator';
import { PaginationDTO } from '../../common/dtos/pagination/pagination.dto';
import { ResponseDto } from '../../common/dtos/reponse/response.dto';
import { DtoValidationPipe } from '../../common/pipes/dto-validation.pipe';
import { UuidValidationPipe } from '../../common/pipes/uuid-validation.pipe';
import { RequestService } from '../../common/services/request.service';
import { ResponseService } from '../../common/services/response.service';
import { LedgerService } from '../services/ledger.service';

@ApiTags('ledgers')
@Controller('ledger')
export class LedgerController {
  constructor(
    private ledgerService: LedgerService,
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
    const ledgers = this.ledgerService.findAll();
    return this.responseService.toDtosResponse(HttpStatus.OK, null, ledgers);
  }

  @ApiOkResponse({
    status: HttpStatus.OK,
    description: 'Ledger list in pagination',
  })
  @HttpCode(HttpStatus.OK)
  @AuthWithRoles([...SUPERADMIN_ADMIN])
  @Get('pagination')
  pagination(
    @PaginationDecorator() pagination: PaginationDTO,
    @Query() ledgerSearchDto: LedgerSearchDto,
  ): Promise<ResponseDto> {
    const ledgers = this.ledgerService.pagination(
      pagination.page,
      pagination.limit,
      pagination.sort as 'DESC' | 'ASC',
      pagination.order,
      ledgerSearchDto,
    );
    return this.responseService.toPaginationResponse(
      HttpStatus.OK,
      'Ledger list in pagination',
      pagination.page,
      pagination.limit,
      ledgers,
    );
  }

  // @UseGuards(new EditorGuard())
  @ApiCreatedResponse({
    description: 'A new ledger is created',
  })
  @AuthWithRoles([...SUPERADMIN_ADMIN])
  @ApiBody({ type: CreateLedgerDto })
  @HttpCode(HttpStatus.CREATED)
  @Post()
  create(
    @Body(
      new DtoValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: true,
      }),
    )
    createLedgerDto: CreateLedgerDto,
  ): Promise<ResponseDto> {
    const modifiedDto = this.requestService.forCreate(createLedgerDto);
    const ledger = this.ledgerService.create(modifiedDto);
    return this.responseService.toDtoResponse(
      HttpStatus.CREATED,
      'A new ledger is created',
      ledger,
    );
  }

  // @UseGuards(new EditorGuard())
  @ApiOkResponse({
    description: 'Ledger has been updated',
  })
  @ApiBody({ type: CreateLedgerDto })
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
    createLedgerDto: CreateLedgerDto,
  ): Promise<ResponseDto> {
    const modifiedDto = this.requestService.forUpdate(createLedgerDto);
    const ledger = this.ledgerService.update(id, modifiedDto);
    return this.responseService.toDtoResponse(
      HttpStatus.OK,
      'Ledger has been updated',
      ledger,
    );
  }

  // @UseGuards(new EditorGuard())
  @ApiOkResponse({
    status: HttpStatus.OK,
    description: 'Ledger successfully deleted!',
  })
  @HttpCode(HttpStatus.OK)
  @AuthWithRoles([...SUPERADMIN_ADMIN])
  @Delete(':id')
  remove(
    @Param('id', new UuidValidationPipe()) id: string,
  ): Promise<ResponseDto> {
    const deleted = this.ledgerService.remove(id);
    return this.responseService.toResponse(
      HttpStatus.OK,
      'Ledger successfully deleted!',
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
    const ledger = this.ledgerService.findById(id);
    return this.responseService.toDtoResponse(HttpStatus.OK, null, ledger);
  }
}
