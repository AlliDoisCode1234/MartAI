import {
  c as w,
  e as O
} from "../_deps/GTU362KY.js";
import "../_deps/4U34M3I6.js";
import {
  a as o
} from "../_deps/RUVYHBJQ.js";

// convex/lib/aggregates.ts
O();

// node_modules/@convex-dev/aggregate/dist/client/positions.js
var y = [];
function _(n) {
  if (Array.isArray(n)) {
    let t = [""];
    for (let e of n)
      t.push(e), t.push("");
    return t;
  }
  return n;
}
o(_, "explodeKey");
function L(n) {
  if (Array.isArray(n)) {
    let t = [];
    for (let e = 1; e < n.length; e += 2)
      t.push(n[e]);
    return t;
  }
  return n;
}
o(L, "implodeKey");
function m(n, t) {
  return [_(n), t, ""];
}
o(m, "keyToPosition");
function E(n) {
  return { key: L(n[0]), id: n[1] };
}
o(E, "positionToKey");
function p(n) {
  if (n === void 0)
    return {};
  if ("prefix" in n) {
    let t = n.prefix, e = [];
    for (let s of t)
      e.push(""), e.push(s);
    return {
      k1: [e.concat([null]), null, null],
      k2: [e.concat([y]), y, y]
    };
  }
  return {
    k1: d("lower", n.lower),
    k2: d("upper", n.upper)
  };
}
o(p, "boundsToPositions");
function d(n, t) {
  if (t !== void 0)
    return n === "lower" ? [
      _(t.key),
      t.id ?? (t.inclusive ? null : y),
      t.inclusive ? null : y
    ] : [
      _(t.key),
      t.id ?? (t.inclusive ? y : null),
      t.inclusive ? y : null
    ];
}
o(d, "boundToPosition");

// node_modules/@convex-dev/aggregate/dist/client/index.js
var k = class {
  static {
    o(this, "Aggregate");
  }
  component;
  constructor(t) {
    this.component = t;
  }
  /// Aggregate queries.
  /**
   * Counts items between the given bounds.
   */
  async count(t, ...e) {
    let { count: s } = await t.runQuery(this.component.btree.aggregateBetween, {
      ...p(e[0]?.bounds),
      namespace: u(e)
    });
    return s;
  }
  /**
   * Batch version of count() - counts items for multiple bounds in a single call.
   */
  async countBatch(t, e) {
    let s = e.map((a) => {
      if (!a)
        throw new Error("You must pass bounds and/or namespace");
      let r = b(a), { k1: c, k2: l } = p(a.bounds);
      return { k1: c, k2: l, namespace: r };
    });
    return (await t.runQuery(this.component.btree.aggregateBetweenBatch, {
      queries: s
    })).map((a) => a.count);
  }
  /**
   * Adds up the sumValue of items between the given bounds.
   */
  async sum(t, ...e) {
    let { sum: s } = await t.runQuery(this.component.btree.aggregateBetween, {
      ...p(e[0]?.bounds),
      namespace: u(e)
    });
    return s;
  }
  /**
   * Batch version of sum() - sums items for multiple bounds in a single call.
   */
  async sumBatch(t, e) {
    let s = e.map((a) => {
      if (!a)
        throw new Error("You must pass bounds and/or namespace");
      let r = b(a), { k1: c, k2: l } = p(a.bounds);
      return { k1: c, k2: l, namespace: r };
    });
    return (await t.runQuery(this.component.btree.aggregateBetweenBatch, {
      queries: s
    })).map((a) => a.sum);
  }
  /**
   * Returns the item at the given offset/index/rank in the order of key,
   * within the bounds. Zero-indexed, so at(0) is the smallest key within the
   * bounds.
   *
   * If offset is negative, it counts from the end of the list, so at(-1) is the
   * item with the largest key within the bounds.
   */
  async at(t, e, ...s) {
    if (e < 0) {
      let a = await t.runQuery(this.component.btree.atNegativeOffset, {
        offset: -e - 1,
        namespace: u(s),
        ...p(s[0]?.bounds)
      });
      return h(a);
    }
    let i = await t.runQuery(this.component.btree.atOffset, {
      offset: e,
      namespace: u(s),
      ...p(s[0]?.bounds)
    });
    return h(i);
  }
  /**
   * Batch version of at() - returns items at multiple offsets in a single call.
   */
  async atBatch(t, e) {
    let s = e.map((a) => ({
      offset: a.offset,
      ...p(a.bounds),
      namespace: b(a)
    }));
    return (await t.runQuery(this.component.btree.atOffsetBatch, {
      queries: s
    })).map(h);
  }
  /**
   * Returns the rank/offset/index of the given key, within the bounds.
   * Specifically, it returns the index of the first item with
   *
   * - key >= the given key if `order` is "asc" (default)
   * - key <= the given key if `order` is "desc"
   */
  async indexOf(t, e, ...s) {
    let { k1: i, k2: a } = p(s[0]?.bounds);
    return s[0]?.order === "desc" ? await t.runQuery(this.component.btree.offsetUntil, {
      key: d("upper", {
        key: e,
        id: s[0]?.id,
        inclusive: !0
      }),
      k2: a,
      namespace: u(s)
    }) : await t.runQuery(this.component.btree.offset, {
      key: d("lower", { key: e, id: s[0]?.id, inclusive: !0 }),
      k1: i,
      namespace: u(s)
    });
  }
  /**
   * @deprecated Use `indexOf` instead.
   */
  async offsetOf(t, e, s, i, a) {
    return this.indexOf(t, e, { id: i, bounds: a, order: "asc", namespace: s });
  }
  /**
   * @deprecated Use `indexOf` instead.
   */
  async offsetUntil(t, e, s, i, a) {
    return this.indexOf(t, e, { id: i, bounds: a, order: "desc", namespace: s });
  }
  /**
   * Gets the minimum item within the given bounds.
   */
  async min(t, ...e) {
    let { page: s } = await this.paginate(t, {
      namespace: u(e),
      bounds: e[0]?.bounds,
      order: "asc",
      pageSize: 1
    });
    return s[0] ?? null;
  }
  /**
   * Gets the maximum item within the given bounds.
   */
  async max(t, ...e) {
    let { page: s } = await this.paginate(t, {
      namespace: u(e),
      bounds: e[0]?.bounds,
      order: "desc",
      pageSize: 1
    });
    return s[0] ?? null;
  }
  /**
   * Gets a uniformly random item within the given bounds.
   */
  async random(t, ...e) {
    let s = await this.count(t, ...e);
    if (s === 0)
      return null;
    let i = Math.floor(Math.random() * s);
    return await this.at(t, i, ...e);
  }
  /**
   * Get a page of items between the given bounds, with a cursor to paginate.
   * Use `iter` to iterate over all items within the bounds.
   */
  async paginate(t, ...e) {
    let s = e[0]?.order ?? "asc", i = e[0]?.pageSize ?? 100, { page: a, cursor: r, isDone: c } = await t.runQuery(this.component.btree.paginate, {
      namespace: u(e),
      ...p(e[0]?.bounds),
      cursor: e[0]?.cursor,
      order: s,
      limit: i
    });
    return {
      page: a.map(h),
      cursor: r,
      isDone: c
    };
  }
  /**
   * Example usage:
   * ```ts
   * for await (const item of aggregate.iter(ctx, bounds)) {
   *   console.log(item);
   * }
   * ```
   */
  async *iter(t, ...e) {
    let s = e[0]?.order ?? "asc", i = e[0]?.pageSize ?? 100, a = e[0]?.bounds, r = u(e), c = !1, l;
    for (; !c; ) {
      let { page: x, cursor: g, isDone: D } = await this.paginate(t, {
        namespace: r,
        bounds: a,
        cursor: l,
        order: s,
        pageSize: i
      });
      for (let I of x)
        yield I;
      c = D, l = g;
    }
  }
  /** Write operations. See {@link DirectAggregate} for docstrings. */
  async _insert(t, e, s, i, a) {
    await t.runMutation(this.component.public.insert, {
      key: m(s, i),
      summand: a,
      value: i,
      namespace: e
    });
  }
  async _delete(t, e, s, i) {
    await t.runMutation(this.component.public.delete_, {
      key: m(s, i),
      namespace: e
    });
  }
  async _replace(t, e, s, i, a, r, c) {
    await t.runMutation(this.component.public.replace, {
      currentKey: m(s, r),
      newKey: m(a, r),
      summand: c,
      value: r,
      namespace: e,
      newNamespace: i
    });
  }
  async _insertIfDoesNotExist(t, e, s, i, a) {
    await this._replaceOrInsert(t, e, s, e, s, i, a);
  }
  async _deleteIfExists(t, e, s, i) {
    await t.runMutation(this.component.public.deleteIfExists, {
      key: m(s, i),
      namespace: e
    });
  }
  async _replaceOrInsert(t, e, s, i, a, r, c) {
    await t.runMutation(this.component.public.replaceOrInsert, {
      currentKey: m(s, r),
      newKey: m(a, r),
      summand: c,
      value: r,
      namespace: e,
      newNamespace: i
    });
  }
  /// Initialization and maintenance.
  /**
   * (re-)initialize the data structure, removing all items if it exists.
   *
   * Change the maxNodeSize if provided, otherwise keep it the same.
   *   maxNodeSize is how you tune the data structure's width and depth.
   *   Larger values can reduce write contention but increase read latency.
   *   Default is 16.
   * Set rootLazy = false to eagerly compute aggregates on the root node, which
   *   improves aggregation latency at the expense of making all writes contend
   *   with each other, so it's only recommended for read-heavy workloads.
   *   Default is true.
   */
  async clear(t, ...e) {
    await t.runMutation(this.component.public.clear, {
      maxNodeSize: e[0]?.maxNodeSize,
      rootLazy: e[0]?.rootLazy,
      namespace: u(e)
    });
  }
  /**
   * If rootLazy is false (the default is true but it can be set to false by
   * `clear`), the aggregates data structure writes to a single root node on
   * every insert/delete/replace, which can cause contention.
   *
   * If your data structure has frequent writes, you can reduce contention by
   * calling makeRootLazy, which removes the frequent writes to the root node.
   * With a lazy root node, updates will only contend with other updates to the
   * same shard of the tree. The number of shards is determined by maxNodeSize,
   * so larger maxNodeSize can also help.
   */
  async makeRootLazy(t, e) {
    await t.runMutation(this.component.public.makeRootLazy, { namespace: e });
  }
  async paginateNamespaces(t, e, s = 100) {
    let { page: i, cursor: a, isDone: r } = await t.runQuery(this.component.btree.paginateNamespaces, {
      cursor: e,
      limit: s
    });
    return {
      page: i,
      cursor: a,
      isDone: r
    };
  }
  async *iterNamespaces(t, e = 100) {
    let s = !1, i;
    for (; !s; ) {
      let { page: a, cursor: r, isDone: c } = await this.paginateNamespaces(t, i, e);
      for (let l of a)
        yield l ?? void 0;
      s = c, i = r;
    }
  }
  async clearAll(t, e) {
    for await (let s of this.iterNamespaces(t))
      await this.clear(t, { ...e, namespace: s });
    await this.clear(t, { ...e, namespace: void 0 });
  }
  async makeAllRootsLazy(t) {
    for await (let e of this.iterNamespaces(t))
      await this.makeRootLazy(t, e);
  }
};
var f = class extends k {
  static {
    o(this, "TableAggregate");
  }
  options;
  constructor(t, e) {
    super(t), this.options = e;
  }
  async insert(t, e) {
    await this._insert(t, this.options.namespace?.(e), this.options.sortKey(e), e._id, this.options.sumValue?.(e));
  }
  async delete(t, e) {
    await this._delete(t, this.options.namespace?.(e), this.options.sortKey(e), e._id);
  }
  async replace(t, e, s) {
    await this._replace(t, this.options.namespace?.(e), this.options.sortKey(e), this.options.namespace?.(s), this.options.sortKey(s), s._id, this.options.sumValue?.(s));
  }
  async insertIfDoesNotExist(t, e) {
    await this._insertIfDoesNotExist(t, this.options.namespace?.(e), this.options.sortKey(e), e._id, this.options.sumValue?.(e));
  }
  async deleteIfExists(t, e) {
    await this._deleteIfExists(t, this.options.namespace?.(e), this.options.sortKey(e), e._id);
  }
  async replaceOrInsert(t, e, s) {
    await this._replaceOrInsert(t, this.options.namespace?.(e), this.options.sortKey(e), this.options.namespace?.(s), this.options.sortKey(s), s._id, this.options.sumValue?.(s));
  }
  /**
   * Returns the rank/offset/index of the given document, within the bounds.
   * This differs from `indexOf` in that it take the document rather than key.
   * Specifically, it returns the index of the first item with
   *
   * - key >= the given doc's key if `order` is "asc" (default)
   * - key <= the given doc's key if `order` is "desc"
   */
  async indexOfDoc(t, e, s) {
    let i = this.options.sortKey(e);
    return this.indexOf(t, i, {
      namespace: this.options.namespace?.(e),
      ...s
    });
  }
  trigger() {
    return async (t, e) => {
      e.operation === "insert" ? await this.insert(t, e.newDoc) : e.operation === "update" ? await this.replace(t, e.oldDoc, e.newDoc) : e.operation === "delete" && await this.delete(t, e.oldDoc);
    };
  }
  idempotentTrigger() {
    return async (t, e) => {
      e.operation === "insert" ? await this.insertIfDoesNotExist(t, e.newDoc) : e.operation === "update" ? await this.replaceOrInsert(t, e.oldDoc, e.newDoc) : e.operation === "delete" && await this.deleteIfExists(t, e.oldDoc);
    };
  }
};
function h({ k: n, s: t }) {
  let { key: e, id: s } = E(n);
  return {
    key: e,
    id: s,
    sumValue: t
  };
}
o(h, "btreeItemToAggregateItem");
function b(n) {
  if ("namespace" in n)
    return n.namespace;
}
o(b, "namespaceFromArg");
function u(n) {
  if (n.length === 0)
    return;
  let [{ namespace: t }] = n;
  return t;
}
o(u, "namespaceFromOpts");

// convex/lib/aggregates.ts
var M = new f(w.aggregateBriefs, {
  namespace: /* @__PURE__ */ o((n) => n.projectId, "namespace"),
  sortKey: /* @__PURE__ */ o((n) => n._creationTime, "sortKey")
}), R = new f(w.aggregateKeywords, {
  namespace: /* @__PURE__ */ o((n) => n.projectId, "namespace"),
  sortKey: /* @__PURE__ */ o((n) => n._creationTime, "sortKey")
});
export {
  M as contentPiecesByProject,
  R as keywordsByProject
};
//# sourceMappingURL=aggregates.js.map
