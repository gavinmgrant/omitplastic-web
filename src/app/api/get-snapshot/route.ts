import { NextResponse } from "next/server"
import { db } from "@/db/drizzle"
import { sources, brightdataSnapshots } from "@/db/schema"
import { eq } from "drizzle-orm"

// This is the first phase of the two-phase approach to scrape Amazon product data.
// It initiates a scrape and returns the snapshot ID.

interface BrightDataScrapeResponse {
  snapshot_id: string
  [key: string]: unknown
}

// Validate ASIN format (10 characters, alphanumeric)
function isValidASIN(asin: string): boolean {
  const trimmed = asin.trim()
  return /^[A-Z0-9]{10}$/i.test(trimmed)
}

export async function GET(request: Request) {
  const authHeader = request.headers.get("authorization")
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return new Response("Unauthorized", {
      status: 401,
    })
  }

  const startTime = Date.now()

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
      console.log("[GetSnapshot] No Amazon sources found")
      return NextResponse.json({ message: "No Amazon sources found." })
    }

    console.log(
      `[GetSnapshot] Starting sync for ${amazonSources.length} Amazon sources`
    )

    // Filter out sources without affiliate tags and validate ASIN format
    const validSources = amazonSources.filter((source) => {
      if (!source.affiliateTag || source.affiliateTag.trim() === "") {
        return false
      }
      const trimmed = source.affiliateTag.trim()
      if (!isValidASIN(trimmed)) {
        console.warn(
          `[GetSnapshot] Invalid ASIN format for source ${source.id}: ${trimmed}`
        )
        return false
      }
      return true
    })

    if (validSources.length === 0) {
      throw new Error("No valid Amazon sources with affiliate tags found")
    }

    if (validSources.length < amazonSources.length) {
      console.warn(
        `[GetSnapshot] Filtered out ${
          amazonSources.length - validSources.length
        } sources without valid affiliate tags/ASINs`
      )
    }

    const customOutputFields =
      "final_price%2Cdescription%2Cavailability%2Casin%2Cimage_url%2Cupc%2Crating"

    const amazonUrls = validSources.map((source) => ({
      url: `https://www.amazon.com/dp/${source.affiliateTag}`,
      zipcode: "92110",
      language: "EN",
    }))

    // Initiate scrape (single call, no retries)
    console.log(`[GetSnapshot] Calling BrightData API to initiate scrape...`)

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

    // More defensive parsing of response
    const newSnapshotId =
      typeof scrapeData === "object" &&
      scrapeData !== null &&
      "snapshot_id" in scrapeData &&
      typeof scrapeData.snapshot_id === "string"
        ? scrapeData.snapshot_id
        : null

    if (!newSnapshotId) {
      throw new Error("No valid snapshot_id returned from BrightData")
    }

    console.log(`[GetSnapshot] Created snapshot ${newSnapshotId}`)

    const duration = Date.now() - startTime

    // Store snapshot ID in database
    await db.insert(brightdataSnapshots).values({
      snapshotId: newSnapshotId,
    })

    const response = NextResponse.json({
      message: "Scrape initiated successfully",
      snapshotId: newSnapshotId,
      count: validSources.length,
      duration: `${duration}ms`,
    })
    
    // Don't cache cron job responses
    response.headers.set("Cache-Control", "no-store, no-cache, must-revalidate")
    
    return response
  } catch (err) {
    const duration = Date.now() - startTime
    const errorMessage =
      err instanceof Error ? err.message : "Unknown error occurred"
    const errorStack = err instanceof Error ? err.stack : undefined

    console.error(`[GetSnapshot] Error after ${duration}ms:`, {
      message: errorMessage,
      stack: errorStack,
    })

    const response = NextResponse.json(
      {
        error: "Failed to initiate scrape",
        message: errorMessage,
        duration: `${duration}ms`,
      },
      { status: 500 }
    )
    
    response.headers.set("Cache-Control", "no-store, no-cache, must-revalidate")
    
    return response
  }
}
