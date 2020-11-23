import { Entity, PrimaryGeneratedColumn } from 'typeorm'
import { BaseEntity } from '../base.entity'

@Entity({ name: 'users', database: 'stagg' })
export class User extends BaseEntity {
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

import { Repository } from 'typeorm'

// @Injectable()
// export class UserDAO {
//     constructor(
//         @InjectRepository(User, 'stagg') private userRepo: Repository<User>,
//     ) {}

//     public async insert(user: Partial<User>): Promise<User> {
//         return await this.userRepo.save(user);
//     }

//     public async find(userId: string): Promise<User> {
//         return await this.userRepo.findOne(userId);
//     }
// }

export class UserRepository extends Repository<User> {
    public async insertUser(user: Partial<User>): Promise<User> {
        return await this.save(user)
    }

    public async findOneUser(userId: string): Promise<User> {
        return await this.findOne(userId)
    }
}