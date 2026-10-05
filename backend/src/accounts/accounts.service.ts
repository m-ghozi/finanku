import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateAccountDto } from './dto/account.dto';

@Injectable()
export class AccountsService {
  constructor(private prisma: PrismaService) {}

  async findAll(userId: string, includeArchived = false) {
    return this.prisma.account.findMany({
      where: { userId, ...(includeArchived ? {} : { isArchived: false }) },
      orderBy: { createdAt: 'asc' },
    });
  }

  async findOne(userId: string, id: string) {
    const account = await this.prisma.account.findFirst({ where: { id, userId } });
    if (!account) throw new NotFoundException('Rekening tidak ditemukan');
    return account;
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
  async computeCurrentBalance(userId: string, accountId: string): Promise<number> {
    const account = await this.findOne(userId, accountId);
    const [income, expense, transferIn, transferOut] = await Promise.all([
      this.prisma.transaction.aggregate({
        where: { accountId, type: 'income', status: 'completed' },
        _sum: { amount: true },
      }),
      this.prisma.transaction.aggregate({
        where: { accountId, type: 'expense', status: 'completed' },
        _sum: { amount: true },
      }),
      this.prisma.transaction.aggregate({
        where: { toAccountId: accountId, type: 'transfer', status: 'completed' },
        _sum: { amount: true },
      }),
      this.prisma.transaction.aggregate({
        where: { accountId, type: 'transfer', status: 'completed' },
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
