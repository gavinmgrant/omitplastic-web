import { config, collection, fields } from "@keystatic/core"

export default config({
  storage: {
    kind: "local",
  },

  ui: {
    brand: {
      name: "OmitPlastic",
    },
    navigation: {
      Guides: ["guides"],
    },
  },

  collections: {
    guides: collection({
      label: "Guides",
      path: "src/content/guides/*",
      slugField: "title",
      format: { contentField: "content" },
      schema: {
        title: fields.slug({ name: { label: 'Title' } }),

        description: fields.text({
          label: "Meta Description",
          validation: { length: { min: 50, max: 160 } },
        }),

        coverImage: fields.image({
          label: "Cover Image",
          directory: "public/uploads/guides",
          publicPath: "/uploads/guides",
        }),

        publishedAt: fields.datetime({
          label: "Published At",
          defaultValue: { kind: "now" },
        }),

        content: fields.mdx({
          label: "Content",
          options: {
            image: {
              directory: "public/uploads/guides",
              publicPath: "/uploads/guides",
            },
          },
        }),
      },
    }),
  },
})
