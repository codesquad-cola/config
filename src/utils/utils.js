export const $ = (selector, base = document) => {
  return base.querySelector(selector);
};

export const $$ = (selector, base = document) => {
  return [...base.querySelectorAll(selector)];
};

export const eventDelegate = ({ target, eventName, selector, handler }) => {
  const emitEvent = event => {
    const expectedTarget = event.target.closest(selector);
    if (expectedTarget) handler.call(expectedTarget, event);
  };

  target.addEventListener(eventName, emitEvent);
};

export const emit = (target, eventName, detail) => {
  const event = new CustomEvent(eventName, { detail });
  target.dispatchEvent(event);
};

export const pipe = (...fns) => {
  return value => fns.reduce((acc, fn) => fn(acc), value);
};

export const insertNodeBefore = (targetNode, referenceNode) => {
  referenceNode.parentNode.insertBefore(targetNode, referenceNode);
};

export const insertNodeAfter = (targetNode, referenceNode) => {
  referenceNode.parentNode.insertBefore(targetNode, referenceNode.nextSibling);
};

export const removeNodeSelf = node => {
  node.parentNode.removeChild(node);
};

export const addClass = (className, element) => {
  if (!element) return;
  element.classList.add(className);
};

export const removeClass = (className, element) => {
  if (!element) return;
  element.classList.remove(className);
};

export const toggleClass = (className, element) => {
  if (!element) return;
  element.classList.toggle(className);
};

export const hasClass = (className, element) => {
  return element.classList.contains(className);
};

export const createElement = (tagName, className, attrs = {}) => {
  const element = document.createElement(tagName);
  if (className) {
    if (Array.isArray(className)) element.className = className.join(' ');
    else element.className = className;
  }
  Object.entries(attrs).forEach(([key, value]) => {
    element.setAttribute(key, value);
  });
  return element;
};

export const delay = ms => {
  return new Promise(resolve => {
    setTimeout(() => resolve(), ms);
  });
};

export const debounce = (cb, delay) => {
  let timerId;
  return event => {
    if (timerId) {
      clearTimeout(timerId);
    }
    timerId = setTimeout(cb, delay, event);
  };
};

export const throttle = (cb, delay) => {
  let timerId;
  return event => {
    if (timerId) return;
    timerId = setTimeout(() => {
      cb(event);
      timerId = null;
    }, delay);
  };
};

export const replaceLinebreakWithBrElement = text =>
  text.replace(/(\r\n|\r|\n)/g, '<br>');

export const replaceBrElementWithLinebreak = text =>
  text.replace(/<br\s?\/?>/g, '\n');

const makeRequestMessage = (method, requestBody) => {
  const headers = { 'Content-type': 'application/json; charset=UTF-8' };
  if (!requestBody) return { method, headers };
  const body = JSON.stringify(requestBody);

  return {
    headers,
    method,
    body,
  };
};

export const requestHttp = async (url, methodType, requestBody) => {
  const method = methodType.toUpperCase();
  const response = await (
    await fetch(url, makeRequestMessage(method, requestBody))
  ).json();

  return response;
};

export class Storage {
  #db;

  constructor(storage = localStorage) {
    if (![sessionStorage, localStorage].includes(storage))
      throw Error('arguments must be localStorage or sessionStorage');
    this.#db = storage;
  }

  set(key, value) {
    this.#db.setItem(key, JSON.stringify(value));
  }

  get(key) {
    return JSON.parse(this.db.getItem(key));
  }

  clear(key) {
    this.#db.removeItem(key);
  }

  allClear() {
    this.#db.clear();
  }
}
