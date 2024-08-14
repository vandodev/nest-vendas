import {
    Column,
    CreateDateColumn,
    Entity,
    OneToMany,
    PrimaryGeneratedColumn,
    UpdateDateColumn,
  } from 'typeorm';
  import { CartProdutEntity } from 'src/cart-product/entities/cart-product.entity';
  
  @Entity({ name: 'cart' })
  export class CartEntity {
    @PrimaryGeneratedColumn('rowid')
    id: number;
  
    @Column({ name: 'user_id', nullable: false })
    userId: number;
  
    @CreateDateColumn({ name: 'created_at' })
    createdAt: Date;
  
    @UpdateDateColumn({ name: 'updated_at' })
    updatedAt: Date;

    @OneToMany(() => CartProdutEntity, (cartProduct) => cartProduct.cart)
    cartProduct?: CartProdutEntity[];
  }