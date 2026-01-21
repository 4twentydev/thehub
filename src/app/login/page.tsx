"use client";

import * as React from "react";
import { signIn } from "next-auth/react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function LoginPage() {
  const [pin, setPin] = React.useState("");
  const [loading, setLoading] = React.useState(false);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoading(true);
    const result = await signIn("credentials", {
      pin,
      redirect: true,
      callbackUrl: "/admin"
    });

    if (result?.error) {
      toast.error("Invalid PIN. Try again.");
    }
    setLoading(false);
  };

  return (
    <div className="mx-auto flex min-h-[60vh] w-full max-w-md items-center">
      <Card className="w-full border-border/60 bg-card/80">
        <CardHeader>
          <CardTitle>Owner Mode</CardTitle>
          <CardDescription>Enter your secure PIN to unlock admin controls.</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm text-muted-foreground" htmlFor="pin">
                Owner PIN
              </label>
              <input
                id="pin"
                type="password"
                value={pin}
                onChange={(event) => setPin(event.target.value)}
                className="h-11 w-full rounded-lg border border-border bg-background px-3 text-sm"
                placeholder="Enter PIN"
                required
              />
            </div>
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? "Authorizing..." : "Enter dashboard"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
