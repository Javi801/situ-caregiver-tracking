import type { ReactElement, ReactNode } from "react";
import { render, type RenderOptions } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { ShiftProvider } from "@/hooks/ShiftProvider";
import { ToastProvider } from "@/components/feedback/ToastProvider";

interface Options extends Omit<RenderOptions, "wrapper"> {
  route?: string;
}

/** Render a component wrapped in router + shared app providers. */
export function renderWithProviders(ui: ReactElement, { route = "/", ...options }: Options = {}) {
  function Wrapper({ children }: { children: ReactNode }) {
    return (
      <MemoryRouter initialEntries={[route]}>
        <ShiftProvider>
          <ToastProvider>{children}</ToastProvider>
        </ShiftProvider>
      </MemoryRouter>
    );
  }

  return render(ui, { wrapper: Wrapper, ...options });
}
