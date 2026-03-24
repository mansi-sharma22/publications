const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

const seed = [
  { title: "Robust Federated Learning Under Byzantine Attacks via Adaptive Gradient Clipping", authors: "Arjun Mehta, Priya Nair, Siddharth Rao, Kavya Krishnan", venue: "NeurIPS", year: 2024, field: "Machine Learning", abstract: "We propose AdaClip, a gradient clipping strategy that dynamically adjusts per-round to the empirical gradient distribution.", link: "https://arxiv.org" },
  { title: "Spectral Graph Transformers for Long-Range Dependency Modelling in Molecular Property Prediction", authors: "Kavya Krishnan, Rohit Joshi", venue: "ICML", year: 2024, field: "Graphs & Networks", abstract: "We introduce Spectral Graph Transformers (SGT), leveraging Laplacian eigenvectors as positional encodings.", link: "https://arxiv.org" },
  { title: "On the Generalization Bounds of Sparse Mixture-of-Experts Models", authors: "Siddharth Rao, Arjun Mehta", venue: "ICLR", year: 2024, field: "Theory", abstract: "We derive tight PAC-Bayes generalization bounds for sparse MoE models.", link: "https://arxiv.org" },
  { title: "CausalBench: A Benchmark Suite for Evaluating Causal Reasoning in Large Language Models", authors: "Nandini Varma, Priya Nair, Arjun Mehta", venue: "ACL", year: 2023, field: "NLP", abstract: "We introduce CausalBench, comprising 12 diverse tasks spanning counterfactual reasoning.", link: "https://arxiv.org" },
  { title: "Privacy-Preserving Graph Neural Networks via Differentially Private Message Passing", authors: "Rohit Joshi, Kavya Krishnan, Deepa Subramaniam", venue: "KDD", year: 2023, field: "Privacy & Security", abstract: "We formalize edge-level and node-level differential privacy guarantees for the message-passing framework.", link: "https://arxiv.org" },
];

async function main() {
  console.log("Seeding database...");
  for (const pub of seed) {
    await prisma.publication.create({ data: pub });
  }
  console.log(`Seeded ${seed.length} publications.`);
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
