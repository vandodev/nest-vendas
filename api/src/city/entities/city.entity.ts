import {
    Column,
    CreateDateColumn,
    Entity,
    JoinColumn,
    ManyToOne,
    OneToMany,
    PrimaryGeneratedColumn,
    UpdateDateColumn,
  } from 'typeorm';

  import { AddressEntity } from 'src/address/entities/address.entity';
import { StateEntity } from 'src/state/entities/state.entity';
  
  @Entity({ name: 'city' })
  export class CityEntity {
    @PrimaryGeneratedColumn('rowid')
    id: number;
  
    @Column({ name: 'state_id', nullable: false })
    stateId: number;
  
    @Column({ name: 'name', nullable: false })
    name: string;
  
    @CreateDateColumn({ name: 'created_at' })
    createdAt: Date;
  
    @UpdateDateColumn({ name: 'updated_at' })
    updatedAt: Date;

    @OneToMany(() => AddressEntity, (address) => address.city)
    addresses?: AddressEntity[];
  
    @ManyToOne(() => StateEntity, (state) => state.cities)
    @JoinColumn({ name: 'state_id', referencedColumnName: 'id' })
    state?: StateEntity;
  }