
(function(l, r) { if (!l || l.getElementById('livereloadscript')) return; r = l.createElement('script'); r.async = 1; r.src = '//' + (self.location.host || 'localhost').split(':')[0] + ':35729/livereload.js?snipver=1'; r.id = 'livereloadscript'; l.getElementsByTagName('head')[0].appendChild(r) })(self.document);
var app = (function () {
    'use strict';

    function noop() { }
    function add_location(element, file, line, column, char) {
        element.__svelte_meta = {
            loc: { file, line, column, char }
        };
    }
    function run(fn) {
        return fn();
    }
    function blank_object() {
        return Object.create(null);
    }
    function run_all(fns) {
        fns.forEach(run);
    }
    function is_function(thing) {
        return typeof thing === 'function';
    }
    function safe_not_equal(a, b) {
        return a != a ? b == b : a !== b || ((a && typeof a === 'object') || typeof a === 'function');
    }
    function is_empty(obj) {
        return Object.keys(obj).length === 0;
    }
    function append(target, node) {
        target.appendChild(node);
    }
    function insert(target, node, anchor) {
        target.insertBefore(node, anchor || null);
    }
    function detach(node) {
        if (node.parentNode) {
            node.parentNode.removeChild(node);
        }
    }
    function destroy_each(iterations, detaching) {
        for (let i = 0; i < iterations.length; i += 1) {
            if (iterations[i])
                iterations[i].d(detaching);
        }
    }
    function element(name) {
        return document.createElement(name);
    }
    function text(data) {
        return document.createTextNode(data);
    }
    function space() {
        return text(' ');
    }
    function listen(node, event, handler, options) {
        node.addEventListener(event, handler, options);
        return () => node.removeEventListener(event, handler, options);
    }
    function attr(node, attribute, value) {
        if (value == null)
            node.removeAttribute(attribute);
        else if (node.getAttribute(attribute) !== value)
            node.setAttribute(attribute, value);
    }
    function children(element) {
        return Array.from(element.childNodes);
    }
    function set_input_value(input, value) {
        input.value = value == null ? '' : value;
    }
    function toggle_class(element, name, toggle) {
        element.classList[toggle ? 'add' : 'remove'](name);
    }
    function custom_event(type, detail, { bubbles = false, cancelable = false } = {}) {
        const e = document.createEvent('CustomEvent');
        e.initCustomEvent(type, bubbles, cancelable, detail);
        return e;
    }

    let current_component;
    function set_current_component(component) {
        current_component = component;
    }

    const dirty_components = [];
    const binding_callbacks = [];
    let render_callbacks = [];
    const flush_callbacks = [];
    const resolved_promise = /* @__PURE__ */ Promise.resolve();
    let update_scheduled = false;
    function schedule_update() {
        if (!update_scheduled) {
            update_scheduled = true;
            resolved_promise.then(flush);
        }
    }
    function add_render_callback(fn) {
        render_callbacks.push(fn);
    }
    // flush() calls callbacks in this order:
    // 1. All beforeUpdate callbacks, in order: parents before children
    // 2. All bind:this callbacks, in reverse order: children before parents.
    // 3. All afterUpdate callbacks, in order: parents before children. EXCEPT
    //    for afterUpdates called during the initial onMount, which are called in
    //    reverse order: children before parents.
    // Since callbacks might update component values, which could trigger another
    // call to flush(), the following steps guard against this:
    // 1. During beforeUpdate, any updated components will be added to the
    //    dirty_components array and will cause a reentrant call to flush(). Because
    //    the flush index is kept outside the function, the reentrant call will pick
    //    up where the earlier call left off and go through all dirty components. The
    //    current_component value is saved and restored so that the reentrant call will
    //    not interfere with the "parent" flush() call.
    // 2. bind:this callbacks cannot trigger new flush() calls.
    // 3. During afterUpdate, any updated components will NOT have their afterUpdate
    //    callback called a second time; the seen_callbacks set, outside the flush()
    //    function, guarantees this behavior.
    const seen_callbacks = new Set();
    let flushidx = 0; // Do *not* move this inside the flush() function
    function flush() {
        // Do not reenter flush while dirty components are updated, as this can
        // result in an infinite loop. Instead, let the inner flush handle it.
        // Reentrancy is ok afterwards for bindings etc.
        if (flushidx !== 0) {
            return;
        }
        const saved_component = current_component;
        do {
            // first, call beforeUpdate functions
            // and update components
            try {
                while (flushidx < dirty_components.length) {
                    const component = dirty_components[flushidx];
                    flushidx++;
                    set_current_component(component);
                    update(component.$$);
                }
            }
            catch (e) {
                // reset dirty state to not end up in a deadlocked state and then rethrow
                dirty_components.length = 0;
                flushidx = 0;
                throw e;
            }
            set_current_component(null);
            dirty_components.length = 0;
            flushidx = 0;
            while (binding_callbacks.length)
                binding_callbacks.pop()();
            // then, once components are updated, call
            // afterUpdate functions. This may cause
            // subsequent updates...
            for (let i = 0; i < render_callbacks.length; i += 1) {
                const callback = render_callbacks[i];
                if (!seen_callbacks.has(callback)) {
                    // ...so guard against infinite loops
                    seen_callbacks.add(callback);
                    callback();
                }
            }
            render_callbacks.length = 0;
        } while (dirty_components.length);
        while (flush_callbacks.length) {
            flush_callbacks.pop()();
        }
        update_scheduled = false;
        seen_callbacks.clear();
        set_current_component(saved_component);
    }
    function update($$) {
        if ($$.fragment !== null) {
            $$.update();
            run_all($$.before_update);
            const dirty = $$.dirty;
            $$.dirty = [-1];
            $$.fragment && $$.fragment.p($$.ctx, dirty);
            $$.after_update.forEach(add_render_callback);
        }
    }
    /**
     * Useful for example to execute remaining `afterUpdate` callbacks before executing `destroy`.
     */
    function flush_render_callbacks(fns) {
        const filtered = [];
        const targets = [];
        render_callbacks.forEach((c) => fns.indexOf(c) === -1 ? filtered.push(c) : targets.push(c));
        targets.forEach((c) => c());
        render_callbacks = filtered;
    }
    const outroing = new Set();
    let outros;
    function group_outros() {
        outros = {
            r: 0,
            c: [],
            p: outros // parent group
        };
    }
    function check_outros() {
        if (!outros.r) {
            run_all(outros.c);
        }
        outros = outros.p;
    }
    function transition_in(block, local) {
        if (block && block.i) {
            outroing.delete(block);
            block.i(local);
        }
    }
    function transition_out(block, local, detach, callback) {
        if (block && block.o) {
            if (outroing.has(block))
                return;
            outroing.add(block);
            outros.c.push(() => {
                outroing.delete(block);
                if (callback) {
                    if (detach)
                        block.d(1);
                    callback();
                }
            });
            block.o(local);
        }
        else if (callback) {
            callback();
        }
    }
    function create_component(block) {
        block && block.c();
    }
    function mount_component(component, target, anchor, customElement) {
        const { fragment, after_update } = component.$$;
        fragment && fragment.m(target, anchor);
        if (!customElement) {
            // onMount happens before the initial afterUpdate
            add_render_callback(() => {
                const new_on_destroy = component.$$.on_mount.map(run).filter(is_function);
                // if the component was destroyed immediately
                // it will update the `$$.on_destroy` reference to `null`.
                // the destructured on_destroy may still reference to the old array
                if (component.$$.on_destroy) {
                    component.$$.on_destroy.push(...new_on_destroy);
                }
                else {
                    // Edge case - component was destroyed immediately,
                    // most likely as a result of a binding initialising
                    run_all(new_on_destroy);
                }
                component.$$.on_mount = [];
            });
        }
        after_update.forEach(add_render_callback);
    }
    function destroy_component(component, detaching) {
        const $$ = component.$$;
        if ($$.fragment !== null) {
            flush_render_callbacks($$.after_update);
            run_all($$.on_destroy);
            $$.fragment && $$.fragment.d(detaching);
            // TODO null out other refs, including component.$$ (but need to
            // preserve final state?)
            $$.on_destroy = $$.fragment = null;
            $$.ctx = [];
        }
    }
    function make_dirty(component, i) {
        if (component.$$.dirty[0] === -1) {
            dirty_components.push(component);
            schedule_update();
            component.$$.dirty.fill(0);
        }
        component.$$.dirty[(i / 31) | 0] |= (1 << (i % 31));
    }
    function init(component, options, instance, create_fragment, not_equal, props, append_styles, dirty = [-1]) {
        const parent_component = current_component;
        set_current_component(component);
        const $$ = component.$$ = {
            fragment: null,
            ctx: [],
            // state
            props,
            update: noop,
            not_equal,
            bound: blank_object(),
            // lifecycle
            on_mount: [],
            on_destroy: [],
            on_disconnect: [],
            before_update: [],
            after_update: [],
            context: new Map(options.context || (parent_component ? parent_component.$$.context : [])),
            // everything else
            callbacks: blank_object(),
            dirty,
            skip_bound: false,
            root: options.target || parent_component.$$.root
        };
        append_styles && append_styles($$.root);
        let ready = false;
        $$.ctx = instance
            ? instance(component, options.props || {}, (i, ret, ...rest) => {
                const value = rest.length ? rest[0] : ret;
                if ($$.ctx && not_equal($$.ctx[i], $$.ctx[i] = value)) {
                    if (!$$.skip_bound && $$.bound[i])
                        $$.bound[i](value);
                    if (ready)
                        make_dirty(component, i);
                }
                return ret;
            })
            : [];
        $$.update();
        ready = true;
        run_all($$.before_update);
        // `false` as a special case of no DOM component
        $$.fragment = create_fragment ? create_fragment($$.ctx) : false;
        if (options.target) {
            if (options.hydrate) {
                const nodes = children(options.target);
                // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                $$.fragment && $$.fragment.l(nodes);
                nodes.forEach(detach);
            }
            else {
                // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                $$.fragment && $$.fragment.c();
            }
            if (options.intro)
                transition_in(component.$$.fragment);
            mount_component(component, options.target, options.anchor, options.customElement);
            flush();
        }
        set_current_component(parent_component);
    }
    /**
     * Base class for Svelte components. Used when dev=false.
     */
    class SvelteComponent {
        $destroy() {
            destroy_component(this, 1);
            this.$destroy = noop;
        }
        $on(type, callback) {
            if (!is_function(callback)) {
                return noop;
            }
            const callbacks = (this.$$.callbacks[type] || (this.$$.callbacks[type] = []));
            callbacks.push(callback);
            return () => {
                const index = callbacks.indexOf(callback);
                if (index !== -1)
                    callbacks.splice(index, 1);
            };
        }
        $set($$props) {
            if (this.$$set && !is_empty($$props)) {
                this.$$.skip_bound = true;
                this.$$set($$props);
                this.$$.skip_bound = false;
            }
        }
    }

    function dispatch_dev(type, detail) {
        document.dispatchEvent(custom_event(type, Object.assign({ version: '3.59.2' }, detail), { bubbles: true }));
    }
    function append_dev(target, node) {
        dispatch_dev('SvelteDOMInsert', { target, node });
        append(target, node);
    }
    function insert_dev(target, node, anchor) {
        dispatch_dev('SvelteDOMInsert', { target, node, anchor });
        insert(target, node, anchor);
    }
    function detach_dev(node) {
        dispatch_dev('SvelteDOMRemove', { node });
        detach(node);
    }
    function listen_dev(node, event, handler, options, has_prevent_default, has_stop_propagation, has_stop_immediate_propagation) {
        const modifiers = options === true ? ['capture'] : options ? Array.from(Object.keys(options)) : [];
        if (has_prevent_default)
            modifiers.push('preventDefault');
        if (has_stop_propagation)
            modifiers.push('stopPropagation');
        if (has_stop_immediate_propagation)
            modifiers.push('stopImmediatePropagation');
        dispatch_dev('SvelteDOMAddEventListener', { node, event, handler, modifiers });
        const dispose = listen(node, event, handler, options);
        return () => {
            dispatch_dev('SvelteDOMRemoveEventListener', { node, event, handler, modifiers });
            dispose();
        };
    }
    function attr_dev(node, attribute, value) {
        attr(node, attribute, value);
        if (value == null)
            dispatch_dev('SvelteDOMRemoveAttribute', { node, attribute });
        else
            dispatch_dev('SvelteDOMSetAttribute', { node, attribute, value });
    }
    function set_data_dev(text, data) {
        data = '' + data;
        if (text.data === data)
            return;
        dispatch_dev('SvelteDOMSetData', { node: text, data });
        text.data = data;
    }
    function validate_each_argument(arg) {
        if (typeof arg !== 'string' && !(arg && typeof arg === 'object' && 'length' in arg)) {
            let msg = '{#each} only iterates over array-like objects.';
            if (typeof Symbol === 'function' && arg && Symbol.iterator in arg) {
                msg += ' You can use a spread to convert this iterable into an array.';
            }
            throw new Error(msg);
        }
    }
    function validate_slots(name, slot, keys) {
        for (const slot_key of Object.keys(slot)) {
            if (!~keys.indexOf(slot_key)) {
                console.warn(`<${name}> received an unexpected slot "${slot_key}".`);
            }
        }
    }
    /**
     * Base class for Svelte components with some minor dev-enhancements. Used when dev=true.
     */
    class SvelteComponentDev extends SvelteComponent {
        constructor(options) {
            if (!options || (!options.target && !options.$$inline)) {
                throw new Error("'target' is a required option");
            }
            super();
        }
        $destroy() {
            super.$destroy();
            this.$destroy = () => {
                console.warn('Component was already destroyed'); // eslint-disable-line no-console
            };
        }
        $capture_state() { }
        $inject_state() { }
    }

    /* src/components/input.svelte generated by Svelte v3.59.2 */

    const file$3 = "src/components/input.svelte";

    function create_fragment$3(ctx) {
    	let div;
    	let input;
    	let t0;
    	let button;
    	let mounted;
    	let dispose;

    	const block = {
    		c: function create() {
    			div = element("div");
    			input = element("input");
    			t0 = space();
    			button = element("button");
    			button.textContent = "ADD";
    			attr_dev(input, "type", "text");
    			attr_dev(input, "placeholder", "할일을 입력하세요");
    			attr_dev(input, "class", "svelte-28hfv0");
    			add_location(input, file$3, 28, 4, 560);
    			attr_dev(button, "class", "svelte-28hfv0");
    			add_location(button, file$3, 29, 4, 656);
    			add_location(div, file$3, 27, 0, 550);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			append_dev(div, input);
    			set_input_value(input, /*todo*/ ctx[0]);
    			append_dev(div, t0);
    			append_dev(div, button);

    			if (!mounted) {
    				dispose = [
    					listen_dev(input, "input", /*input_input_handler*/ ctx[3]),
    					listen_dev(input, "keyup", /*keyup_handler*/ ctx[4], false, false, false, false),
    					listen_dev(
    						button,
    						"click",
    						function () {
    							if (is_function(/*addTodo*/ ctx[1])) /*addTodo*/ ctx[1].apply(this, arguments);
    						},
    						false,
    						false,
    						false,
    						false
    					)
    				];

    				mounted = true;
    			}
    		},
    		p: function update(new_ctx, [dirty]) {
    			ctx = new_ctx;

    			if (dirty & /*todo*/ 1 && input.value !== /*todo*/ ctx[0]) {
    				set_input_value(input, /*todo*/ ctx[0]);
    			}
    		},
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			mounted = false;
    			run_all(dispose);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$3.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$3($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Input', slots, []);
    	let { todo } = $$props;
    	let { addTodo } = $$props;
    	let { handleKeyUp } = $$props;

    	$$self.$$.on_mount.push(function () {
    		if (todo === undefined && !('todo' in $$props || $$self.$$.bound[$$self.$$.props['todo']])) {
    			console.warn("<Input> was created without expected prop 'todo'");
    		}

    		if (addTodo === undefined && !('addTodo' in $$props || $$self.$$.bound[$$self.$$.props['addTodo']])) {
    			console.warn("<Input> was created without expected prop 'addTodo'");
    		}

    		if (handleKeyUp === undefined && !('handleKeyUp' in $$props || $$self.$$.bound[$$self.$$.props['handleKeyUp']])) {
    			console.warn("<Input> was created without expected prop 'handleKeyUp'");
    		}
    	});

    	const writable_props = ['todo', 'addTodo', 'handleKeyUp'];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Input> was created with unknown prop '${key}'`);
    	});

    	function input_input_handler() {
    		todo = this.value;
    		$$invalidate(0, todo);
    	}

    	const keyup_handler = e => handleKeyUp(e);

    	$$self.$$set = $$props => {
    		if ('todo' in $$props) $$invalidate(0, todo = $$props.todo);
    		if ('addTodo' in $$props) $$invalidate(1, addTodo = $$props.addTodo);
    		if ('handleKeyUp' in $$props) $$invalidate(2, handleKeyUp = $$props.handleKeyUp);
    	};

    	$$self.$capture_state = () => ({ todo, addTodo, handleKeyUp });

    	$$self.$inject_state = $$props => {
    		if ('todo' in $$props) $$invalidate(0, todo = $$props.todo);
    		if ('addTodo' in $$props) $$invalidate(1, addTodo = $$props.addTodo);
    		if ('handleKeyUp' in $$props) $$invalidate(2, handleKeyUp = $$props.handleKeyUp);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [todo, addTodo, handleKeyUp, input_input_handler, keyup_handler];
    }

    class Input extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$3, create_fragment$3, safe_not_equal, { todo: 0, addTodo: 1, handleKeyUp: 2 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Input",
    			options,
    			id: create_fragment$3.name
    		});
    	}

    	get todo() {
    		throw new Error("<Input>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set todo(value) {
    		throw new Error("<Input>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get addTodo() {
    		throw new Error("<Input>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set addTodo(value) {
    		throw new Error("<Input>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get handleKeyUp() {
    		throw new Error("<Input>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set handleKeyUp(value) {
    		throw new Error("<Input>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src/components/TodoItem.svelte generated by Svelte v3.59.2 */

    const file$2 = "src/components/TodoItem.svelte";

    function create_fragment$2(ctx) {
    	let div1;
    	let div0;
    	let input;
    	let t0;
    	let p;
    	let t1_value = /*todo*/ ctx[0].text + "";
    	let t1;
    	let t2;
    	let button;
    	let mounted;
    	let dispose;

    	const block = {
    		c: function create() {
    			div1 = element("div");
    			div0 = element("div");
    			input = element("input");
    			t0 = space();
    			p = element("p");
    			t1 = text(t1_value);
    			t2 = space();
    			button = element("button");
    			button.textContent = "X";
    			attr_dev(input, "type", "checkbox");
    			attr_dev(input, "class", "svelte-1ohsd07");
    			add_location(input, file$2, 54, 8, 888);
    			attr_dev(p, "class", "svelte-1ohsd07");
    			toggle_class(p, "done", /*todo*/ ctx[0].complete);
    			add_location(p, file$2, 55, 8, 949);
    			attr_dev(div0, "class", "item-content svelte-1ohsd07");
    			add_location(div0, file$2, 53, 4, 853);
    			attr_dev(button, "class", "svelte-1ohsd07");
    			add_location(button, file$2, 57, 4, 1010);
    			attr_dev(div1, "class", "item svelte-1ohsd07");
    			add_location(div1, file$2, 52, 0, 830);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div1, anchor);
    			append_dev(div1, div0);
    			append_dev(div0, input);
    			input.checked = /*todo*/ ctx[0].complete;
    			append_dev(div0, t0);
    			append_dev(div0, p);
    			append_dev(p, t1);
    			append_dev(div1, t2);
    			append_dev(div1, button);

    			if (!mounted) {
    				dispose = [
    					listen_dev(input, "change", /*input_change_handler*/ ctx[2]),
    					listen_dev(button, "click", /*click_handler*/ ctx[3], false, false, false, false)
    				];

    				mounted = true;
    			}
    		},
    		p: function update(ctx, [dirty]) {
    			if (dirty & /*todo*/ 1) {
    				input.checked = /*todo*/ ctx[0].complete;
    			}

    			if (dirty & /*todo*/ 1 && t1_value !== (t1_value = /*todo*/ ctx[0].text + "")) set_data_dev(t1, t1_value);

    			if (dirty & /*todo*/ 1) {
    				toggle_class(p, "done", /*todo*/ ctx[0].complete);
    			}
    		},
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div1);
    			mounted = false;
    			run_all(dispose);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$2.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$2($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('TodoItem', slots, []);
    	let { todo } = $$props;
    	let { removeTodo } = $$props;

    	$$self.$$.on_mount.push(function () {
    		if (todo === undefined && !('todo' in $$props || $$self.$$.bound[$$self.$$.props['todo']])) {
    			console.warn("<TodoItem> was created without expected prop 'todo'");
    		}

    		if (removeTodo === undefined && !('removeTodo' in $$props || $$self.$$.bound[$$self.$$.props['removeTodo']])) {
    			console.warn("<TodoItem> was created without expected prop 'removeTodo'");
    		}
    	});

    	const writable_props = ['todo', 'removeTodo'];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<TodoItem> was created with unknown prop '${key}'`);
    	});

    	function input_change_handler() {
    		todo.complete = this.checked;
    		$$invalidate(0, todo);
    	}

    	const click_handler = () => removeTodo(todo.id);

    	$$self.$$set = $$props => {
    		if ('todo' in $$props) $$invalidate(0, todo = $$props.todo);
    		if ('removeTodo' in $$props) $$invalidate(1, removeTodo = $$props.removeTodo);
    	};

    	$$self.$capture_state = () => ({ todo, removeTodo });

    	$$self.$inject_state = $$props => {
    		if ('todo' in $$props) $$invalidate(0, todo = $$props.todo);
    		if ('removeTodo' in $$props) $$invalidate(1, removeTodo = $$props.removeTodo);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [todo, removeTodo, input_change_handler, click_handler];
    }

    class TodoItem extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$2, create_fragment$2, safe_not_equal, { todo: 0, removeTodo: 1 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "TodoItem",
    			options,
    			id: create_fragment$2.name
    		});
    	}

    	get todo() {
    		throw new Error("<TodoItem>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set todo(value) {
    		throw new Error("<TodoItem>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get removeTodo() {
    		throw new Error("<TodoItem>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set removeTodo(value) {
    		throw new Error("<TodoItem>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src/components/Todos.svelte generated by Svelte v3.59.2 */
    const file$1 = "src/components/Todos.svelte";

    function get_each_context(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[2] = list[i];
    	return child_ctx;
    }

    // (23:4) {#each todoList as todo}
    function create_each_block(ctx) {
    	let todoitem;
    	let current;

    	todoitem = new TodoItem({
    			props: {
    				todo: /*todo*/ ctx[2],
    				removeTodo: /*removeTodo*/ ctx[1]
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(todoitem.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(todoitem, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const todoitem_changes = {};
    			if (dirty & /*todoList*/ 1) todoitem_changes.todo = /*todo*/ ctx[2];
    			if (dirty & /*removeTodo*/ 2) todoitem_changes.removeTodo = /*removeTodo*/ ctx[1];
    			todoitem.$set(todoitem_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(todoitem.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(todoitem.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(todoitem, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block.name,
    		type: "each",
    		source: "(23:4) {#each todoList as todo}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$1(ctx) {
    	let div;
    	let current;
    	let each_value = /*todoList*/ ctx[0];
    	validate_each_argument(each_value);
    	let each_blocks = [];

    	for (let i = 0; i < each_value.length; i += 1) {
    		each_blocks[i] = create_each_block(get_each_context(ctx, each_value, i));
    	}

    	const out = i => transition_out(each_blocks[i], 1, 1, () => {
    		each_blocks[i] = null;
    	});

    	const block = {
    		c: function create() {
    			div = element("div");

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			attr_dev(div, "class", "svelte-1ha6h33");
    			toggle_class(div, "todos", /*todoList*/ ctx[0].length);
    			add_location(div, file$1, 21, 0, 423);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				if (each_blocks[i]) {
    					each_blocks[i].m(div, null);
    				}
    			}

    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			if (dirty & /*todoList, removeTodo*/ 3) {
    				each_value = /*todoList*/ ctx[0];
    				validate_each_argument(each_value);
    				let i;

    				for (i = 0; i < each_value.length; i += 1) {
    					const child_ctx = get_each_context(ctx, each_value, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(child_ctx, dirty);
    						transition_in(each_blocks[i], 1);
    					} else {
    						each_blocks[i] = create_each_block(child_ctx);
    						each_blocks[i].c();
    						transition_in(each_blocks[i], 1);
    						each_blocks[i].m(div, null);
    					}
    				}

    				group_outros();

    				for (i = each_value.length; i < each_blocks.length; i += 1) {
    					out(i);
    				}

    				check_outros();
    			}

    			if (!current || dirty & /*todoList*/ 1) {
    				toggle_class(div, "todos", /*todoList*/ ctx[0].length);
    			}
    		},
    		i: function intro(local) {
    			if (current) return;

    			for (let i = 0; i < each_value.length; i += 1) {
    				transition_in(each_blocks[i]);
    			}

    			current = true;
    		},
    		o: function outro(local) {
    			each_blocks = each_blocks.filter(Boolean);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				transition_out(each_blocks[i]);
    			}

    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			destroy_each(each_blocks, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$1.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$1($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Todos', slots, []);
    	let { todoList } = $$props;
    	let { removeTodo } = $$props;

    	$$self.$$.on_mount.push(function () {
    		if (todoList === undefined && !('todoList' in $$props || $$self.$$.bound[$$self.$$.props['todoList']])) {
    			console.warn("<Todos> was created without expected prop 'todoList'");
    		}

    		if (removeTodo === undefined && !('removeTodo' in $$props || $$self.$$.bound[$$self.$$.props['removeTodo']])) {
    			console.warn("<Todos> was created without expected prop 'removeTodo'");
    		}
    	});

    	const writable_props = ['todoList', 'removeTodo'];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Todos> was created with unknown prop '${key}'`);
    	});

    	$$self.$$set = $$props => {
    		if ('todoList' in $$props) $$invalidate(0, todoList = $$props.todoList);
    		if ('removeTodo' in $$props) $$invalidate(1, removeTodo = $$props.removeTodo);
    	};

    	$$self.$capture_state = () => ({ TodoItem, todoList, removeTodo });

    	$$self.$inject_state = $$props => {
    		if ('todoList' in $$props) $$invalidate(0, todoList = $$props.todoList);
    		if ('removeTodo' in $$props) $$invalidate(1, removeTodo = $$props.removeTodo);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [todoList, removeTodo];
    }

    class Todos extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$1, create_fragment$1, safe_not_equal, { todoList: 0, removeTodo: 1 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Todos",
    			options,
    			id: create_fragment$1.name
    		});
    	}

    	get todoList() {
    		throw new Error("<Todos>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set todoList(value) {
    		throw new Error("<Todos>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get removeTodo() {
    		throw new Error("<Todos>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set removeTodo(value) {
    		throw new Error("<Todos>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src/App.svelte generated by Svelte v3.59.2 */
    const file = "src/App.svelte";

    function create_fragment(ctx) {
    	let main;
    	let div;
    	let h1;
    	let t1;
    	let input;
    	let t2;
    	let todos;
    	let current;

    	input = new Input({
    			props: {
    				todo: /*todo*/ ctx[1],
    				addTodo: /*addTodo*/ ctx[2],
    				handleKeyUp: /*handleKeyUp*/ ctx[4]
    			},
    			$$inline: true
    		});

    	todos = new Todos({
    			props: {
    				todoList: /*todoList*/ ctx[0],
    				removeTodo: /*removeTodo*/ ctx[3]
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			main = element("main");
    			div = element("div");
    			h1 = element("h1");
    			h1.textContent = "Todo List";
    			t1 = space();
    			create_component(input.$$.fragment);
    			t2 = space();
    			create_component(todos.$$.fragment);
    			attr_dev(h1, "class", "svelte-1s763l1");
    			add_location(h1, file, 65, 2, 1115);
    			attr_dev(div, "class", "container svelte-1s763l1");
    			add_location(div, file, 64, 1, 1089);
    			attr_dev(main, "class", "svelte-1s763l1");
    			add_location(main, file, 63, 0, 1081);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, main, anchor);
    			append_dev(main, div);
    			append_dev(div, h1);
    			append_dev(div, t1);
    			mount_component(input, div, null);
    			append_dev(div, t2);
    			mount_component(todos, div, null);
    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			const input_changes = {};
    			if (dirty & /*todo*/ 2) input_changes.todo = /*todo*/ ctx[1];
    			input.$set(input_changes);
    			const todos_changes = {};
    			if (dirty & /*todoList*/ 1) todos_changes.todoList = /*todoList*/ ctx[0];
    			todos.$set(todos_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(input.$$.fragment, local);
    			transition_in(todos.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(input.$$.fragment, local);
    			transition_out(todos.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(main);
    			destroy_component(input);
    			destroy_component(todos);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('App', slots, []);
    	let todoList = [];
    	let todo = ""; // input 입력값
    	let lastId = 0;

    	let addTodo = () => {
    		if (todo.length) {
    			let newTodo = {
    				id: lastId++,
    				text: todo,
    				complete: false
    			};

    			$$invalidate(0, todoList[todoList.length] = newTodo, todoList);
    			$$invalidate(1, todo = "");
    		}
    	};

    	let removeTodo = id => {
    		$$invalidate(0, todoList = todoList.filter(todo => todo.id !== id));
    	};

    	let handleKeyUp = e => {
    		$$invalidate(1, todo = e.target.value);

    		if (e.keyCode === 13) {
    			addTodo();
    		}
    	};

    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<App> was created with unknown prop '${key}'`);
    	});

    	$$self.$capture_state = () => ({
    		Input,
    		Todos,
    		todoList,
    		todo,
    		lastId,
    		addTodo,
    		removeTodo,
    		handleKeyUp
    	});

    	$$self.$inject_state = $$props => {
    		if ('todoList' in $$props) $$invalidate(0, todoList = $$props.todoList);
    		if ('todo' in $$props) $$invalidate(1, todo = $$props.todo);
    		if ('lastId' in $$props) lastId = $$props.lastId;
    		if ('addTodo' in $$props) $$invalidate(2, addTodo = $$props.addTodo);
    		if ('removeTodo' in $$props) $$invalidate(3, removeTodo = $$props.removeTodo);
    		if ('handleKeyUp' in $$props) $$invalidate(4, handleKeyUp = $$props.handleKeyUp);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [todoList, todo, addTodo, removeTodo, handleKeyUp];
    }

    class App extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance, create_fragment, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "App",
    			options,
    			id: create_fragment.name
    		});
    	}
    }

    const app = new App({
    	target: document.body,
    	props: {
    		name: 'world'
    	}
    });

    return app;

})();
//# sourceMappingURL=bundle.js.map
