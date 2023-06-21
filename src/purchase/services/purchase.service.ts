import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { PurchaseDto, PurchaseSearchDto } from 'src/common/dtos/purchase/purchase.dto';
import { PurchaseEntity } from 'src/common/entities/purchase.entity';
import { ActiveStatus } from 'src/common/enums/active.enum';
import { Repository } from 'typeorm';
import { DeleteDto } from '../../common/dtos/reponse/delete.dto';
import { SystemException } from '../../common/exceptions/system.exception';
import { ConversionService } from '../../common/services/conversion.service';
import { ExceptionService } from '../../common/services/exception.service';

@Injectable()
export class PurchaseService {
  constructor(
    @InjectRepository(PurchaseEntity)
    private readonly purchaseRepository: Repository<PurchaseEntity>,
    private readonly conversionService: ConversionService,
    private readonly exceptionService: ExceptionService,
  ) {}

  async findAll(): Promise<PurchaseDto[]> {
    try {
      const allPurchase = await this.purchaseRepository.find({
        where: { isActive: ActiveStatus.ACTIVE },
      });
      return this.conversionService.toDtos<PurchaseEntity, PurchaseDto>(allPurchase);
    } catch (error) {
      throw new SystemException(error);
    }
  }

  async pagination(
    page: number,
    limit: number,
    sort: 'DESC' | 'ASC',
    order: string,
    purchaseSearchDto:PurchaseSearchDto
  ): Promise<[PurchaseDto[], number]> {
    try {
      const query = await this.purchaseRepository.createQueryBuilder('purchase');
      query.where({ isActive: ActiveStatus.ACTIVE });

      if (purchaseSearchDto.name && purchaseSearchDto.name.length > 0) {
        query.andWhere('lower(purchase.name) like :name', {
          name: `%${purchaseSearchDto.name.toLowerCase()}%`,
        });
      }
      sort = sort !== undefined ? (sort === 'ASC' ? 'ASC' : 'DESC') : 'DESC';

      const orderFields = [
        'name',
        'price',
        'amount',
        'puchaseDate',
        'createAt',
        'updatedAt',
      ];
      order =
        orderFields.findIndex((o) => o === order) > -1 ? order : 'updatedAt';
      query
        .orderBy(`purchase.${order}`, sort)
        .skip((page - 1) * limit)
        .take(limit);
      const [allPurchase, count] = await query.getManyAndCount();

      const purchases = await this.conversionService.toDtos<PurchaseEntity, PurchaseDto>(
        allPurchase,
      );

      return [purchases, count];
    } catch (error) {
      throw new SystemException(error);
    }
  }

  async create(dto: PurchaseDto): Promise<PurchaseDto> {
    try {
      const dtoToEntity = await this.conversionService.toEntity<
      PurchaseEntity,
      PurchaseDto
      >(dto);

      const purchase = this.purchaseRepository.create(dtoToEntity);
      await this.purchaseRepository.save(purchase);
      return this.conversionService.toDto<PurchaseEntity, PurchaseDto>(purchase);
    } catch (error) {
      console.log(error);

      throw new SystemException(error);
    }
  }

  async update(id: string, dto: PurchaseDto): Promise<PurchaseDto> {
    try {
      const saveDto = await this.getPurchaseById(id);
      const dtoToEntity = await this.conversionService.toEntity<
      PurchaseEntity,
      PurchaseDto
      >({ ...saveDto, ...dto });

      const updatedPurchase = await this.purchaseRepository.save(dtoToEntity, {
        reload: true,
      });
      return this.conversionService.toDto<PurchaseEntity, PurchaseDto>(updatedPurchase);
    } catch (error) {
      throw new SystemException(error);
    }
  }

  async remove(id: string): Promise<DeleteDto> {
    try {
      const saveDto = await this.getPurchaseById(id);

      const deleted = await this.purchaseRepository.save({
        ...saveDto,
        isActive: ActiveStatus.INACTIVE,
      });
      return Promise.resolve(new DeleteDto(!!deleted));
    } catch (error) {
      throw new SystemException(error);
    }
  }

  async findById(id: string): Promise<PurchaseDto> {
    try {
      const purchase = await this.getPurchaseById(id);
      return this.conversionService.toDto<PurchaseEntity, PurchaseDto>(purchase);
    } catch (error) {
      throw new SystemException(error);
    }
  }

  /********************** Start checking relations of post ********************/

  async getPurchaseById(id: string): Promise<PurchaseEntity> {
    const purchase = await this.purchaseRepository.findOne({
      where: {
        id,
        isActive: ActiveStatus.ACTIVE,
      },
    });
    this.exceptionService.notFound(purchase, 'Purchase Not Found!!');
    return purchase;
  }
  /*********************** End checking relations of post *********************/
}
