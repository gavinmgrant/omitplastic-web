import { makeRouteHandler } from "@keystatic/next/route-handler"
import keystaticConfig from "../../../../../keystatic.config"

const isProd = process.env.NODE_ENV === "production"

const keystaticHandlers = isProd
  ? null
  : makeRouteHandler({
      config: keystaticConfig,
    })

export const GET = isProd
  ? async () => new Response(null, { status: 404 })
  : keystaticHandlers!.GET

export const POST = isProd
  ? async () => new Response(null, { status: 404 })
  : keystaticHandlers!.POST

