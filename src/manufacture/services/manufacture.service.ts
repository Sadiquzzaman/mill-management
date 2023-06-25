import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateManuafactureDto } from 'src/common/dtos/manufacture/create/create-manufacture.dto';
import {
  ManufactureDto,
  ManufactureSearchDto,
} from 'src/common/dtos/manufacture/manufacture.dto';
import { ManufactureEntity } from 'src/common/entities/manufacture.entity';
import { ActiveStatus } from 'src/common/enums/active.enum';
import { PurchaseService } from 'src/purchase/services/purchase.service';
import { Repository } from 'typeorm';
import { DeleteDto } from '../../common/dtos/reponse/delete.dto';
import { SystemException } from '../../common/exceptions/system.exception';
import { ConversionService } from '../../common/services/conversion.service';
import { ExceptionService } from '../../common/services/exception.service';

@Injectable()
export class ManufactureService {
  constructor(
    @InjectRepository(ManufactureEntity)
    private readonly manufactureRepository: Repository<ManufactureEntity>,
    private readonly conversionService: ConversionService,
    private readonly exceptionService: ExceptionService,
    private readonly purchaseService: PurchaseService,
  ) {}

  async findAll(): Promise<ManufactureDto[]> {
    try {
      const allManufactures = await this.manufactureRepository.find({
        where: { isActive: ActiveStatus.ACTIVE },
        relations: ['purchase'],
      });
      return this.conversionService.toDtos<ManufactureEntity, ManufactureDto>(
        allManufactures,
      );
    } catch (error) {
      throw new SystemException(error);
    }
  }

  async pagination(
    page: number,
    limit: number,
    sort: 'DESC' | 'ASC',
    order: string,
    manufactureSearchDto: ManufactureSearchDto,
  ): Promise<[ManufactureDto[], number]> {
    try {
      const query = await this.manufactureRepository.createQueryBuilder(
        'manufacture',
      );
      query.where({ isActive: ActiveStatus.ACTIVE });
      query.leftJoinAndSelect('manufacture.purchase', 'purchase');

      if (manufactureSearchDto.name && manufactureSearchDto.name.length > 0) {
        query.andWhere('lower(manufacture.name) like :name', {
          name: `%${manufactureSearchDto.name.toLowerCase()}%`,
        });
      }
      sort = sort !== undefined ? (sort === 'ASC' ? 'ASC' : 'DESC') : 'DESC';

      const orderFields = [
        'name',
        'amount',
        'manufactureDate',
        'createAt',
        'updatedAt',
      ];
      order =
        orderFields.findIndex((o) => o === order) > -1 ? order : 'updatedAt';
      query
        .orderBy(`manufacture.${order}`, sort)
        .skip((page - 1) * limit)
        .take(limit);
      const [allManufacture, count] = await query.getManyAndCount();

      const manufactures = await this.conversionService.toDtos<
        ManufactureEntity,
        ManufactureDto
      >(allManufacture);

      return [manufactures, count];
    } catch (error) {
      throw new SystemException(error);
    }
  }

  async create(dto: CreateManuafactureDto): Promise<ManufactureDto> {
    try {
      const dtoToEntity = await this.conversionService.toEntity<
        ManufactureEntity,
        ManufactureDto
      >(dto);

      const purchase = await this.purchaseService.getPurchaseById(
        dto.purchaseId,
      );
      console.log(purchase.amount);

      if (purchase.amount < dtoToEntity.amount) {
        throw new SystemException('You are exceeding purchase amount');
      }

      const manufacture = this.manufactureRepository.create(dtoToEntity);
      manufacture.purchase = purchase;
      await this.manufactureRepository.save(manufacture);
      return this.conversionService.toDto<ManufactureEntity, ManufactureDto>(
        manufacture,
      );
    } catch (error) {
      console.log(error);
      throw new SystemException(error);
    }
  }

  async update(
    id: string,
    dto: CreateManuafactureDto,
  ): Promise<ManufactureDto> {
    try {
      const saveDto = await this.getManufactureById(id);
      const dtoToEntity = await this.conversionService.toEntity<
        ManufactureEntity,
        ManufactureDto
      >({ ...saveDto, ...dto });

      const purchase = await this.purchaseService.getPurchaseById(
        dto.purchaseId,
      );

      dtoToEntity.purchase = purchase;

      const updatedManufacture = await this.manufactureRepository.save(
        dtoToEntity,
        {
          reload: true,
        },
      );
      return this.conversionService.toDto<ManufactureEntity, ManufactureDto>(
        updatedManufacture,
      );
    } catch (error) {
      throw new SystemException(error);
    }
  }

  async remove(id: string): Promise<DeleteDto> {
    try {
      const saveDto = await this.getManufactureById(id);

      const deleted = await this.manufactureRepository.save({
        ...saveDto,
        isActive: ActiveStatus.INACTIVE,
      });
      return Promise.resolve(new DeleteDto(!!deleted));
    } catch (error) {
      throw new SystemException(error);
    }
  }

  async findById(id: string): Promise<ManufactureDto> {
    try {
      const manufacture = await this.getManufactureById(id);
      return this.conversionService.toDto<ManufactureEntity, ManufactureDto>(
        manufacture,
      );
    } catch (error) {
      throw new SystemException(error);
    }
  }

  /********************** Start checking relations of post ********************/

  async getManufactureById(id: string): Promise<ManufactureEntity> {
    const manufacture = await this.manufactureRepository.findOne({
      where: {
        id,
        isActive: ActiveStatus.ACTIVE,
      },
      relations: ['purchase'],
    });
    this.exceptionService.notFound(manufacture, 'Manufacture Not Found!!');
    return manufacture;
  }
  /*********************** End checking relations of post *********************/
}
