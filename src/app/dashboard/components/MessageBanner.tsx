interface MessageBannerProps {
  message: string | null;
  error: string | null;
}

export function MessageBanner({ message, error }: MessageBannerProps) {
  if (!message && !error) return null;

  const tone = error ? "bg-rose-50 text-rose-700 border-rose-200" : "bg-emerald-50 text-emerald-700 border-emerald-200";
  const content = error ?? message ?? "";

  return (
    <div className={`my-4 rounded-lg border px-4 py-3 text-sm font-medium shadow-sm ${tone}`}>
      {content}
    </div>
  );
}
