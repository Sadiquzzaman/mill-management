import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ActiveStatus } from 'src/common/enums/active.enum';
import { Repository } from 'typeorm';
import { DeleteDto } from '../../common/dtos/reponse/delete.dto';
import { SystemException } from '../../common/exceptions/system.exception';
import { ConversionService } from '../../common/services/conversion.service';
import { ExceptionService } from '../../common/services/exception.service';
import { SellerEntity } from 'src/common/entities/seller.entity';
import { SellerDto, SellerSearchDto } from 'src/common/dtos/seller/seller.dto';

@Injectable()
export class SellerService {
  constructor(
    @InjectRepository(SellerEntity)
    private readonly sellerRepository: Repository<SellerEntity>,
    private readonly conversionService: ConversionService,
    private readonly exceptionService: ExceptionService,
  ) {}

  async findAll(): Promise<SellerDto[]> {
    try {
      const allSeller = await this.sellerRepository.find({
        where: { isActive: ActiveStatus.ACTIVE },
      });
      return this.conversionService.toDtos<SellerEntity, SellerDto>(allSeller);
    } catch (error) {
      throw new SystemException(error);
    }
  }

  async pagination(
    page: number,
    limit: number,
    sort: 'DESC' | 'ASC',
    order: string,
    sellerSearchDto: SellerSearchDto,
  ): Promise<[SellerDto[], number]> {
    try {
      const query = await this.sellerRepository.createQueryBuilder('seller');
      query.where({ isActive: ActiveStatus.ACTIVE });

      if (sellerSearchDto.name && sellerSearchDto.name.length > 0) {
        query.andWhere('lower(seller.name) like :name', {
          name: `%${sellerSearchDto.name.toLowerCase()}%`,
        });
      }

      if (sellerSearchDto.phone && sellerSearchDto.phone.length > 0) {
        query.andWhere('lower(seller.phone) like :phone', {
          phone: `%${sellerSearchDto.phone.toLowerCase()}%`,
        });
      }

      if (
        sellerSearchDto.companyName &&
        sellerSearchDto.companyName.length > 0
      ) {
        query.andWhere('lower(seller.companyName) like :companyName', {
          companyName: `%${sellerSearchDto.companyName.toLowerCase()}%`,
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
        .orderBy(`seller.${order}`, sort)
        .skip((page - 1) * limit)
        .take(limit);
      const [allSeller, count] = await query.getManyAndCount();

      const sellers = await this.conversionService.toDtos<
        SellerEntity,
        SellerDto
      >(allSeller);

      return [sellers, count];
    } catch (error) {
      throw new SystemException(error);
    }
  }

  async create(dto: SellerDto): Promise<SellerDto> {
    try {
      const dtoToEntity = await this.conversionService.toEntity<
        SellerEntity,
        SellerDto
      >(dto);

      const seller = this.sellerRepository.create(dtoToEntity);
      await this.sellerRepository.save(seller);
      return this.conversionService.toDto<SellerEntity, SellerDto>(seller);
    } catch (error) {
      console.log(error);

      throw new SystemException(error);
    }
  }

  async update(id: string, dto: SellerDto): Promise<SellerDto> {
    try {
      const saveDto = await this.getSellerById(id);
      const dtoToEntity = await this.conversionService.toEntity<
        SellerEntity,
        SellerDto
      >({ ...saveDto, ...dto });

      const updatedSeller = await this.sellerRepository.save(dtoToEntity, {
        reload: true,
      });
      return this.conversionService.toDto<SellerEntity, SellerDto>(
        updatedSeller,
      );
    } catch (error) {
      throw new SystemException(error);
    }
  }

  async remove(id: string): Promise<DeleteDto> {
    try {
      const saveDto = await this.getSellerById(id);

      const deleted = await this.sellerRepository.save({
        ...saveDto,
        isActive: ActiveStatus.INACTIVE,
      });
      return Promise.resolve(new DeleteDto(!!deleted));
    } catch (error) {
      throw new SystemException(error);
    }
  }

  async findById(id: string): Promise<SellerDto> {
    try {
      const seller = await this.getSellerById(id);
      return this.conversionService.toDto<SellerEntity, SellerDto>(seller);
    } catch (error) {
      throw new SystemException(error);
    }
  }

  /********************** Start checking relations of post ********************/

  async getSellerById(id: string): Promise<SellerEntity> {
    const seller = await this.sellerRepository.findOne({
      where: {
        id,
        isActive: ActiveStatus.ACTIVE,
      },
    });
    this.exceptionService.notFound(seller, 'Seller Not Found!!');
    return seller;
  }
  /*********************** End checking relations of post *********************/
}
