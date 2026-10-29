import { createContactHandler } from "@/lib/contact/handler";

const { POST: post, methodNotAllowed } = createContactHandler();

export const POST = post;
export const GET = methodNotAllowed;
export const PUT = methodNotAllowed;
export const PATCH = methodNotAllowed;
export const DELETE = methodNotAllowed;
export const OPTIONS = methodNotAllowed;
