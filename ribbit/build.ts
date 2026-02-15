import { transformSync } from '@babel/core';
import { readdir, readFile, writeFile, mkdir, copyFile } from 'fs/promises';
import { join, relative, dirname, extname } from 'path';
import postcss from 'postcss';
import tailwindPostcss from '@tailwindcss/postcss';
import autoprefixer from 'autoprefixer';

const SRC_DIR = join(import.meta.dir, 'src', 'app');
const PUBLIC_DIR = join(import.meta.dir, 'public');
const OUT_DIR = join(import.meta.dir, 'dist', 'public');
const ASSETS_DIR = join(OUT_DIR, 'assets');

async function ensureDir(dir: string) {
  await mkdir(dir, { recursive: true });
}

async function getAllFiles(dir: string, files: string[] = []): Promise<string[]> {
  const entries = await readdir(dir, { withFileTypes: true });
  for (const entry of entries) {
    const fullPath = join(dir, entry.name);
    if (entry.isDirectory()) {
      await getAllFiles(fullPath, files);
    } else {
      files.push(fullPath);
    }
  }
  return files;
}

async function transformInfernoFile(filePath: string): Promise<string> {
  const source = await readFile(filePath, 'utf-8');
  const ext = extname(filePath);

  if (ext !== '.tsx' && ext !== '.jsx') {
    return source;
  }

  const result = transformSync(source, {
    filename: filePath,
    presets: [],
    plugins: [
      ['babel-plugin-inferno', { imports: true }],
      ['@babel/plugin-transform-typescript', { isTSX: true, allExtensions: true, allowDeclareFields: true }],
    ],
    sourceMaps: false,
  });

  if (!result || !result.code) {
    throw new Error(`Babel transform failed for ${filePath}`);
  }

  return result.code;
}

async function build() {
  console.log('Building ribbit.network...');
  const startTime = Date.now();

  await ensureDir(OUT_DIR);
  await ensureDir(ASSETS_DIR);

  // Copy public files (index.html, etc.)
  try {
    const publicFiles = await readdir(PUBLIC_DIR);
    for (const file of publicFiles) {
      await copyFile(join(PUBLIC_DIR, file), join(OUT_DIR, file));
    }
    console.log(`  Copied ${publicFiles.length} public files`);
  } catch {
    console.warn('  No public directory found, skipping');
  }

  // Collect all app source files
  const appFiles = await getAllFiles(SRC_DIR).catch(() => [] as string[]);
  const storeDir = join(import.meta.dir, 'src', 'app', 'store');
  const hooksDir = join(import.meta.dir, 'src', 'app', 'hooks');
  const componentsDir = join(import.meta.dir, 'src', 'app', 'components');
  const pagesDir = join(import.meta.dir, 'src', 'app', 'pages');

  // Process styles through PostCSS (Tailwind v4)
  const stylesDir = join(import.meta.dir, 'src', 'styles');
  try {
    const tailwindInput = join(stylesDir, 'tailwind.css');
    const tailwindSrc = await readFile(tailwindInput, 'utf-8');
    const processor = postcss([tailwindPostcss(), autoprefixer()]);
    const tailwindResult = await processor.process(tailwindSrc, { from: tailwindInput, to: join(ASSETS_DIR, 'tailwind.css') });
    await writeFile(join(ASSETS_DIR, 'tailwind.css'), tailwindResult.css);
    console.log('  Processed tailwind.css through PostCSS');

    // Copy main.css (base styles) as-is
    await copyFile(join(stylesDir, 'main.css'), join(ASSETS_DIR, 'main.css'));
    console.log('  Copied main.css');
  } catch (err) {
    console.warn('  Style processing error:', err);
  }

  // Use Bun.build for the main bundle (with external babel transform)
  // First, transform all TSX/JSX files through babel-plugin-inferno
  // Then bundle with Bun

  // Create a temp directory for transformed files
  const tmpDir = join(import.meta.dir, '.build-tmp');
  await ensureDir(tmpDir);

  // Transform all source files (app + nostr lib)
  const allSrcDirs = [
    join(import.meta.dir, 'src', 'app'),
    join(import.meta.dir, 'src', 'nostr'),
  ];

  for (const srcDir of allSrcDirs) {
    try {
      const files = await getAllFiles(srcDir);
      for (const file of files) {
        const rel = relative(join(import.meta.dir, 'src'), file);
        const outPath = join(tmpDir, rel).replace(/\.tsx?$/, '.js');
        await ensureDir(dirname(outPath));

        const ext = extname(file);
        if (ext === '.tsx' || ext === '.jsx') {
          const transformed = await transformInfernoFile(file);
          await writeFile(outPath, transformed);
        } else if (ext === '.ts') {
          // Let Bun handle plain TS
          const source = await readFile(file, 'utf-8');
          await writeFile(outPath, source);
        } else {
          await copyFile(file, outPath);
        }
      }
    } catch (err) {
      console.warn(`  Skipping ${srcDir}:`, err);
    }
  }

  // Bundle with Bun
  const entryPoint = join(tmpDir, 'app', 'index.js');
  try {
    const result = await Bun.build({
      entrypoints: [join(import.meta.dir, 'src', 'app', 'index.tsx')],
      outdir: ASSETS_DIR,
      target: 'browser',
      format: 'esm',
      splitting: false,
      minify: process.env.NODE_ENV === 'production',
      naming: '[name].[hash].[ext]',
      define: {
        'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV || 'development'),
      },
      plugins: [
        {
          name: 'inferno-jsx',
          setup(build) {
            build.onLoad({ filter: /\.(tsx|jsx)$/ }, async (args) => {
              const source = await readFile(args.path, 'utf-8');
              const result = transformSync(source, {
                filename: args.path,
                presets: [],
                plugins: [
                  ['babel-plugin-inferno', { imports: true }],
                  ['@babel/plugin-transform-typescript', { isTSX: true, allExtensions: true, allowDeclareFields: true }],
                ],
                sourceMaps: false,
              });
              return {
                contents: result?.code || '',
                loader: 'js',
              };
            });
          },
        },
      ],
    });

    if (!result.success) {
      console.error('Build failed:');
      for (const log of result.logs) {
        console.error(log);
      }
      process.exit(1);
    }

    // Write a manifest so index.html can reference the hashed filename
    const outputs = result.outputs.map((o) => ({
      path: relative(OUT_DIR, o.path),
      kind: o.kind,
    }));

    const jsOutput = outputs.find((o) => o.path.endsWith('.js'));
    if (jsOutput) {
      // Update index.html with the correct script path
      // Normalize Windows backslashes and ensure correct /assets/ prefix
      const bundlePath = '/' + jsOutput.path.replace(/\\/g, '/');
      const indexPath = join(OUT_DIR, 'index.html');
      let html = await readFile(indexPath, 'utf-8');
      html = html.replace('__BUNDLE_PATH__', bundlePath);
      await writeFile(indexPath, html);
    }

    console.log(`  Bundled ${result.outputs.length} files`);
  } catch (err) {
    console.error('Bundle error:', err);
    process.exit(1);
  }

  // Clean up temp dir
  const { rm } = await import('fs/promises');
  await rm(tmpDir, { recursive: true, force: true }).catch(() => {});

  const elapsed = Date.now() - startTime;
  console.log(`Build complete in ${elapsed}ms`);
}

build().catch((err) => {
  console.error('Build failed:', err);
  process.exit(1);
});
