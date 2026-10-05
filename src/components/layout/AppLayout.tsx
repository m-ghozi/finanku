import React, { useState } from 'react';
import { useRouter } from '@/src/lib/router';
import { Sidebar } from './Sidebar';
import { Header } from './Header';
import { MobileNav } from './MobileNav';
import { OfflineIndicator } from '@/src/components/shared/OfflineIndicator';
import { TransactionFormModal } from '@/src/components/transactions/TransactionFormModal';
import { QuickTransactionModal } from '@/src/components/transactions/QuickTransactionModal';
import { Transaction } from '@/src/types/transaction';

// Views
import { DashboardView } from '@/src/views/DashboardView';
import { TransactionsView } from '@/src/views/TransactionsView';
import { AccountsView } from '@/src/views/AccountsView';
import { CategoriesView } from '@/src/views/CategoriesView';
import { BudgetsView } from '@/src/views/BudgetsView';
import { SavingsView } from '@/src/views/SavingsView';
import { DebtsView } from '@/src/views/DebtsView';
import { RecurringView } from '@/src/views/RecurringView';
import { ReportsView } from '@/src/views/ReportsView';
import { FinancialPlanningView } from '@/src/views/FinancialPlanningView';
import { NotificationsView } from '@/src/views/NotificationsView';
import { SettingsView } from '@/src/views/SettingsView';
import { LoginView } from '@/src/views/LoginView';

export const AppLayout: React.FC = () => {
  const { pathname } = useRouter();

  // Modals state
  const [transactionModalOpen, setTransactionModalOpen] = useState(false);
  const [editingTransaction, setEditingTransaction] = useState<Transaction | null>(null);
  const [quickInputModalOpen, setQuickInputModalOpen] = useState(false);

  const handleOpenCreateTransaction = () => {
    setEditingTransaction(null);
    setTransactionModalOpen(true);
  };

  const handleOpenEditTransaction = (trx: Transaction) => {
    setEditingTransaction(trx);
    setTransactionModalOpen(true);
  };

  const handleOpenQuickInput = () => {
    setQuickInputModalOpen(true);
  };

  // Login view is standalone without app shell
  if (pathname === '/login') {
    return <LoginView />;
  }

  // Render view corresponding to current route
  const renderView = () => {
    switch (pathname) {
      case '/dashboard':
        return <DashboardView onOpenCreateTransaction={handleOpenCreateTransaction} />;
      case '/transactions':
        return (
          <TransactionsView
            onOpenCreateTransaction={handleOpenCreateTransaction}
            onEditTransaction={handleOpenEditTransaction}
          />
        );
      case '/accounts':
        return <AccountsView />;
      case '/categories':
        return <CategoriesView />;
      case '/budgets':
        return <BudgetsView />;
      case '/savings':
        return <SavingsView />;
      case '/debts':
        return <DebtsView />;
      case '/recurring':
        return <RecurringView />;
      case '/reports':
        return <ReportsView />;
      case '/financial-planning':
        return <FinancialPlanningView />;
      case '/notifications':
        return <NotificationsView />;
      case '/settings':
        return <SettingsView />;
      default:
        return <DashboardView onOpenCreateTransaction={handleOpenCreateTransaction} />;
    }
  };

  return (
    <div className="min-h-screen flex bg-zinc-50/50 dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100">
      {/* Desktop Sidebar */}
      <Sidebar />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        <Header
          onOpenCreateTransaction={handleOpenCreateTransaction}
          onOpenQuickInput={handleOpenQuickInput}
        />

        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto pb-24 lg:pb-12">
          {renderView()}
        </main>
      </div>

      {/* Mobile Bottom Navigation */}
      <MobileNav
        onOpenCreateTransaction={handleOpenCreateTransaction}
        onOpenQuickInput={handleOpenQuickInput}
      />

      {/* Connectivity Indicator */}
      <OfflineIndicator />

      {/* Transaction Form Modal */}
      <TransactionFormModal
        open={transactionModalOpen}
        onOpenChange={setTransactionModalOpen}
        transactionToEdit={editingTransaction}
      />

      {/* Quick Input Transaction Modal */}
      <QuickTransactionModal
        open={quickInputModalOpen}
        onOpenChange={setQuickInputModalOpen}
      />
    </div>
  );
};
