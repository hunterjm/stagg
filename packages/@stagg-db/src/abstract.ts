import { CreateDateColumn, UpdateDateColumn, AbstractRepository, InsertResult } from 'typeorm'

export abstract class BaseEntity {
    @CreateDateColumn()
    created_datetime?: Date

    @UpdateDateColumn()
    updated_datetime?: Date
}

export abstract class BaseRepository<T> extends AbstractRepository<T> {
    protected normailze(entity:Partial<T>) {
        return { ...entity }
    }
    public query() {
        return this.repository.createQueryBuilder()
    }
    public async save(entity:T): Promise<T> {
        const normalized = <T>this.normailze(entity)
        return this.repository.save(normalized)
    }
    public async update(entity:T&{id:string}): Promise<T> {
        const existing = await this.repository.findOneOrFail(entity.id)
        return this.repository.save({ ...existing, ...this.normailze(entity) })
    }
    public async insert(entity:T): Promise<InsertResult> {
        const normalized = <T>this.normailze(entity)
        return this.repository.insert(normalized)
    }
    public async findOne(criteria:Partial<T>): Promise<T> {
        return this.repository.findOne(criteria)
    }
    public async findAll(criteria:Partial<T>): Promise<T[]> {
        return this.repository.find(criteria)
    }
}
