import { Column, Entity, PrimaryColumn } from 'typeorm'
import { BaseEntity } from '../base.entity'

@Entity({ name: 'accounts', database: 'discord' })
export class Account extends BaseEntity {
    @PrimaryColumn('text')
    discordId: string

    @Column('uuid', { unique: true })
    userId: string

    @Column('citext')
    tag: string

    @Column('citext')
    avatar: string
}