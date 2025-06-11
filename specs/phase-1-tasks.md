# Phase 1 – Research & Skeleton: Detailed Task Breakdown

This phase establishes a **solid knowledge base and project scaffold**. No functional features are expected yet. All tasks must be completed before continuing to Phase 2.

---

## 1. Standards & Domain Research
| ID | Task | Output | Owner |
|----|------|--------|-------|
| R-1 | Study OPC UA core (services, Address Space, Nodes, Subscriptions, Security) | `docs/standards/opcua-summary.md` (≈ 1-2 pages) | PO / Eng |
| R-2 | Read OPC UA Companion Spec for Mining v1.0 | Add “MiningEquipmentType” notes to same summary | PO / Eng |
| R-3 | Study **ISA-95 / IEC 62264** levels & data flows | `docs/standards/isa95-summary.md` outlining 5 levels & integration points | PO / Eng |
| R-4 | Collect 2–3 references on real-time grade control economics | Annotated links in `docs/research-bibliography.md` | PO |

> **Timebox**: ≤ 8 h total. Summaries limited to essential bullet points.

---

## 2. Tooling & Library Evaluation
| ID | Task | Output |
|----|------|--------|
| T-1 | Evaluate **node-opcua** vs **open62541** vs **Eclipse Milo** for server implementation | Decision note in `docs/tooling/opcua-lib-choice.md` (should pick *node-opcua*) |
| T-2 | Spike minimal `node-opcua` server that exposes one variable | Source in `spikes/node-opcua-hello/` + screenshot of UAExpert browsing|

---

## 3. Repository Scaffold
| ID | Task | Output |
|----|------|--------|
| S-1 | Initialise monorepo with **PNPM Workspaces** | `package.json` workspace config |
| S-2 | Create structure: `frontend/`, `backend/`, `specs/`, `docs/`, `.github/` | Empty folders committed |
| S-3 | Add **README.md** root with project vision & setup steps | README draft |
| S-4 | Generate **architecture diagram** (Mermaid in README) | Mermaid code block |

---

## 4. Backend Skeleton (Node + TypeScript)
| ID | Task | Output |
|----|------|--------|
| B-1 | Initialise `backend/` with `tsconfig.json`, ESLint, Prettier | Config files |
| B-2 | Add `node-opcua` & `ts-node-dev` deps | `backend/package.json` |
| B-3 | Create stub `server.ts` printing "OPC UA Skeleton Running" | Builds & runs without error |

---

## 5. Frontend Skeleton (Next.js 14 + Tailwind)
| ID | Task | Output |
|----|------|--------|
| F-1 | Bootstrap Next.js app in `frontend/` (`next@canary`) | Compiling dev server |
| F-2 | Integrate Tailwind CSS & Radix UI | tailwind.config & demo page |
| F-3 | Add placeholder pages for *Real-time*, *Explorer*, *Integration*, *Compliance* | Simple links |

---

## 6. Dev Tooling & Quality Gates
| ID | Task | Output |
|----|------|--------|
| Q-1 | Configure **ESLint + Prettier** root presets | `.eslintrc`, `.prettierrc` |
| Q-2 | Add **Husky** pre-commit hook for lint & format | `.husky/` scripts |
| Q-3 | Setup **Jest** (ts-jest) with one sample test per package | `tests/` folder |

---

## 7. Continuous Integration *(optional for this demo)*
No dedicated CI pipeline is required. If future hosting or collaboration needs arise, consider adding a simple GitHub Actions workflow that installs dependencies and runs unit tests.

---

## 8. Containerisation
| ID | Task | Output |
|----|------|--------|
| D-1 | Draft `Dockerfile` for backend (Node 20-alpine, prod & dev stages) | `backend/Dockerfile` |
| D-2 | Draft `Dockerfile` for frontend (Next.js, faster builds) | `frontend/Dockerfile` |
| D-3 | Compose file mapping ports **3000**, **4840**, **4841** | `docker-compose.yml` |

---

## 9. Documentation & Checkpoint
| ID | Task | Output |
|----|------|--------|
| Doc-1 | Ensure all created docs committed under `docs/` | Directory tree |
| Doc-2 | Update PRD Phase 1 status table → *Done* | PR merge |

---

## 10. Validation & Sign-off
1. All unit tests pass via `pnpm test` (backend and frontend).  
2. Start the backend skeleton (`docker-compose up -d --build backend` **or** `pnpm --filter backend dev`) and observe the log **"OPC UA Skeleton Running"**.  
3. Reviewer confirms folder layout and documentation completeness.

Once these criteria are met, Phase 1 is officially **complete → proceed to Phase 2**.
