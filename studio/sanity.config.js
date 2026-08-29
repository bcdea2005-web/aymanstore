import {defineConfig} from 'sanity'
import {structureTool} from 'sanity/structure'
import {visionTool} from '@sanity/vision'
import {schemaTypes} from './schemas'

export default defineConfig({
  name: 'ayman-store',
  title: 'متجر أيمن للملابس',

  projectId: 'p8stu12g',
  dataset: '1production',

  plugins: [
    structureTool({
      structure: (S) =>
        S.list()
          .title('لوحة تحكم متجر أيمن')
          .items([
            S.listItem()
              .title('إعدادات المتجر')
              .id('storeSettings')
              .child(
                S.document()
                  .schemaType('storeSettings')
                  .documentId('storeSettings')
                  .title('إعدادات المتجر'),
              ),
            S.divider(),
            S.documentTypeListItem('branch').title('الفروع'),
            S.documentTypeListItem('product').title('المنتجات'),
          ]),
    }),
    visionTool(),
  ],

  schema: {
    types: schemaTypes,
  },
})
