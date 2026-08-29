import {defineCliConfig} from 'sanity/cli'

export default defineCliConfig({
  api: {
    projectId: 'p8stu12g',
    dataset: '1production',
  },
  /**
   * يمكن تفعيل التحديث التلقائي للاستضافة عبر:
   * studioHost: 'ayman-store'
   * ثم تشغيل: npm run deploy
   */
})
