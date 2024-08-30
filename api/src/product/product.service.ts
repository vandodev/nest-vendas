import {
  forwardRef,
  Inject,
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DeleteResult, In, Repository } from 'typeorm';
import { ProductEntity } from './entities/product.entity';
import { CreateProductDTO } from './dtos/create-product.dto';
import { CategoryService } from '../category/category.service';
import { UpdateProductDTO } from './dtos/update-procut.dto';
import { CountProduct } from './dtos/count-product.dto';
import { SizeProductDTO } from '../correios/dto/size-product.dto';
import { CorreiosService } from '../correios/correios.service';
import { CdServiceEnum } from '../correios/enums/cd-service.enum';
import { ReturnPriceDeliveryDto } from './dtos/return-price-delivery.dto';

@Injectable()
export class ProductService {
  constructor(
    @InjectRepository(ProductEntity)
    private readonly productRepository: Repository<ProductEntity>,

    @Inject(forwardRef(() => CategoryService))
    private readonly categoryService: CategoryService,

    private readonly correiosService: CorreiosService,
  ) {}

  async findAll(
    productId?: number[],
    isFindRelations?: boolean,
  ): Promise<ProductEntity[]> {
    let findOptions = {};

    if (productId && productId.length > 0) {
      findOptions = {
        where: {
          id: In(productId),
        },
      };
    }

    if (isFindRelations) {
      findOptions = {
        ...findOptions,
        relations: {
          category: true,
        },
      };
    }

    const products = await this.productRepository.find(findOptions);

    if (!products || products.length === 0) {
      throw new NotFoundException('Not found products');
    }

    return products;
  }

  async createProduct(createProduct: CreateProductDTO): Promise<ProductEntity> {
    await this.categoryService.findCategoryById(createProduct.categoryId);

    return this.productRepository.save({
      ...createProduct,
      weight: createProduct.weight || 0,
      width: createProduct.width || 0,
      length: createProduct.length || 0,
      diameter: createProduct.diameter || 0,
      height: createProduct.height || 0,
    });
  }

  async findProductById(
    productId: number,
    isRelations?: boolean,
  ): Promise<ProductEntity> {

    const relations = isRelations
      ? {
          category: true,
        }
      : undefined;

    const product = await this.productRepository.findOne({
      where: {
        id: productId,
      },
      relations,
    });

    if (!product) {
      throw new NotFoundException(`Product id: ${productId} not found`);
    }

    return product;
  }

  async deleteProduct(productId: number): Promise<DeleteResult> {
    await this.findProductById(productId);

    return this.productRepository.delete({ id: productId });
  }

  async updateProduct(
    updateProduct: UpdateProductDTO,
    productId: number,
  ): Promise<ProductEntity> {
    const product = await this.findProductById(productId);

    return this.productRepository.save({
      ...product,
      ...updateProduct,
    });
  }

  async countProdutsByCategoryId(): Promise<CountProduct[]> {
    return this.productRepository
      .createQueryBuilder('product')
      .select('product.category_id, COUNT(*) as total')
      .groupBy('product.category_id')
      .getRawMany();
  }

  async findPriceDelivery(cep: string, idProduct: number): Promise<any> {
    const product = await this.findProductById(idProduct);
    const sizeProduct = new SizeProductDTO(product);
    const returnCorreios = await this.correiosService.priceDelivery(
      CdServiceEnum.PAC,
      cep,
      sizeProduct,
    );
   
    const resultPrice = await Promise.all([
      this.correiosService.priceDelivery(CdServiceEnum.PAC, cep, sizeProduct),
      this.correiosService.priceDelivery(CdServiceEnum.SEDEX, cep, sizeProduct),
      this.correiosService.priceDelivery(
        CdServiceEnum.SEDEX_10,
        cep,
        sizeProduct,
      ),
    ]).catch(() => {
      throw new BadRequestException('Error find delivery price');
    });

    return new ReturnPriceDeliveryDto(resultPrice);
  }
}