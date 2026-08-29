import {defineType, defineField} from 'sanity'

export default defineType({
  name: 'branch',
  title: 'الفروع',
  type: 'document',
  fields: [
    defineField({
      name: 'name',
      title: 'اسم الفرع',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'description',
      title: 'وصف الفرع',
      type: 'string',
      description: 'مثال: العاصمة، الخرطوم بحري ...',
    }),
    defineField({
      name: 'icon',
      title: 'أيقونة الفرع (Font Awesome)',
      type: 'string',
      description: 'اسم أيقونة FontAwesome، مثال: fa-city, fa-mosque, fa-water, fa-ship',
      initialValue: 'fa-store',
    }),
    defineField({
      name: 'deliveryFee',
      title: 'رسوم التوصيل (ج.س)',
      type: 'number',
      initialValue: 0,
      validation: (Rule) => Rule.required().min(0),
    }),
    defineField({
      name: 'active',
      title: 'الفرع مُفعّل؟',
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
  ],
  preview: {
    select: {title: 'name', subtitle: 'description', active: 'active'},
    prepare({title, subtitle, active}) {
      return {
        title: title,
        subtitle: `${subtitle || ''}${active === false ? ' — (غير مفعّل)' : ''}`,
      }
    },
  },
})
