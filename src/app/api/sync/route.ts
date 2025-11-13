import { NextResponse } from "next/server"
import { db } from "@/db/drizzle"
import { products, sources } from "@/db/schema"
import { eq } from "drizzle-orm"

const delay = (ms: number) => new Promise((res) => setTimeout(res, ms))

// Poll for snapshot to be ready
async function pollSnapshotReady(
  snapshotId: string,
  apiKey: string,
  maxWaitTime: number = 10 * 60 * 1000, // 10 minutes max
  pollInterval: number = 10 * 1000 // Poll every 10 seconds
): Promise<void> {
  const startTime = Date.now()

  while (Date.now() - startTime < maxWaitTime) {
    try {
      const statusResponse = await fetch(
        `https://api.brightdata.com/datasets/v3/snapshot/${snapshotId}?format=json`,
        {
          headers: {
            Authorization: `Bearer ${apiKey}`,
          },
        }
      )

      if (statusResponse.ok) {
        const data = await statusResponse.json()

        // Check if snapshot has results (array with data)
        if (Array.isArray(data) && data.length > 0) {
          console.log(
            `Snapshot ${snapshotId} is ready with ${data.length} results`
          )
          return
        }

        // If it's an object, check for status indicators
        if (typeof data === "object" && data !== null) {
          // Some APIs return status in the response
          if (data.status === "ready" || data.status === "completed") {
            console.log(`Snapshot ${snapshotId} is ready`)
            return
          }
        }
      } else if (statusResponse.status === 404) {
        // Snapshot not found yet, continue polling
        console.log(
          `Snapshot ${snapshotId} not ready yet, continuing to poll...`
        )
      } else {
        // Other error, log but continue polling
        console.warn(
          `Unexpected status ${statusResponse.status} while polling snapshot`
        )
      }
    } catch (error) {
      // Network error, log but continue polling
      console.warn(
        `Error polling snapshot: ${
          error instanceof Error ? error.message : String(error)
        }`
      )
    }

    // Wait before next poll
    await delay(pollInterval)
  }

  throw new Error(
    `Snapshot ${snapshotId} did not become ready within ${
      maxWaitTime / 1000
    } seconds`
  )
}

export async function GET() {
  try {
    const amazonSources = await db
      .select()
      .from(sources)
      .where(eq(sources.sourceName, "Amazon"))

    if (!amazonSources.length) {
      return NextResponse.json({ message: "No Amazon sources found." })
    }

    const apiKey = process.env.BRIGHTDATA_API_KEY
    const datasetId = process.env.BRIGHTDATA_DATASET_ID
    const customOutputFields = "final_price%2Cdescription%2Cavailability%2Casin"

    if (!apiKey) {
      throw new Error("BRIGHTDATA_API_KEY is not set")
    }

    const amazonUrls = amazonSources.map((source) => ({
      url: `https://www.amazon.com/dp/${source.affiliateTag}`,
      zipcode: "92110",
      language: "EN",
    }))

    const scrapeResponse = await fetch(
      `https://api.brightdata.com/datasets/v3/scrape?dataset_id=${datasetId}&custom_output_fields=${customOutputFields}&notify=false&include_errors=true`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${apiKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ input: amazonUrls }),
      }
    )

    if (!scrapeResponse.ok) {
      throw new Error(`BrightData request failed: ${scrapeResponse.statusText}`)
    }

    const scrapeData = await scrapeResponse.json()
    const snapshotId = scrapeData.snapshot_id
    if (!snapshotId) {
      throw new Error("No snapshot_id returned from BrightData")
    }

    // Poll for snapshot to be ready instead of fixed delay
    console.log(`Polling for snapshot ${snapshotId} to be ready...`)
    await pollSnapshotReady(snapshotId, apiKey)

    const resultResponse = await fetch(
      `https://api.brightdata.com/datasets/v3/snapshot/${snapshotId}?format=json`,
      {
        headers: {
          Authorization: `Bearer ${apiKey}`,
        },
      }
    )

    if (!resultResponse.ok) {
      throw new Error(
        `Failed to fetch snapshot data: ${resultResponse.statusText}`
      )
    }

    const results = await resultResponse.json()
    console.log("BrightData snapshot results:", results)

    for (const result of results) {
      const amazonSource = amazonSources.find(
        (source) => source.affiliateTag === result.asin
      )
      if (amazonSource) {
        results[amazonSource.id] = {
          price: result.final_price,
          availability: result.availability,
          asin: result.asin,
        }

        // Update the sources table
        await db
          .update(sources)
          .set({
            price: result.final_price,
            availability: result.availability,
            lastSynced: new Date(),
          })
          .where(eq(sources.id, amazonSource.id))

        // Update the products table
        if (result.description) {
          await db
            .update(products)
            .set({
              description: result.description,
              updatedAt: new Date(),
            })
            .where(eq(products.id, amazonSource.productId ?? ""))
        }
      }
    }

    return NextResponse.json({
      updatedAt: new Date().toISOString(),
      count: amazonSources.length,
      snapshotId,
      results,
    })
  } catch (err) {
    console.error("Scraping error:", err)
    return NextResponse.json(
      { error: "Failed to scrape prices" },
      { status: 500 }
    )
  }
}
