import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateSellDto } from 'src/common/dtos/sell/create/create-sell.dto';
import { SellDto, SellSearchDto } from 'src/common/dtos/sell/sell.dto';
import { SellEntity } from 'src/common/entities/sell.entity';
import { ActiveStatus } from 'src/common/enums/active.enum';
import { PurchaseService } from 'src/purchase/services/purchase.service';
import { Repository } from 'typeorm';
import { DeleteDto } from '../../common/dtos/reponse/delete.dto';
import { SystemException } from '../../common/exceptions/system.exception';
import { ConversionService } from '../../common/services/conversion.service';
import { ExceptionService } from '../../common/services/exception.service';

@Injectable()
export class SellService {
  constructor(
    @InjectRepository(SellEntity)
    private readonly sellRepository: Repository<SellEntity>,
    private readonly conversionService: ConversionService,
    private readonly exceptionService: ExceptionService,
    private readonly purchaseService: PurchaseService,
  ) {}

  async findAll(): Promise<SellDto[]> {
    try {
      const allSells = await this.sellRepository.find({
        where: { isActive: ActiveStatus.ACTIVE },
        relations: ['purchase'],
      });
      return this.conversionService.toDtos<SellEntity, SellDto>(allSells);
    } catch (error) {
      throw new SystemException(error);
    }
  }

  async pagination(
    page: number,
    limit: number,
    sort: 'DESC' | 'ASC',
    order: string,
    sellSearchDto: SellSearchDto,
  ): Promise<[SellDto[], number]> {
    try {
      const query = await this.sellRepository.createQueryBuilder('sell');
      query.where({ isActive: ActiveStatus.ACTIVE });
      query.leftJoinAndSelect('sell.purchase', 'purchase');

      if (sellSearchDto.name && sellSearchDto.name.length > 0) {
        query.andWhere('lower(sell.name) like :name', {
          name: `%${sellSearchDto.name.toLowerCase()}%`,
        });
      }
      sort = sort !== undefined ? (sort === 'ASC' ? 'ASC' : 'DESC') : 'DESC';

      const orderFields = [
        'name',
        'price',
        'amount',
        'sellDate',
        'createAt',
        'updatedAt',
      ];
      order =
        orderFields.findIndex((o) => o === order) > -1 ? order : 'updatedAt';
      query
        .orderBy(`sell.${order}`, sort)
        .skip((page - 1) * limit)
        .take(limit);
      const [allSell, count] = await query.getManyAndCount();

      const sells = await this.conversionService.toDtos<SellEntity, SellDto>(
        allSell,
      );

      return [sells, count];
    } catch (error) {
      throw new SystemException(error);
    }
  }

  async create(dto: CreateSellDto): Promise<SellDto> {
    try {
      const dtoToEntity = await this.conversionService.toEntity<
        SellEntity,
        SellDto
      >(dto);

      const purchase = await this.purchaseService.getPurchaseById(
        dto.purchaseId,
      );
      console.log(purchase.amount);

      if (purchase.amount < dtoToEntity.amount) {
        throw new SystemException('You are exceeding purchase amount');
      }

      const sell = this.sellRepository.create(dtoToEntity);
      sell.purchase = purchase;
      await this.sellRepository.save(sell);
      return this.conversionService.toDto<SellEntity, SellDto>(sell);
    } catch (error) {
      console.log(error);
      throw new SystemException(error);
    }
  }

  async update(id: string, dto: CreateSellDto): Promise<SellDto> {
    try {
      const saveDto = await this.getSellById(id);
      const dtoToEntity = await this.conversionService.toEntity<
        SellEntity,
        SellDto
      >({ ...saveDto, ...dto });

      const purchase = await this.purchaseService.getPurchaseById(
        dto.purchaseId,
      );

      dtoToEntity.purchase = purchase;

      const updatedSell = await this.sellRepository.save(dtoToEntity, {
        reload: true,
      });
      return this.conversionService.toDto<SellEntity, SellDto>(updatedSell);
    } catch (error) {
      throw new SystemException(error);
    }
  }

  async remove(id: string): Promise<DeleteDto> {
    try {
      const saveDto = await this.getSellById(id);

      const deleted = await this.sellRepository.save({
        ...saveDto,
        isActive: ActiveStatus.INACTIVE,
      });
      return Promise.resolve(new DeleteDto(!!deleted));
    } catch (error) {
      throw new SystemException(error);
    }
  }

  async findById(id: string): Promise<SellDto> {
    try {
      const sell = await this.getSellById(id);
      return this.conversionService.toDto<SellEntity, SellDto>(sell);
    } catch (error) {
      throw new SystemException(error);
    }
  }

  /********************** Start checking relations of post ********************/

  async getSellById(id: string): Promise<SellEntity> {
    const sell = await this.sellRepository.findOne({
      where: {
        id,
        isActive: ActiveStatus.ACTIVE,
      },
      relations: ['purchase'],
    });
    this.exceptionService.notFound(sell, 'Sell Not Found!!');
    return sell;
  }
  /*********************** End checking relations of post *********************/
}
