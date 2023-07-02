import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { BuyerDto, BuyerSearchDto } from 'src/common/dtos/buyer/buyer.dto';
import { BuyerEntity } from 'src/common/entities/buyer.entity';
import { ActiveStatus } from 'src/common/enums/active.enum';
import { Repository } from 'typeorm';
import { DeleteDto } from '../../common/dtos/reponse/delete.dto';
import { SystemException } from '../../common/exceptions/system.exception';
import { ConversionService } from '../../common/services/conversion.service';
import { ExceptionService } from '../../common/services/exception.service';

@Injectable()
export class BuyerService {
  constructor(
    @InjectRepository(BuyerEntity)
    private readonly buyerRepository: Repository<BuyerEntity>,
    private readonly conversionService: ConversionService,
    private readonly exceptionService: ExceptionService,
  ) {}

  async findAll(): Promise<BuyerDto[]> {
    try {
      const allBuyer = await this.buyerRepository.find({
        where: { isActive: ActiveStatus.ACTIVE },
      });
      return this.conversionService.toDtos<BuyerEntity, BuyerDto>(allBuyer);
    } catch (error) {
      throw new SystemException(error);
    }
  }

  async pagination(
    page: number,
    limit: number,
    sort: 'DESC' | 'ASC',
    order: string,
    buyerSearchDto: BuyerSearchDto,
  ): Promise<[BuyerDto[], number]> {
    try {
      const query = await this.buyerRepository.createQueryBuilder('buyer');
      query.where({ isActive: ActiveStatus.ACTIVE });

      if (buyerSearchDto.name && buyerSearchDto.name.length > 0) {
        query.andWhere('lower(buyer.name) like :name', {
          name: `%${buyerSearchDto.name.toLowerCase()}%`,
        });
      }

      if (buyerSearchDto.phone && buyerSearchDto.phone.length > 0) {
        query.andWhere('lower(buyer.phone) like :phone', {
          phone: `%${buyerSearchDto.phone.toLowerCase()}%`,
        });
      }

      if (buyerSearchDto.companyName && buyerSearchDto.companyName.length > 0) {
        query.andWhere('lower(buyer.companyName) like :companyName', {
          companyName: `%${buyerSearchDto.companyName.toLowerCase()}%`,
        });
      }

      sort = sort !== undefined ? (sort === 'ASC' ? 'ASC' : 'DESC') : 'DESC';

      const orderFields = [
        'name',
        'phone',
        'companyName',
        'createAt',
        'updatedAt',
      ];
      order =
        orderFields.findIndex((o) => o === order) > -1 ? order : 'updatedAt';
      query
        .orderBy(`buyer.${order}`, sort)
        .skip((page - 1) * limit)
        .take(limit);
      const [allBuyer, count] = await query.getManyAndCount();

      const buyers = await this.conversionService.toDtos<BuyerEntity, BuyerDto>(
        allBuyer,
      );

      return [buyers, count];
    } catch (error) {
      throw new SystemException(error);
    }
  }

  async create(dto: BuyerDto): Promise<BuyerDto> {
    try {
      const dtoToEntity = await this.conversionService.toEntity<
        BuyerEntity,
        BuyerDto
      >(dto);

      const buyer = this.buyerRepository.create(dtoToEntity);
      await this.buyerRepository.save(buyer);
      return this.conversionService.toDto<BuyerEntity, BuyerDto>(buyer);
    } catch (error) {
      console.log(error);

      throw new SystemException(error);
    }
  }

  async update(id: string, dto: BuyerDto): Promise<BuyerDto> {
    try {
      const saveDto = await this.getBuyerById(id);
      const dtoToEntity = await this.conversionService.toEntity<
        BuyerEntity,
        BuyerDto
      >({ ...saveDto, ...dto });

      const updatedBuyer = await this.buyerRepository.save(dtoToEntity, {
        reload: true,
      });
      return this.conversionService.toDto<BuyerEntity, BuyerDto>(updatedBuyer);
    } catch (error) {
      throw new SystemException(error);
    }
  }

  async remove(id: string): Promise<DeleteDto> {
    try {
      const saveDto = await this.getBuyerById(id);

      const deleted = await this.buyerRepository.save({
        ...saveDto,
        isActive: ActiveStatus.INACTIVE,
      });
      return Promise.resolve(new DeleteDto(!!deleted));
    } catch (error) {
      throw new SystemException(error);
    }
  }

  async findById(id: string): Promise<BuyerDto> {
    try {
      const buyer = await this.getBuyerById(id);
      return this.conversionService.toDto<BuyerEntity, BuyerDto>(buyer);
    } catch (error) {
      throw new SystemException(error);
    }
  }

  /********************** Start checking relations of post ********************/

  async getBuyerById(id: string): Promise<BuyerEntity> {
    const buyer = await this.buyerRepository.findOne({
      where: {
        id,
        isActive: ActiveStatus.ACTIVE,
      },
    });
    this.exceptionService.notFound(buyer, 'Buyer Not Found!!');
    return buyer;
  }
  /*********************** End checking relations of post *********************/
}
