import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm'
import { BaseEntity } from '../../base.entity'

@Entity({ name: 'accounts', database: 'callofduty' })
export class Account extends BaseEntity {
    @PrimaryGeneratedColumn('uuid')
    accountId: string

    @Column('uuid', { nullable: true })
    userId: string

    @Column('text', { nullable: true, unique: true })
    unoId: string
}
