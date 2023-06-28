import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import {
  CustomerDto,
  CustomerSearchDto,
} from 'src/common/dtos/customer/customer.dto';
import { CustomerEntity } from 'src/common/entities/customer.entity';
import { ActiveStatus } from 'src/common/enums/active.enum';
import { Repository } from 'typeorm';
import { DeleteDto } from '../../common/dtos/reponse/delete.dto';
import { SystemException } from '../../common/exceptions/system.exception';
import { ConversionService } from '../../common/services/conversion.service';
import { ExceptionService } from '../../common/services/exception.service';

@Injectable()
export class CustomerService {
  constructor(
    @InjectRepository(CustomerEntity)
    private readonly customerRepository: Repository<CustomerEntity>,
    private readonly conversionService: ConversionService,
    private readonly exceptionService: ExceptionService,
  ) {}

  async findAll(): Promise<CustomerDto[]> {
    try {
      const allCustomer = await this.customerRepository.find({
        where: { isActive: ActiveStatus.ACTIVE },
      });
      return this.conversionService.toDtos<CustomerEntity, CustomerDto>(
        allCustomer,
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
    customerSearchDto: CustomerSearchDto,
  ): Promise<[CustomerDto[], number]> {
    try {
      const query = await this.customerRepository.createQueryBuilder(
        'customer',
      );
      query.where({ isActive: ActiveStatus.ACTIVE });

      if (customerSearchDto.name && customerSearchDto.name.length > 0) {
        query.andWhere('lower(customer.name) like :name', {
          name: `%${customerSearchDto.name.toLowerCase()}%`,
        });
      }

      if (customerSearchDto.phone && customerSearchDto.phone.length > 0) {
        query.andWhere('lower(customer.phone) like :phone', {
          phone: `%${customerSearchDto.phone.toLowerCase()}%`,
        });
      }

      if (
        customerSearchDto.companyName &&
        customerSearchDto.companyName.length > 0
      ) {
        query.andWhere('lower(customer.companyName) like :companyName', {
          companyName: `%${customerSearchDto.companyName.toLowerCase()}%`,
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
        .orderBy(`customer.${order}`, sort)
        .skip((page - 1) * limit)
        .take(limit);
      const [allCustomer, count] = await query.getManyAndCount();

      const customers = await this.conversionService.toDtos<
        CustomerEntity,
        CustomerDto
      >(allCustomer);

      return [customers, count];
    } catch (error) {
      throw new SystemException(error);
    }
  }

  async create(dto: CustomerDto): Promise<CustomerDto> {
    try {
      const dtoToEntity = await this.conversionService.toEntity<
        CustomerEntity,
        CustomerDto
      >(dto);

      const customer = this.customerRepository.create(dtoToEntity);
      await this.customerRepository.save(customer);
      return this.conversionService.toDto<CustomerEntity, CustomerDto>(
        customer,
      );
    } catch (error) {
      console.log(error);

      throw new SystemException(error);
    }
  }

  async update(id: string, dto: CustomerDto): Promise<CustomerDto> {
    try {
      const saveDto = await this.getCustomerById(id);
      const dtoToEntity = await this.conversionService.toEntity<
        CustomerEntity,
        CustomerDto
      >({ ...saveDto, ...dto });

      const updatedCustomer = await this.customerRepository.save(dtoToEntity, {
        reload: true,
      });
      return this.conversionService.toDto<CustomerEntity, CustomerDto>(
        updatedCustomer,
      );
    } catch (error) {
      throw new SystemException(error);
    }
  }

  async remove(id: string): Promise<DeleteDto> {
    try {
      const saveDto = await this.getCustomerById(id);

      const deleted = await this.customerRepository.save({
        ...saveDto,
        isActive: ActiveStatus.INACTIVE,
      });
      return Promise.resolve(new DeleteDto(!!deleted));
    } catch (error) {
      throw new SystemException(error);
    }
  }

  async findById(id: string): Promise<CustomerDto> {
    try {
      const customer = await this.getCustomerById(id);
      return this.conversionService.toDto<CustomerEntity, CustomerDto>(
        customer,
      );
    } catch (error) {
      throw new SystemException(error);
    }
  }

  /********************** Start checking relations of post ********************/

  async getCustomerById(id: string): Promise<CustomerEntity> {
    const customer = await this.customerRepository.findOne({
      where: {
        id,
        isActive: ActiveStatus.ACTIVE,
      },
    });
    this.exceptionService.notFound(customer, 'Customer Not Found!!');
    return customer;
  }
  /*********************** End checking relations of post *********************/
}
