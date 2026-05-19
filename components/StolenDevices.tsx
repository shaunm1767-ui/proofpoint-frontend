export default function StolenDevices({
  stolen,
}: {
  stolen: Record<string, { reportedAt: string }>;
}) {
  if (!stolen) return <p>No stolen devices reported.</p>;

  return (
    <section>
      <h2>Stolen Devices</h2>
      <ul>
        {Object.entries(stolen).map(([serial, info]) => (
          <li key={serial}>
            🚨 <strong>{serial}</strong> — reported at {info.reportedAt}
          </li>
        ))}
      </ul>
    </section>
  );
}
