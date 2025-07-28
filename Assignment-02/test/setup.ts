import { vi } from "vitest";

// Declare and assign globally so it's accessible in your tests
const promptMock = vi.fn();
(globalThis as any).promptMock = promptMock;

vi.mock("prompt-sync", () => ({
  default: () => promptMock,
}));
