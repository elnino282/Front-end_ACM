import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/shared/ui";
import { ShieldX } from "lucide-react";
import { useEffect, useState } from "react";

// Auth storage key from http.ts
const AUTH_STORAGE_KEY = "acm_auth";

/**
 * Clear auth data from storage (matches http.ts clearStoredAuth)
 */
function clearStoredAuth() {
  if (typeof window === "undefined") return;
  window.localStorage.removeItem(AUTH_STORAGE_KEY);
  window.sessionStorage.removeItem(AUTH_STORAGE_KEY);
}

/**
 * AccountLockedModal - Shows when user's account has been locked by admin.
 *
 * Listens for 'account-locked' custom event dispatched by http interceptor.
 * Shows Vietnamese message and ONLY redirects to sign-in after user clicks OK.
 */
export function AccountLockedModal() {
  const [isOpen, setIsOpen] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    const handleAccountLocked = (event: CustomEvent<{ message: string }>) => {
      setMessage(event.detail.message);
      setIsOpen(true);
    };

    window.addEventListener(
      "account-locked",
      handleAccountLocked as EventListener,
    );

    return () => {
      window.removeEventListener(
        "account-locked",
        handleAccountLocked as EventListener,
      );
    };
  }, []);

  const handleConfirm = () => {
    setIsOpen(false);

    // Clear auth data
    clearStoredAuth();

    // Redirect to sign-in page
    window.location.href = "/sign-in?locked=true";
  };

  return (
    <AlertDialog open={isOpen}>
      <AlertDialogContent className="max-w-md">
        <AlertDialogHeader>
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-full bg-destructive/10 flex items-center justify-center">
              <ShieldX className="w-6 h-6 text-destructive" />
            </div>
            <AlertDialogTitle className="text-xl text-destructive">
              Tài khoản bị khóa
            </AlertDialogTitle>
          </div>
        </AlertDialogHeader>
        <AlertDialogDescription className="text-base leading-relaxed">
          {message ||
            "Tài khoản của bạn đã bị khóa do vi phạm chính sách hệ thống. Vui lòng liên hệ quản trị viên để được hỗ trợ."}
        </AlertDialogDescription>
        <AlertDialogFooter>
          <Button onClick={handleConfirm} variant="destructive">
            OK
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
