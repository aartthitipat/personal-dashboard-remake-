export default function StatCard({ label, value, badge, footer }) {
  return (
    <div className="rounded-lg border border-outline-variant bg-surface-container-lowest p-6">
      {badge && (
        <div className="mb-4 flex justify-end">
          <span className="rounded-full bg-surface-container px-3 py-1 text-xs font-medium text-on-surface-variant">
            {badge}
          </span>
        </div>
      )}
      <p className="text-sm text-on-surface-variant">{label}</p>
      <p className="mt-1 font-heading text-3xl font-semibold text-on-surface">{value}</p>
      {footer && <div className="mt-4 border-t border-outline-variant pt-3 text-sm">{footer}</div>}
    </div>
  );
}
