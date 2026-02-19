import { transformSync } from '@babel/core';
import { readdir, readFile, writeFile, mkdir, copyFile, rm } from 'fs/promises';
import { join, relative, extname } from 'path';
import postcss from 'postcss';
import tailwindPostcss from '@tailwindcss/postcss';
import autoprefixer from 'autoprefixer';

const IS_PROD = process.env.NODE_ENV === 'production';
const PUBLIC_DIR = join(import.meta.dir, 'public');
const OUT_DIR = join(import.meta.dir, 'dist', 'public');
const ASSETS_DIR = join(OUT_DIR, 'assets');

async function ensureDir(dir: string) {
  await mkdir(dir, { recursive: true });
}

async function build() {
  console.log(`Building ribbit.network... (${IS_PROD ? 'production' : 'development'})`);
  const startTime = Date.now();

  // Clean previous build
  await rm(OUT_DIR, { recursive: true, force: true }).catch(() => {});
  await ensureDir(OUT_DIR);
  await ensureDir(ASSETS_DIR);

  // ── 1. Copy public files ──────────────────────────────────────────────
  try {
    const publicFiles = await readdir(PUBLIC_DIR);
    for (const file of publicFiles) {
      await copyFile(join(PUBLIC_DIR, file), join(OUT_DIR, file));
    }
    console.log(`  Copied ${publicFiles.length} public files`);
  } catch {
    console.warn('  No public directory found, skipping');
  }

  // ── 2. Process styles through PostCSS (Tailwind v4 + autoprefixer + cssnano) ─
  const stylesDir = join(import.meta.dir, 'src', 'styles');
  try {
    const tailwindInput = join(stylesDir, 'tailwind.css');
    const tailwindSrc = await readFile(tailwindInput, 'utf-8');

    const plugins: postcss.AcceptedPlugin[] = [tailwindPostcss(), autoprefixer()];
    if (IS_PROD) {
      const cssnano = (await import('cssnano')).default;
      plugins.push(cssnano({ preset: 'default' }));
    }

    const processor = postcss(plugins);
    const tailwindResult = await processor.process(tailwindSrc, {
      from: tailwindInput,
      to: join(ASSETS_DIR, 'tailwind.css'),
      map: IS_PROD ? false : { inline: true },
    });
    await writeFile(join(ASSETS_DIR, 'tailwind.css'), tailwindResult.css);
    console.log(`  Processed tailwind.css through PostCSS${IS_PROD ? ' (minified)' : ''}`);

    // Copy main.css (base styles)
    await copyFile(join(stylesDir, 'main.css'), join(ASSETS_DIR, 'main.css'));
    console.log('  Copied main.css');
  } catch (err) {
    console.warn('  Style processing error:', err);
  }

  // ── 3. Bundle with Bun (Babel plugin for Inferno JSX) ─────────────────
  try {
    const result = await Bun.build({
      entrypoints: [join(import.meta.dir, 'src', 'app', 'index.tsx')],
      outdir: ASSETS_DIR,
      target: 'browser',
      format: 'esm',
      splitting: false,
      minify: IS_PROD,
      sourcemap: IS_PROD ? 'none' : 'linked',
      naming: '[name].[hash].[ext]',
      define: {
        'process.env.NODE_ENV': JSON.stringify(IS_PROD ? 'production' : 'development'),
      },
      drop: IS_PROD ? ['debugger'] : [],
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
                  ['@babel/plugin-transform-typescript', {
                    isTSX: true,
                    allExtensions: true,
                    allowDeclareFields: true,
                  }],
                ],
                sourceMaps: IS_PROD ? false : 'inline',
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

    // Update index.html with the hashed bundle path
    const outputs = result.outputs.map((o) => ({
      path: relative(OUT_DIR, o.path),
      kind: o.kind,
    }));

    const jsOutput = outputs.find((o) => o.path.endsWith('.js'));
    if (jsOutput) {
      const bundlePath = '/' + jsOutput.path.replace(/\\/g, '/');
      const indexPath = join(OUT_DIR, 'index.html');
      let html = await readFile(indexPath, 'utf-8');
      html = html.replace('__BUNDLE_PATH__', bundlePath);
      await writeFile(indexPath, html);
    }

    const totalSize = result.outputs.reduce((sum, o) => sum + o.size, 0);
    console.log(`  Bundled ${result.outputs.length} file(s) — ${(totalSize / 1024).toFixed(1)} KB`);
  } catch (err) {
    console.error('Bundle error:', err);
    process.exit(1);
  }

  const elapsed = Date.now() - startTime;
  console.log(`Build complete in ${elapsed}ms`);
}

build().catch((err) => {
  console.error('Build failed:', err);
  process.exit(1);
});
