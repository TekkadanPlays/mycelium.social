import { render } from 'inferno';
import { createElement } from 'inferno-create-element';
import { BrowserRouter } from 'inferno-router';
import { App } from './App';

const root = document.getElementById('app');

if (root) {
  render(
    createElement(BrowserRouter, null,
      createElement(App, null),
    ),
    root,
  );
}
