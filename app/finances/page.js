import FinancesDashboard from "@/components/FinancesDashboard";
import { getSummary, listTransactions } from "@/lib/summarizer";
import { getSavingsGoal } from "@/lib/goals";
import { listSubscriptions } from "@/lib/subscriptions";

export const dynamic = "force-dynamic";

export default async function FinancesPage() {
  const summary = getSummary();
  const transactions = listTransactions();
  const savingsGoal = getSavingsGoal();
  const subscriptions = listSubscriptions();

  return (
    <FinancesDashboard
      summary={summary}
      transactions={transactions}
      savingsGoal={savingsGoal}
      subscriptions={subscriptions}
    />
  );
}
