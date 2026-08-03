import { NextResponse } from "next/server";
import { withApiHandler } from "@/lib/api-handler";
import { listServices } from "@/lib/data/services";

export const GET = withApiHandler(async () => {
  const services = await listServices();
  return NextResponse.json({ services });
});
