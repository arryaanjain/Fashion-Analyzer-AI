# Semantic Matching Troubleshooting

## Current Issue: Second Request Returns Empty

From the logs:
```
INFO:dataset_processor:ℹ️  Semantic index not available, using keyword matching
INFO:     127.0.0.1:36528 - "POST /api/chat HTTP/1.1" 200 OK
INFO:dataset_processor:ℹ️  Semantic index not available, using keyword matching
```

The second request shows "responds with nothing" - meaning the response body might be empty or the API is timing out.

## Root Causes to Check

### 1. **Semantic Index Building on Second Request**
The semantic index might be getting rebuilt on every request because:
- Cache loading succeeds but `_build_semantic_index()` is called again
- This re-parses all 104+ images through TF-IDF vectorizer
- Could cause timeout on second request if images haven't finished extracting

**Fix**: Add caching to prevent rebuilding if already built
```python
def _build_semantic_index(self):
    """Build TF-IDF semantic index for similarity search"""
    # Skip if already built
    if self.semantic_index is not None and self.semantic_matrix is not None:
        logger.debug("✅ Semantic index already built, skipping rebuild")
        return
    # ... rest of code
```

### 2. **Query Vector Transform Issues**
When transforming a query that contains out-of-vocabulary words:
```python
def _build_query_vector(self, query: str, user_colors: List[str] = None) -> np.ndarray:
    if self.semantic_index:
        return self.semantic_index.transform([query_text]).toarray()[0]
```

If query contains words not in vocabulary, transform might fail silently or return empty vector.

**Fix**: Handle unknown words gracefully
```python
if self.semantic_index:
    try:
        return self.semantic_index.transform([query_text]).toarray()[0]
    except Exception as e:
        logger.warning(f"Query transform failed: {e}")
        return np.array([])
```

### 3. **Timeout on Similarity Calculation**
For 104 images with large TF-IDF vectors:
```python
similarity_scores = cosine_similarity([query_features], self.semantic_matrix)[0]
```

This might timeout with large matrices.

**Fix**: Add timeout handling and batch processing

### 4. **Empty Metadata After Cache Load**
```python
if os.path.exists(self.metadata_cache_file):
    with open(self.metadata_cache_file, 'r') as f:
        self.fashion_images_metadata = json.load(f)
```

If cache file is corrupted or empty, metadata stays empty, then:
```python
if len(self.fashion_images_metadata) == 0:
    logger.warning("⚠️  No metadata to index")
    self.semantic_index = None
    self.semantic_matrix = None
    return
```

Semantic index stays None.

**Fix**: Validate cache before loading
```python
if os.path.exists(self.metadata_cache_file):
    try:
        with open(self.metadata_cache_file, 'r') as f:
            cached_data = json.load(f)
        if cached_data and len(cached_data) > 0:
            self.fashion_images_metadata = cached_data
            # ... build index
        else:
            raise ValueError("Cache file is empty")
    except Exception as e:
        logger.warning(f"Cache validation failed: {e}")
        # Rebuild from disk
```

## Testing the System

### Test 1: Check if semantic index builds
```bash
curl http://localhost:8000/api/dataset-stats
```

Look for: `"semantic_index_available": true`

### Test 2: Send a semantic query
```bash
curl -X POST http://localhost:8000/api/chat \
  -H "Content-Type: application/json" \
  -d '{"message": "Show me a blue dress"}'
```

Expected: Response contains "💎 Stylette Semantic Match Analysis" section with similarity scores

### Test 3: Check logs for semantic matches
```bash
# Should show one of:
# ✅ Found N semantic matches for query
# ℹ️  Semantic index not available, using keyword matching
# ✅ Built semantic index for X documents
```

### Test 4: Second request
Send the same query again. Should be faster and show same matches.

## Actual Semantic Matching Output Format

When working correctly, response should include:

```markdown
### 💎 Stylette Semantic Match Analysis
**Found 3 similar styles from your dataset:**

**1. BlackFormalJeans** (Match Score: 89%)
   • Type: jeans
   • Colors: black
   • Occasion: formal

**2. DarkBlueJacket** (Match Score: 78%)
   • Type: jacket
   • Colors: blue
   • Occasion: formal

**3. NavyFormalfBlouse** (Match Score: 71%)
   • Type: blouse
   • Colors: navy
```

## Current Code Status

✅ **Fixed in v2:**
- `self.semantic_index` and `self.semantic_matrix` initialized in `__init__`
- Both checked before use with `hasattr()` and `is not None`
- Fallback to keyword matching always available
- Cache loading calls `_build_semantic_index()`

⚠️ **Still Potential Issues:**
- Rebuilding index on every cache load (needs optimization)
- No caching of TF-IDF vectorizer itself (only metadata)
- Query transformation might fail on unknown words
- Large matrices could cause timeout

## Next Steps

1. **Add semantic index rebuild prevention**
2. **Add timeout protection for similarity calculation**
3. **Cache the TF-IDF vectorizer, not just metadata**
4. **Add query validation before transformation**
5. **Test with timeout middleware**
