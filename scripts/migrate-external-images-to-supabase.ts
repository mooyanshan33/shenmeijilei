import { createClient } from '@supabase/supabase-js';
import { execFileSync } from 'child_process';
import { promises as fs } from 'fs';
import * as path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const supabaseUrl = 'https://tefbzxcdrlepzhgjfpdq.supabase.co';
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
const rewriteOnly = process.argv.includes('--rewrite-only');
const uploadOnly = process.argv.includes('--upload-only');
const useGitHead = process.argv.includes('--use-git-head');
const backfillPlaceholders = process.argv.includes('--backfill-placeholders');

const supabase = rewriteOnly
  ? null
  : createClient(supabaseUrl, serviceRoleKey ?? '', {
      auth: { autoRefreshToken: false, persistSession: false },
    });

const projectRoot = path.resolve(__dirname, '..');
const targetFiles = [
  path.join(projectRoot, 'src', 'data', 'aestheticDatabase.ts'),
  path.join(projectRoot, 'src', 'data', 'artMovements.ts'),
  path.join(projectRoot, 'src', 'data', 'internetAesthetics.ts'),
  path.join(projectRoot, 'src', 'data', 'completeDatabase.ts'),
  path.join(projectRoot, 'src', 'data', 'mockData.ts'),
];

const externalUrlPattern =
  /'((?:https:\/\/coresg-normal\.trae\.ai\/api\/ide\/v1\/text_to_image\?[^'\n]+|https:\/\/images\.unsplash\.com\/[^'\n]+|https:\/\/picsum\.photos\/[^'\n]+))'/g;
const managedKeyPattern = /getManagedImageUrl\('([^']+)'\)/g;

function ensureGalleryImport(content: string) {
  const existingGalleryImport = /import\s*\{([^}]+)\}\s*from\s*'@\/lib\/gallery';/;
  const match = content.match(existingGalleryImport);

  if (match) {
    const imports = match[1]
      .split(',')
      .map((item) => item.trim())
      .filter(Boolean);

    if (!imports.includes('getManagedImageUrl')) {
      imports.push('getManagedImageUrl');
      return content.replace(existingGalleryImport, `import { ${imports.join(', ')} } from '@/lib/gallery';`);
    }

    return content;
  }

  const importStatements = [...content.matchAll(/^import .*;$/gm)];
  if (importStatements.length === 0) {
    return `import { getManagedImageUrl } from '@/lib/gallery';\n${content}`;
  }

  const lastImport = importStatements[importStatements.length - 1];
  const insertAt = (lastImport.index ?? 0) + lastImport[0].length;
  return `${content.slice(0, insertAt)}\nimport { getManagedImageUrl } from '@/lib/gallery';${content.slice(insertAt)}`;
}

async function uploadExternalImage(url: string, assetKey: string) {
  if (!supabase) {
    throw new Error('rewrite-only 模式下不应调用上传逻辑');
  }

  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`下载失败 ${response.status}: ${url}`);
  }

  const contentType = response.headers.get('content-type') ?? 'image/jpeg';
  const data = Buffer.from(await response.arrayBuffer());
  const storagePath = `managed/${assetKey}`;

  const { error } = await supabase.storage.from('gallery').upload(storagePath, data, {
    contentType,
    upsert: true,
  });

  if (error) {
    throw new Error(`上传失败 ${storagePath}: ${error.message}`);
  }
}

async function readSourceContent(filePath: string) {
  if (!useGitHead) {
    return fs.readFile(filePath, 'utf8');
  }

  const relativePath = path.relative(projectRoot, filePath).replace(/\\/g, '/');
  return execFileSync('git', ['--no-pager', 'show', `HEAD:${relativePath}`], {
    cwd: projectRoot,
    encoding: 'utf8',
  });
}

async function managedAssetExists(assetKey: string) {
  const response = await fetch(`${supabaseUrl}/storage/v1/object/public/gallery/managed/${assetKey}`);
  return response.ok;
}

async function uploadPlaceholderImage(assetKey: string) {
  if (!supabase) {
    throw new Error('缺少 Supabase 客户端');
  }

  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="1200" viewBox="0 0 1200 1200"><rect width="1200" height="1200" fill="#111827"/><rect x="60" y="60" width="1080" height="1080" rx="48" fill="#1f2937" stroke="#4b5563" stroke-width="4"/><text x="600" y="520" text-anchor="middle" fill="#f9fafb" font-family="Arial, sans-serif" font-size="54">Supabase Managed Asset</text><text x="600" y="620" text-anchor="middle" fill="#9ca3af" font-family="Arial, sans-serif" font-size="32">${assetKey}</text></svg>`;
  const storagePath = `managed/${assetKey}`;

  const { error } = await supabase.storage.from('gallery').upload(storagePath, Buffer.from(svg, 'utf8'), {
    contentType: 'image/svg+xml',
    upsert: true,
  });

  if (error) {
    throw new Error(`占位图上传失败 ${storagePath}: ${error.message}`);
  }
}

async function backfillMissingManagedAssets() {
  if (!serviceRoleKey) {
    throw new Error('缺少 SUPABASE_SERVICE_ROLE_KEY 环境变量');
  }

  for (const filePath of targetFiles) {
    const content = await fs.readFile(filePath, 'utf8');
    const keys = [...content.matchAll(managedKeyPattern)].map((match) => match[1]);

    if (keys.length === 0) {
      continue;
    }

    console.log(`检查 ${path.basename(filePath)}: ${keys.length} 个 managed key`);

    for (const assetKey of keys) {
      const exists = await managedAssetExists(assetKey);
      if (exists) {
        continue;
      }

      console.log(`  补传占位图 ${assetKey}`);
      await uploadPlaceholderImage(assetKey);
    }
  }
}

async function migrateFile(filePath: string) {
  const original = await readSourceContent(filePath);
  const fileKey = path.basename(filePath, path.extname(filePath));

  const matches = [...original.matchAll(externalUrlPattern)];
  if (matches.length === 0) {
    console.log(`跳过 ${path.basename(filePath)}: 未发现外链图片`);
    return;
  }

  console.log(`处理 ${path.basename(filePath)}: ${matches.length} 张`);

  if (!rewriteOnly) {
    if (!serviceRoleKey) {
      throw new Error('缺少 SUPABASE_SERVICE_ROLE_KEY 环境变量');
    }

    for (let i = 0; i < matches.length; i += 1) {
      const url = matches[i][1];
      const assetKey = `${fileKey}-${String(i + 1).padStart(3, '0')}`;
      console.log(`  上传 ${assetKey}`);
      await uploadExternalImage(url, assetKey);
    }
  }

  if (uploadOnly) {
    console.log(`  仅上传完成 ${path.basename(filePath)}`);
    return;
  }

  let replacementIndex = 0;
  const replaced = original.replace(externalUrlPattern, () => {
    replacementIndex += 1;
    const assetKey = `${fileKey}-${String(replacementIndex).padStart(3, '0')}`;
    return `getManagedImageUrl('${assetKey}')`;
  });

  const nextContent = ensureGalleryImport(replaced);
  await fs.writeFile(filePath, nextContent, 'utf8');
  console.log(`  已回写 ${path.basename(filePath)}`);
}

async function main() {
  if (backfillPlaceholders) {
    await backfillMissingManagedAssets();
    console.log('缺失 managed 资源已补齐');
    return;
  }

  for (const filePath of targetFiles) {
    await migrateFile(filePath);
  }

  console.log('外链图片迁移完成');
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
