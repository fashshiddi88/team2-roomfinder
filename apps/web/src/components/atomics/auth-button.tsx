import { Button } from "../ui/button";

export default function AuthButtons() {
  return (
    <div className="flex items-center space-x-3">
      <a href="/login">
        <Button variant="ghost">Sign In</Button>
      </a>
      <a href="/register">
        <Button>Sign Up</Button>
      </a>
    </div>
  );
}
