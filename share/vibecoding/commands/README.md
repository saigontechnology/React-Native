# Vibe Coding Commands - Quick Reference

## Workflow

```
1. WBS Analysis → 2. Generate Guides → 3. Implement Code → 4. Fix Features
```

---

## Commands

### Documentation Generation

#### `/wbs-analysis`
```bash
/wbs-analysis [--wbs "@docs/WBS.csv"] [--output "@docs/WBS_Analysis.md"]
```

#### `/guide-be`
```bash
/guide-be [--tech "NestJS with Typescript"] [--roles "Admin,Seller,Buyer"] [--db "PostgreSQL + Prisma, Redis"] [--infra "Docker + AWS"]
```

#### `/guide-fe`
```bash
/guide-fe [--tech "ReactJS + Vite + Typescript"] [--roles "Admin,Seller"] [--ui "MUI, Tailwindcss, AntDesign"] [--state "Redux-toolkit, context"] [--form "react-hook-form, zod"]
```

#### `/guide-mobile`
```bash
/guide-mobile [--tech "React Native Expo + Typescript"] [--roles "Buyer"] [--ui "Expo UI"] [--state "Redux-toolkit, context"] [--form "react-hook-form, zod"]
```

#### `/guide-api`
```bash
/guide-api [--swagger "swagger.json"] [--output "@docs/API_Integration_guide.md"]
```

#### `/mobile-breakdown`
```bash
/mobile-breakdown [--input "@docs/Mobile_implementation_guide.md"] [--output "documents/mobile"]
```
*Requires: [Figma MCP](https://github.com/GLips/Figma-Context-MCP)*

---

### Code Implementation

#### `/impl-be`
```bash
/impl-be
```
*Run 3+ times until complete. Requires: `@docs/Backend_implementation_guide.md`*

#### `/impl-fe`
```bash
/impl-fe
```
*Run 3+ times until complete. Requires: `@docs/FrontEnd_implementation_guide.md`, `@docs/API_Integration_guide.md`*

#### `/impl-mobile`
```bash
/impl-mobile
```
*Run 3+ times until complete. Requires: `@docs/Mobile_implementation_guide.md`, `@docs/API_Integration_guide.md`*

---

### Feature Fixes

#### `/fix-be`
```bash
/fix-be --feature "Feature Name"
```

#### `/fix-fe`
```bash
/fix-fe --feature "Feature Name"
```

#### `/fix-mobile`
```bash
/fix-mobile --feature "Feature Name"
```

---

## Usage Example

```bash
# 1. Generate documentation
/wbs-analysis
/guide-be --tech "NestJS" --roles "Admin,User"
/guide-fe --tech "ReactJS" --roles "Admin,User"
/guide-api

# 2. Implement code (run each 3+ times)
/impl-be
/impl-fe

# 3. Fix incomplete features
/fix-be --feature "Authentication"
/fix-fe --feature "User Dashboard"
```

---

## Flag Usage

**All flags are optional** - omit to use defaults shown in square brackets above.

**Examples:**
```bash
# Use all defaults
/guide-be

# Override specific flags
/guide-be --tech "ExpressJS" --db "MongoDB"

# Multiple roles (comma-separated, no spaces)
/guide-fe --roles "Admin,User,Guest"
```

---

## Tips

- 📝 Generate guides before implementing code
- 🔄 Implementation commands need 3-5 runs to complete
- ✅ Review AI-generated code before committing
- 🔧 Use fix commands for specific incomplete features
