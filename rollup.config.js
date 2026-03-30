import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import typescript from '@rollup/plugin-typescript';
import { terser } from 'rollup-plugin-terser';
import external from 'rollup-plugin-peer-deps-external';
import dts from 'rollup-plugin-dts';
import image from 'rollup-plugin-img'
import postcss from 'rollup-plugin-postcss';
import babel from '@rollup/plugin-babel';
import autoprefixer from 'autoprefixer';

export default [
    {
        input: 'src/index.ts',
        output: [
            {
                file: "dist/cjs/index.js",
                format: 'cjs',
                sourcemap: false,
                name: 'react-open-layers'
            },
            {
                file: "dist/esm/index.js",
                format: 'esm',
                sourcemap: false
            }
        ],
        plugins: [
            external(),
            resolve(),
            commonjs(),
            typescript({ tsconfig: './tsconfig.json' }),
            terser(),
            babel({
                exclude: 'node_modules/**',
                babelHelpers: 'bundled',
            }),
            image(),
            postcss({
                plugins: [autoprefixer()],
                modules: {
                    scopeBehaviour: 'global',
                },
                sourceMap: false,
                extract: true,
            })
        ]
    },
    {
        input: 'dist/esm/types/index.d.ts',
        output: [{ file: 'dist/index.d.ts', format: "esm" }],
        external: [/\.css$/],
        plugins: [dts()],
    },
]
