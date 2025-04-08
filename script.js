// Function to initialize the search functionality after loading city data
function initCitySearch(rawWords) {
  // 1) Normalize all words to lowercase
  const words = rawWords.map(w => w.toLowerCase());
  console.log("Loaded words:", words.length, "entries");  // sanity check

  // --- Trie Data Structure ---
  class TrieNode {
    constructor() {
      this.children = {};
      this.isEndOfWord = false;
    }
  }

  class Trie {
    constructor() {
      this.root = new TrieNode();
    }

    insert(word) {
      let node = this.root;
      for (let c of word) {
        if (!node.children[c]) node.children[c] = new TrieNode();
        node = node.children[c];
      }
      node.isEndOfWord = true;
    }

    search(prefix) {
      let node = this.root;
      for (let c of prefix) {
        if (!node.children[c]) return [];
        node = node.children[c];
      }
      return this._collect(node, prefix);
    }

    _collect(node, prefix) {
      const res = [];
      if (node.isEndOfWord) res.push(prefix);
      for (let c in node.children) {
        res.push(...this._collect(node.children[c], prefix + c));
      }
      return res;
    }
  }

  // --- Edit Distance (Levenshtein) ---
  function getEditDistance(a, b) {
    const m = a.length, n = b.length;
    const dp = Array.from({length: m+1}, () => Array(n+1).fill(0));
    for (let i = 0; i <= m; i++) dp[i][0] = i;
    for (let j = 0; j <= n; j++) dp[0][j] = j;
    for (let i = 1; i <= m; i++) {
      for (let j = 1; j <= n; j++) {
        dp[i][j] = a[i-1] === b[j-1]
          ? dp[i-1][j-1]
          : 1 + Math.min(dp[i-1][j], dp[i][j-1], dp[i-1][j-1]);
      }
    }
    return dp[m][n];
  }

  // --- Rabin-Karp Hashing Search ---
  function HashingSearch(text, pattern) {
    text = text.toLowerCase();
    pattern = pattern.toLowerCase();
    const p = 31, m = 1e9+9;
    const S = text.length, P = pattern.length;
    if (P > S) return false;

    // precompute p^P % m
    let pPow = 1;
    for (let i = 0; i < P; i++) pPow = (pPow * p) % m;

    // hash of pattern & first window
    let hashPat = 0, hashTxt = 0;
    for (let i = 0; i < P; i++) {
      hashPat = (hashPat * p + (pattern.charCodeAt(i) - 96)) % m;
      hashTxt = (hashTxt * p + (text.charCodeAt(i) - 96)) % m;
    }

    for (let i = 0; i + P <= S; i++) {
      if (hashPat === hashTxt && text.substr(i, P) === pattern) {
        return true;
      }
      // roll the hash
      if (i + P < S) {
        hashTxt = (
          hashTxt * p
          - (text.charCodeAt(i) - 96) * pPow
          + (text.charCodeAt(i + P) - 96)
        ) % m;
        if (hashTxt < 0) hashTxt += m;
      }
    }
    return false;
  }

  // --- Fixed SearchHash: breakable loop + lowercase words ---
  function SearchHash(query) {
    query = query.toLowerCase();
    const res = [];
    for (let w of words) {
      if (HashingSearch(w, query)) {
        res.push(w);
        if (res.length === 5) break;
      }
    }
    return res;
  }

  // build the trie
  const trie = new Trie();
  for (let w of words) trie.insert(w);

  // --- Input handler ---
  document.getElementById("search").addEventListener("input", function () {
    const query = this.value.trim().toLowerCase();
    if (!query) {
      ["hashmap-results","trie-results","edit-distance-results","performance-box"]
        .forEach(id => document.getElementById(id).innerHTML = "");
      return;
    }

    // Hashing
    const t0 = performance.now();
    const hRes = SearchHash(query);
    const t1 = performance.now();
    document.getElementById("hashmap-results").innerHTML = hRes.length
      ? hRes.map(w => `<p>${w}</p>`).join("")
      : "<p>No results found using Hashing.</p>";

    // Trie
    const t2 = performance.now();
    const trRes = trie.search(query).slice(0,5);
    const t3 = performance.now();
    document.getElementById("trie-results").innerHTML = trRes.length
      ? trRes.map(w => `<p>${w}</p>`).join("")
      : "<p>No results found in Trie.</p>";

    // Edit Distance
    const t4 = performance.now();
    const edRes = words
      .map(w => ({ w, d: getEditDistance(query, w) }))
      .filter(o => o.d <= 2)
      .sort((a,b) => a.d - b.d)
      .slice(0,5);
    const t5 = performance.now();
    document.getElementById("edit-distance-results").innerHTML = edRes.length
      ? edRes.map(o => `<p>${o.w} (Distance: ${o.d})</p>`).join("")
      : "<p>No results within edit‑distance ≤ 2.</p>";

    // Performance
    const hashTime = (t1 - t0)*1000;
    const trieTime = Math.max(0.01,(t3 - t2)*1000);
    const editTime = (t5 - t4)*1000;
    document.getElementById("performance-box").innerHTML = `
      <p>Trie: ${trieTime.toFixed(2)} µs</p>
      <p>Hashing: ${hashTime.toFixed(2)} µs</p>
      <p>Edit Dist: ${editTime.toFixed(2)} µs</p>
      <p><strong>Hashing vs Trie:</strong> ${(hashTime/trieTime).toFixed(2)}×</p>
      <p><strong>Edit vs Trie:</strong> ${(editTime/trieTime).toFixed(2)}×</p>
    `;
  });

  // optional “Search” button handler
  window.Search = function() {
    const q = document.getElementById("search").value;
    if (q) window.open("https://www.google.com/search?q="+encodeURIComponent(q), "_blank");
  };
}

// Fetch and kick things off
fetch("data.json")
  .then(r => r.json())
  .then(arr => {
    if (!Array.isArray(arr) || arr.length === 0) {
      console.error("data.json didn’t return a non‑empty array!");
      return;
    }
    initCitySearch(arr);
  })
  .catch(err => console.error("Error loading data.json:", err));
