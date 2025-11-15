import { NextResponse } from "next/server"
import { db } from "@/db/drizzle"
import { products, sources, brightdataSnapshots } from "@/db/schema"
import { eq } from "drizzle-orm"

// Simple two-phase approach:
// Phase 1: Initiate scrape (returns immediately with snapshot ID)
// Phase 2: Fetch and process results (call with ?snapshot_id=xxx)

// Type definitions for BrightData API responses
interface BrightDataScrapeResponse {
  snapshot_id: string
  [key: string]: unknown
}

interface BrightDataResult {
  asin?: string
  final_price?: string | number
  availability?: string
  description?: string
  image_url?: string
  upc?: string
  error?: string
  [key: string]: unknown
}

interface ProcessedResult {
  sourceId: string
  price: string | number | null
  availability: string
  asin?: string
  description?: string
  imageUrl?: string
  barcode?: string
  success: boolean
  error?: string
}

// Check if snapshot is ready (single check, no polling)
async function checkSnapshotReady(
  snapshotId: string,
  apiKey: string
): Promise<{ ready: boolean; results?: BrightDataResult[] }> {
  try {
    const statusResponse = await fetch(
      `https://api.brightdata.com/datasets/v3/snapshot/${snapshotId}?format=json`,
      {
        headers: {
          Authorization: `Bearer ${apiKey}`,
        },
        signal: AbortSignal.timeout(30000), // 30 second timeout
      }
    )

    if (statusResponse.ok) {
      const data = await statusResponse.json()

      // Check if snapshot has results (array with data)
      if (Array.isArray(data) && data.length > 0) {
        console.log(
          `[Sync] Snapshot ${snapshotId} is ready with ${data.length} results`
        )
        return { ready: true, results: data as BrightDataResult[] }
      }

      // If it's an object, check for status indicators
      if (typeof data === "object" && data !== null && !Array.isArray(data)) {
        // Some APIs return status in the response
        if (data.status === "ready" || data.status === "completed") {
          // If status is ready but no array, try to get results
          if (Array.isArray(data.results) && data.results.length > 0) {
            return { ready: true, results: data.results as BrightDataResult[] }
          }
          return { ready: true }
        }
      }
    } else if (statusResponse.status === 404) {
      // Snapshot not found yet
      console.log(`[Sync] Snapshot ${snapshotId} not ready yet (404)`)
      return { ready: false }
    } else {
      // Other error
      console.warn(
        `[Sync] Unexpected status ${statusResponse.status} while checking snapshot`
      )
      return { ready: false }
    }
  } catch (error) {
    // Network error
    if (error instanceof Error && error.name === "AbortError") {
      console.warn(
        `[Sync] Request timeout while checking snapshot ${snapshotId}`
      )
    } else {
      console.warn(
        `[Sync] Error checking snapshot: ${
          error instanceof Error ? error.message : String(error)
        }`
      )
    }
    return { ready: false }
  }

  return { ready: false }
}

export async function GET(request: Request) {
  const authHeader = request.headers.get("authorization")
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return new Response("Unauthorized", {
      status: 401,
    })
  }

  const startTime = Date.now()
  const url = new URL(request.url)
  const snapshotId = url.searchParams.get("snapshot_id")

  // Phase 2: Check and process snapshot results
  if (snapshotId) {
    return await processSnapshot(snapshotId, startTime)
  }

  // Phase 1: Initiate scrape
  try {
    // Validate environment variables
    const apiKey = process.env.BRIGHTDATA_API_KEY
    const datasetId = process.env.BRIGHTDATA_DATASET_ID

    if (!apiKey) {
      throw new Error("BRIGHTDATA_API_KEY is not set")
    }

    if (!datasetId) {
      throw new Error("BRIGHTDATA_DATASET_ID is not set")
    }

    // Fetch Amazon sources
    const amazonSources = await db
      .select()
      .from(sources)
      .where(eq(sources.sourceName, "Amazon"))

    if (!amazonSources.length) {
      console.log("[Sync] No Amazon sources found")
      return NextResponse.json({ message: "No Amazon sources found." })
    }

    console.log(
      `[Sync] Starting sync for ${amazonSources.length} Amazon sources`
    )

    // Filter out sources without affiliate tags
    const validSources = amazonSources.filter(
      (source) => source.affiliateTag && source.affiliateTag.trim() !== ""
    )

    if (validSources.length === 0) {
      throw new Error("No valid Amazon sources with affiliate tags found")
    }

    if (validSources.length < amazonSources.length) {
      console.warn(
        `[Sync] Filtered out ${
          amazonSources.length - validSources.length
        } sources without affiliate tags`
      )
    }

    const customOutputFields =
      "final_price%2Cdescription%2Cavailability%2Casin%2Cimage_url%2Cupc"

    const amazonUrls = validSources.map((source) => ({
      url: `https://www.amazon.com/dp/${source.affiliateTag}`,
      zipcode: "92110",
      language: "EN",
    }))

    // Initiate scrape (single call, no retries)
    console.log(`[Sync] Calling BrightData API to initiate scrape...`)

    let scrapeResponse: Response
    try {
      scrapeResponse = await fetch(
        `https://api.brightdata.com/datasets/v3/scrape?dataset_id=${datasetId}&custom_output_fields=${customOutputFields}&notify=false&include_errors=true`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${apiKey}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ input: amazonUrls }),
          signal: AbortSignal.timeout(240000), // 4 minute timeout
        }
      )
    } catch (fetchError) {
      // Handle timeout or network errors
      if (fetchError instanceof Error && fetchError.name === "AbortError") {
        throw new Error(
          "Request timed out. BrightData may still be processing the scrape. Check your BrightData dashboard for the snapshot ID, or try again."
        )
      }
      throw fetchError
    }

    if (!scrapeResponse.ok) {
      const errorText = await scrapeResponse.text()
      throw new Error(
        `BrightData request failed: ${scrapeResponse.status} ${scrapeResponse.statusText} - ${errorText}`
      )
    }

    const scrapeData = (await scrapeResponse.json()) as BrightDataScrapeResponse

    const newSnapshotId = scrapeData.snapshot_id
    if (!newSnapshotId || typeof newSnapshotId !== "string") {
      throw new Error("No valid snapshot_id returned from BrightData")
    }

    console.log(`[Sync] Created snapshot ${newSnapshotId}`)

    const duration = Date.now() - startTime

    // Store snapshot ID in database
    await db.insert(brightdataSnapshots).values({
      snapshotId: newSnapshotId,
    })

    return NextResponse.json({
      message: "Scrape initiated successfully",
      snapshotId: newSnapshotId,
      count: validSources.length,
      duration: `${duration}ms`,
      nextStep: `Call /api/sync?snapshot_id=${newSnapshotId} to fetch and process results`,
    })
  } catch (err) {
    const duration = Date.now() - startTime
    const errorMessage =
      err instanceof Error ? err.message : "Unknown error occurred"
    const errorStack = err instanceof Error ? err.stack : undefined

    console.error(`[Sync] Error after ${duration}ms:`, {
      message: errorMessage,
      stack: errorStack,
    })

    return NextResponse.json(
      {
        error: "Failed to initiate scrape",
        message: errorMessage,
        duration: `${duration}ms`,
      },
      { status: 500 }
    )
  }
}

// Phase 2: Process snapshot results
async function processSnapshot(
  snapshotId: string,
  startTime: number
): Promise<NextResponse> {
  try {
    const apiKey = process.env.BRIGHTDATA_API_KEY

    if (!apiKey) {
      throw new Error("BRIGHTDATA_API_KEY is not set")
    }

    console.log(`[Sync] Checking snapshot ${snapshotId}...`)

    // Check if snapshot is ready (single check, no polling)
    const snapshotStatus = await checkSnapshotReady(snapshotId, apiKey)

    if (!snapshotStatus.ready) {
      return NextResponse.json({
        message: "Snapshot not ready yet",
        snapshotId,
        ready: false,
        duration: `${Date.now() - startTime}ms`,
        nextStep: `Call /api/sync?snapshot_id=${snapshotId} again later to check results`,
      })
    }

    // Fetch results if not already provided
    let results = snapshotStatus.results
    if (!results) {
      const resultResponse = await fetch(
        `https://api.brightdata.com/datasets/v3/snapshot/${snapshotId}?format=json`,
        {
          headers: {
            Authorization: `Bearer ${apiKey}`,
          },
          signal: AbortSignal.timeout(30000), // 30 second timeout
        }
      )

      if (!resultResponse.ok) {
        const errorText = await resultResponse.text()
        throw new Error(
          `Failed to fetch snapshot data: ${resultResponse.status} ${resultResponse.statusText} - ${errorText}`
        )
      }

      const data = await resultResponse.json()
      results = Array.isArray(data)
        ? data
        : (data.results as BrightDataResult[]) || []
    }

    if (!results || results.length === 0) {
      return NextResponse.json({
        message: "Snapshot ready but no results found",
        snapshotId,
        ready: true,
        resultsCount: 0,
        duration: `${Date.now() - startTime}ms`,
      })
    }

    console.log(
      `[Sync] Processing ${results.length} results from snapshot ${snapshotId}`
    )

    // Fetch sources for matching
    const amazonSources = await db
      .select()
      .from(sources)
      .where(eq(sources.sourceName, "Amazon"))

    const validSources = amazonSources.filter(
      (source) => source.affiliateTag && source.affiliateTag.trim() !== ""
    )

    // Process results and prepare updates
    const processedResults: ProcessedResult[] = []
    const updatePromises: Promise<void>[] = []

    for (const result of results) {
      // Skip results with errors
      if (result.error) {
        console.warn(
          `[Sync] Error in result for ASIN ${result.asin}: ${result.error}`
        )
        continue
      }

      const amazonSource = validSources.find(
        (source) => source.affiliateTag === result.asin
      )

      if (!amazonSource) {
        console.warn(`[Sync] No matching source found for ASIN: ${result.asin}`)
        continue
      }

      if (!amazonSource.productId) {
        console.warn(
          `[Sync] Source ${amazonSource.id} has no productId, skipping`
        )
        continue
      }

      const processedResult: ProcessedResult = {
        sourceId: amazonSource.id,
        price: result.final_price ?? null,
        availability: result.availability ?? "unknown",
        asin: result.asin,
        success: true,
      }

      // Process description
      if (result.description && typeof result.description === "string") {
        let descr = result.description
        const PREFIX = "About this item "
        const SUFFIX = " › See more product details"

        if (descr.startsWith(PREFIX)) {
          descr = descr.slice(PREFIX.length)
        }

        if (descr.endsWith(SUFFIX)) {
          descr = descr.slice(0, -SUFFIX.length)
        }

        processedResult.description = descr.trim() || undefined
      }

      // Process image URL
      if (result.image_url && typeof result.image_url === "string") {
        processedResult.imageUrl = result.image_url.trim() || undefined
      }

      // Process UPC/barcode
      if (result.upc && typeof result.upc === "string") {
        processedResult.barcode = result.upc.trim() || undefined
      }

      processedResults.push(processedResult)

      // Create update promise for this result
      // Store productId in a const to satisfy TypeScript's null checking
      const productId = amazonSource.productId
      updatePromises.push(
        (async () => {
          try {
            // Update source
            await db
              .update(sources)
              .set({
                price:
                  processedResult.price !== null
                    ? String(processedResult.price)
                    : null,
                availability: processedResult.availability,
                lastSynced: new Date(),
              })
              .where(eq(sources.id, amazonSource.id))

            // Update product if we have product data
            const productUpdates: {
              description?: string
              imageUrl?: string
              barcode?: string
              updatedAt: Date
            } = {
              updatedAt: new Date(),
            }

            if (processedResult.description) {
              productUpdates.description = processedResult.description
            }

            if (processedResult.imageUrl) {
              productUpdates.imageUrl = processedResult.imageUrl
            }

            if (processedResult.barcode) {
              productUpdates.barcode = processedResult.barcode
            }

            // Only update if we have something to update
            if (
              productUpdates.description ||
              productUpdates.imageUrl ||
              productUpdates.barcode
            ) {
              await db
                .update(products)
                .set(productUpdates)
                .where(eq(products.id, productId))
            }
          } catch (error) {
            processedResult.success = false
            processedResult.error =
              error instanceof Error ? error.message : String(error)
            console.error(
              `[Sync] Failed to update source ${amazonSource.id}:`,
              error
            )
          }
        })()
      )
    }

    // Execute all updates in parallel
    await Promise.allSettled(updatePromises)

    const successful = processedResults.filter((r) => r.success).length
    const failed = processedResults.filter((r) => !r.success).length

    const duration = Date.now() - startTime

    console.log(
      `[Sync] Completed: ${successful} successful, ${failed} failed in ${duration}ms`
    )

    return NextResponse.json({
      updatedAt: new Date().toISOString(),
      count: validSources.length,
      successful,
      failed,
      snapshotId,
      duration: `${duration}ms`,
      results: processedResults.map((r) => ({
        sourceId: r.sourceId,
        success: r.success,
        price: r.price,
        availability: r.availability,
        error: r.error,
      })),
    })
  } catch (err) {
    const duration = Date.now() - startTime
    const errorMessage =
      err instanceof Error ? err.message : "Unknown error occurred"
    const errorStack = err instanceof Error ? err.stack : undefined

    console.error(`[Sync] Error processing snapshot after ${duration}ms:`, {
      message: errorMessage,
      stack: errorStack,
    })

    return NextResponse.json(
      {
        error: "Failed to process snapshot",
        message: errorMessage,
        snapshotId,
        duration: `${duration}ms`,
      },
      { status: 500 }
    )
  }
}
