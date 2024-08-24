import { ProductEntity } from '../entities/product.entity';
import { ReturnCategory } from '../../category/dtos/return-category.dto';

export class ReturnProduct {
  id: number;
  name: string;
  price: number;
  image: string;
  category?: ReturnCategory;

  constructor(productEntity: ProductEntity) {
    this.id = productEntity.id;
    this.name = productEntity.name;
    this.price = productEntity.price;
    this.image = productEntity.image;
    this.category = productEntity.category
      ? new ReturnCategory(productEntity.category)
      : undefined;
  }
}