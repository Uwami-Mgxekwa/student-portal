// Back4App (Parse) Configuration
// Parse is loaded via <script> tag in HTML pages to avoid CORS issues with CDN imports

const APP_ID = 'SxhMBsTSB2BasoZQecw9KyixCwyDMK8cyQwx9T7f';
const JS_KEY = 'oFVQJKq96RoamUqC6EfbPdnIJBlA5V4ii6ZF6riF';

// Wait for Parse to be available from the global script tag
function getParseInstance() {
  if (typeof Parse === 'undefined') {
    console.error('❌ Parse is not loaded. Make sure the Parse CDN script tag is in your HTML.');
    return null;
  }
  return Parse;
}

const ParseInstance = getParseInstance();

if (ParseInstance) {
  ParseInstance.initialize(APP_ID, JS_KEY);
  ParseInstance.serverURL = 'https://parseapi.back4app.com/';
  console.log('✅ Back4App (Parse) client initialized');
}

export { ParseInstance as Parse };

// ============================================================================
// SUPABASE-COMPATIBLE WRAPPER
// This allows all existing code using supabase.from(...).select() etc. to work
// with Back4App (Parse) without changing every file.
// ============================================================================

class ParseQueryBuilder {
  constructor(className) {
    this.className = className;
    this._filters = [];
    this._orFilters = [];
    this._order = null;
    this._ascending = true;
    this._limit = null;
    this._selectFields = null;
    this._single = false;
    this._ilike = null;
    this._gte = null;
    this._lte = null;
    this._eq = null;
    this._neq = null;
    this._orConditions = null;
  }

  select(fields = '*') {
    this._selectFields = fields;
    return this;
  }

  eq(field, value) {
    this._filters.push({ type: 'eq', field, value });
    return this;
  }

  neq(field, value) {
    this._filters.push({ type: 'neq', field, value });
    return this;
  }

  ilike(field, value) {
    this._filters.push({ type: 'ilike', field, value });
    return this;
  }

  gte(field, value) {
    this._filters.push({ type: 'gte', field, value });
    return this;
  }

  lte(field, value) {
    this._filters.push({ type: 'lte', field, value });
    return this;
  }

  gt(field, value) {
    this._filters.push({ type: 'gt', field, value });
    return this;
  }

  lt(field, value) {
    this._filters.push({ type: 'lt', field, value });
    return this;
  }

  or(conditionString) {
    // Parse "field.eq.value,field.eq.value" format
    this._orConditions = conditionString;
    return this;
  }

  order(field, options = {}) {
    this._order = field;
    this._ascending = options.ascending !== false;
    return this;
  }

  limit(n) {
    this._limit = n;
    return this;
  }

  single() {
    this._single = true;
    return this;
  }

  _buildQuery() {
    const P = getParseInstance();
    if (!P) return null;

    const query = new P.Query(this.className);

    for (const filter of this._filters) {
      switch (filter.type) {
        case 'eq':
          query.equalTo(filter.field, filter.value);
          break;
        case 'neq':
          query.notEqualTo(filter.field, filter.value);
          break;
        case 'ilike': {
          const regex = new RegExp(filter.value.replace(/%/g, '.*'), 'i');
          query.matches(filter.field, regex);
          break;
        }
        case 'gte':
          query.greaterThanOrEqualTo(filter.field, filter.value);
          break;
        case 'lte':
          query.lessThanOrEqualTo(filter.field, filter.value);
          break;
        case 'gt':
          query.greaterThan(filter.field, filter.value);
          break;
        case 'lt':
          query.lessThan(filter.field, filter.value);
          break;
      }
    }

    // Handle OR conditions like "year.eq.2,year.eq.all"
    if (this._orConditions) {
      const parts = this._orConditions.split(',');
      const orQueries = parts.map(part => {
        const subQuery = new P.Query(this.className);
        // Apply existing non-or filters to each sub-query
        for (const filter of this._filters) {
          switch (filter.type) {
            case 'eq': subQuery.equalTo(filter.field, filter.value); break;
            case 'neq': subQuery.notEqualTo(filter.field, filter.value); break;
            case 'gte': subQuery.greaterThanOrEqualTo(filter.field, filter.value); break;
            case 'lte': subQuery.lessThanOrEqualTo(filter.field, filter.value); break;
          }
        }
        // Parse the OR part: "field.op.value"
        const match = part.trim().match(/^(\w+)\.(eq|neq|gte|lte|gt|lt)\.(.+)$/);
        if (match) {
          const [, field, op, value] = match;
          switch (op) {
            case 'eq': subQuery.equalTo(field, value); break;
            case 'neq': subQuery.notEqualTo(field, value); break;
            case 'gte': subQuery.greaterThanOrEqualTo(field, value); break;
            case 'lte': subQuery.lessThanOrEqualTo(field, value); break;
          }
        }
        return subQuery;
      });
      return P.Query.or(...orQueries);
    }

    if (this._order) {
      if (this._ascending) {
        query.ascending(this._order);
      } else {
        query.descending(this._order);
      }
    }

    if (this._limit) {
      query.limit(this._limit);
    } else {
      query.limit(1000); // Default high limit
    }

    return query;
  }

  _parseObjectToRow(obj) {
    if (!obj) return null;
    const json = obj.toJSON();
    // Map Parse objectId to id for compatibility
    return { id: json.objectId, ...json };
  }

  async _execute() {
    try {
      const query = this._buildQuery();
      if (!query) return { data: null, error: new Error('Parse not initialized') };

      // Apply order and limit to OR queries too
      if (this._order) {
        if (this._ascending) query.ascending(this._order);
        else query.descending(this._order);
      }
      if (this._limit) query.limit(this._limit);
      else query.limit(1000);

      if (this._single) {
        const result = await query.first();
        if (!result) return { data: null, error: { code: 'PGRST116', message: 'No rows found' } };
        return { data: this._parseObjectToRow(result), error: null };
      }

      const results = await query.find();
      return { data: results.map(r => this._parseObjectToRow(r)), error: null };
    } catch (error) {
      console.error(`Parse query error on ${this.className}:`, error);
      return { data: null, error };
    }
  }

  then(resolve, reject) {
    return this._execute().then(resolve, reject);
  }
}

class ParseMutationBuilder {
  constructor(className, operation, payload, matchField, matchValue) {
    this.className = className;
    this.operation = operation; // 'insert', 'update', 'delete', 'upsert'
    this.payload = payload;
    this._matchField = matchField;
    this._matchValue = matchValue;
    this._filters = [];
  }

  eq(field, value) {
    this._filters.push({ field, value });
    return this;
  }

  single() {
    return this;
  }

  async _execute() {
    const P = getParseInstance();
    if (!P) return { data: null, error: new Error('Parse not initialized') };

    try {
      const ParseClass = P.Object.extend(this.className);

      if (this.operation === 'insert') {
        const items = Array.isArray(this.payload) ? this.payload : [this.payload];
        const objects = items.map(item => {
          const obj = new ParseClass();
          Object.entries(item).forEach(([k, v]) => obj.set(k, v));
          return obj;
        });
        await P.Object.saveAll(objects);
        return { data: objects.map(o => ({ id: o.id, ...o.toJSON() })), error: null };
      }

      if (this.operation === 'update' || this.operation === 'delete') {
        const query = new P.Query(this.className);
        for (const f of this._filters) {
          query.equalTo(f.field, f.value);
        }
        query.limit(1000);
        const results = await query.find();

        if (this.operation === 'delete') {
          await P.Object.destroyAll(results);
          return { data: null, error: null };
        }

        // Update
        results.forEach(obj => {
          Object.entries(this.payload).forEach(([k, v]) => obj.set(k, v));
        });
        await P.Object.saveAll(results);
        return { data: results.map(o => ({ id: o.id, ...o.toJSON() })), error: null };
      }

      if (this.operation === 'upsert') {
        const query = new P.Query(this.className);
        for (const f of this._filters) {
          query.equalTo(f.field, f.value);
        }
        // Try to find existing
        const existing = await query.first();
        const obj = existing || new ParseClass();
        const items = Array.isArray(this.payload) ? this.payload[0] : this.payload;
        Object.entries(items).forEach(([k, v]) => obj.set(k, v));
        await obj.save();
        return { data: { id: obj.id, ...obj.toJSON() }, error: null };
      }

      return { data: null, error: new Error('Unknown operation') };
    } catch (error) {
      console.error(`Parse mutation error on ${this.className}:`, error);
      return { data: null, error };
    }
  }

  then(resolve, reject) {
    return this._execute().then(resolve, reject);
  }
}

class ParseTableRef {
  constructor(className) {
    this.className = className;
  }

  select(fields = '*') {
    return new ParseQueryBuilder(this.className).select(fields);
  }

  insert(payload) {
    return new ParseMutationBuilder(this.className, 'insert', payload);
  }

  update(payload) {
    return new ParseMutationBuilder(this.className, 'update', payload);
  }

  delete() {
    return new ParseMutationBuilder(this.className, 'delete', null);
  }

  upsert(payload, options = {}) {
    return new ParseMutationBuilder(this.className, 'upsert', payload);
  }
}

// Storage compatibility stub (Back4App uses Parse Files)
const storageCompat = {
  from: (bucket) => ({
    upload: async (path, file, options) => {
      try {
        const P = getParseInstance();
        const parseFile = new P.File(path.split('/').pop(), file);
        await parseFile.save();
        return { data: { path }, error: null };
      } catch (error) {
        return { data: null, error };
      }
    },
    getPublicUrl: (path) => {
      // Return a placeholder - Back4App file URLs are returned on upload
      return { data: { publicUrl: '' } };
    }
  })
};

// Auth compatibility stub
const authCompat = {
  getUser: async () => {
    const P = getParseInstance();
    const user = P ? P.User.current() : null;
    return { data: { user: user ? { id: user.id, email: user.get('email') } : null } };
  },
  signInWithPassword: async ({ email, password }) => {
    // Not used - back4app-auth.js handles login
    return { error: null };
  },
  updateUser: async ({ password }) => {
    try {
      const P = getParseInstance();
      const user = P.User.current();
      if (!user) return { error: new Error('Not logged in') };
      user.setPassword(password);
      await user.save();
      return { error: null };
    } catch (error) {
      return { error };
    }
  }
};

// The main supabase-compatible client
export const supabase = {
  from: (tableName) => new ParseTableRef(tableName),
  storage: storageCompat,
  auth: authCompat
};
