import { ReadonlyRequestCookies } from "next/dist/server/web/spec-extension/adapters/request-cookies";
import { createServer } from "./createServer";

const supabase = (cookies: ReadonlyRequestCookies) => createServer(cookies);
export default supabase;
