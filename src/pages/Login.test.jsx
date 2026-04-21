// src/pages/Login.test.jsx
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { MemoryRouter, useNavigate } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { vi } from "vitest";
import Login from "./Login";
import api from "../api/axios";
import { useAuthStore } from "../store/authStore";

// 1. Mock the Axios API client
vi.mock("../api/axios", () => ({
  default: {
    get: vi.fn(),
    post: vi.fn(),
  },
}));

// 2. Mock React Router's useNavigate
const mockNavigate = vi.fn();
vi.mock("react-router-dom", async () => {
  const actual = await vi.importActual("react-router-dom");
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

// Wrapper to provide React Query and Router context to our component
const renderWithProviders = (component) => {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  });
  return render(
    <QueryClientProvider client={queryClient}>
      <MemoryRouter>{component}</MemoryRouter>
    </QueryClientProvider>,
  );
};

describe("Login Component", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    // Clear Zustand store before each test
    useAuthStore.getState().clearAuth();
  });

  it("renders the login form correctly", () => {
    renderWithProviders(<Login />);
    expect(
      screen.getByPlaceholderText("agronomist@farm.com"),
    ).toBeInTheDocument();
    expect(
      screen.getByPlaceholderText("Enter your password"),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /sign in/i }),
    ).toBeInTheDocument();
  });

  it("shows validation error if submitted empty", async () => {
    renderWithProviders(<Login />);
    const submitButton = screen.getByRole("button", { name: /sign in/i });

    fireEvent.click(submitButton);

    expect(
      await screen.findByText("Email and password are required."),
    ).toBeInTheDocument();
    // Ensure API was never called
    expect(api.post).not.toHaveBeenCalled();
  });

  it("displays error message on failed API login", async () => {
    // Mock a 422 Unprocessable Entity response from Laravel
    api.get.mockResolvedValueOnce({}); // Mock CSRF call
    api.post.mockRejectedValueOnce({
      response: {
        data: { message: "The provided credentials are incorrect." },
      },
    });

    renderWithProviders(<Login />);

    fireEvent.change(screen.getByPlaceholderText("agronomist@farm.com"), {
      target: { value: "admin@openrails.com" },
    });
    fireEvent.change(screen.getByPlaceholderText("Enter your password"), {
      target: { value: "wrongpassword" },
    });
    fireEvent.click(screen.getByRole("button", { name: /sign in/i }));

    // Wait for the TanStack Query mutation to fail and update the UI
    expect(
      await screen.findByText("The provided credentials are incorrect."),
    ).toBeInTheDocument();
  });

  it("successfully logs in an admin and redirects to admin dashboard", async () => {
    const mockAdminResponse = {
      data: {
        token: "mock-token",
        user: { id: 1, email: "admin@openrails.com", role: "admin" },
      },
    };

    api.get.mockResolvedValueOnce({}); // Mock CSRF call
    api.post.mockResolvedValueOnce(mockAdminResponse); // Mock Login call

    renderWithProviders(<Login />);

    fireEvent.change(screen.getByPlaceholderText("agronomist@farm.com"), {
      target: { value: "admin@openrails.com" },
    });
    fireEvent.change(screen.getByPlaceholderText("Enter your password"), {
      target: { value: "securePassword123" },
    });
    fireEvent.click(screen.getByRole("button", { name: /sign in/i }));

    // Wait for asynchronous actions to complete
    await waitFor(() => {
      // 1. Verify Zustand store was updated
      expect(useAuthStore.getState().user.email).toBe("admin@openrails.com");
      // 2. Verify router redirect fired correctly
      expect(mockNavigate).toHaveBeenCalledWith("/admin/dashboard");
    });
  });
});
