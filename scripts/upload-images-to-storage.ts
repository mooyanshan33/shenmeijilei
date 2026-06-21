import { createClient } from '@supabase/supabase-js';
import * as fs from 'fs';
import * as path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const supabaseUrl = 'https://tefbzxcdrlepzhgjfpdq.supabase.co';
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

const publicDir = path.join(__dirname, '..', 'public');

const imageMap = [
  { src: 'avatars/defaults/avatar-01.jpg', dest: 'avatars/defaults/avatar-01.jpg' },
  { src: 'avatars/defaults/avatar-02.png', dest: 'avatars/defaults/avatar-02.png' },
  { src: 'avatars/defaults/avatar-03.jpg', dest: 'avatars/defaults/avatar-03.jpg' },
  { src: 'avatars/defaults/avatar-04.png', dest: 'avatars/defaults/avatar-04.png' },
  { src: 'avatars/defaults/avatar-05.png', dest: 'avatars/defaults/avatar-05.png' },
  { src: 'avatars/defaults/avatar-06.png', dest: 'avatars/defaults/avatar-06.png' },
  { src: 'avatars/defaults/avatar-07.png', dest: 'avatars/defaults/avatar-07.png' },
  { src: 'avatars/defaults/avatar-08.jpg', dest: 'avatars/defaults/avatar-08.jpg' },
  { src: 'picture/抹茶.jpg', dest: 'color-themes/matcha.jpg' },
  { src: 'picture/浅灰-灰.png', dest: 'color-themes/light-gray.png' },
  { src: 'picture/浅灰-粉.jpg', dest: 'color-themes/light-pink.jpg' },
  { src: 'picture/海盐.png', dest: 'color-themes/sea-salt.png' },
  { src: 'picture/燕麦.png', dest: 'color-themes/oat.png' },
  { src: 'picture/黑-浅灰.png', dest: 'color-themes/dark-light-gray.png' },
  { src: 'picture/黑粉.jpg', dest: 'color-themes/dark-pink.jpg' },
  { src: 'picture/赛博朋克1.png', dest: 'aesthetics/cyberpunk-1.png' },
  { src: 'picture/赛博朋克2.png', dest: 'aesthetics/cyberpunk-2.png' },
  { src: 'aesthetic-art-deco.jpg', dest: 'aesthetics/art-deco.jpg' },
  { src: 'aesthetic-cyberpunk.jpg', dest: 'aesthetics/cyberpunk.jpg' },
  { src: 'aesthetic-minimalism.jpg', dest: 'aesthetics/minimalism.jpg' },
  { src: 'aesthetic-neo-chinese.jpg', dest: 'aesthetics/neo-chinese.jpg' },
  { src: 'aesthetic-pop-art.jpg', dest: 'aesthetics/pop-art.jpg' },
  { src: 'aesthetic-wabi-sabi.jpg', dest: 'aesthetics/wabi-sabi.jpg' },
];

async function main() {
  console.log('=== Supabase Storage 图片上传脚本 ===\n');

  if (!serviceRoleKey) {
    throw new Error('缺少 SUPABASE_SERVICE_ROLE_KEY 环境变量');
  }

  const supabase = createClient(supabaseUrl, serviceRoleKey, {
    auth: { autoRefreshToken: false, persistSession: false }
  });

  console.log('开始上传图片...\n');

  for (const img of imageMap) {
    const srcPath = path.join(publicDir, img.src);

    if (!fs.existsSync(srcPath)) {
      console.warn(`跳过：文件不存在 ${img.src}`);
      continue;
    }

    const fileContent = fs.readFileSync(srcPath);
    const ext = path.extname(srcPath);
    const contentType = ext === '.png' ? 'image/png' : 'image/jpeg';

    console.log(`上传: ${img.src} → ${img.dest}`);

    const { error } = await supabase.storage
      .from('gallery')
      .upload(img.dest, fileContent, {
        contentType,
        upsert: true,
      });

    if (error) {
      console.error(`  ❌ 上传失败:`, error.message);
    } else {
      console.log(`  ✅ 成功`);
    }
  }

  console.log('\n=== 上传完成 ===\n');
  console.log('所有图片的公共 URL 格式:');
  console.log(`${supabaseUrl}/storage/v1/object/public/gallery/[路径]/[文件名]`);
}

main().catch(console.error);

