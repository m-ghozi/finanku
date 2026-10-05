import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateAccountDto } from './dto/account.dto';

@Injectable()
export class AccountsService {
  constructor(private prisma: PrismaService) {}

  async findAll(userId: string, includeArchived = false) {
    const accounts = await this.prisma.account.findMany({
      where: { userId, ...(includeArchived ? {} : { isArchived: false }) },
      orderBy: { createdAt: 'asc' },
    });
    return Promise.all(
      accounts.map(async (a) => ({ ...a, currentBalance: await this.computeBalance(a) })),
    );
  }

  async findOne(userId: string, id: string) {
    const account = await this.prisma.account.findFirst({ where: { id, userId } });
    if (!account) throw new NotFoundException('Rekening tidak ditemukan');
    return { ...account, currentBalance: await this.computeBalance(account) };
  }

  async create(userId: string, dto: CreateAccountDto) {
    return this.prisma.account.create({ data: { ...dto, userId } });
  }

  async update(userId: string, id: string, dto: Partial<CreateAccountDto> & { isArchived?: boolean }) {
    await this.findOne(userId, id);
    return this.prisma.account.update({ where: { id }, data: dto });
  }

  async remove(userId: string, id: string) {
    await this.findOne(userId, id);
    const trxCount = await this.prisma.transaction.count({ where: { accountId: id } });
    if (trxCount > 0) {
      throw new BadRequestException(
        'Rekening sudah memiliki transaksi; gunakan arsip (archive) sebagai gantinya',
      );
    }
    await this.prisma.account.delete({ where: { id } });
    return { message: 'Rekening dihapus' };
  }

  /** currentBalance = openingBalance + income - expense + transferIn - transferOut */
  private async computeBalance(account: {
    id: string;
    openingBalance: number;
  }): Promise<number> {
    const [income, expense, transferIn, transferOut] = await Promise.all([
      this.prisma.transaction.aggregate({
        where: { accountId: account.id, type: 'income', status: 'completed' },
        _sum: { amount: true },
      }),
      this.prisma.transaction.aggregate({
        where: { accountId: account.id, type: 'expense', status: 'completed' },
        _sum: { amount: true },
      }),
      this.prisma.transaction.aggregate({
        where: { toAccountId: account.id, type: 'transfer', status: 'completed' },
        _sum: { amount: true },
      }),
      this.prisma.transaction.aggregate({
        where: { accountId: account.id, type: 'transfer', status: 'completed' },
        _sum: { amount: true },
      }),
    ]);
    return (
      account.openingBalance +
      (income._sum.amount ?? 0) -
      (expense._sum.amount ?? 0) +
      (transferIn._sum.amount ?? 0) -
      (transferOut._sum.amount ?? 0)
    );
  }
}
