import { createClient } from '@supabase/supabase-js';
import * as fs from 'fs';
import * as path from 'path';

const supabaseUrl = 'https://tefbzxcdrlepzhgjfpdq.supabase.co';

console.log('请在 Supabase 控制台中获取 Service Role Key');
console.log('然后修改此文件中的 serviceRoleKey 变量');
console.log('\n或者直接在 Supabase 控制台中手动上传图片：');
console.log('1. 创建名为 "gallery" 的 Storage Bucket（设为公开）');
console.log('2. 创建以下文件夹结构：');
console.log('   - aesthetics/');
console.log('     - cyberpunk/');
console.log('   - color-themes/');
console.log('     - matcha/');
console.log('     - light-gray/');
console.log('     - light-pink/');
console.log('     - light-black/');
console.log('     - sea-salt/');
console.log('     - oat/');
console.log('     - dark-light-gray/');
console.log('     - dark-pink/');
console.log('3. 将对应图片上传到相应文件夹');
console.log('\n图片分类映射：');
console.log('赛博朋克1.png, 赛博朋克2.png → aesthetics/cyberpunk/');
console.log('抹茶.jpg → color-themes/matcha/');
console.log('浅灰-灰.png → color-themes/light-gray/');
console.log('浅灰-粉.jpg → color-themes/light-pink/');
console.log('浅灰-黑.png → color-themes/light-black/');
console.log('海盐.png → color-themes/sea-salt/');
console.log('燕麦.png → color-themes/oat/');
console.log('黑-浅灰.png → color-themes/dark-light-gray/');
console.log('黑粉.jpg → color-themes/dark-pink/');
console.log('\n上传后，图片的公共 URL 格式为：');
console.log('https://tefbzxcdrlepzhgjfpdq.supabase.co/storage/v1/object/public/gallery/分类路径/文件名');

