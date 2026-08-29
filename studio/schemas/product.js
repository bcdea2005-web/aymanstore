import {defineType, defineField} from 'sanity'

export default defineType({
  name: 'product',
  title: 'المنتجات',
  type: 'document',
  fields: [
    defineField({
      name: 'name',
      title: 'اسم المنتج',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'price',
      title: 'السعر (ج.س)',
      type: 'number',
      validation: (Rule) => Rule.required().min(0),
    }),
    defineField({
      name: 'category',
      title: 'القسم',
      type: 'string',
      options: {
        list: [
          {title: 'بجامات', value: 'pajamas'},
          {title: 'بناطيل', value: 'pants'},
          {title: 'أقمصة', value: 'shirts'},
          {title: 'أحذية', value: 'shoes'},
          {title: 'مقاسات كبيرة', value: 'plus'},
        ],
        layout: 'radio',
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'branch',
      title: 'الفرع',
      type: 'reference',
      to: [{type: 'branch'}],
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'image',
      title: 'صورة المنتج',
      type: 'image',
      options: {hotspot: true},
    }),
    defineField({
      name: 'icon',
      title: 'أيقونة بديلة (Font Awesome)',
      type: 'string',
      description: 'تُستخدم إذا لم توجد صورة. مثال: fa-shirt, fa-user-tie, fa-shoe-prints, fa-bed',
      initialValue: 'fa-shirt',
    }),
    defineField({
      name: 'sizes',
      title: 'المقاسات المتاحة',
      type: 'array',
      of: [
        {
          type: 'object',
          fields: [
            {name: 'label', title: 'المقاس', type: 'string'},
            {name: 'available', title: 'متوفر؟', type: 'boolean', initialValue: true},
          ],
          preview: {
            select: {title: 'label', available: 'available'},
            prepare({title, available}) {
              return {title: `${title}${available === false ? ' (غير متوفر)' : ''}`}
            },
          },
        },
      ],
      options: {
        // اختصار لإضافة المقاسات الشائعة بسرعة عبر النص
      },
    }),
    defineField({
      name: 'available',
      title: 'المنتج متاح للبيع؟',
      type: 'boolean',
      initialValue: true,
    }),
    defineField({
      name: 'order',
      title: 'ترتيب العرض',
      type: 'number',
      initialValue: 0,
    }),
  ],
  orderings: [
    {
      title: 'ترتيب العرض',
      name: 'orderAsc',
      by: [{field: 'order', direction: 'asc'}],
    },
    {
      title: 'السعر تصاعدي',
      name: 'priceAsc',
      by: [{field: 'price', direction: 'asc'}],
    },
  ],
  preview: {
    select: {title: 'name', subtitle: 'price', media: 'image', branch: 'branch.name'},
    prepare({title, subtitle, media, branch}) {
      return {
        title: title,
        subtitle: `${subtitle ? subtitle + ' ج.س' : ''}${branch ? ' — ' + branch : ''}`,
        media: media,
      }
    },
  },
})
