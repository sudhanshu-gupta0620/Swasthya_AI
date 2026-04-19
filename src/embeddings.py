# src/embeddings.py

from sentence_transformers import SentenceTransformer
import faiss
import numpy as np
import pickle
import os
from data_processor import DataProcessor

class MedicineEmbeddings:
    def __init__(self):
        print("Loading Sentence Transformer Model...")
        # This is the same model you used before
        self.model = SentenceTransformer('all-MiniLM-L6-v2')
        self.index = None
        self.documents = []
        self.embeddings = None
        
        # Paths to save/load index
        self.index_path = "data/faiss_index.bin"
        self.docs_path = "data/documents.pkl"
        
        print("✅ Model Loaded!")
    
    def create_embeddings(self, documents):
        """
        Convert documents to embeddings
        and store in FAISS index
        """
        print(f"\nCreating embeddings for {len(documents)} documents...")
        
        # Store documents
        self.documents = documents
        
        # Extract text from documents
        texts = [doc['text'] for doc in documents]
        
        # Create embeddings
        print("This will take 1-2 minutes...")
        self.embeddings = self.model.encode(
            texts,
            show_progress_bar=True,
            batch_size=32
        )
        
        print(f"✅ Embeddings shape: {self.embeddings.shape}")
        
        # Create FAISS index
        dimension = self.embeddings.shape[1]
        self.index = faiss.IndexFlatL2(dimension)
        
        # Add embeddings to index
        self.index.add(np.array(self.embeddings).astype('float32'))
        
        print(f"✅ FAISS index created with {self.index.ntotal} vectors")
        
        return self
    
    def save_index(self):
        """Save FAISS index and documents to disk"""
        print("\nSaving index to disk...")
        
        # Save FAISS index
        faiss.write_index(self.index, self.index_path)
        
        # Save documents
        with open(self.docs_path, 'wb') as f:
            pickle.dump(self.documents, f)
        
        print(f"✅ Index saved to {self.index_path}")
        print(f"✅ Documents saved to {self.docs_path}")
    
    def load_index(self):
        """Load existing FAISS index from disk"""
        if os.path.exists(self.index_path) and os.path.exists(self.docs_path):
            print("Loading existing index...")
            
            # Load FAISS index
            self.index = faiss.read_index(self.index_path)
            
            # Load documents
            with open(self.docs_path, 'rb') as f:
                self.documents = pickle.load(f)
            
            print(f"✅ Loaded index with {self.index.ntotal} vectors")
            print(f"✅ Loaded {len(self.documents)} documents")
            return True
        
        print("No existing index found, will create new one")
        return False
    
    def search(self, query, top_k=3):
        """
        Search for most relevant documents
        given a query
        """
        # Create query embedding
        query_embedding = self.model.encode([query])
        
        # Search in FAISS index
        distances, indices = self.index.search(
            np.array(query_embedding).astype('float32'),
            top_k
        )
        
        # Get relevant documents
        results = []
        for i, idx in enumerate(indices[0]):
            if idx != -1:  # Valid result
                results.append({
                    'document': self.documents[idx],
                    'distance': distances[0][i],
                    'relevance_score': round(1 / (1 + distances[0][i]), 3)
                })
        
        return results


# Test it
if __name__ == "__main__":
    # Step 1: Load data
    print("=== STEP 1: Loading Data ===")
    dp = DataProcessor()
    dp.load_all_data()
    documents = dp.create_knowledge_base()
    
    # Step 2: Create embeddings
    print("\n=== STEP 2: Creating Embeddings ===")
    embedder = MedicineEmbeddings()
    
    # Check if index already exists
    if not embedder.load_index():
        # Create new index
        embedder.create_embeddings(documents)
        embedder.save_index()
    
    # Step 3: Test search
    print("\n=== STEP 3: Testing Search ===")
    
    test_queries = [
        "cheap alternative to DOLO 650",
        "medicine for diabetes metformin",
        "antibiotic azithromycin alternative",
        "blood pressure medicine amlodipine"
    ]
    
    for query in test_queries:
        print(f"\n🔍 Query: {query}")
        results = embedder.search(query, top_k=2)
        for r in results:
            print(f"   Found: {r['document']['metadata']['brand_name']}")
            print(f"   Score: {r['relevance_score']}")