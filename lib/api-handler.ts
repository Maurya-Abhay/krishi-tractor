import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { ZodError } from "zod";
import { Prisma } from "@prisma/client";
import { authOptions } from "@/lib/auth";
import { checkRateLimit } from "@/lib/rate-limit";

export class ApiError extends Error {
  constructor(public status: number, message: string) {
    super(message);
  }
}

type Session = { user: { id: string; name: string; phone: string } };

type Handler = (req: NextRequest, ctx: any) => Promise<NextResponse>;

/**
 * Wraps a Route Handler with: session verification, rate limiting,
 * and consistent error formatting (Zod validation errors, Prisma known
 * errors, and unexpected errors all map to safe, typed JSON responses).
 * This is the ONLY place this cross-cutting logic should live — individual
 * routes just implement their Prisma query.
 */
export function withApiHandler(handler: Handler) {
  return async (req: NextRequest, context: any): Promise<NextResponse> => {
    try {
      const session = await getServerSession(authOptions);
      if (!session?.user) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
      }

      const rateLimit = await checkRateLimit(session.user.id);
      if (!rateLimit.success) {
        return NextResponse.json(
          { error: "Too many requests. Please slow down." },
          { status: 429 }
        );
      }

      const params = await context?.params;
      return await handler(req, { session: session as Session, params });
    } catch (error) {
      return handleApiError(error);
    }
  };
}

function handleApiError(error: unknown): NextResponse {
  if (error instanceof ApiError) {
    return NextResponse.json({ error: error.message }, { status: error.status });
  }

  if (error instanceof ZodError) {
    return NextResponse.json(
      { error: "Validation failed", details: error.flatten().fieldErrors },
      { status: 400 }
    );
  }

  if (error instanceof Prisma.PrismaClientKnownRequestError) {
    if (error.code === "P2002") {
      return NextResponse.json(
        { error: "A record with this value already exists." },
        { status: 409 }
      );
    }
    if (error.code === "P2025") {
      return NextResponse.json({ error: "Record not found." }, { status: 404 });
    }
    if (error.code === "P2003") {
      return NextResponse.json(
        { error: "This record is referenced elsewhere and cannot be modified." },
        { status: 409 }
      );
    }
  }

  // Never leak internal error details to the client.
  console.error("Unhandled API error:", error);
  return NextResponse.json({ error: "Something went wrong. Please try again." }, { status: 500 });
}

export async function parseJson<T>(req: NextRequest, schema: { parse: (v: unknown) => T }): Promise<T> {
  const body = await req.json().catch(() => {
    throw new ApiError(400, "Invalid JSON body");
  });
  return schema.parse(body);
}
