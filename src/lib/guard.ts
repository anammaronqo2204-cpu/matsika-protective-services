import { getSession, type SessionUser } from "@/lib/auth";

export type GuardResult =
  | { ok: true; user: SessionUser }
  | { ok: false; response: Response };

export async function requireAdmin(): Promise<GuardResult> {
  const user = await getSession();
  if (!user) {
    return {
      ok: false,
      response: Response.json({ ok: false, error: "Not authenticated." }, { status: 401 }),
    };
  }
  return { ok: true, user };
}

export function forbidden(message = "Your role does not permit this action.") {
  return Response.json({ ok: false, error: message }, { status: 403 });
}
