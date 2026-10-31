import "@testing-library/jest-dom/vitest";
import { cleanup } from "@solidjs/testing-library";
import { afterEach, vi } from "vitest";

import "./dateMatchers";

afterEach(() => { cleanup(); vi.clearAllMocks(); });
