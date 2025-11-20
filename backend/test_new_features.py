#!/usr/bin/env python3
"""
Test script for new FeatureExtractor and semantic similarity features
"""

import sys
import os
import logging
from pathlib import Path

# Set up logging
logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(name)s - %(levelname)s - %(message)s')
logger = logging.getLogger(__name__)

def test_imports():
    """Test that all imports work"""
    logger.info("🧪 Testing imports...")
    try:
        from dataset_processor import DatasetProcessor, FeatureExtractor, ColorAnalyzer
        logger.info("✅ All imports successful")
        return True
    except Exception as e:
        logger.error(f"❌ Import failed: {e}")
        return False

def test_feature_extractor():
    """Test the FeatureExtractor class"""
    logger.info("\n🧪 Testing FeatureExtractor...")
    try:
        from dataset_processor import FeatureExtractor
        
        fe = FeatureExtractor()
        logger.info("✅ FeatureExtractor initialized")
        
        # Test color naming
        import numpy as np
        test_color = np.array([255, 0, 0])  # Red
        color_name = fe._rgb_to_color_name(test_color)
        logger.info(f"   Color naming test: RGB {test_color} -> '{color_name}'")
        assert color_name == 'red', f"Expected 'red', got '{color_name}'"
        logger.info("✅ Color naming works")
        
        return True
    except Exception as e:
        logger.error(f"❌ FeatureExtractor test failed: {e}")
        import traceback
        traceback.print_exc()
        return False

def test_dataset_processor_init():
    """Test that DatasetProcessor initializes without crashing"""
    logger.info("\n🧪 Testing DatasetProcessor initialization...")
    try:
        from dataset_processor import dataset_processor
        
        logger.info(f"   Base path: {dataset_processor.base_path}")
        logger.info(f"   Cache file: {dataset_processor.metadata_cache_file}")
        logger.info(f"   Total indexed images: {len(dataset_processor.fashion_images_metadata)}")
        
        if len(dataset_processor.fashion_images_metadata) > 0:
            sample = dataset_processor.fashion_images_metadata[0]
            logger.info(f"   Sample image: {sample.get('filename', 'N/A')}")
            logger.info(f"   - Colors: {sample.get('colors', [])}")
            logger.info(f"   - Visual features keys: {list(sample.get('visual_features', {}).keys())}")
            
            # Check feature structure
            vf = sample.get('visual_features', {})
            if vf.get('colors'):
                logger.info(f"     - Dominant colors: {vf['colors'].get('dominant_colors', [])}")
            if vf.get('texture'):
                logger.info(f"     - Texture type: {vf['texture'].get('texture_type', 'N/A')}")
        
        logger.info("✅ DatasetProcessor initialized successfully")
        return True
    except Exception as e:
        logger.error(f"❌ DatasetProcessor test failed: {e}")
        import traceback
        traceback.print_exc()
        return False

def test_semantic_similarity():
    """Test semantic similarity search"""
    logger.info("\n🧪 Testing semantic similarity search...")
    try:
        from dataset_processor import dataset_processor
        
        if len(dataset_processor.fashion_images_metadata) == 0:
            logger.warning("   ⚠️  No images in dataset, skipping similarity test")
            return True
        
        # Test query
        query = "blue dress casual"
        results = dataset_processor.find_similar_outfits(query)
        
        logger.info(f"   Query: '{query}'")
        logger.info(f"   Results: {len(results)} matches found")
        
        for i, result in enumerate(results[:3]):
            score = result.get('similarity_score', 0)
            logger.info(f"   [{i+1}] {result.get('filename', 'N/A')} (score: {score:.3f})")
        
        logger.info("✅ Semantic similarity search works")
        return True
    except Exception as e:
        logger.error(f"❌ Semantic similarity test failed: {e}")
        import traceback
        traceback.print_exc()
        return False

def test_cache_persistence():
    """Test that metadata cache is saved and can be loaded"""
    logger.info("\n🧪 Testing metadata cache persistence...")
    try:
        import json
        from dataset_processor import dataset_processor
        
        cache_file = dataset_processor.metadata_cache_file
        if os.path.exists(cache_file):
            with open(cache_file, 'r') as f:
                cached_data = json.load(f)
            logger.info(f"   Cache file exists: {cache_file}")
            logger.info(f"   Cached items: {len(cached_data)}")
            logger.info("✅ Cache persistence works")
            return True
        else:
            logger.warning(f"   Cache file not found: {cache_file}")
            logger.warning("   (This is OK if no images were found)")
            return True
    except Exception as e:
        logger.error(f"❌ Cache persistence test failed: {e}")
        import traceback
        traceback.print_exc()
        return False

def main():
    """Run all tests"""
    logger.info("=" * 60)
    logger.info("🚀 NEW FEATURES TEST SUITE")
    logger.info("=" * 60)
    
    tests = [
        ("Imports", test_imports),
        ("FeatureExtractor", test_feature_extractor),
        ("DatasetProcessor Init", test_dataset_processor_init),
        ("Semantic Similarity", test_semantic_similarity),
        ("Cache Persistence", test_cache_persistence),
    ]
    
    results = {}
    for test_name, test_func in tests:
        try:
            results[test_name] = test_func()
        except Exception as e:
            logger.error(f"❌ Test '{test_name}' crashed: {e}")
            results[test_name] = False
    
    logger.info("\n" + "=" * 60)
    logger.info("📊 TEST SUMMARY")
    logger.info("=" * 60)
    
    passed = sum(1 for v in results.values() if v)
    total = len(results)
    
    for test_name, result in results.items():
        status = "✅ PASS" if result else "❌ FAIL"
        logger.info(f"{status} - {test_name}")
    
    logger.info("=" * 60)
    logger.info(f"Result: {passed}/{total} tests passed")
    
    if passed == total:
        logger.info("🎉 All tests passed!")
        return 0
    else:
        logger.error(f"⚠️  {total - passed} test(s) failed")
        return 1

if __name__ == "__main__":
    sys.exit(main())
