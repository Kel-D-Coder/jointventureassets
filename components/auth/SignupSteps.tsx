import { FiCheck } from "react-icons/fi";
import { cx } from "@/lib/format";

const steps = ["Role", "Category", "Account", "Profile"];

/** Progress through sign-up: role → category → account → profile. `current` is 0-based. */
export function SignupSteps({ current }: { current: number }) {
  return (
    <ol className="mb-8 flex items-center gap-2" aria-label="Sign-up progress">
      {steps.map((step, index) => {
        const done = index < current;
        const active = index === current;
        return (
          <li key={step} className="flex flex-1 items-center gap-2" aria-current={active ? "step" : undefined}>
            <span
              className={cx(
                "grid h-7 w-7 shrink-0 place-items-center rounded-full text-xs font-bold",
                done && "bg-gold text-ink",
                active && "bg-ink text-white",
                !done && !active && "border border-line bg-white text-muted",
              )}
            >
              {done ? <FiCheck aria-hidden="true" /> : index + 1}
            </span>
            <span className={cx("hidden text-xs font-semibold sm:inline", active ? "text-ink" : "text-muted")}>{step}</span>
            {index < steps.length - 1 ? <span className={cx("h-px flex-1", done ? "bg-gold" : "bg-line")} /> : null}
          </li>
        );
      })}
    </ol>
  );
}
