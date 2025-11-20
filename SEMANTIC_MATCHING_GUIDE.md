# Stylette Semantic Matching Guide

## What Triggers Semantic Matches?

The system builds a TF-IDF semantic index from fashion image metadata. Matches occur when your query contains keywords that are found in the indexed documents.

### Indexed Keywords (from filenames)

#### Clothing Types
These are extracted from image filenames and indexed:
- `dress`
- `saree`
- `anarkali`
- `lehenga`
- `suit`
- `top`
- `blouse`
- `skirt`
- `kurta`
- `pants`
- `jeans`
- `jacket`
- `blazer`

#### Colors
These color names trigger semantic matches:
- `black`, `white`, `red`, `blue`, `green`, `yellow`, `pink`, `purple`, `orange`, `brown`, `gray`, `grey`, `navy`, `burgundy`, `turquoise`, `olive`, `lavender`, `coral`, `gold`, `silver`

#### Style Descriptors
These appearance keywords are indexed:
- `embroidered`
- `embellished`
- `sequin` / `sequined`
- `floral`
- `printed`
- `lace`
- `silk`
- `cotton`
- `formal`
- `casual`
- `party`

#### Ethnic Wear Detection
Images with these keywords are marked as ethnic:
- `anarkali`, `saree`, `lehenga`, `kurta`, `salwar`, `ethnic`, `traditional`

#### Visual Features (from image analysis)
Additional features indexed:
- **Dominant colors** extracted via K-Means clustering
- **Texture type**: `plain`, `patterned`, `embellished`
- **Edge density** from Sobel edge detection
- **Sharpness score** from Laplacian analysis

### Example Queries That Will Match

✅ **Queries that WILL get semantic matches:**
- "Show me a blue dress" → Matches `dress` + `blue`
- "I want an embroidered saree" → Matches `saree` + `embroidered`
- "Find me formal black jeans" → Matches `jeans` + `black` + `formal`
- "casual floral top" → Matches `top` + `floral` + `casual`
- "party sequin outfit" → Matches `sequin` + `party`
- "navy blazer" → Matches `blazer` + `navy`
- "pink leather jacket" → Matches `jacket` + `pink`

❌ **Queries that might NOT get good matches:**
- "What should I wear for a date?" → Generic query, no clothing/color keywords
- "Do these colors go together?" → No specific clothing type mentioned
- "Style me for winter" → Season not indexed
- "Make me look taller" → Body type not extracted from filenames

## How It Works

### Layer 1: Filename-Based Metadata Extraction
When images are indexed, the filename is parsed to extract:
- Clothing types (e.g., "BlackFormaJeans.jpg" → `black`, `jeans`, `formal`)
- Colors
- Style descriptors
- Ethnic wear flag

### Layer 2: Visual Feature Extraction
Each image is analyzed for:
- **Dominant colors** using K-Means clustering
- **Texture features** using Sobel edge detection
- **Sharpness** using Laplacian filtering
- **Composition** metrics

### Layer 3: TF-IDF Semantic Indexing
All metadata + features are combined into text documents:
```
Document for "BlackFormaJeans.jpg":
"jeans black formal" + visual_features...
```

The TF-IDF vectorizer learns which terms are most distinctive.

### Layer 4: Query Matching
Your query is transformed to TF-IDF features and compared against all indexed documents using **cosine similarity**. Matches with similarity > 0.1 are returned, ranked by score.

## Similarity Score Ranges

- **0.9-1.0**: Very similar (same clothing type, color, and style)
- **0.7-0.9**: Similar (2-3 features match)
- **0.5-0.7**: Moderately related (1-2 features match)
- **0.1-0.5**: Weakly related (minor feature overlap)
- **< 0.1**: Not similar (filtered out)

## Fallback: Keyword-Based Matching

If the semantic index is unavailable, Stylette falls back to keyword matching with weighted scores:

| Feature | Weight |
|---------|--------|
| Clothing type match | 3 points |
| Color match | 2 points |
| User uploaded image color | 2 points |
| Style descriptor match | 1 point |
| Texture feature match | 1.5 points |

This ensures you always get relevant results, even without TF-IDF indexing.

## Performance Notes

- **First startup**: Processes all images (100+ items), may take 30-60 seconds
- **Subsequent runs**: Loads from `.metadata_cache/image_metadata.json` (~5 seconds)
- **Query time**: ~10-50ms per semantic similarity search
- **Memory**: ~5-10MB for 100+ images

## Debugging

To verify semantic matching is working:

1. **Check logs** for `✅ Built semantic index for X documents` on startup
2. **Look for** `✅ Found N semantic matches for query` in request logs
3. **If fallback is used**: You'll see `ℹ️  Semantic index not available, using keyword matching`
4. **Response includes** match scores: `Match Score: 89%` in the results

## Pro Tips

- **Be specific**: "blue formal saree" gets better matches than "nice outfit"
- **Use exact colors**: "navy" matches better than "dark blue"
- **Combine features**: "embroidered party lehenga" uses all three keywords
- **Include occasion**: "casual" vs "formal" significantly impacts results
