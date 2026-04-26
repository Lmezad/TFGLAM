// Minimal test setup: polyfill HTMLMediaElement.load which isn't implemented in JSDOM-like envs used by test runner
if (typeof HTMLMediaElement !== 'undefined' && !HTMLMediaElement.prototype.load) {
    // @ts-ignore
    HTMLMediaElement.prototype.load = function () { /* no-op for tests */ };
}

// Optionally, silence other unimplemented warnings by providing a no-op play/pause if needed in tests
if (typeof HTMLMediaElement !== 'undefined') {
    // @ts-ignore
    if (!HTMLMediaElement.prototype.play) {
        // @ts-ignore
        HTMLMediaElement.prototype.play = function () { return Promise.resolve(); };
    }
    // @ts-ignore
    if (!HTMLMediaElement.prototype.pause) {
        // @ts-ignore
        HTMLMediaElement.prototype.pause = function () { return undefined; };
    }
}
