// script.js

const words = [
  "delhi",
  "mumbai",
  "bangalore",
  "hyderabad",
  "chennai",
  "kolkata",
  "pune",
  "ahmedabad",
  "jaipur",
  "lucknow",
  "kanpur",
  "nagpur",
  "indore",
  "bhopal",
  "coimbatore",
  "visakhapatnam",
  "ranchi",
  "patna",
  "jabalpur",
  "agra",
  "meerut",
  "varanasi",
  "amritsar",
  "nagapattinam",
  "gwalior",
  "chandigarh",
  "udaipur",
  "mangalore",
  "tiruchirappalli",
  "surat",
  "vadodara",
  "rajkot",
  "guwahati",
  "dehradun",
  "shillong",
  "port blair",
  "dhanbad",
  "jamshedpur",
  "howrah",
  "nashik",
  "solapur",
  "jodhpur",
  "srinagar",
  "kota",
  "aligarh",
  "kalyan",
  "thane",
  "bhubaneswar",
  "hubbali",
  "vijayawada",
  "kakinada",
  "tirupati",
  "agra",
  "kanchipuram",
  "ludhiana",
  "kota",
  "aizawl",
  "dispur",
  "dibrugarh",
  "silchar",
  "jorhat",
  "imphal",
  "agartala",
  "kohima",
  "tura",
  "jalandhar",
  "mohali",
  "siliguri",
  "jammu",
  "ranikhet",
  "kullu",
  "manali",
  "shimla",
  "haridwar",
  "mussoorie",
  "almora",
  "nainital",
  "bhilwara",
  "kota",
  "shahjahanpur",
  "etawah",
  "firozabad",
  "jhansi",
  "saharanpur",
  "meerut",
  "bulandshahr",
  "unnao",
  "budaun",
  "etawah",
  "mau",
  "siddharthnagar",
  "sultanpur",
  "azamgarh",
  "gorakhpur",
  "ballia",
  "chandauli",
  "kushinagar",
  "raebareli",
  "hardoi",
  "kanpur",
  "etawah",
  "basti",
  "deoria",
];

// Trie Data Structure
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
    let currentNode = this.root;
    for (let char of word) {
      if (!currentNode.children[char]) {
        currentNode.children[char] = new TrieNode();
      }
      currentNode = currentNode.children[char];
    }
    currentNode.isEndOfWord = true;
  }

  search(prefix) {
    let currentNode = this.root;
    for (let char of prefix) {
      if (!currentNode.children[char]) {
        return [];
      }
      currentNode = currentNode.children[char];
    }
    return this._findWordsFromNode(currentNode, prefix);
  }

  _findWordsFromNode(node, prefix) {
    let results = [];
    if (node.isEndOfWord) results.push(prefix);
    for (let char in node.children) {
      results.push(
        ...this._findWordsFromNode(node.children[char], prefix + char)
      );
    }
    return results;
  }
}

// Edit Distance Function
function getEditDistance(word1, word2) {
  const m = word1.length;
  const n = word2.length;
  const dp = Array.from({ length: m + 1 }, () => Array(n + 1).fill(0));

  for (let i = 0; i <= m; i++) dp[i][0] = i;
  for (let j = 0; j <= n; j++) dp[0][j] = j;

  for (let i = 1; i <= m; i++) {
    for (let j = 1; j <= n; j++) {
      if (word1[i - 1] === word2[j - 1]) {
        dp[i][j] = dp[i - 1][j - 1];
      } else {
        dp[i][j] = 1 + Math.min(dp[i - 1][j], dp[i][j - 1], dp[i - 1][j - 1]);
      }
    }
  }

  return dp[m][n];
}

// Single Hashing Function
// function HashingSearch(text, pattern) {
//   const p = 31;
//   const m = 1e9 + 9;

//   const S = text.length;
//   const P = pattern.length;

//   let pPow = 1;
//   for (let i = 0; i < P; i++) {
//     pPow = (pPow * p) % m;
//   }

//   let patternHash = 0;
//   for (let i = 0; i < P; i++) {
//     patternHash =
//       (patternHash * p + (pattern.charCodeAt(i) - "a".charCodeAt(0) + 1)) % m;
//   }

//   let currentHash = 0;
//   for (let i = 0; i < P; i++) {
//     currentHash =
//       (currentHash * p + (text.charCodeAt(i) - "a".charCodeAt(0) + 1)) % m;
//   }

//   for (let i = 0; i + P - 1 < S; i++) {
//     if (patternHash === currentHash) {
//       if (text.substr(i, P) === pattern) {
//         return true;
//       }
//     }

//     if (i + P < S) {
//       currentHash =
//         (currentHash * p -
//           (text.charCodeAt(i) - "a".charCodeAt(0) + 1) * pPow +
//           (text.charCodeAt(i + P) - "a".charCodeAt(0) + 1)) %
//         m;
//       if (currentHash < 0) currentHash += m;
//     }
//   }

//   return false;
// }

function HashingSearch(text, pattern) {
  const p1 = 31;
  const p2 = 37;
  const m = 1e9 + 9;

  const S = text.length;
  const P = pattern.length;

  let p1Pow = 1;
  let p2Pow = 1;
  for (let i = 0; i < P; i++) {
    p1Pow = (p1Pow * p1) % m;
    p2Pow = (p2Pow * p2) % m;
  }

  let patternHash1 = 0;
  let patternHash2 = 0;
  for (let i = 0; i < P; i++) {
    patternHash1 =
      (patternHash1 * p1 + (pattern.charCodeAt(i) - "a".charCodeAt(0) + 1)) % m;
    patternHash2 =
      (patternHash2 * p2 + (pattern.charCodeAt(i) - "a".charCodeAt(0) + 1)) % m;
  }

  let currentHash1 = 0;
  let currentHash2 = 0;
  for (let i = 0; i < P; i++) {
    currentHash1 =
      (currentHash1 * p1 + (text.charCodeAt(i) - "a".charCodeAt(0) + 1)) % m;
    currentHash2 =
      (currentHash2 * p2 + (text.charCodeAt(i) - "a".charCodeAt(0) + 1)) % m;
  }

  for (let i = 0; i + P - 1 < S; i++) {
    if (patternHash1 === currentHash1 && patternHash2 === currentHash2) {
      if (text.substr(i, P) === pattern) {
        return true;
      }
    }

    if (i + P < S) {
      currentHash1 =
        (currentHash1 * p1 -
          (text.charCodeAt(i) - "a".charCodeAt(0) + 1) * p1Pow +
          (text.charCodeAt(i + P) - "a".charCodeAt(0) + 1)) %
        m;
      if (currentHash1 < 0) currentHash1 += m;

      currentHash2 =
        (currentHash2 * p2 -
          (text.charCodeAt(i) - "a".charCodeAt(0) + 1) * p2Pow +
          (text.charCodeAt(i + P) - "a".charCodeAt(0) + 1)) %
        m;
      if (currentHash2 < 0) currentHash2 += m;
    }
  }

  return false;
}

function SearchHash(query) {
  const results = [];
  words.forEach((word) => {
    if (HashingSearch(word, query)) {
      results.push(word);
    }
    if (results.length == 5) {
      return results;
    }
  });
  return results.slice(0, 5); // Limit to 5 results
}

const trie = new Trie();
words.forEach((word) => trie.insert(word));

// Handling input and searches
document.getElementById("search").addEventListener("input", function () {
  const query = this.value.toLowerCase();
  if (query) {
    // Single Hashing search results
    const DHashingResult = SearchHash(query);
    document.getElementById("hashmap-results").innerHTML = DHashingResult.length
      ? DHashingResult.map((word) => `<p>${word}</p>`).join("")
      : "<p>No results found using Single Hashing.</p>";

    // Trie search results
    const trieResults = trie.search(query).slice(0, 5);
    document.getElementById("trie-results").innerHTML = trieResults.length
      ? trieResults.map((word) => `<p>${word}</p>`).join("")
      : "<p>No results found in Trie.</p>";

    // Edit distance results, sorted by distance, limited to 5 results
    const editDistanceResults = words
      .map((word) => ({
        word: word,
        distance: getEditDistance(query, word),
      }))
      .filter((result) => result.distance <= 2)
      .sort((a, b) => a.distance - b.distance)
      .slice(0, 5);

    document.getElementById("edit-distance-results").innerHTML =
      editDistanceResults.length
        ? editDistanceResults
            .map(
              (result) => `<p>${result.word} (Distance: ${result.distance})</p>`
            )
            .join("")
        : "<p>No results found using Edit Distance.</p>";
  } else {
    document.getElementById("hashmap-results").innerHTML = "";
    document.getElementById("trie-results").innerHTML = "";
    document.getElementById("edit-distance-results").innerHTML = "";
  }
});

function Search() {
  query = document.getElementById("search").value;
  url = "http://www.google.com/search?q=" + query;
  window.open(url, "_blank");
}
