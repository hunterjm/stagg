import { CreateDateColumn, Repository, UpdateDateColumn } from 'typeorm'

export abstract class BaseEntity {
    @CreateDateColumn()
    createdAt: Date

    @UpdateDateColumn()
    updatedAt: Date
}