import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateLedgerDto } from 'src/common/dtos/ledger/create/create-ledger.dto';
import { LedgerDto, LedgerSearchDto } from 'src/common/dtos/ledger/ledger.dto';
import { LedgerEntity } from 'src/common/entities/ledger.entity';
import { ActiveStatus } from 'src/common/enums/active.enum';
import { CustomerService } from 'src/customer/services/customer.service';
import { Repository } from 'typeorm';
import { DeleteDto } from '../../common/dtos/reponse/delete.dto';
import { SystemException } from '../../common/exceptions/system.exception';
import { ConversionService } from '../../common/services/conversion.service';
import { ExceptionService } from '../../common/services/exception.service';

@Injectable()
export class LedgerService {
  constructor(
    @InjectRepository(LedgerEntity)
    private readonly ledgerRepository: Repository<LedgerEntity>,
    private readonly conversionService: ConversionService,
    private readonly exceptionService: ExceptionService,
    private readonly customerService: CustomerService,
  ) {}

  async findAll(): Promise<LedgerDto[]> {
    try {
      const allLedgers = await this.ledgerRepository.find({
        where: { isActive: ActiveStatus.ACTIVE },
        relations: ['customer'],
      });
      return this.conversionService.toDtos<LedgerEntity, LedgerDto>(allLedgers);
    } catch (error) {
      throw new SystemException(error);
    }
  }

  async pagination(
    page: number,
    limit: number,
    sort: 'DESC' | 'ASC',
    order: string,
    ledgerSearchDto: LedgerSearchDto,
  ): Promise<[LedgerDto[], number]> {
    try {
      let customer;
      if (ledgerSearchDto.customerId) {
        customer = await this.customerService.getCustomerById(
          ledgerSearchDto.customerId,
        );
        if (!customer) {
          return [[], 0];
        }
      }

      const query = await this.ledgerRepository.createQueryBuilder('ledger');
      query.where({ isActive: ActiveStatus.ACTIVE });
      query.leftJoinAndSelect('ledger.customer', 'customer');

      if (ledgerSearchDto.customerId) {
        query.andWhere('customer.id = :userCustomerId', {
          userCustomerId: customer.id,
        });
      }

      sort = sort !== undefined ? (sort === 'ASC' ? 'ASC' : 'DESC') : 'DESC';

      const orderFields = [
        'previousLedger',
        'depositAmount',
        'createAt',
        'updatedAt',
      ];
      order =
        orderFields.findIndex((o) => o === order) > -1 ? order : 'updatedAt';
      query
        .orderBy(`ledger.${order}`, sort)
        .skip((page - 1) * limit)
        .take(limit);
      const [allLedger, count] = await query.getManyAndCount();

      const ledgers = await this.conversionService.toDtos<
        LedgerEntity,
        LedgerDto
      >(allLedger);

      return [ledgers, count];
    } catch (error) {
      throw new SystemException(error);
    }
  }

  async create(dto: CreateLedgerDto): Promise<LedgerDto> {
    try {
      const dtoToEntity = await this.conversionService.toEntity<
        LedgerEntity,
        LedgerDto
      >(dto);

      const customer = await this.customerService.getCustomerById(
        dto.customerId,
      );

      const ledger = this.ledgerRepository.create(dtoToEntity);
      ledger.customer = customer;
      ledger.remainingLedger = ledger.previousLedger - ledger.depositAmount;
      await this.ledgerRepository.save(ledger);
      return this.conversionService.toDto<LedgerEntity, LedgerDto>(ledger);
    } catch (error) {
      console.log(error);
      throw new SystemException(error);
    }
  }

  async update(id: string, dto: CreateLedgerDto): Promise<LedgerDto> {
    try {
      const saveDto = await this.getLedgerById(id);
      const dtoToEntity = await this.conversionService.toEntity<
        LedgerEntity,
        LedgerDto
      >({ ...saveDto, ...dto });

      const customer = await this.customerService.getCustomerById(
        dto.customerId,
      );

      dtoToEntity.customer = customer;

      const updatedLedger = await this.ledgerRepository.save(dtoToEntity, {
        reload: true,
      });
      return this.conversionService.toDto<LedgerEntity, LedgerDto>(
        updatedLedger,
      );
    } catch (error) {
      throw new SystemException(error);
    }
  }

  async remove(id: string): Promise<DeleteDto> {
    try {
      const saveDto = await this.getLedgerById(id);

      const deleted = await this.ledgerRepository.save({
        ...saveDto,
        isActive: ActiveStatus.INACTIVE,
      });
      return Promise.resolve(new DeleteDto(!!deleted));
    } catch (error) {
      throw new SystemException(error);
    }
  }

  async findById(id: string): Promise<LedgerDto> {
    try {
      const ledger = await this.getLedgerById(id);
      return this.conversionService.toDto<LedgerEntity, LedgerDto>(ledger);
    } catch (error) {
      throw new SystemException(error);
    }
  }

  /********************** Start checking relations of post ********************/

  async getLedgerById(id: string): Promise<LedgerEntity> {
    const ledger = await this.ledgerRepository.findOne({
      where: {
        id,
        isActive: ActiveStatus.ACTIVE,
      },
      relations: ['customer'],
    });
    this.exceptionService.notFound(ledger, 'Ledger Not Found!!');
    return ledger;
  }
  /*********************** End checking relations of post *********************/
}
