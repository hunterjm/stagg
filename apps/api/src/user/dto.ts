// Example DTO?

// import { ApiModelProperty } from '@nestjs/swagger'
import { IsString, IsUUID } from 'class-validator'
import { User } from './entity';

export class CreateUserDTO {
    // @ApiModelProperty({ required: true })
    domains: {
        discord?: UserCreationDomainDTO
        callofduty: UserCreationDomainDTO
    }

    public static from(dto: Partial<CreateUserDTO>) {
        const u = new CreateUserDTO();
        u.domains = {
            discord: dto?.domains?.discord,
            callofduty: dto?.domains?.callofduty,
        }
        return u;
    }

    public static fromEntity(entity: User) {
        return this.from({
            // fields
        })
    }

    public toEntity() {
        const u = new User();
        // fields
        return u;
    }
}

class UserCreationDomainDTO {
    // @ApiModelProperty({ required: true })
    @IsString()
    domainId: string

    // @ApiModelProperty({ required: true })
    @IsString()
    jwt: string
}