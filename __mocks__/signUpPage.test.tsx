import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import SignUpPage from "@/app/sign-up/page";
import { signup } from "@/app/sign-up/actions";

jest.mock("@/app/sign-up/actions", () => ({
  signup: jest.fn(),
}));

describe("Sign-Up Page", () => {
  it("renders the form", () => {
    render(<SignUpPage />);
    expect(screen.getByText(/Sign Up/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Email:/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Password:/i)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /Sign up/i })).toBeInTheDocument();
  });

  it("submits the form successfully", async () => {
    (signup as jest.Mock).mockResolvedValueOnce({ error: null });

    render(<SignUpPage />);

    fireEvent.change(screen.getByLabelText(/Email:/i), {
      target: { value: "testuser@example.com" },
    });
    fireEvent.change(screen.getByLabelText(/Password:/i), {
      target: { value: "password123" },
    });

    fireEvent.click(screen.getByRole("button", { name: /Sign up/i }));

    await waitFor(() => {
      expect(signup).toHaveBeenCalledWith(expect.any(FormData));
    });
  });

  it("shows an error when the user already exists", async () => {
    (signup as jest.Mock).mockResolvedValueOnce({
      error: { message: "User already exists" },
    });

    render(<SignUpPage />);

    fireEvent.change(screen.getByLabelText(/Email:/i), {
      target: { value: "already@exists.com" },
    });
    fireEvent.change(screen.getByLabelText(/Password:/i), {
      target: { value: "password123" },
    });

    fireEvent.click(screen.getByRole("button", { name: /Sign up/i }));

    await waitFor(() => {
      expect(signup).toHaveBeenCalledWith(expect.any(FormData));
    });

    expect(await screen.findByText(/User already exists/i)).toBeInTheDocument();
  });
});
