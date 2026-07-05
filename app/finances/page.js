import FinancesDashboard from "@/components/FinancesDashboard";
import { getSummary, listTransactions } from "@/lib/summarizer";
import { getSavingsGoal } from "@/lib/goals";
import { listSubscriptions } from "@/lib/subscriptions";

export const dynamic = "force-dynamic";

export default async function FinancesPage() {
  const summary = await getSummary();
  const transactions = await listTransactions();
  const savingsGoal = await getSavingsGoal();
  const subscriptions = await listSubscriptions();

  return (
    <FinancesDashboard
      summary={summary}
      transactions={transactions}
      savingsGoal={savingsGoal}
      subscriptions={subscriptions}
    />
  );
}
