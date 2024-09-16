import { JSDOM } from 'jsdom';

const dom = new JSDOM();
global.document = dom.window.document;
global.window = dom.window;
global.window.sfnAdminBarPublish = undefined;
global.window.alert = jest.fn();
global.history = dom.window.history;
global.history.replaceState = jest.fn();
