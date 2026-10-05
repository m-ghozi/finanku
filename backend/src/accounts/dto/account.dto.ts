import {
  IsString,
  IsEnum,
  IsInt,
  IsOptional,
  IsBoolean,
  Min,
  Max,
  Matches,
  MaxLength,
} from 'class-validator';

export class CreateAccountDto {
  @IsString()
  @MaxLength(100)
  name: string;

  @IsEnum(['bank', 'cash', 'e_wallet', 'credit_card'])
  type: 'bank' | 'cash' | 'e_wallet' | 'credit_card';

  @IsOptional()
  @IsString()
  @MaxLength(100)
  bankName?: string;

  @IsOptional()
  @IsString()
  @MaxLength(50)
  accountNumber?: string;

  @IsInt()
  @Min(0)
  @IsOptional()
  openingBalance?: number;

  @IsOptional()
  @IsString()
  @Matches(/^#[0-9a-fA-F]{6}$/)
  color?: string;

  @IsOptional()
  @IsString()
  @MaxLength(50)
  icon?: string;

  @IsOptional()
  @IsInt()
  @Min(0)
  creditLimit?: number;

  @IsOptional()
  @IsInt()
  @Min(1)
  @Max(31)
  billingCycleDay?: number;

  @IsOptional()
  @IsInt()
  @Min(1)
  @Max(31)
  dueDateDay?: number;
}

export class UpdateAccountDto extends CreateAccountDto {
  @IsOptional()
  @IsBoolean()
  isArchived?: boolean;

  @IsOptional()
  @IsInt()
  @Min(0)
  declare openingBalance?: number;
}
