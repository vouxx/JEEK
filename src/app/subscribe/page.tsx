import { SubscribeForm } from "@/components/SubscribeForm";

export default function SubscribePage() {
  return (
    <div className="px-6 py-6">
      <div className="mb-8">
        <h1 className="text-lg font-bold text-neutral-900 dark:text-neutral-100">뉴스레터 구독</h1>
        <p className="mt-1 text-sm text-neutral-400 dark:text-neutral-500">
          매일 아침 AI/Tech 뉴스를 이메일로 받아보세요.
        </p>
      </div>
      <SubscribeForm />
    </div>
  );
}
