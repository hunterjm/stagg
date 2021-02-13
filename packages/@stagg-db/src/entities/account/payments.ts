import {
    Entity,
    Column,
    EntityRepository,
    PrimaryGeneratedColumn,
} from 'typeorm'
import { BaseEntity, BaseRepository } from '../../abstract'

@Entity({ name: 'accounts/payments', database: 'stagg' })
class Payment extends BaseEntity {
    @PrimaryGeneratedColumn('uuid')
    id: string

    @Column('uuid')
    account_id: string

    @Column('numeric')
    total_paid: number
}

@EntityRepository(Payment)
class PaymentRepository extends BaseRepository<Payment> {
    protected normailze(entity:Partial<Payment>) {
        return { ...entity }
    }
    public async findAll(criteria:Partial<Payment>): Promise<Payment[]> {
        return this.repository.find(criteria)
    }
}

export {
    Payment as Entity,
    PaymentRepository as Repository
}
