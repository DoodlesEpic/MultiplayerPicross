import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';

export default defineConfig({
	plugins: [sveltekit()],
	css: {
		preprocessorOptions: {
			scss: {
				// silenceDeprecations is currently needed because of a problem with Bootstrap and Dart CSS
				// See: https://getbootstrap.com/docs/5.3/customize/sass/ (warning at the top of the page)
				// See: https://github.com/twbs/bootstrap/issues/40962
				// Whenever Bootstrap fixes it, we can unsilence these warnings
				silenceDeprecations: [
					'color-functions',
					'global-builtin',
					'import',
					'if-function',
					'legacy-js-api'
				],
				additionalData: '@use "src/variables.scss" as *;'
			}
		}
	}
});
