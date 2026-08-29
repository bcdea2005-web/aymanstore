import {defineType, defineField} from 'sanity'

export default defineType({
  name: 'storeSettings',
  title: 'إعدادات المتجر',
  type: 'document',
  // مستند مفرد (Singleton) — لا يُنشأ ولا يُحذف من الواجهة
  __experimental_actions: ['update', 'publish'],
  fields: [
    defineField({
      name: 'storeName',
      title: 'اسم المتجر',
      type: 'string',
      initialValue: 'متجر أيمن',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'tagline',
      title: 'الشعار الفرعي',
      type: 'string',
      initialValue: 'للملابس العصرية',
    }),
    defineField({
      name: 'whatsappNumber',
      title: 'رقم الواتساب (بصيغة دولية بدون +)',
      type: 'string',
      description: 'مثال: 249123456789',
      initialValue: '249123456789',
      validation: (Rule) =>
        Rule.required().regex(/^[0-9]{8,15}$/, {
          name: 'رقم هاتف',
          invert: false,
        }),
    }),
    defineField({
      name: 'logo',
      title: 'شعار المتجر',
      type: 'image',
      options: {hotspot: true},
    }),
  ],
  preview: {
    select: {title: 'storeName', subtitle: 'tagline', media: 'logo'},
  },
})
