import { AbstractRepository, Entity, EntityRepository, PrimaryGeneratedColumn } from 'typeorm'
import { BaseEntity } from '../abstract'

@Entity({ name: 'users', database: 'stagg' })
class User extends BaseEntity {
    @PrimaryGeneratedColumn('uuid')
    userId: string

    // @Column('citext')
    // @OneToMany(() => SubscriptionEntity?)
    // subscriptionId: Subscription

    // public key, private key (sort of)

    // @Column('uuid', { unique: true })
    // apiKey: string
}

// // TODO: actually set this up
// export enum Subscription {
//     FreeTier = 'free',
//     NotFreeTier = 'notfree',
//     BigMoneyTier = 'supernotfree'
// }

@EntityRepository(User)
class UserRepository extends AbstractRepository<User> {
    private normailze({ }: Partial<User>) {
        // TODO: add normalization for secondary fields
        return { }
    }

    public async insertUser(user?: Partial<User>): Promise<User> {
        if (!user) user = new User();
        return this.repository.save(user)
    }

    public async updateUser(user: User): Promise<User> {
        const existing = await this.repository.findOneOrFail(user.userId)
        return this.repository.save({ ...existing, ...this.normailze(user) })
    }

    public async findOne(userId: string): Promise<User> {
        return this.repository.findOne(userId)
    }
}

export {
    User as Entity,
    UserRepository as Repository
}