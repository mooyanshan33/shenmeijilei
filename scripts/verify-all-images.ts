
import { createClient } from '@supabase/supabase-js';
import * as fs from 'fs';
import * as path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.join(__dirname, '..');

const supabaseUrl = 'https://tefbzxcdrlepzhgjfpdq.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRlZmJ6eGNkcmxlcHpoZ2pmcGRxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzQ5MTI3MDAsImV4cCI6MjA5MDQ4ODcwMH0.dqhci98lb_3k8SKZcRoofQ24Zz7lPzzgE_aFzO3ShIQ';

const getAestheticCoverUrl = (id) => `aesthetics/${id}.jpg`;
const getGalleryImageUrl = (fileName) => {
    const legacyMap = { '赛博朋克1.png': 'cyberpunk-1.png', '赛博朋克2.png': 'cyberpunk-2.png', '抹茶.jpg': 'matcha.jpg', '浅灰-灰.png': 'light-gray.png', '浅灰-粉.jpg': 'light-pink.jpg', '海盐.png': 'sea-salt.png', '燕麦.png': 'oat.png', '黑-浅灰.png': 'dark-light-gray.png', '黑粉.jpg': 'dark-pink.jpg' };
    const resolved = legacyMap[fileName] || fileName;
    const images = [{fileName: 'cyberpunk-1.png', category: 'aesthetics'},{fileName: 'cyberpunk-2.png', category: 'aesthetics'},{fileName: 'matcha.jpg', category: 'color-themes'},{fileName: 'light-gray.png', category: 'color-themes'},{fileName: 'light-pink.jpg', category: 'color-themes'},{fileName: 'sea-salt.png', category: 'color-themes'},{fileName: 'oat.png', category: 'color-themes'},{fileName: 'dark-light-gray.png', category: 'color-themes'},{fileName: 'dark-pink.jpg', category: 'color-themes'}];
    const image = images.find(img => img.fileName === resolved);
    return image ? `${image.category}/${resolved}` : resolved;
};
const getManagedImageUrl = (key) => `managed/${key}`;

const targetFiles = [
    path.join(projectRoot, 'src/data/completeDatabase.ts'),
    path.join(projectRoot, 'src/data/aestheticDatabase.ts'),
    path.join(projectRoot, 'src/data/artMovements.ts'),
    path.join(projectRoot, 'src/data/internetAesthetics.ts'),
    path.join(projectRoot, 'src/data/mockData.ts')
];

let urls = new Set();
for (const file of targetFiles) {
    if (!fs.existsSync(file)) continue;
    const content = fs.readFileSync(file, 'utf-8');
    const matches = [...content.matchAll(/getManagedImageUrl\('([^']+)'\)|getGalleryImageUrl\('([^']+)'\)|getAestheticCoverUrl\('([^']+)'\)/g)];
    for (const match of matches) {
        if (match[1]) urls.add(`managed/${match[1]}`);
        if (match[2]) urls.add(getGalleryImageUrl(match[2]));
        if (match[3]) urls.add(getAestheticCoverUrl(match[3]));
    }
}

async function verify() {
    console.log(`开始验证 ${urls.size} 个 URL...`);
    const failed = [];
    for (const urlPath of urls) {
        const fullUrl = `${supabaseUrl}/storage/v1/object/public/gallery/${urlPath}`;
        try {
            const response = await fetch(fullUrl, { method: 'HEAD' });
            if (!response.ok) {
                failed.push({ url: fullUrl, status: response.status });
            }
        } catch (e) {
            failed.push({ url: fullUrl, error: e.message });
        }
    }
    
    if (failed.length > 0) {
        console.log('检测到加载失败的图片：');
        console.log(JSON.stringify(failed, null, 2));
    } else {
        console.log('所有图片链接验证通过！');
    }
}

verify();
