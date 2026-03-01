import { render } from 'inferno';
import { createElement } from 'inferno-create-element';
import { BrowserRouter } from 'inferno-router';
import { App } from './App';
import { getHighlighter } from './pages/docs/_helpers';

// Pre-warm Shiki so code blocks render highlighted on first paint
getHighlighter();

const root = document.getElementById('app');

if (root) {
  render(
    createElement(BrowserRouter, null,
      createElement(App, null),
    ),
    root,
  );
}
