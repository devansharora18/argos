import type { Toast } from '../../types/controlRoom';

type ToastStackProps = {
  toasts: Toast[];
};

export function ToastStack({ toasts }: ToastStackProps): JSX.Element {
  return (
    <div className="fixed bottom-4 right-4 z-20 grid gap-2">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className="min-w-[260px] border border-[#3a4258] bg-[#1a202d] p-2.5 font-['Space_Mono'] text-xs tracking-[0.05em] text-[#dbddea]"
        >
          {toast.message}
        </div>
      ))}
    </div>
  );
}
