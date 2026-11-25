import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { reducer } from "./use-toast";

const t = (id: string, extra: Record<string, unknown> = {}) =>
  ({ id, title: `toast ${id}`, open: true, ...extra }) as any;

beforeEach(() => {
  vi.useFakeTimers();
});

afterEach(() => {
  vi.clearAllTimers();
  vi.useRealTimers();
});

describe("toast reducer", () => {
  it("ADD_TOAST puts the newest toast first and keeps only one", () => {
    const state = reducer({ toasts: [t("1")] }, { type: "ADD_TOAST", toast: t("2") });
    expect(state.toasts.map((x) => x.id)).toEqual(["2"]);
  });

  it("UPDATE_TOAST merges changes into the matching toast only", () => {
    const state = reducer(
      { toasts: [t("1"), t("2")] },
      { type: "UPDATE_TOAST", toast: { id: "2", title: "changed" } }
    );
    expect(state.toasts[0].title).toBe("toast 1");
    expect(state.toasts[1].title).toBe("changed");
  });

  it("DISMISS_TOAST with an id closes only that toast", () => {
    const state = reducer({ toasts: [t("1"), t("2")] }, { type: "DISMISS_TOAST", toastId: "1" });
    expect(state.toasts.map((x) => x.open)).toEqual([false, true]);
  });

  it("DISMISS_TOAST without an id closes all toasts", () => {
    const state = reducer({ toasts: [t("1"), t("2")] }, { type: "DISMISS_TOAST" });
    expect(state.toasts.every((x) => x.open === false)).toBe(true);
  });

  it("REMOVE_TOAST with an id removes only that toast", () => {
    const state = reducer({ toasts: [t("1"), t("2")] }, { type: "REMOVE_TOAST", toastId: "1" });
    expect(state.toasts.map((x) => x.id)).toEqual(["2"]);
  });

  it("REMOVE_TOAST without an id clears every toast", () => {
    const state = reducer({ toasts: [t("1"), t("2")] }, { type: "REMOVE_TOAST" });
    expect(state.toasts).toEqual([]);
  });
});
